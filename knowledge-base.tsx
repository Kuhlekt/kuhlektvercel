"use client"

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
import { Button } from "@/components/ui/button"
import { Plus, Settings, Home } from "lucide-react"
import type { Article, Category, User } from "./types/knowledge-base"
import { storage } from "./utils/storage"
import { initialCategories } from "./data/initial-data"
import { initialUsers } from "./data/initial-users"
import Image from "next/image"

type ViewMode = "browse" | "search" | "article" | "add" | "edit" | "admin"

export default function KnowledgeBase() {
  // State management
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Load categories
        const storedCategories = storage.getCategories()
        if (storedCategories && storedCategories.length > 0) {
          setCategories(storedCategories)
        } else {
          setCategories(initialCategories)
          storage.saveCategories(initialCategories)
        }

        // Load users
        const storedUsers = storage.getUsers()
        if (storedUsers && storedUsers.length > 0) {
          setUsers(storedUsers)
        } else {
          setUsers(initialUsers)
          storage.saveUsers(initialUsers)
        }

        // Check for existing session
        const sessionUser = storage.getCurrentUser()
        if (sessionUser) {
          setCurrentUser(sessionUser)
        }
      } catch (error) {
        console.error("Error loading data:", error)
        // Fallback to initial data
        setCategories(initialCategories)
        setUsers(initialUsers)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Save data when it changes
  useEffect(() => {
    if (categories.length > 0 && !isLoading) {
      storage.saveCategories(categories)
    }
  }, [categories, isLoading])

  useEffect(() => {
    if (users.length > 0 && !isLoading) {
      storage.saveUsers(users)
    }
  }, [users, isLoading])

  // Authentication functions
  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date() }
      setCurrentUser(updatedUser)
      storage.setCurrentUser(updatedUser)

      // Update users array with last login time
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      setUsers(updatedUsers)
      storage.saveUsers(updatedUsers)

      setShowLoginModal(false)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setCurrentUser(null)
    storage.clearCurrentUser()
    setViewMode("browse")
  }

  // Search functionality
  const performSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      setViewMode("browse")
      return
    }

    const results: Article[] = []
    const searchLower = searchTerm.toLowerCase()

    categories.forEach((category) => {
      // Search in category articles
      category.articles.forEach((article) => {
        const titleMatch = article.title.toLowerCase().includes(searchLower)
        const contentMatch = article.content.toLowerCase().includes(searchLower)
        const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(searchLower))

        if (titleMatch || contentMatch || tagMatch) {
          results.push(article)
        }
      })

      // Search in subcategory articles
      category.subcategories.forEach((subcategory) => {
        subcategory.articles.forEach((article) => {
          const titleMatch = article.title.toLowerCase().includes(searchLower)
          const contentMatch = article.content.toLowerCase().includes(searchLower)
          const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(searchLower))

          if (titleMatch || contentMatch || tagMatch) {
            results.push(article)
          }
        })
      })
    })

    // Remove duplicates and sort by relevance
    const uniqueResults = results.filter((article, index, self) => index === self.findIndex((a) => a.id === article.id))

    setSearchResults(uniqueResults)
    setViewMode("search")
  }

  // Article management functions
  const addArticle = (articleData: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === articleData.categoryId) {
        if (articleData.subcategoryId) {
          // Add to subcategory
          return {
            ...category,
            subcategories: category.subcategories.map((subcategory) =>
              subcategory.id === articleData.subcategoryId
                ? { ...subcategory, articles: [...subcategory.articles, newArticle] }
                : subcategory,
            ),
          }
        } else {
          // Add to main category
          return {
            ...category,
            articles: [...category.articles, newArticle],
          }
        }
      }
      return category
    })

    setCategories(updatedCategories)
    setViewMode("browse")
  }

  const updateArticle = (updatedArticle: Article) => {
    const updatedCategories = categories.map((category) => {
      // Update in main category articles
      const updatedCategoryArticles = category.articles.map((article) =>
        article.id === updatedArticle.id ? { ...updatedArticle, updatedAt: new Date() } : article,
      )

      // Update in subcategory articles
      const updatedSubcategories = category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.map((article) =>
          article.id === updatedArticle.id ? { ...updatedArticle, updatedAt: new Date() } : article,
        ),
      }))

      return {
        ...category,
        articles: updatedCategoryArticles,
        subcategories: updatedSubcategories,
      }
    })

    setCategories(updatedCategories)
    setEditingArticle(null)
    setCurrentArticle({ ...updatedArticle, updatedAt: new Date() })
    setViewMode("article")
  }

  const deleteArticle = (articleId: string) => {
    const updatedCategories = categories.map((category) => ({
      ...category,
      articles: category.articles.filter((article) => article.id !== articleId),
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        articles: subcategory.articles.filter((article) => article.id !== articleId),
      })),
    }))

    setCategories(updatedCategories)
    setCurrentArticle(null)
    setViewMode("browse")
  }

  // Navigation functions
  const handleCategorySelect = (categoryIds: Set<string>, subcategoryIds: Set<string>) => {
    setSelectedCategories(categoryIds)
    setSelectedSubcategories(subcategoryIds)
    setViewMode("browse")
  }

  const handleArticleSelect = (article: Article) => {
    setCurrentArticle(article)
    setViewMode("article")
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setViewMode("edit")
  }

  const getNavigationTitle = () => {
    if (selectedCategories.size === 0 && selectedSubcategories.size === 0) {
      return "All Articles"
    }

    const categoryNames: string[] = []
    categories.forEach((category) => {
      if (selectedCategories.has(category.id)) {
        categoryNames.push(category.name)
      }
      category.subcategories.forEach((subcategory) => {
        if (selectedSubcategories.has(subcategory.id)) {
          categoryNames.push(`${category.name} > ${subcategory.name}`)
        }
      })
    })

    return categoryNames.join(", ") || "Selected Categories"
  }

  const isLoggedIn = currentUser !== null
  const isAdmin = currentUser?.role === "admin"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading knowledge base...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={performSearch}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser?.username || null}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode !== "article" && viewMode !== "add" && viewMode !== "edit" && viewMode !== "admin" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <Image
                src="/images/kuhlekt-logo.jpg"
                alt="Kuhlekt"
                width={160}
                height={160}
                className="h-40 w-40 mx-auto mb-4 object-contain"
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
              <p className="text-gray-600">Find answers, guides, and documentation</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mb-8">
              <Button
                variant={viewMode === "browse" ? "default" : "outline"}
                onClick={() => setViewMode("browse")}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Browse</span>
              </Button>

              {isAdmin && (
                <>
                  <Button variant="outline" onClick={() => setViewMode("add")} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Article</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setViewMode("admin")}
                    className="flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Button>
                </>
              )}
            </div>
          </>
        )}

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Only show in browse and search modes */}
          {(viewMode === "browse" || viewMode === "search") && (
            <div className="lg:col-span-1">
              <CategoryTree
                categories={categories}
                selectedCategories={selectedCategories}
                selectedSubcategories={selectedSubcategories}
                onSelectionChange={handleCategorySelect}
              />
            </div>
          )}

          {/* Main Content */}
          <div className={viewMode === "browse" || viewMode === "search" ? "lg:col-span-3" : "lg:col-span-4"}>
            {viewMode === "browse" && (
              <SelectedArticles
                categories={categories}
                selectedCategories={selectedCategories}
                selectedSubcategories={selectedSubcategories}
                onArticleSelect={handleArticleSelect}
                navigationTitle={getNavigationTitle()}
              />
            )}

            {viewMode === "search" && (
              <SearchResults
                results={searchResults}
                categories={categories}
                query={searchTerm}
                onArticleSelect={handleArticleSelect}
              />
            )}

            {viewMode === "article" && currentArticle && (
              <ArticleViewer
                article={currentArticle}
                categories={categories}
                onEdit={isAdmin ? handleEditArticle : undefined}
                onDelete={isAdmin ? deleteArticle : undefined}
                onBack={() => setViewMode("browse")}
              />
            )}

            {viewMode === "add" && isAdmin && (
              <AddArticleForm
                categories={categories}
                onSubmit={addArticle}
                onCancel={() => setViewMode("browse")}
                currentUser={currentUser?.username || "Unknown"}
              />
            )}

            {viewMode === "edit" && editingArticle && isAdmin && (
              <EditArticleForm
                article={editingArticle}
                categories={categories}
                onSubmit={updateArticle}
                onCancel={() => {
                  setEditingArticle(null)
                  setViewMode("article")
                }}
                currentUser={currentUser?.username || "Unknown"}
              />
            )}

            {viewMode === "admin" && isAdmin && (
              <AdminDashboard
                categories={categories}
                setCategories={setCategories}
                users={users}
                setUsers={setUsers}
                currentUser={currentUser}
                onBack={() => setViewMode("browse")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}
