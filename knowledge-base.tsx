"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { SearchResults } from "./components/search-results"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { Category, Article, User } from "./types/knowledge-base"
import { storage } from "./utils/storage"

export default function KnowledgeBase() {
  // State management
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [currentView, setCurrentView] = useState<"browse" | "add" | "edit" | "admin">("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Load data on component mount
  useEffect(() => {
    const loadedCategories = storage.getCategories()
    const loadedArticles = storage.getArticles()
    const loadedUsers = storage.getUsers()

    setCategories(loadedCategories)
    setArticles(loadedArticles)
    setUsers(loadedUsers)
  }, [])

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, articles])

  // Authentication handlers
  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date().toISOString() }
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      setUsers(updatedUsers)
      storage.saveUsers(updatedUsers)
      setCurrentUser(updatedUser)
      setShowLoginModal(false)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
  }

  // Article management
  const handleAddArticle = (articleData: Omit<Article, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
    if (!currentUser) return

    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUser.id,
    }

    const updatedArticles = [...articles, newArticle]
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)
    setCurrentView("browse")
  }

  const handleEditArticle = (articleData: Omit<Article, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
    if (!currentUser || !editingArticle) return

    const updatedArticle: Article = {
      ...editingArticle,
      ...articleData,
      updatedAt: new Date().toISOString(),
    }

    const updatedArticles = articles.map((a) => (a.id === editingArticle.id ? updatedArticle : a))
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)
    setEditingArticle(null)
    setCurrentView("browse")
  }

  const handleDeleteArticle = (articleId: string) => {
    const updatedArticles = articles.filter((a) => a.id !== articleId)
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)
    setSelectedArticle(null)
  }

  // Category management
  const handleAddCategory = (categoryData: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
    }

    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
  }

  const handleEditCategory = (categoryId: string, categoryData: Omit<Category, "id">) => {
    const updatedCategories = categories.map((c) => (c.id === categoryId ? { ...c, ...categoryData } : c))
    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
  }

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter((c) => c.id !== categoryId)
    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
  }

  // User management
  const handleAddUser = (userData: Omit<User, "id" | "createdAt" | "lastLogin">) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastLogin: null,
    }

    const updatedUsers = [...users, newUser]
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
  }

  const handleEditUser = (userId: string, userData: Omit<User, "id" | "createdAt" | "lastLogin">) => {
    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, ...userData } : u))
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
  }

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId)
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
  }

  // View handlers
  const handleViewChange = (view: "browse" | "add" | "edit" | "admin") => {
    if ((view === "add" || view === "admin") && !currentUser) {
      setShowLoginModal(true)
      return
    }
    setCurrentView(view)
    setSelectedArticle(null)
    setEditingArticle(null)
  }

  const handleEditArticleClick = (article: Article) => {
    setEditingArticle(article)
    setCurrentView("edit")
  }

  // Filter articles by category
  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.categoryId === selectedCategory)
    : articles

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
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

      <div className="container mx-auto px-4 py-8">
        {currentView === "browse" && (
          <>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <CategoryTree
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={setSelectedCategory}
                />
              </div>

              {/* Content Area */}
              <div className="lg:col-span-3">
                {searchQuery ? (
                  <SearchResults
                    results={searchResults}
                    searchQuery={searchQuery}
                    onArticleSelect={setSelectedArticle}
                  />
                ) : selectedArticle ? (
                  <ArticleViewer
                    article={selectedArticle}
                    onBack={() => setSelectedArticle(null)}
                    onEdit={currentUser ? handleEditArticleClick : undefined}
                    onDelete={currentUser ? handleDeleteArticle : undefined}
                    categories={categories}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCategory
                          ? categories.find((c) => c.id === selectedCategory)?.name || "Articles"
                          : "All Articles"}
                      </h2>
                      {selectedCategory && (
                        <Button
                          variant="outline"
                          onClick={() => setSelectedCategory(null)}
                          className="flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Clear Filter</span>
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4">
                      {filteredArticles.length > 0 ? (
                        filteredArticles.map((article) => (
                          <div
                            key={article.id}
                            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                            <p className="text-gray-600 mb-3 line-clamp-2">{article.content.substring(0, 200)}...</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>
                                {categories.find((c) => c.id === article.categoryId)?.name || "Uncategorized"}
                              </span>
                              <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                            </div>
                            {article.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-3">
                                {article.tags.map((tag, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500 text-lg">
                            {selectedCategory ? "No articles in this category." : "No articles found."}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {currentView === "add" && (
          <AddArticleForm
            categories={categories}
            onSubmit={handleAddArticle}
            onCancel={() => setCurrentView("browse")}
          />
        )}

        {currentView === "edit" && editingArticle && (
          <EditArticleForm
            article={editingArticle}
            categories={categories}
            onSubmit={handleEditArticle}
            onCancel={() => {
              setEditingArticle(null)
              setCurrentView("browse")
            }}
          />
        )}

        {currentView === "admin" && (
          <AdminDashboard
            categories={categories}
            articles={articles}
            users={users}
            onAddCategory={handleAddCategory}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
            onDeleteArticle={handleDeleteArticle}
          />
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
    </div>
  )
}
