"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginForm } from "./components/login-form"
import { storage } from "./utils/storage"
import type { User, Category, Article, AuditLog, SearchResult } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [auditLog, setAuditLog] = useState<AuditLog[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false)
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = () => {
      try {
        const storedUser = storage.getCurrentUser()
        const storedUsers = storage.getUsers()
        const storedCategories = storage.getCategories()
        const storedArticles = storage.getArticles()
        const storedAuditLog = storage.getAuditLog()

        setCurrentUser(storedUser)
        setUsers(storedUsers)
        setCategories(storedCategories)
        setArticles(storedArticles)
        setAuditLog(storedAuditLog)

        // Increment page visits
        storage.incrementPageVisits()
      } catch (error) {
        console.error("Failed to initialize data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    storage.setCurrentUser(user)
    // Refresh audit log to show login entry
    setAuditLog(storage.getAuditLog())
  }

  const handleLogout = () => {
    if (currentUser) {
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "LOGOUT",
        details: `User ${currentUser.username} logged out`,
      })
      setAuditLog(storage.getAuditLog())
    }
    setCurrentUser(null)
    storage.setCurrentUser(null)
    setSelectedArticleId(null)
    setSelectedCategoryId(null)
  }

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: SearchResult[] = []
    const searchTerm = query.toLowerCase()

    // Search articles
    articles.forEach((article) => {
      if (article.status === "published") {
        let relevance = 0
        if (article.title.toLowerCase().includes(searchTerm)) relevance += 3
        if (article.content.toLowerCase().includes(searchTerm)) relevance += 1
        if (article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))) relevance += 2

        if (relevance > 0) {
          const category = categories.find((c) => c.id === article.categoryId)
          results.push({
            type: "article",
            id: article.id,
            title: article.title,
            content: article.content.substring(0, 200) + "...",
            categoryName: category?.name,
            relevance,
          })
        }
      }
    })

    // Search categories
    categories.forEach((category) => {
      let relevance = 0
      if (category.name.toLowerCase().includes(searchTerm)) relevance += 2
      if (category.description?.toLowerCase().includes(searchTerm)) relevance += 1

      if (relevance > 0) {
        results.push({
          type: "category",
          id: category.id,
          title: category.name,
          content: category.description,
          relevance,
        })
      }
    })

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance)
    setSearchResults(results)
  }

  const handleAddArticle = (articleData: {
    title: string
    content: string
    categoryId: string
    tags: string[]
    status: "draft" | "published"
  }) => {
    if (!currentUser) return

    const newArticle: Article = {
      id: Date.now().toString(),
      title: articleData.title,
      content: articleData.content,
      categoryId: articleData.categoryId,
      authorId: currentUser.id,
      createdBy: currentUser.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: articleData.status,
      tags: articleData.tags,
    }

    const updatedArticles = [...articles, newArticle]
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)

    storage.addAuditEntry({
      performedBy: currentUser.id,
      action: "CREATE_ARTICLE",
      details: `Created article "${newArticle.title}"`,
    })
    setAuditLog(storage.getAuditLog())

    setIsAddArticleOpen(false)
    setSelectedArticleId(newArticle.id)
  }

  const selectedArticle = selectedArticleId ? articles.find((a) => a.id === selectedArticleId) : null
  const selectedCategory = selectedCategoryId ? categories.find((c) => c.id === selectedCategoryId) : null
  const articleCategory = selectedArticle ? categories.find((c) => c.id === selectedArticle.categoryId) : null
  const articleAuthor = selectedArticle ? users.find((u) => u.id === selectedArticle.authorId) : undefined

  // Show login form if no user is logged in
  if (!currentUser && !isLoading) {
    return (
      <LoginForm
        onLogin={(username, password) => {
          const user = storage.authenticateUser(username, password)
          if (user) {
            handleLogin(user)
          }
        }}
      />
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Knowledge Base...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onSearch={handleSearch}
        onAddArticle={() => setIsAddArticleOpen(true)}
        onAdminPanel={() => setIsAdminDashboardOpen(true)}
        searchResults={articles}
        categories={categories}
      />

      <div className="flex">
        <CategoryTree
          categories={categories}
          articles={articles}
          selectedCategoryId={selectedCategoryId}
          selectedArticleId={selectedArticleId}
          onCategorySelect={setSelectedCategoryId}
          onArticleSelect={setSelectedArticleId}
        />

        <ArticleViewer
          article={selectedArticle}
          category={articleCategory}
          author={articleAuthor}
          currentUser={currentUser}
          onEdit={() => {
            // TODO: Implement article editing
            console.log("Edit article:", selectedArticle?.id)
          }}
          onBack={() => {
            setSelectedArticleId(null)
            setSelectedCategoryId(null)
          }}
        />
      </div>

      {currentUser && (currentUser.role === "admin" || currentUser.role === "editor") && (
        <AddArticleForm
          isOpen={isAddArticleOpen}
          onClose={() => setIsAddArticleOpen(false)}
          onSubmit={handleAddArticle}
          categories={categories}
          currentUser={currentUser}
        />
      )}

      {currentUser && currentUser.role === "admin" && (
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          currentUser={currentUser}
          users={users}
          categories={categories}
          articles={articles}
          auditLog={auditLog}
          onUpdateUsers={setUsers}
          onUpdateCategories={setCategories}
          onUpdateArticles={setArticles}
        />
      )}
    </div>
  )
}
