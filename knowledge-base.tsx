"use client"
import { LoginDebug } from "./components/login-debug"

import { useState, useEffect } from "react"

import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { SearchResults } from "./components/search-results"
import { SelectedArticles } from "./components/selected-articles"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { storage } from "./utils/storage"
import type { Category, Article, KnowledgeBaseUser } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [users, setUsers] = useState<KnowledgeBaseUser[]>([])
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([])
  const [currentView, setCurrentView] = useState<"browse" | "search" | "selected" | "add" | "edit" | "admin">("browse")
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [currentUser, setCurrentUser] = useState<KnowledgeBaseUser | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    loadData()
    // Increment page visits
    const visits = storage.getPageVisits()
    localStorage.setItem("kuhlekt_kb_page_visits", (visits + 1).toString())
  }, [])

  const loadData = () => {
    try {
      const loadedCategories = storage.getCategories()
      const loadedArticles = storage.getArticles()
      const loadedUsers = storage.getUsers()
      const loadedAuditLog = storage.getAuditLog()

      setCategories(loadedCategories)
      setArticles(loadedArticles)
      setUsers(loadedUsers)
      setAuditLog(loadedAuditLog)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const results = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase())),
      )
      setSearchResults(results)
      setCurrentView("search")
    } else {
      setSearchResults([])
      setCurrentView("browse")
    }
  }

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
    setCurrentView("browse")
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    // Add to audit log if user is logged in
    if (currentUser) {
      storage.addAuditEntry({
        action: "article_view",
        entityType: "article",
        entityId: article.id,
        performedBy: currentUser.username,
        timestamp: new Date(),
        details: `Viewed article: ${article.title}`,
      })
    }
  }

  const handleArticleToggle = (article: Article) => {
    setSelectedArticles((prev) => {
      const exists = prev.find((a) => a.id === article.id)
      if (exists) {
        return prev.filter((a) => a.id !== article.id)
      } else {
        return [...prev, article]
      }
    })
  }

  const handleAddArticle = (articleData: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedArticles = [...articles, newArticle]
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)

    // Add to audit log
    if (currentUser) {
      storage.addAuditEntry({
        action: "article_create",
        entityType: "article",
        entityId: newArticle.id,
        performedBy: currentUser.username,
        timestamp: new Date(),
        details: `Created article: ${newArticle.title}`,
      })
    }

    setCurrentView("browse")
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setCurrentView("edit")
  }

  const handleUpdateArticle = (articleData: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    if (!editingArticle) return

    const updatedArticle: Article = {
      ...editingArticle,
      ...articleData,
      updatedAt: new Date(),
    }

    const updatedArticles = articles.map((a) => (a.id === editingArticle.id ? updatedArticle : a))
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)

    // Add to audit log
    if (currentUser) {
      storage.addAuditEntry({
        action: "article_update",
        entityType: "article",
        entityId: updatedArticle.id,
        performedBy: currentUser.username,
        timestamp: new Date(),
        details: `Updated article: ${updatedArticle.title}`,
      })
    }

    setEditingArticle(null)
    setCurrentView("browse")
  }

  const handleDeleteArticle = (articleId: string) => {
    const article = articles.find((a) => a.id === articleId)
    const updatedArticles = articles.filter((a) => a.id !== articleId)
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)

    // Add to audit log
    if (currentUser && article) {
      storage.addAuditEntry({
        action: "article_delete",
        entityType: "article",
        entityId: articleId,
        performedBy: currentUser.username,
        timestamp: new Date(),
        details: `Deleted article: ${article.title}`,
      })
    }

    if (selectedArticle?.id === articleId) {
      setSelectedArticle(null)
    }
    setSelectedArticles((prev) => prev.filter((a) => a.id !== articleId))
  }

  const handleLogin = (user: KnowledgeBaseUser) => {
    setCurrentUser(user)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    if (currentUser) {
      storage.addAuditEntry({
        action: "user_logout",
        entityType: "user",
        entityId: currentUser.id,
        performedBy: currentUser.username,
        timestamp: new Date(),
        details: `User logout: ${currentUser.username}`,
      })
    }
    setCurrentUser(null)
    setCurrentView("browse")
  }

  const updateCategories = (newCategories: Category[]) => {
    setCategories(newCategories)
    storage.saveCategories(newCategories)
  }

  const updateUsers = (newUsers: KnowledgeBaseUser[]) => {
    setUsers(newUsers)
    storage.saveUsers(newUsers)
  }

  const updateAuditLog = (newAuditLog: any[]) => {
    setAuditLog(newAuditLog)
    storage.saveAuditLog(newAuditLog)
  }

  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.categoryId === selectedCategory)
    : articles

  const renderMainContent = () => {
    switch (currentView) {
      case "search":
        return (
          <SearchResults
            results={searchResults}
            query={searchQuery}
            onArticleSelect={handleArticleSelect}
            onArticleToggle={handleArticleToggle}
            selectedArticles={selectedArticles}
            onEditArticle={
              currentUser?.role === "admin" || currentUser?.role === "editor" ? handleEditArticle : undefined
            }
            onDeleteArticle={currentUser?.role === "admin" ? handleDeleteArticle : undefined}
          />
        )
      case "selected":
        return (
          <SelectedArticles
            articles={selectedArticles}
            onArticleSelect={handleArticleSelect}
            onArticleRemove={handleArticleToggle}
            onEditArticle={
              currentUser?.role === "admin" || currentUser?.role === "editor" ? handleEditArticle : undefined
            }
            onDeleteArticle={currentUser?.role === "admin" ? handleDeleteArticle : undefined}
          />
        )
      case "add":
        return (
          <AddArticleForm
            categories={categories}
            onSubmit={handleAddArticle}
            onCancel={() => setCurrentView("browse")}
          />
        )
      case "edit":
        return editingArticle ? (
          <EditArticleForm
            article={editingArticle}
            categories={categories}
            onSubmit={handleUpdateArticle}
            onCancel={() => {
              setEditingArticle(null)
              setCurrentView("browse")
            }}
          />
        ) : null
      case "admin":
        return (
          <AdminDashboard
            categories={categories}
            users={users}
            auditLog={auditLog}
            onUpdateCategories={updateCategories}
            onUpdateUsers={updateUsers}
            onUpdateAuditLog={updateAuditLog}
            onDataImported={loadData}
          />
        )
      default:
        return (
          <div className="flex flex-1 overflow-hidden">
            <div className="w-80 border-r border-gray-200 overflow-y-auto">
              <CategoryTree
                categories={categories}
                articles={filteredArticles}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onArticleSelect={handleArticleSelect}
                onArticleToggle={handleArticleToggle}
                selectedArticles={selectedArticles}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <ArticleViewer
                article={selectedArticle}
                onEditArticle={
                  currentUser?.role === "admin" || currentUser?.role === "editor" ? handleEditArticle : undefined
                }
                onDeleteArticle={currentUser?.role === "admin" ? handleDeleteArticle : undefined}
              />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navigation
        onSearch={handleSearch}
        searchQuery={searchQuery}
        selectedCount={selectedArticles.length}
        onViewSelected={() => setCurrentView("selected")}
        onAddArticle={
          currentUser?.role === "admin" || currentUser?.role === "editor" ? () => setCurrentView("add") : undefined
        }
        onAdminPanel={currentUser?.role === "admin" ? () => setCurrentView("admin") : undefined}
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onHome={() => {
          setCurrentView("browse")
          setSelectedCategory(null)
          setSelectedArticle(null)
          setSearchQuery("")
        }}
      />

      <div className="flex-1 flex overflow-hidden">{renderMainContent()}</div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />

      {process.env.NODE_ENV === "development" && (
        <div className="fixed bottom-4 right-4">
          <LoginDebug currentUser={currentUser} onLogout={handleLogout} />
        </div>
      )}
    </div>
  )
}
