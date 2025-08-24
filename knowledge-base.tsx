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
    incrementPageVisits()
  }, [])

  const loadInitialData = async () => {
    try {
      console.log("🚀 KnowledgeBase - Loading initial data...")
      setIsLoading(true)

      const data = await apiDatabase.loadData()

      if (data.categories) setCategories(data.categories)
      if (data.articles) setArticles(data.articles)
      if (data.users) setUsers(data.users)
      if (data.auditLog) setAuditLog(data.auditLog)
      if (data.pageVisits !== undefined) setPageVisits(data.pageVisits)

      console.log("✅ KnowledgeBase - Initial data loaded successfully:", {
        categories: data.categories?.length || 0,
        users: data.users?.length || 0,
        usernames: data.users?.map((u) => u.username) || [],
        auditLog: data.auditLog?.length || 0,
      })
    } catch (error) {
      console.error("❌ KnowledgeBase - Error loading initial data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const incrementPageVisits = async () => {
    try {
      const newCount = await apiDatabase.incrementPageVisits()
      setPageVisits(newCount)
    } catch (error) {
      console.error("Failed to increment page visits")
    }
  }

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log("🔐 KnowledgeBase.handleLogin() - Attempting login")
      console.log("📝 Login attempt details:", {
        username,
        passwordLength: password.length,
        usersAvailable: users.length,
      })
      console.log("👥 Available users in state:", users)

      const user = users.find((u) => {
        const usernameMatch = u.username === username
        const passwordMatch = u.password === password

        console.log(`🔍 Checking user ${u.username}:`, {
          usernameMatch,
          passwordMatch,
          storedUsername: u.username,
          storedPasswordLength: u.password.length,
        })

        return usernameMatch && passwordMatch && u.isActive
      })

      if (user) {
        console.log("✅ Login successful for user:", {
          id: user.id,
          username: user.username,
          role: user.role,
        })

        const loginUser: User = {
          id: user.id,
          username: user.username,
          password: user.password,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: new Date(),
        }

        setCurrentUser(loginUser)

        // Update last login time
        try {
          const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date() } : u))
          setUsers(updatedUsers)
          await apiDatabase.saveData({ users: updatedUsers })
        } catch (error) {
          console.warn("⚠️ Failed to update last login, but continuing with login:", error)
        }

        // Add audit log entry
        const auditEntry: AuditLogEntry = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          action: "user_login",
          performedBy: user.username,
          timestamp: new Date(),
          details: `User ${user.username} logged in successfully`,
        }

        const updatedAuditLog = [...auditLog, auditEntry]
        setAuditLog(updatedAuditLog)

        return true
      }

      console.log("❌ Login failed - user not found or invalid credentials")
      return false
    } catch (error) {
      console.error("❌ KnowledgeBase.handleLogin() - Error:", error)
      return false
    }
  }

  const handleLogout = () => {
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
          <p className="text-gray-600">Loading Knowledge Base...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to database...</p>
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

      <div className="container mx-auto px-4 py-6">
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
