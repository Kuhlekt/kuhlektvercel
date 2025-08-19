"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { LoginModal } from "./components/login-modal"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { storage } from "./utils/storage"
import type { Category, Article, User, AuditLogEntry } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isAddArticleModalOpen, setIsAddArticleModalOpen] = useState(false)
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false)

  // Initialize data on component mount
  useEffect(() => {
    storage.initializeStorage()
    setUsers(storage.getUsers())
    setCategories(storage.getCategories())
    setArticles(storage.getArticles())
    setAuditLog(storage.getAuditLog())
    setCurrentUser(storage.getCurrentUser())
  }, [])

  // Filter articles based on category and search term
  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategoryId ? article.categoryId === selectedCategoryId : true
    const matchesSearch = searchTerm
      ? article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
    return matchesCategory && matchesSearch && article.status === "published"
  })

  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    storage.setCurrentUser(null)
    setCurrentUser(null)
    setSelectedArticle(null)
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
  }

  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
    setAuditLog(storage.getAuditLog())
  }

  const handleUpdateCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
    setAuditLog(storage.getAuditLog())
  }

  const handleUpdateArticles = (updatedArticles: Article[]) => {
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)
    setAuditLog(storage.getAuditLog())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentUser={currentUser}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddArticle={() => setIsAddArticleModalOpen(true)}
        onAdminPanel={() => setIsAdminDashboardOpen(true)}
        onLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex">
        <CategoryTree
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={setSelectedCategoryId}
        />

        <main className="flex-1 p-6">
          {selectedArticle ? (
            <ArticleViewer
              article={selectedArticle}
              category={categories.find((c) => c.id === selectedArticle.categoryId)}
              author={users.find((u) => u.id === selectedArticle.authorId)}
              currentUser={currentUser}
              onEdit={() => {}} // TODO: Implement edit functionality
            />
          ) : (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategoryId
                  ? categories.find((c) => c.id === selectedCategoryId)?.name || "Category"
                  : searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : "All Articles"}
              </h2>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No articles found.</p>
                  {currentUser && (
                    <button
                      onClick={() => setIsAddArticleModalOpen(true)}
                      className="mt-4 text-blue-600 hover:text-blue-800"
                    >
                      Add the first article
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">{article.content.substring(0, 200)}...</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{categories.find((c) => c.id === article.categoryId)?.name}</span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />

      {currentUser && (
        <AddArticleForm
          isOpen={isAddArticleModalOpen}
          onClose={() => setIsAddArticleModalOpen(false)}
          onSubmit={handleAddArticle}
          categories={categories}
          currentUser={currentUser}
        />
      )}

      {currentUser?.role === "admin" && (
        <AdminDashboard
          isOpen={isAdminDashboardOpen}
          onClose={() => setIsAdminDashboardOpen(false)}
          currentUser={currentUser}
          users={users}
          categories={categories}
          articles={articles}
          auditLog={auditLog}
          onUpdateUsers={handleUpdateUsers}
          onUpdateCategories={handleUpdateCategories}
          onUpdateArticles={handleUpdateArticles}
        />
      )}
    </div>
  )
}
