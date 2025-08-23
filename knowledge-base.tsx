"use client"

import { useState, useEffect, useCallback } from "react"
import { Navigation } from "./components/navigation"
import { LoginModal } from "./components/login-modal"
import { CategoryTree } from "./components/category-tree"
import { ArticleList } from "./components/article-list"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  // Authentication state
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Navigation state
  const [currentView, setCurrentView] = useState<"browse" | "add" | "admin">("browse")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  // Data state
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [users, setUsers] = useState<KnowledgeBaseUser[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [pageVisits, setPageVisits] = useState(0)

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

      // Update state with loaded data
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
        const newVisits = await apiDatabase.incrementPageVisits()
        setPageVisits(newVisits)
      } catch (error) {
        console.warn("Failed to increment page visits:", error)
      }
    } catch (error) {
      console.error("❌ KnowledgeBase - Error loading initial data:", error)
      setError("Failed to load data from server. Please refresh the page.")
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh data from server
  const refreshData = useCallback(async () => {
    try {
      console.log("🔄 Refreshing data from server...")
      setError(null)

      // Clear cache to force fresh load
      apiDatabase.clearCache()
      const data = await apiDatabase.loadData()

      // Update all state
      if (data.categories) setCategories([...data.categories])
      if (data.articles) setArticles([...data.articles])
      if (data.users) setUsers([...data.users])
      if (data.auditLog) setAuditLog([...data.auditLog])
      if (data.pageVisits !== undefined) setPageVisits(data.pageVisits)

      console.log("✅ Data refreshed successfully")
    } catch (error) {
      console.error("❌ Error refreshing data:", error)
      setError("Failed to refresh data from server.")
    }
  }, [])

  // Handle user login
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("🔐 Attempting login for:", username)

      // Find user in current users list
      const user = users.find((u) => u.username === username && u.password === password && u.isActive)

      if (!user) {
        console.log("❌ Login failed - invalid credentials")
        return false
      }

      console.log("✅ Login successful for user:", user.username)

      // Create User object for current user state
      const loginUser: User = {
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: new Date(),
      }

      setCurrentUser(loginUser)
      setShowLoginModal(false)

      // Update last login time in database
      try {
        await apiDatabase.updateUserLastLogin(user.id)

        // Add audit log entry
        await apiDatabase.addAuditEntry({
          action: "user_login",
          userId: user.id,
          username: user.username,
          performedBy: user.username,
          details: `User ${user.username} logged in successfully`,
        })

        // Refresh data to get updated audit log
        await refreshData()
      } catch (error) {
        console.warn("⚠️ Failed to update login info:", error)
      }

      return true
    } catch (error) {
      console.error("❌ Login error:", error)
      return false
    }
  }

  // Handle user logout
  const handleLogout = () => {
    console.log("👋 User logging out")
    setCurrentUser(null)
    setCurrentView("browse")
    setSelectedArticle(null)
    setEditingArticle(null)
    clearSearch()
  }

  // Handle view changes
  const handleViewChange = (view: "browse" | "add" | "admin") => {
    setCurrentView(view)
    setSelectedArticle(null)
    setEditingArticle(null)
    clearSearch()
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
    setEditingArticle(null)
    clearSearch()
  }

  // Handle article selection
  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    setEditingArticle(null)

    // Increment article views
    const updatedArticles = articles.map((a) => (a.id === article.id ? { ...a, views: (a.views || 0) + 1 } : a))
    setArticles(updatedArticles)

    // Save updated view count to database
    const updatedData: KnowledgeBaseData = {
      categories,
      articles: updatedArticles,
      users,
      auditLog,
      pageVisits,
    }

    apiDatabase.saveData(updatedData).catch((error) => {
      console.warn("Failed to save view count:", error)
    })
  }

  // Handle article editing
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setSelectedArticle(null)
  }

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results = articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        article.author.toLowerCase().includes(query),
    )

    setSearchResults(results)
    console.log(`🔍 Search for "${searchQuery}" returned ${results.length} results`)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  // Handle data updates from child components
  const handleDataUpdate = useCallback(
    async (updatedData: Partial<KnowledgeBaseData>) => {
      try {
        // Update local state
        if (updatedData.categories) setCategories([...updatedData.categories])
        if (updatedData.articles) setArticles([...updatedData.articles])
        if (updatedData.users) setUsers([...updatedData.users])
        if (updatedData.auditLog) setAuditLog([...updatedData.auditLog])
        if (updatedData.pageVisits !== undefined) setPageVisits(updatedData.pageVisits)

        // Save to database
        const fullData: KnowledgeBaseData = {
          categories: updatedData.categories || categories,
          articles: updatedData.articles || articles,
          users: updatedData.users || users,
          auditLog: updatedData.auditLog || auditLog,
          pageVisits: updatedData.pageVisits !== undefined ? updatedData.pageVisits : pageVisits,
        }

        await apiDatabase.saveData(fullData)
        console.log("✅ Data updated successfully")
      } catch (error) {
        console.error("❌ Error updating data:", error)
        setError("Failed to save changes. Please try again.")
      }
    },
    [categories, articles, users, auditLog, pageVisits],
  )

  // Get filtered articles based on search and category
  const getDisplayArticles = (): Article[] => {
    if (searchQuery && searchResults.length >= 0) {
      return searchResults
    }

    if (selectedCategory) {
      return articles.filter((article) => article.categoryId === selectedCategory)
    }

    return articles
  }

  // Get current title for article list
  const getCurrentTitle = (): string => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}" (${searchResults.length})`
    }

    if (selectedCategory) {
      const category = categories.find((c) => c.id === selectedCategory)
      return category ? category.name : "Category"
    }

    return `All Articles (${articles.length})`
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Knowledge Base</h2>
          <p className="text-gray-600 mb-4">Connecting to server and loading data...</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <span>🗄️</span>
            <span>Initializing database connection</span>
          </div>
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === "browse" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <img
                src="/images/kuhlekt-logo.png"
                alt="Kuhlekt Logo"
                className="h-32 w-auto mx-auto mb-4 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                }}
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
              <p className="text-gray-600 mb-4">Find answers, guides, and documentation</p>
              <div className="flex items-center justify-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">🟢</span>
                  <span>Database connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>{categories.length} categories</span>
                  <span>•</span>
                  <span>{articles.length} articles</span>
                  <span>•</span>
                  <span>{users.length} users</span>
                  <span>•</span>
                  <span>{pageVisits} visits</span>
                </div>
                <Button variant="ghost" size="sm" onClick={refreshData} className="h-6 px-2 text-xs">
                  🔄 Refresh
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
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
                    ✕
                  </Button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 text-center">
                  <Button onClick={handleSearch} className="mx-auto">
                    🔍 Search
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
                    onArticleUpdated={handleDataUpdate}
                    onCancel={() => setEditingArticle(null)}
                  />
                ) : selectedArticle ? (
                  <ArticleViewer
                    article={selectedArticle}
                    categories={categories}
                    onBack={() => setSelectedArticle(null)}
                    onEdit={
                      currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
                        ? handleEditArticle
                        : undefined
                    }
                  />
                ) : (
                  <ArticleList
                    articles={getDisplayArticles()}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onArticleSelect={handleArticleSelect}
                    title={getCurrentTitle()}
                  />
                )}
              </div>
            </div>
          </>
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
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}
