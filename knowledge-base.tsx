"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { LoginModal } from "./components/login-modal"
import { CategoryTree } from "./components/category-tree"
import { ArticleList } from "./components/article-list"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { apiDatabase } from "./utils/api-database"
import type {
  User,
  Category,
  Article,
  AuditLogEntry,
  KnowledgeBaseUser,
  KnowledgeBaseData,
} from "./types/knowledge-base"

export default function KnowledgeBase() {
  // State management
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<"browse" | "add" | "admin">("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data state
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [users, setUsers] = useState<KnowledgeBaseUser[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [pageVisits, setPageVisits] = useState(0)

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  // Load initial data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      console.log("🚀 KnowledgeBase - Loading initial data...")
      setIsLoading(true)
      setError(null)

      const data = await apiDatabase.loadData()

      if (data.categories) setCategories(data.categories)
      if (data.articles) setArticles(data.articles)
      if (data.users) setUsers(data.users)
      if (data.auditLog) setAuditLog(data.auditLog)
      if (data.pageVisits !== undefined) setPageVisits(data.pageVisits)

      console.log("✅ KnowledgeBase - Initial data loaded successfully:", {
        categories: data.categories?.length || 0,
        articles: data.articles?.length || 0,
        users: data.users?.length || 0,
        auditLog: data.auditLog?.length || 0,
        pageVisits: data.pageVisits || 0,
      })

      // Increment page visits
      try {
        const newCount = await apiDatabase.incrementPageVisits()
        setPageVisits(newCount)
      } catch (error) {
        console.warn("⚠️ Failed to increment page visits:", error)
      }
    } catch (error) {
      console.error("❌ KnowledgeBase - Error loading initial data:", error)
      setError("Failed to load data from server. Using fallback data.")

      // Set fallback data to prevent empty UI
      setCategories([])
      setArticles([])
      setUsers([])
      setAuditLog([])
      setPageVisits(0)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      setError(null)
      apiDatabase.clearCache()
      const data = await apiDatabase.loadData()

      if (data.categories) setCategories(data.categories)
      if (data.articles) setArticles(data.articles)
      if (data.users) setUsers(data.users)
      if (data.auditLog) setAuditLog(data.auditLog)
      if (data.pageVisits !== undefined) setPageVisits(data.pageVisits)

      console.log("✅ Data refreshed successfully")
    } catch (error) {
      console.error("❌ Error refreshing data:", error)
      setError("Failed to refresh data from server.")
    }
  }

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("🔐 Attempting login for:", username)

      // Call the login API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const result = await response.json()

      if (result.success && result.user) {
        console.log("✅ Login successful for user:", result.user.username)

        // Create User object for current user state
        const loginUser: User = {
          id: result.user.id || `user-${username}`,
          username: result.user.username,
          password: password, // Keep for session
          email: result.user.email || `${username}@example.com`,
          role: result.user.role,
          isActive: true,
          createdAt: result.user.createdAt || new Date().toISOString(),
          lastLogin: new Date(),
        }

        setCurrentUser(loginUser)
        setShowLoginModal(false)

        // Refresh data to get updated audit log
        setTimeout(() => refreshData(), 500)

        return true
      }

      console.log("❌ Login failed:", result.message)
      return false
    } catch (error) {
      console.error("❌ Login error:", error)
      return false
    }
  }

  const handleLogout = () => {
    console.log("👋 User logging out")
    setCurrentUser(null)
    setCurrentView("browse")
    setSelectedArticle(null)
    setEditingArticle(null)
  }

  const handleViewChange = (view: "browse" | "add" | "admin") => {
    setCurrentView(view)
    setSelectedArticle(null)
    setEditingArticle(null)
  }

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
    setEditingArticle(null)
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    setEditingArticle(null)

    // Increment article views
    const updatedArticles = articles.map((a) => (a.id === article.id ? { ...a, views: (a.views || 0) + 1 } : a))
    setArticles(updatedArticles)

    // Save updated view count to database
    const updatedData = {
      categories,
      articles: updatedArticles,
      users,
      auditLog,
      pageVisits,
    }

    apiDatabase.saveData(updatedData).catch((error) => {
      console.warn("⚠️ Failed to save view count:", error)
    })
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setSelectedArticle(null)
  }

  const handleArticleUpdate = async (updatedData: KnowledgeBaseData) => {
    if (updatedData.categories) setCategories(updatedData.categories)
    if (updatedData.articles) setArticles(updatedData.articles)
    if (updatedData.users) setUsers(updatedData.users)
    if (updatedData.auditLog) setAuditLog(updatedData.auditLog)

    setEditingArticle(null)
    setSelectedArticle(null)
  }

  const handleDataUpdate = async (updatedData: KnowledgeBaseData) => {
    if (updatedData.categories) setCategories(updatedData.categories)
    if (updatedData.articles) setArticles(updatedData.articles)
    if (updatedData.users) setUsers(updatedData.users)
    if (updatedData.auditLog) setAuditLog(updatedData.auditLog)
  }

  // Filter articles by selected category
  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.categoryId === selectedCategory)
    : articles

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Knowledge Base</h2>
          <p className="text-gray-600 mb-4">Initializing database and loading content...</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>🗄️</span>
            <span>Connecting to database...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onViewChange={handleViewChange}
        currentView={currentView}
      />

      {/* Error Alert */}
      {error && (
        <div className="container mx-auto px-4 pt-4">
          <Alert variant="destructive">
            <span className="text-red-500">⚠️</span>
            <AlertDescription className="flex items-center justify-between">
              {error}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={refreshData} className="h-6 px-2 text-xs">
                  🔄 Retry
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>
                  ✕
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🗂️ Kuhlekt Knowledge Base</h1>
          <p className="text-xl text-gray-600 mb-4">Your comprehensive documentation and knowledge management system</p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="text-green-500">🟢</span>
              <span>Database Connected</span>
            </div>
            <span>|</span>
            <span>📚 {articles.length} Articles</span>
            <span>|</span>
            <span>🗂️ {categories.length} Categories</span>
            <span>|</span>
            <span>👥 {users.length} Users</span>
            <span>|</span>
            <span>👀 {pageVisits} Page Views</span>
          </div>

          {!currentUser && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 mb-2">
                <strong>Welcome!</strong> This is a demo knowledge base system.
              </p>
              <Button onClick={() => setShowLoginModal(true)} className="bg-blue-600 hover:bg-blue-700">
                🔐 Try Demo Login
              </Button>
            </div>
          )}
        </div>

        {currentView === "browse" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <CategoryTree
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedArticle ? (
                <ArticleViewer
                  article={selectedArticle}
                  onBack={() => setSelectedArticle(null)}
                  onEdit={
                    currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
                      ? handleEditArticle
                      : undefined
                  }
                />
              ) : (
                <ArticleList
                  articles={filteredArticles}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onArticleSelect={handleArticleSelect}
                />
              )}
            </div>
          </div>
        )}

        {currentView === "add" && currentUser && (currentUser.role === "admin" || currentUser.role === "editor") && (
          <AddArticleForm
            categories={categories}
            currentUser={currentUser}
            onArticleAdded={handleDataUpdate}
            onCancel={() => setCurrentView("browse")}
          />
        )}

        {currentView === "admin" && currentUser?.role === "admin" && (
          <AdminDashboard
            categories={categories}
            articles={articles}
            users={users}
            auditLog={auditLog}
            pageVisits={pageVisits}
            onDataUpdate={handleDataUpdate}
          />
        )}

        {editingArticle && currentUser && (currentUser.role === "admin" || currentUser.role === "editor") && (
          <EditArticleForm
            article={editingArticle}
            categories={categories}
            currentUser={currentUser}
            onArticleUpdated={handleArticleUpdate}
            onCancel={() => setEditingArticle(null)}
          />
        )}
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}
