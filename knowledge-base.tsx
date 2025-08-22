"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleList } from "./components/article-list"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { SearchResults } from "./components/search-results"
import { SelectedArticles } from "./components/selected-articles"
import type { Category, Article, User, AuditLogEntry } from "./types/knowledge-base"
import { loadFromAPI, saveToAPI } from "./utils/api-database"

export default function KnowledgeBase() {
  // State management
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([])
  const [pageVisits, setPageVisits] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data on component mount
  useEffect(() => {
    loadData()
    incrementPageVisits()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await loadFromAPI()
      setCategories(data.categories || [])
      setUsers(data.users || [])
      setAuditLog(data.auditLog || [])
      setPageVisits(data.settings?.pageVisits || 0)
    } catch (err) {
      console.error("Failed to load data:", err)
      setError("Failed to load data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const saveData = async () => {
    try {
      await saveToAPI({
        categories,
        users,
        auditLog,
        settings: { pageVisits },
      })
    } catch (err) {
      console.error("Failed to save data:", err)
      setError("Failed to save data. Please try again.")
    }
  }

  const incrementPageVisits = async () => {
    try {
      const response = await fetch("/api/data/page-visits", {
        method: "POST",
      })
      if (response.ok) {
        const data = await response.json()
        setPageVisits(data.pageVisits)
      }
    } catch (err) {
      console.error("Failed to increment page visits:", err)
    }
  }

  // Authentication
  const handleLogin = (username: string, password: string): boolean => {
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      setIsLoggedIn(true)
      setCurrentUser(user)
      addAuditLogEntry(`User ${username} logged in`, "auth")
      return true
    }
    return false
  }

  const handleLogout = () => {
    if (currentUser) {
      addAuditLogEntry(`User ${currentUser.username} logged out`, "auth")
    }
    setIsLoggedIn(false)
    setCurrentUser(null)
    setShowAdminDashboard(false)
    setShowAddForm(false)
    setEditingArticle(null)
  }

  // Audit logging
  const addAuditLogEntry = (action: string, type: "create" | "update" | "delete" | "auth" | "admin" = "admin") => {
    const entry: AuditLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      user: currentUser?.username || "Anonymous",
      action,
      type,
    }
    setAuditLog((prev) => [entry, ...prev])
  }

  // Category management
  const addCategory = (name: string, parentId?: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      parentId,
      articles: [],
    }
    setCategories((prev) => [...prev, newCategory])
    addAuditLogEntry(`Created category: ${name}`, "create")
    saveData()
  }

  const updateCategory = (id: string, name: string) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, name } : cat)))
    addAuditLogEntry(`Updated category: ${name}`, "update")
    saveData()
  }

  const deleteCategory = (id: string) => {
    const category = categories.find((cat) => cat.id === id)
    if (category) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id && cat.parentId !== id))
      addAuditLogEntry(`Deleted category: ${category.name}`, "delete")
      saveData()
    }
  }

  // Article management
  const addArticle = (title: string, content: string, categoryId: string, tags: string[] = []) => {
    const newArticle: Article = {
      id: Date.now().toString(),
      title,
      content,
      categoryId,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: currentUser?.username || "Anonymous",
    }

    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, articles: [...cat.articles, newArticle] } : cat)),
    )

    addAuditLogEntry(`Created article: ${title}`, "create")
    setShowAddForm(false)
    saveData()
  }

  const updateArticle = (id: string, title: string, content: string, tags: string[] = []) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        articles: cat.articles.map((article) =>
          article.id === id
            ? {
                ...article,
                title,
                content,
                tags,
                updatedAt: new Date().toISOString(),
              }
            : article,
        ),
      })),
    )

    addAuditLogEntry(`Updated article: ${title}`, "update")
    setEditingArticle(null)
    saveData()
  }

  const deleteArticle = (id: string) => {
    let articleTitle = ""
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        articles: cat.articles.filter((article) => {
          if (article.id === id) {
            articleTitle = article.title
            return false
          }
          return true
        }),
      })),
    )

    if (articleTitle) {
      addAuditLogEntry(`Deleted article: ${articleTitle}`, "delete")
    }

    if (selectedArticle?.id === id) {
      setSelectedArticle(null)
    }
    saveData()
  }

  // Search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: Article[] = []
    categories.forEach((category) => {
      category.articles.forEach((article) => {
        if (
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        ) {
          results.push(article)
        }
      })
    })
    setSearchResults(results)
  }

  // Article selection
  const toggleArticleSelection = (article: Article) => {
    setSelectedArticles((prev) => {
      const isSelected = prev.some((a) => a.id === article.id)
      if (isSelected) {
        return prev.filter((a) => a.id !== article.id)
      } else {
        return [...prev, article]
      }
    })
  }

  const clearSelectedArticles = () => {
    setSelectedArticles([])
  }

  // User management
  const addUser = (username: string, password: string, role: "admin" | "editor" | "viewer") => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      role,
      createdAt: new Date().toISOString(),
    }
    setUsers((prev) => [...prev, newUser])
    addAuditLogEntry(`Created user: ${username} (${role})`, "create")
    saveData()
  }

  const updateUser = (id: string, username: string, password: string, role: "admin" | "editor" | "viewer") => {
    setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, username, password, role } : user)))
    addAuditLogEntry(`Updated user: ${username}`, "update")
    saveData()
  }

  const deleteUser = (id: string) => {
    const user = users.find((u) => u.id === id)
    if (user) {
      setUsers((prev) => prev.filter((u) => u.id !== id))
      addAuditLogEntry(`Deleted user: ${user.username}`, "delete")
      saveData()
    }
  }

  // Data management
  const exportData = () => {
    const data = {
      categories,
      users,
      auditLog,
      settings: { pageVisits },
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `knowledge-base-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addAuditLogEntry("Exported knowledge base data", "admin")
  }

  const importData = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.categories) setCategories(data.categories)
        if (data.users) setUsers(data.users)
        if (data.auditLog) setAuditLog(data.auditLog)
        if (data.settings?.pageVisits) setPageVisits(data.settings.pageVisits)

        addAuditLogEntry("Imported knowledge base data", "admin")
        saveData()
      } catch (err) {
        console.error("Failed to import data:", err)
        setError("Failed to import data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  const clearAllData = () => {
    setCategories([])
    setUsers([])
    setAuditLog([])
    setSelectedCategory(null)
    setSelectedArticle(null)
    setSearchResults([])
    setSelectedArticles([])
    addAuditLogEntry("Cleared all knowledge base data", "admin")
    saveData()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading knowledge base...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with larger logo */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-6">
            <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt Logo" className="h-24 w-auto" />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-4 mt-4">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        </div>
      )}

      <Navigation
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onShowAdmin={() => setShowAdminDashboard(true)}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        pageVisits={pageVisits}
        onRefresh={loadData}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategoryTree
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onAddCategory={isLoggedIn ? addCategory : undefined}
              onUpdateCategory={isLoggedIn ? updateCategory : undefined}
              onDeleteCategory={isLoggedIn ? deleteCategory : undefined}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {searchResults.length > 0 ? (
              <SearchResults
                results={searchResults}
                searchQuery={searchQuery}
                onSelectArticle={setSelectedArticle}
                onToggleSelection={toggleArticleSelection}
                selectedArticles={selectedArticles}
                onClearSearch={() => {
                  setSearchQuery("")
                  setSearchResults([])
                }}
              />
            ) : selectedArticles.length > 0 ? (
              <SelectedArticles
                articles={selectedArticles}
                onSelectArticle={setSelectedArticle}
                onRemoveFromSelection={toggleArticleSelection}
                onClearSelection={clearSelectedArticles}
              />
            ) : showAdminDashboard ? (
              <AdminDashboard
                categories={categories}
                users={users}
                auditLog={auditLog}
                pageVisits={pageVisits}
                onAddUser={addUser}
                onUpdateUser={updateUser}
                onDeleteUser={deleteUser}
                onExportData={exportData}
                onImportData={importData}
                onClearData={clearAllData}
                onClose={() => setShowAdminDashboard(false)}
              />
            ) : showAddForm ? (
              <AddArticleForm
                categories={categories}
                onAddArticle={addArticle}
                onCancel={() => setShowAddForm(false)}
              />
            ) : editingArticle ? (
              <EditArticleForm
                article={editingArticle}
                onUpdateArticle={updateArticle}
                onCancel={() => setEditingArticle(null)}
              />
            ) : selectedArticle ? (
              <ArticleViewer
                article={selectedArticle}
                onEdit={isLoggedIn ? setEditingArticle : undefined}
                onDelete={isLoggedIn ? deleteArticle : undefined}
                onBack={() => setSelectedArticle(null)}
              />
            ) : selectedCategory ? (
              <ArticleList
                category={categories.find((cat) => cat.id === selectedCategory)}
                onSelectArticle={setSelectedArticle}
                onAddArticle={isLoggedIn ? () => setShowAddForm(true) : undefined}
                onToggleSelection={toggleArticleSelection}
                selectedArticles={selectedArticles}
              />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Kuhlekt Knowledge Base</h2>
                <p className="text-gray-600 mb-8">
                  Select a category from the sidebar to browse articles, or use the search function to find specific
                  content.
                </p>
                {isLoggedIn && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add New Article
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}
