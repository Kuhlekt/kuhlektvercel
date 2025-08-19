"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { SearchResults } from "./components/search-results"
import { SelectedArticles } from "./components/selected-articles"
import type { Article, Category, User } from "./types/knowledge-base"
import { initialData } from "./data/initial-data"
import { initialUsers } from "./data/initial-users"
import { loadFromStorage, saveToStorage } from "./utils/storage"

export default function KnowledgeBase() {
  // State management
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"browse" | "add" | "edit" | "admin">("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set())

  // Load data on component mount
  useEffect(() => {
    const savedArticles = loadFromStorage<Article[]>("articles")
    const savedCategories = loadFromStorage<Category[]>("categories")
    const savedUsers = loadFromStorage<User[]>("users")

    if (savedArticles && savedArticles.length > 0) {
      setArticles(savedArticles)
    } else {
      setArticles(initialData.articles)
      saveToStorage("articles", initialData.articles)
    }

    if (savedCategories && savedCategories.length > 0) {
      setCategories(savedCategories)
    } else {
      setCategories(initialData.categories)
      saveToStorage("categories", initialData.categories)
    }

    if (savedUsers && savedUsers.length > 0) {
      setUsers(savedUsers)
    } else {
      setUsers(initialUsers)
      saveToStorage("users", initialUsers)
    }
  }, [])

  // Save data when it changes
  useEffect(() => {
    if (articles.length > 0) {
      saveToStorage("articles", articles)
    }
  }, [articles])

  useEffect(() => {
    if (categories.length > 0) {
      saveToStorage("categories", categories)
    }
  }, [categories])

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

  // Event handlers
  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date() }
      setCurrentUser(updatedUser)

      // Update users array with last login time
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      setUsers(updatedUsers)

      setShowLoginModal(false)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
    setSelectedArticle(null)
    setEditingArticle(null)
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

  const handleAddArticle = (article: Omit<Article, "id" | "createdAt" | "updatedAt" | "createdBy">) => {
    if (!currentUser) return

    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser.username,
    }

    setArticles((prev) => [...prev, newArticle])
    setCurrentView("browse")
  }

  const handleEditArticle = (updatedArticle: Article) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === updatedArticle.id ? { ...updatedArticle, updatedAt: new Date() } : article,
      ),
    )
    setEditingArticle(null)
    setCurrentView("browse")
  }

  const handleDeleteArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((article) => article.id !== articleId))
    setSelectedArticle(null)
  }

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
    setSearchQuery("")
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    setCurrentView("browse")
  }

  const handleStartEdit = (article: Article) => {
    setEditingArticle(article)
    setCurrentView("edit")
  }

  const handleAddCategory = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    }
    setCategories((prev) => [...prev, newCategory])
  }

  const handleUpdateCategory = (updatedCategory: Category) => {
    setCategories((prev) => prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat)))
  }

  const handleDeleteCategory = (categoryId: string) => {
    // Remove category and update articles that reference it
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
    setArticles((prev) =>
      prev.map((article) => ({
        ...article,
        categoryId: article.categoryId === categoryId ? null : article.categoryId,
      })),
    )
  }

  const handleAddUser = (user: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setUsers((prev) => [...prev, newUser])
  }

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
  }

  const handleDeleteUser = (userId: string) => {
    if (currentUser?.id === userId) {
      handleLogout()
    }
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleArticleSelection = (articleId: string, selected: boolean) => {
    setSelectedArticles((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(articleId)
      } else {
        newSet.delete(articleId)
      }
      return newSet
    })
  }

  const handleBulkDelete = () => {
    setArticles((prev) => prev.filter((article) => !selectedArticles.has(article.id)))
    setSelectedArticles(new Set())
    setSelectedArticle(null)
  }

  // Filter articles based on selected category
  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.categoryId === selectedCategory)
    : articles

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategoryTree
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentView === "browse" && (
              <>
                {searchQuery && searchResults.length > 0 && (
                  <SearchResults
                    results={searchResults}
                    onArticleSelect={handleArticleSelect}
                    searchQuery={searchQuery}
                  />
                )}

                {!searchQuery && selectedArticle && (
                  <ArticleViewer
                    article={selectedArticle}
                    onEdit={currentUser ? handleStartEdit : undefined}
                    onDelete={currentUser ? handleDeleteArticle : undefined}
                    currentUser={currentUser}
                  />
                )}

                {!searchQuery && !selectedArticle && (
                  <SelectedArticles
                    articles={filteredArticles}
                    selectedArticles={selectedArticles}
                    onArticleSelect={handleArticleSelect}
                    onArticleSelection={handleArticleSelection}
                    onBulkDelete={selectedArticles.size > 0 ? handleBulkDelete : undefined}
                    currentUser={currentUser}
                  />
                )}
              </>
            )}

            {currentView === "add" && currentUser && (
              <AddArticleForm
                categories={categories}
                onSubmit={handleAddArticle}
                onCancel={() => setCurrentView("browse")}
              />
            )}

            {currentView === "edit" && editingArticle && currentUser && (
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

            {currentView === "admin" && currentUser && (
              <AdminDashboard
                articles={articles}
                categories={categories}
                users={users}
                currentUser={currentUser}
                onAddCategory={handleAddCategory}
                onUpdateCategory={handleUpdateCategory}
                onDeleteCategory={handleDeleteCategory}
                onAddUser={handleAddUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
              />
            )}
          </div>
        </div>
      </div>

      {showLoginModal && <LoginModal onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />}
    </div>
  )
}
