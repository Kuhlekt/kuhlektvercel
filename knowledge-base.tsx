"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { SelectedArticles } from "./components/selected-articles"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { SearchResults } from "./components/search-results"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import type { Article, Category, User } from "./types/knowledge-base"
import { initialCategories } from "./data/initial-data"
import { initialUsers } from "./data/initial-users"
import { loadFromStorage, saveToStorage } from "./utils/storage"

export default function KnowledgeBase() {
  // State management
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [currentView, setCurrentView] = useState<"browse" | "add" | "edit" | "admin">("browse")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  // Load data on component mount
  useEffect(() => {
    const loadedCategories = loadFromStorage<Category[]>("categories", initialCategories)
    const loadedArticles = loadFromStorage<Article[]>("articles", [])
    const loadedUsers = loadFromStorage<User[]>("users", initialUsers)

    setCategories(loadedCategories)
    setArticles(loadedArticles)
    setUsers(loadedUsers)
  }, [])

  // Save data when it changes
  useEffect(() => {
    if (categories.length > 0) {
      saveToStorage("categories", categories)
    }
  }, [categories])

  useEffect(() => {
    if (articles.length >= 0) {
      saveToStorage("articles", articles)
    }
  }, [articles])

  useEffect(() => {
    if (users.length > 0) {
      saveToStorage("users", users)
    }
  }, [users])

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

  // Get articles for selected category
  const getArticlesForCategory = (categoryId: string): Article[] => {
    return articles.filter((article) => article.categoryId === categoryId)
  }

  // Handle login
  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      setCurrentUser(user)
      setShowLoginModal(false)
      // Update last login
      const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date() } : u))
      setUsers(updatedUsers)
      return true
    }
    return false
  }

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
  }

  // Handle article operations
  const handleAddArticle = (article: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setArticles((prev) => [...prev, newArticle])
    setCurrentView("browse")
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setCurrentView("edit")
  }

  const handleUpdateArticle = (updatedArticle: Article) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === updatedArticle.id ? { ...updatedArticle, updatedAt: new Date() } : a)),
    )
    setEditingArticle(null)
    setCurrentView("browse")
  }

  const handleDeleteArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId))
    if (selectedArticle?.id === articleId) {
      setSelectedArticle(null)
    }
  }

  // Handle category operations
  const handleAddCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c)))
  }

  const handleDeleteCategory = (categoryId: string) => {
    // Delete category and all its articles
    setCategories((prev) => prev.filter((c) => c.id !== categoryId))
    setArticles((prev) => prev.filter((a) => a.categoryId !== categoryId))
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    }
  }

  // Handle user operations
  const handleAddUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setUsers((prev) => [...prev, newUser])
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  const handleViewChange = (view: "browse" | "add" | "edit" | "admin") => {
    if ((view === "add" || view === "admin") && !currentUser) {
      setShowLoginModal(true)
      return
    }
    setCurrentView(view)
    if (view === "browse") {
      setEditingArticle(null)
    }
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
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Results */}
            {searchQuery.trim() && (
              <SearchResults results={searchResults} onSelectArticle={setSelectedArticle} searchQuery={searchQuery} />
            )}

            {/* Main Content */}
            {!searchQuery.trim() && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Category Tree */}
                <div className="lg:col-span-1">
                  <CategoryTree
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </div>

                {/* Articles List */}
                <div className="lg:col-span-1">
                  {selectedCategory && (
                    <SelectedArticles
                      articles={getArticlesForCategory(selectedCategory)}
                      selectedArticle={selectedArticle}
                      onSelectArticle={setSelectedArticle}
                      onEditArticle={currentUser ? handleEditArticle : undefined}
                      onDeleteArticle={currentUser ? handleDeleteArticle : undefined}
                    />
                  )}
                </div>

                {/* Article Viewer */}
                <div className="lg:col-span-1">
                  {selectedArticle && (
                    <ArticleViewer
                      article={selectedArticle}
                      onEdit={currentUser ? () => handleEditArticle(selectedArticle) : undefined}
                      onDelete={currentUser ? () => handleDeleteArticle(selectedArticle.id) : undefined}
                    />
                  )}
                </div>
              </div>
            )}
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
          <AddArticleForm
            categories={categories}
            onSubmit={handleUpdateArticle}
            onCancel={() => setCurrentView("browse")}
            initialArticle={editingArticle}
            isEditing={true}
          />
        )}

        {currentView === "admin" && (
          <AdminDashboard
            categories={categories}
            articles={articles}
            users={users}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddUser={handleAddUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
          />
        )}
      </div>

      {/* Login Modal */}
      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
    </div>
  )
}
