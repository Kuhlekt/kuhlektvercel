"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { storage } from "./utils/storage"
import type { User, Category, Article, AuditLogEntry } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [currentView, setCurrentView] = useState<"browse" | "add-article" | "admin">("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("🚀 Initializing Knowledge Base...")

        // Initialize storage
        storage.init()

        // Load data
        const loadedCategories = storage.getCategories()
        const loadedArticles = storage.getArticles()
        const loadedAuditLog = storage.getAuditLog()
        const loadedUser = storage.getCurrentUser()

        setCategories(loadedCategories)
        setArticles(loadedArticles)
        setAuditLog(loadedAuditLog)
        setCurrentUser(loadedUser)

        console.log("✅ Knowledge Base initialized successfully")
        console.log(
          `📊 Loaded: ${loadedCategories.length} categories, ${loadedArticles.length} articles, ${loadedAuditLog.length} audit entries`,
        )

        if (loadedUser) {
          console.log(`👤 Current user: ${loadedUser.username} (${loadedUser.role})`)
        }
      } catch (error) {
        console.error("❌ Failed to initialize Knowledge Base:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  const handleLogin = (user: User) => {
    console.log("🔐 User logged in:", user.username)
    setCurrentUser(user)
    setShowLoginModal(false)
    refreshAuditLog()
  }

  const handleLogout = () => {
    if (currentUser) {
      console.log("🚪 User logged out:", currentUser.username)
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "LOGOUT",
        details: `User ${currentUser.username} logged out`,
      })
    }
    storage.setCurrentUser(null)
    setCurrentUser(null)
    setCurrentView("browse")
    setSelectedArticle(null)
    refreshAuditLog()
  }

  const refreshData = () => {
    console.log("🔄 Refreshing data...")
    setCategories(storage.getCategories())
    setArticles(storage.getArticles())
    refreshAuditLog()
  }

  const refreshAuditLog = () => {
    setAuditLog(storage.getAuditLog())
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    setCurrentView("browse")
  }

  const handleAddArticle = () => {
    setCurrentView("add-article")
    setSelectedArticle(null)
  }

  const handleArticleAdded = () => {
    refreshData()
    setCurrentView("browse")
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const filteredArticles = searchQuery
    ? articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : articles

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Knowledge Base...</p>
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
        onSearch={handleSearch}
        onViewChange={setCurrentView}
        currentView={currentView}
      />

      <div className="flex h-[calc(100vh-64px)]">
        {currentView === "browse" && (
          <>
            <CategoryTree
              categories={categories}
              articles={filteredArticles}
              selectedArticleId={selectedArticle?.id}
              onArticleSelect={handleArticleSelect}
              onAddArticle={
                currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
                  ? handleAddArticle
                  : undefined
              }
              currentUser={currentUser}
            />
            <ArticleViewer article={selectedArticle} currentUser={currentUser} />
          </>
        )}

        {currentView === "add-article" && (
          <div className="flex-1 p-6">
            <AddArticleForm
              categories={categories}
              currentUser={currentUser}
              onArticleAdded={handleArticleAdded}
              onCancel={() => setCurrentView("browse")}
            />
          </div>
        )}

        {currentView === "admin" && currentUser?.role === "admin" && (
          <div className="flex-1 p-6">
            <AdminDashboard
              categories={categories}
              articles={articles}
              auditLog={auditLog}
              currentUser={currentUser}
              onDataChange={refreshData}
              onAuditLogUpdate={refreshAuditLog}
            />
          </div>
        )}
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}
