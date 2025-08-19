"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { LoginModal } from "./components/login-modal"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { storage } from "./utils/storage"
import type { User, Category, Article, AuditLog } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [auditLog, setAuditLog] = useState<AuditLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false)
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false)

  useEffect(() => {
    console.log("🚀 Initializing Knowledge Base...")
    storage.init()

    setUsers(storage.getUsers())
    setCategories(storage.getCategories())
    setArticles(storage.getArticles())
    setAuditLog(storage.getAuditLog())

    const existingUser = storage.getCurrentUser()
    if (existingUser) {
      console.log("👤 Found existing user session:", existingUser)
      setCurrentUser(existingUser)
    }

    console.log("✅ Knowledge Base initialized")
  }, [])

  const handleLogin = (user: User) => {
    console.log("🎉 User logged in:", user)
    setCurrentUser(user)
    setIsLoginModalOpen(false)
    setAuditLog(storage.getAuditLog())
  }

  const handleLogout = () => {
    console.log("👋 User logged out")
    if (currentUser) {
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "LOGOUT",
        details: `User ${currentUser.username} logged out`,
      })
      setAuditLog(storage.getAuditLog())
    }

    storage.setCurrentUser(null)
    setCurrentUser(null)
    setSelectedArticleId(null)
    setSelectedCategoryId(null)
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
      ...articleData,
      authorId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser.username,
    }

    const updatedArticles = [...articles, newArticle]
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)

    storage.addAuditEntry({
      userId: currentUser.id,
      action: "CREATE_ARTICLE",
      details: `Created article "${articleData.title}"`,
    })
    setAuditLog(storage.getAuditLog())

    setIsAddArticleModalOpen(false)
    console.log("📝 Article created:", newArticle)
  }

  const getFilteredArticles = () => {
    if (!searchTerm.trim()) return articles

    const query = searchTerm.toLowerCase()
    return articles.filter(
      (article) =>
        article.status === "published" &&
        (article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))),
    )
  }

  const selectedArticle = selectedArticleId ? articles.find((a) => a.id === selectedArticleId) : null
  const selectedCategory = selectedCategoryId ? categories.find((c) => c.id === selectedCategoryId) : null
  const selectedAuthor = selectedArticle ? users.find((u) => u.id === selectedArticle.authorId) : undefined

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId === selectedCategoryId ? null : categoryId)
    setSelectedArticleId(null)
  }

  const handleArticleSelect = (articleId: string) => {
    setSelectedArticleId(articleId)
  }

  const handleBackFromArticle = () => {
    setSelectedArticleId(null)
  }

  const handleEditArticle = () => {
    console.log("✏️ Edit article functionality not implemented yet")
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navigation
        currentUser={currentUser}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddArticle={() => setIsAddArticleModalOpen(true)}
        onAdminPanel={() => setIsAdminDashboardOpen(true)}
        onLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex overflow-hidden">
        <CategoryTree
          categories={categories}
          articles={articles}
          selectedCategoryId={selectedCategoryId}
          selectedArticleId={selectedArticleId}
          onCategorySelect={handleCategorySelect}
          onArticleSelect={handleArticleSelect}
        />

        <main className="flex-1 overflow-hidden">
          {selectedArticle ? (
            <ArticleViewer
              article={selectedArticle}
              category={selectedCategory}
              author={selectedAuthor}
              currentUser={currentUser}
              onEdit={handleEditArticle}
              onBack={handleBackFromArticle}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">KB</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Kuhlekt Knowledge Base</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Select a category from the sidebar to browse articles, or use the search bar to find specific content.
                </p>
                {!currentUser && (
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Login to Get Started
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />

      {currentUser && (
        <>
          <AddArticleForm
            isOpen={isAddArticleModalOpen}
            onClose={() => setIsAddArticleModalOpen(false)}
            onSubmit={handleAddArticle}
            categories={categories}
            currentUser={currentUser}
          />

          {currentUser.role === "admin" && (
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
        </>
      )}
    </div>
  )
}
