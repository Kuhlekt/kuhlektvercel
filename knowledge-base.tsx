"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleList } from "./components/article-list"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, X, Database, AlertCircle } from "lucide-react"
import type { Category, Article, User, AuditLogEntry } from "./types/knowledge-base"
import { apiDatabase } from "./utils/api-database"

export default function KnowledgeBase() {
  // State management
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [currentView, setCurrentView] = useState<"browse" | "add" | "admin">("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Loading data from API...")

        const data = await apiDatabase.loadData()

        console.log("Loaded data:", data)

        setCategories(data.categories)
        setUsers(data.users)
        setAuditLog(data.auditLog)

        // Increment page visits
        await apiDatabase.incrementPageVisits()

        console.log("Data loaded successfully")
      } catch (error) {
        console.error("Error loading data:", error)
        setError("Failed to load data from server. Please refresh the page.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Refresh data function for manual refresh
  const refreshData = async () => {
    try {
      setError(null)
      const data = await apiDatabase.loadData()
      setCategories(data.categories)
      setUsers(data.users)
      setAuditLog(data.auditLog)
    } catch (error) {
      console.error("Error refreshing data:", error)
      setError("Failed to refresh data from server.")
    }
  }

  // Handle login
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting login with:", username)

      const user = users.find((u) => u.username === username && u.password === password)

      if (user) {
        // Update last login time
        const updatedUsers = await apiDatabase.updateUserLastLogin(users, user.id)
        setUsers(updatedUsers)

        const updatedUser = updatedUsers.find((u) => u.id === user.id)
        setCurrentUser(updatedUser || user)

        console.log("Login successful")
        setShowLoginModal(false)
        return true
      }

      console.log("Login failed - invalid credentials")
      return false
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
      return false
    }
  }

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
    setSelectedArticle(null)
    setEditingArticle(null)
  }

  // Get all articles from categories
  const getAllArticles = (): Article[] => {
    const allArticles: Article[] = []

    categories.forEach((category) => {
      allArticles.push(...category.articles)
      category.subcategories.forEach((subcategory) => {
        allArticles.push(...subcategory.articles)
      })
    })

    return allArticles
  }

  // Get filtered articles based on selected category
  const getFilteredArticles = (): Article[] => {
    if (!selectedCategory) {
      return getAllArticles()
    }

    const allArticles: Article[] = []

    categories.forEach((category) => {
      if (category.id === selectedCategory) {
        allArticles.push(...category.articles)
        category.subcategories.forEach((subcategory) => {
          allArticles.push(...subcategory.articles)
        })
      } else {
        category.subcategories.forEach((subcategory) => {
          if (subcategory.id === selectedCategory) {
            allArticles.push(...subcategory.articles)
          }
        })
      }
    })

    return allArticles
  }

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const allArticles = getAllArticles()
    const results = allArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    setSearchResults(results)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
    clearSearch()
  }

  // Handle article selection
  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
  }

  // Handle back to articles
  const handleBackToArticles = () => {
    setSelectedArticle(null)
    setEditingArticle(null)
  }

  // Handle add article
  const handleAddArticle = async (articleData: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    try {
      setError(null)

      const newArticle = await apiDatabase.addArticle(categories, articleData)
      const updatedCategories = await apiDatabase.loadData().then((data) => data.categories)
      setCategories(updatedCategories)

      // Add audit log entry
      const updatedAuditLog = await apiDatabase.addAuditEntry(auditLog, {
        action: "article_created",
        articleId: newArticle.id,
        articleTitle: newArticle.title,
        categoryId: newArticle.categoryId,
        performedBy: currentUser?.username || "anonymous",
        details: `Created article: ${newArticle.title}`,
      })
      setAuditLog(updatedAuditLog)

      setCurrentView("browse")
    } catch (error) {
      console.error("Error adding article:", error)
      setError("Failed to add article. Please try again.")
    }
  }

  // Handle edit article
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
  }

  // Handle update article
  const handleUpdateArticle = async (updatedArticle: Omit<Article, "createdAt">) => {
    try {
      setError(null)

      const updatedCategories = await apiDatabase.updateArticle(categories, updatedArticle.id, updatedArticle)
      setCategories(updatedCategories)

      // Add audit log entry
      const updatedAuditLog = await apiDatabase.addAuditEntry(auditLog, {
        action: "article_updated",
        articleId: updatedArticle.id,
        articleTitle: updatedArticle.title,
        categoryId: updatedArticle.categoryId,
        performedBy: currentUser?.username || "anonymous",
        details: `Updated article: ${updatedArticle.title}`,
      })
      setAuditLog(updatedAuditLog)

      setEditingArticle(null)
      setSelectedArticle(null)
    } catch (error) {
      console.error("Error updating article:", error)
      setError("Failed to update article. Please try again.")
    }
  }

  // Handle delete article
  const handleDeleteArticle = async (articleId: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return
    }

    try {
      setError(null)

      const article = getAllArticles().find((a) => a.id === articleId)
      const updatedCategories = await apiDatabase.deleteArticle(categories, articleId)
      setCategories(updatedCategories)

      // Add audit log entry
      if (article) {
        const updatedAuditLog = await apiDatabase.addAuditEntry(auditLog, {
          action: "article_deleted",
          articleId: articleId,
          articleTitle: article.title,
          categoryId: article.categoryId,
          performedBy: currentUser?.username || "anonymous",
          details: `Deleted article: ${article.title}`,
        })
        setAuditLog(updatedAuditLog)
      }

      setSelectedArticle(null)
    } catch (error) {
      console.error("Error deleting article:", error)
      setError("Failed to delete article. Please try again.")
    }
  }

  // Handle category management
  const handleCategoriesUpdate = async () => {
    try {
      await refreshData()
    } catch (error) {
      console.error("Error updating categories:", error)
      setError("Failed to update categories.")
    }
  }

  const handleUsersUpdate = async () => {
    try {
      await refreshData()
    } catch (error) {
      console.error("Error updating users:", error)
      setError("Failed to update users.")
    }
  }

  const handleAuditLogUpdate = async () => {
    try {
      await refreshData()
    } catch (error) {
      console.error("Error updating audit log:", error)
      setError("Failed to update audit log.")
    }
  }

  // Get current articles to display
  const getCurrentArticles = () => {
    if (searchQuery && searchResults.length >= 0) {
      return searchResults
    }
    return getFilteredArticles()
  }

  // Get current title
  const getCurrentTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`
    }

    if (selectedCategory) {
      for (const category of categories) {
        if (category.id === selectedCategory) {
          return category.name
        }
        for (const subcategory of category.subcategories) {
          if (subcategory.id === selectedCategory) {
            return `${category.name} > ${subcategory.name}`
          }
        }
      }
    }

    return "All Articles"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading knowledge base...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to server...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onViewChange={setCurrentView}
        currentView={currentView}
      />

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 pt-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={refreshData}>
                  Retry
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === "browse" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <img
                src="/images/kuhlekt-logo.jpg"
                alt="Kuhlekt Logo"
                className="h-40 w-40 mx-auto mb-4 object-contain"
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
              <p className="text-gray-600">Find answers, guides, and documentation</p>
              <div className="flex items-center justify-center space-x-2 mt-2 text-sm text-gray-500">
                <Database className="h-4 w-4 text-green-500" />
                <span>Shared database - changes visible to all users</span>
                <Button variant="ghost" size="sm" onClick={refreshData} className="h-6 px-2 text-xs">
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 pr-10"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 text-center">
                  <Button onClick={handleSearch} className="mx-auto">
                    Search
                  </Button>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Categories */}
              {!selectedArticle && !editingArticle && (
                <div className="lg:col-span-1">
                  <CategoryTree
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                  />
                </div>
              )}

              {/* Content Area */}
              <div className={selectedArticle || editingArticle ? "lg:col-span-4" : "lg:col-span-3"}>
                {editingArticle ? (
                  <EditArticleForm
                    article={editingArticle}
                    categories={categories}
                    currentUser={currentUser}
                    onSubmit={handleUpdateArticle}
                    onCancel={() => setEditingArticle(null)}
                  />
                ) : selectedArticle ? (
                  <ArticleViewer
                    article={selectedArticle}
                    categories={categories}
                    currentUser={currentUser}
                    onBack={handleBackToArticles}
                    onEdit={currentUser ? handleEditArticle : undefined}
                    onDelete={currentUser ? handleDeleteArticle : undefined}
                  />
                ) : (
                  <ArticleList
                    articles={getCurrentArticles()}
                    categories={categories}
                    onArticleSelect={handleArticleSelect}
                    title={getCurrentTitle()}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {currentView === "add" && currentUser && (
          <AddArticleForm
            categories={categories}
            onSubmit={handleAddArticle}
            onCancel={() => setCurrentView("browse")}
          />
        )}

        {currentView === "admin" && currentUser && (
          <AdminDashboard
            categories={categories}
            users={users}
            auditLog={auditLog}
            onCategoriesUpdate={handleCategoriesUpdate}
            onUsersUpdate={handleUsersUpdate}
            onAuditLogUpdate={handleAuditLogUpdate}
          />
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}
