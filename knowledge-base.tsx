"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { LoginModal } from "./components/login-modal"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { FileText } from "lucide-react"
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

  // Load data on component mount
  useEffect(() => {
    const loadData = () => {
      console.log("Loading data...")
      setCurrentUser(storage.getCurrentUser())
      setUsers(storage.getUsers())
      setCategories(storage.getCategories())
      setArticles(storage.getArticles())
      setAuditLog(storage.getAuditLog())
      console.log("Data loaded")
    }

    loadData()
  }, [])

  // Auto-select first category on load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId) {
      setSelectedCategoryId(categories[0].id)
    }
  }, [categories, selectedCategoryId])

  const handleLogin = (user: User) => {
    console.log("Handling login for user:", user)
    setCurrentUser(user)
    setUsers(storage.getUsers()) // Refresh users to get updated lastLogin
  }

  const handleLogout = () => {
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
    }

    const updatedArticles = [...articles, newArticle]
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)

    storage.addAuditEntry({
      userId: currentUser.id,
      action: "CREATE_ARTICLE",
      details: `Created article: ${articleData.title}`,
    })
    setAuditLog(storage.getAuditLog())

    setIsAddArticleModalOpen(false)
  }

  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
  }

  const handleUpdateCategories = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
  }

  const handleUpdateArticles = (updatedArticles: Article[]) => {
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)
  }

  // Filter articles based on search term
  const filteredArticles = searchTerm
    ? articles.filter(
        (article) =>
          article.status === "published" &&
          (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
      )
    : articles

  // Get current article and related data
  const selectedArticle = selectedArticleId ? articles.find((a) => a.id === selectedArticleId) : null
  const selectedCategory = selectedCategoryId ? categories.find((c) => c.id === selectedCategoryId) : null
  const articleAuthor = selectedArticle ? users.find((u) => u.id === selectedArticle.authorId) : null

  // Get articles for selected category (filtered by search if applicable)
  const categoryArticles = selectedCategoryId
    ? filteredArticles.filter((a) => a.categoryId === selectedCategoryId && a.status === "published")
    : []

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

      <div className="flex h-[calc(100vh-4rem)]">
        <CategoryTree
          categories={categories}
          articles={filteredArticles}
          selectedCategoryId={selectedCategoryId}
          selectedArticleId={selectedArticleId}
          onCategorySelect={(categoryId) => {
            setSelectedCategoryId(categoryId)
            setSelectedArticleId(null)
          }}
          onArticleSelect={setSelectedArticleId}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {selectedArticle ? (
            <ArticleViewer
              article={selectedArticle}
              category={selectedCategory}
              author={articleAuthor}
              currentUser={currentUser}
              onEdit={() => {
                // TODO: Implement edit functionality
                console.log("Edit article:", selectedArticle.id)
              }}
              onBack={() => setSelectedArticleId(null)}
            />
          ) : (
            <div className="space-y-6">
              {selectedCategory && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedCategory.name}</h1>
                  {selectedCategory.description && <p className="text-gray-600 mb-6">{selectedCategory.description}</p>}
                </div>
              )}

              {categoryArticles.length > 0 ? (
                <div className="grid gap-4">
                  {categoryArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedArticleId(article.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <FileText className="h-5 w-5 text-blue-600 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{article.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{article.content.substring(0, 150)}...</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                              {article.tags.length > 0 && <span>Tags: {article.tags.slice(0, 3).join(", ")}</span>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center text-gray-500">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">
                        {searchTerm ? "No articles found" : "No articles in this category"}
                      </h3>
                      <p>
                        {searchTerm
                          ? `No articles match "${searchTerm}"`
                          : "Select a category to view articles or add new content."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </main>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />

      {currentUser && (currentUser.role === "admin" || currentUser.role === "editor") && (
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
