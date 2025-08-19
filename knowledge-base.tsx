"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleList } from "./components/article-list"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import type { Category, Article, User, AuditLogEntry } from "./types/knowledge-base"
import { storage } from "./utils/storage"
import { initialCategories } from "./data/initial-data"
import { initialUsers } from "./data/initial-users"
import { initialAuditLog } from "./data/initial-audit-log"

export default function KnowledgeBase() {
  // State management
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [currentView, setCurrentView] = useState<"browse" | "add" | "admin">("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading data...")

        // Load categories
        let loadedCategories = storage.getCategories()
        if (!loadedCategories || loadedCategories.length === 0) {
          console.log("No categories found, using initial data")
          loadedCategories = initialCategories
          storage.saveCategories(loadedCategories)
        }
        console.log("Loaded categories:", loadedCategories)
        setCategories(loadedCategories)

        // Load users
        let loadedUsers = storage.getUsers()
        if (!loadedUsers || loadedUsers.length === 0) {
          console.log("No users found, using initial data")
          loadedUsers = initialUsers
          storage.saveUsers(loadedUsers)
        }
        console.log("Loaded users:", loadedUsers)
        setUsers(loadedUsers)

        // Load audit log
        let loadedAuditLog = storage.getAuditLog()
        if (!loadedAuditLog || loadedAuditLog.length === 0) {
          console.log("No audit log found, using initial data")
          loadedAuditLog = initialAuditLog
          storage.saveAuditLog(loadedAuditLog)
        }
        console.log("Loaded audit log:", loadedAuditLog)
        setAuditLog(loadedAuditLog)

        console.log("Data loaded successfully")
      } catch (error) {
        console.error("Error loading data:", error)
        // Fallback to initial data
        setCategories(initialCategories)
        setUsers(initialUsers)
        setAuditLog(initialAuditLog)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Handle login
  const handleLogin = (username: string, password: string): boolean => {
    console.log("Attempting login with:", username, password)
    console.log("Available users:", users)

    const user = users.find((u) => u.username === username && u.password === password)
    console.log("Found user:", user)

    if (user) {
      const updatedUser = { ...user, lastLogin: new Date() }
      setCurrentUser(updatedUser)

      // Update users array with last login time
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      setUsers(updatedUsers)
      storage.saveUsers(updatedUsers)

      console.log("Login successful, user set:", updatedUser)
      setShowLoginModal(false)
      return true
    }

    console.log("Login failed - no matching user found")
    return false
  }

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
    setSelectedArticle(null)
    setEditingArticle(null)
  }

  // Get all articles from categories
  const getAllArticles = (): Article[] => {
    const allArticles: Article[] = []

    categories.forEach((category) => {
      // Add category articles
      allArticles.push(...category.articles)

      // Add subcategory articles
      category.subcategories.forEach((subcategory) => {
        allArticles.push(...subcategory.articles)
      })
    })

    return allArticles
  }

  // Get filtered articles based on selected category
  const getFilteredArticles = (): Article[] => {
    if (!selectedCategory) {
      return getAllArticles()
    }

    const allArticles: Article[] = []

    categories.forEach((category) => {
      if (category.id === selectedCategory) {
        // Add all articles from this category
        allArticles.push(...category.articles)
        category.subcategories.forEach((subcategory) => {
          allArticles.push(...subcategory.articles)
        })
      } else {
        // Check if selected category is a subcategory
        category.subcategories.forEach((subcategory) => {
          if (subcategory.id === selectedCategory) {
            allArticles.push(...subcategory.articles)
          }
        })
      }
    })

    return allArticles
  }

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const allArticles = getAllArticles()
    const results = allArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
    )

    setSearchResults(results)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId)
    setSelectedArticle(null)
    clearSearch()
  }

  // Handle article selection
  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
  }

  // Handle back to articles
  const handleBackToArticles = () => {
    setSelectedArticle(null)
  }

  // Handle add article
  const handleAddArticle = (articleData: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedCategories = categories.map((category) => {
      if (category.id === articleData.categoryId) {
        if (articleData.subcategoryId) {
          // Add to subcategory
          return {
            ...category,
            subcategories: category.subcategories.map((subcategory) =>
              subcategory.id === articleData.subcategoryId
                ? { ...subcategory, articles: [...subcategory.articles, newArticle] }
                : subcategory,
            ),
          }
        } else {
          // Add to main category
          return {
            ...category,
            articles: [...category.articles, newArticle],
          }
        }
      }
      return category
    })

    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)

    // Add audit log entry
    const newAuditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "article_created",
      entityType: "article",
      entityId: newArticle.id,
      details: `Created article: ${newArticle.title}`,
      userId: currentUser?.id || "unknown",
      timestamp: new Date(),
    }

    const updatedAuditLog = [newAuditEntry, ...auditLog]
    setAuditLog(updatedAuditLog)
    storage.saveAuditLog(updatedAuditLog)

    setCurrentView("browse")
  }

  // Handle edit article
  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    // For now, just log - would implement edit form
    console.log("Edit article:", article)
  }

  // Handle delete article
  const handleDeleteArticle = (articleId: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      const updatedCategories = categories.map((category) => ({
        ...category,
        articles: category.articles.filter((a) => a.id !== articleId),
        subcategories: category.subcategories.map((sub) => ({
          ...sub,
          articles: sub.articles.filter((a) => a.id !== articleId),
        })),
      }))

      setCategories(updatedCategories)
      storage.saveCategories(updatedCategories)

      // Add audit log entry
      const newAuditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "article_deleted",
        entityType: "article",
        entityId: articleId,
        details: `Deleted article`,
        userId: currentUser?.id || "unknown",
        timestamp: new Date(),
      }

      const updatedAuditLog = [newAuditEntry, ...auditLog]
      setAuditLog(updatedAuditLog)
      storage.saveAuditLog(updatedAuditLog)

      setSelectedArticle(null)
    }
  }

  // Get current articles to display
  const getCurrentArticles = () => {
    if (searchQuery && searchResults.length >= 0) {
      return searchResults
    }
    return getFilteredArticles()
  }

  // Get current title
  const getCurrentTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`
    }

    if (selectedCategory) {
      // Find category name
      for (const category of categories) {
        if (category.id === selectedCategory) {
          return category.name
        }
        for (const subcategory of category.subcategories) {
          if (subcategory.id === selectedCategory) {
            return `${category.name} > ${subcategory.name}`
          }
        }
      }
    }

    return "All Articles"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading knowledge base...</p>
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
        onViewChange={setCurrentView}
        currentView={currentView}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentView === "browse" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <img
                src="/images/kuhlekt-logo.jpg"
                alt="Kuhlekt Logo"
                className="h-20 w-20 mx-auto mb-4 object-contain"
              />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
              <p className="text-gray-600">Find answers, guides, and documentation</p>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
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
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {searchQuery && (
                <div className="mt-2 text-center">
                  <Button onClick={handleSearch} className="mx-auto">
                    Search
                  </Button>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar - Categories */}
              {!selectedArticle && (
                <div className="lg:col-span-1">
                  <CategoryTree
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                  />
                </div>
              )}

              {/* Content Area */}
              <div className={selectedArticle ? "lg:col-span-4" : "lg:col-span-3"}>
                {selectedArticle ? (
                  <ArticleViewer
                    article={selectedArticle}
                    categories={categories}
                    currentUser={currentUser}
                    onBack={handleBackToArticles}
                    onEdit={currentUser ? handleEditArticle : undefined}
                    onDelete={currentUser ? handleDeleteArticle : undefined}
                  />
                ) : (
                  <ArticleList
                    articles={getCurrentArticles()}
                    categories={categories}
                    onArticleSelect={handleArticleSelect}
                    title={getCurrentTitle()}
                  />
                )}
              </div>
            </div>
          </>
        )}

        {currentView === "add" && currentUser && (
          <AddArticleForm
            categories={categories}
            onSubmit={handleAddArticle}
            onCancel={() => setCurrentView("browse")}
          />
        )}

        {currentView === "admin" && currentUser && (
          <AdminDashboard
            categories={categories}
            users={users}
            auditLog={auditLog}
            onCategoriesUpdate={setCategories}
            onUsersUpdate={setUsers}
            onAuditLogUpdate={setAuditLog}
          />
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}
