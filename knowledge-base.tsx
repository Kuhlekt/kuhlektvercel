"use client"

import { Button } from "@/components/ui/button"

import { useState, useMemo, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { SearchResults } from "./components/search-results"
import { ArticleViewer } from "./components/article-viewer"
import { LoginModal } from "./components/login-modal"
import { AdminDashboard } from "./components/admin-dashboard"
import { initialCategories } from "./data/initial-data"
import { initialUsers } from "./data/initial-users"
import { initialAuditLog } from "./data/initial-audit-log"
import { storage } from "./utils/storage"
import type { Category, Article, User, AuditLogEntry } from "./types/knowledge-base"
import { SelectedArticles } from "./components/selected-articles"
import { EditArticleForm } from "./components/edit-article-form"
import { calculateTotalArticles } from "./utils/article-utils"

export default function KnowledgeBase() {
  // Initialize state with stored data or defaults
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      return storage.loadCategories() || initialCategories
    }
    return initialCategories
  })
  
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window !== 'undefined') {
      return storage.loadUsers() || initialUsers
    }
    return initialUsers
  })
  
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(() => {
    if (typeof window !== 'undefined') {
      return storage.loadAuditLog() || initialAuditLog
    }
    return initialAuditLog
  })

  const [currentView, setCurrentView] = useState<"home" | "search" | "admin" | "article" | "edit-article">("home")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  // Auto-save data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      storage.saveCategories(categories)
    }
  }, [categories])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      storage.saveUsers(users)
    }
  }, [users])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      storage.saveAuditLog(auditLog)
    }
  }, [auditLog])

  // Calculate total articles using memoization for performance and accuracy
  const totalArticles = useMemo(() => calculateTotalArticles(categories), [categories])

  const addAuditLogEntry = (entry: Omit<AuditLogEntry, "id" | "timestamp">) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
    }
    setAuditLog((prev) => [newEntry, ...prev])
  }

  const getCategoryName = (categoryId: string): string => {
    return categories.find((cat) => cat.id === categoryId)?.name || "Unknown Category"
  }

  const getSubcategoryName = (categoryId: string, subcategoryId?: string): string | undefined => {
    if (!subcategoryId) return undefined
    const category = categories.find((cat) => cat.id === categoryId)
    return category?.subcategories.find((sub) => sub.id === subcategoryId)?.name
  }

  const handleLogin = (username: string, password: string) => {
    setLoginLoading(true)
    setLoginError("")

    // Simulate API call delay
    setTimeout(() => {
      const user = users.find((u) => u.username === username && u.password === password)

      if (user) {
        // Update last login
        const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date() } : u))
        setUsers(updatedUsers)
        setCurrentUser({ ...user, lastLogin: new Date() })
        setShowLoginModal(false)
        setCurrentView("admin")
        setLoginError("")
      } else {
        setLoginError("Invalid username or password")
      }
      setLoginLoading(false)
    }, 1000)
  }

  const handleShowLogin = () => {
    setShowLoginModal(true)
    setLoginError("")
  }

  const handleCloseLogin = () => {
    setShowLoginModal(false)
    setLoginError("")
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("home")
    setSearchQuery("")
    setSearchResults([])
    setSelectedArticle(null)
  }

  const handleCategoryToggle = (categoryId: string) => {
    setCategories((prev) => prev.map((cat) => (cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat)))
  }

  const handleCategorySelect = (categoryId: string, selected: boolean) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(categoryId)
      } else {
        newSet.delete(categoryId)
      }
      return newSet
    })
  }

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string, selected: boolean) => {
    setSelectedSubcategories((prev) => {
      const newSet = new Set(prev)
      if (selected) {
        newSet.add(subcategoryId)
      } else {
        newSet.delete(subcategoryId)
      }
      return newSet
    })
  }

  const handleAddArticle = (articleData: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: currentUser?.username || "Unknown",
    }

    setCategories((prev) =>
      prev.map((category) => {
        if (category.id === articleData.categoryId) {
          if (articleData.subcategoryId) {
            return {
              ...category,
              subcategories: category.subcategories.map((sub) =>
                sub.id === articleData.subcategoryId ? { ...sub, articles: [...sub.articles, newArticle] } : sub,
              ),
            }
          } else {
            return {
              ...category,
              articles: [...category.articles, newArticle],
            }
          }
        }
        return category
      }),
    )

    // Add audit log entry
    addAuditLogEntry({
      action: "article_created",
      articleId: newArticle.id,
      articleTitle: newArticle.title,
      categoryName: getCategoryName(articleData.categoryId),
      subcategoryName: getSubcategoryName(articleData.categoryId, articleData.subcategoryId),
      performedBy: currentUser?.username || "Unknown",
      details: `Created new article with ${newArticle.tags.length} tags`,
    })
  }

  const handleCreateUser = (userData: Omit<User, "id" | "createdAt" | "lastLogin">) => {
    // Check if username already exists
    if (users.some((user) => user.username === userData.username)) {
      return // Could show error here
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastLogin: undefined,
    }

    setUsers((prev) => [...prev, newUser])
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleEditArticle = (article: Article) => {
    setEditingArticle(article)
    setCurrentView("edit-article")
  }

  const handleUpdateArticle = (articleId: string, updates: Partial<Article>) => {
    let updatedArticle: Article | null = null

    setCategories((prev) =>
      prev.map((category) => {
        // Update article in main category
        if (category.articles.some((article) => article.id === articleId)) {
          return {
            ...category,
            articles: category.articles.map((article) => {
              if (article.id === articleId) {
                updatedArticle = { ...article, ...updates }
                return updatedArticle
              }
              return article
            }),
          }
        }

        // Update article in subcategories
        const updatedSubcategories = category.subcategories.map((subcategory) => ({
          ...subcategory,
          articles: subcategory.articles.map((article) => {
            if (article.id === articleId) {
              updatedArticle = { ...article, ...updates }
              return updatedArticle
            }
            return article
          }),
        }))

        return {
          ...category,
          subcategories: updatedSubcategories,
        }
      }),
    )

    // Add audit log entry
    if (updatedArticle) {
      addAuditLogEntry({
        action: "article_updated",
        articleId: updatedArticle.id,
        articleTitle: updatedArticle.title,
        categoryName: getCategoryName(updatedArticle.categoryId),
        subcategoryName: getSubcategoryName(updatedArticle.categoryId, updatedArticle.subcategoryId),
        performedBy: currentUser?.username || "Unknown",
        details: `Updated article content and metadata`,
      })
    }

    setEditingArticle(null)
    setCurrentView("admin")
  }

  const handleDeleteArticle = (articleId: string) => {
    let deletedArticle: Article | null = null

    // Find the article before deleting it
    categories.forEach((category) => {
      const foundInMain = category.articles.find((article) => article.id === articleId)
      if (foundInMain) {
        deletedArticle = foundInMain
        return
      }

      category.subcategories.forEach((subcategory) => {
        const foundInSub = subcategory.articles.find((article) => article.id === articleId)
        if (foundInSub) {
          deletedArticle = foundInSub
        }
      })
    })

    setCategories((prev) =>
      prev.map((category) => ({
        ...category,
        articles: category.articles.filter((article) => article.id !== articleId),
        subcategories: category.subcategories.map((subcategory) => ({
          ...subcategory,
          articles: subcategory.articles.filter((article) => article.id !== articleId),
        })),
      })),
    )

    // Add audit log entry
    if (deletedArticle) {
      addAuditLogEntry({
        action: "article_deleted",
        articleId: deletedArticle.id,
        articleTitle: deletedArticle.title,
        categoryName: getCategoryName(deletedArticle.categoryId),
        subcategoryName: getSubcategoryName(deletedArticle.categoryId, deletedArticle.subcategoryId),
        performedBy: currentUser?.username || "Unknown",
        details: `Permanently deleted article`,
      })
    }
  }

  const handleImportData = (data: { categories: Category[], users: User[], auditLog: AuditLogEntry[] }) => {
    setCategories(data.categories)
    setUsers(data.users)
    setAuditLog(data.auditLog)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      setCurrentView("home")
      return
    }

    const results: Article[] = []
    categories.forEach((category) => {
      // Search in category articles
      category.articles.forEach((article) => {
        if (
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        ) {
          results.push(article)
        }
      })

      // Search in subcategory articles
      category.subcategories.forEach((subcategory) => {
        subcategory.articles.forEach((article) => {
          if (
            article.title.toLowerCase().includes(query.toLowerCase()) ||
            article.content.toLowerCase().includes(query.toLowerCase()) ||
            article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
          ) {
            results.push(article)
          }
        })
      })
    })

    setSearchResults(results)
    setCurrentView("search")
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    setCurrentView("article")
  }

  const handleHome = () => {
    setCurrentView("home")
    setSearchQuery("")
    setSearchResults([])
    setSelectedArticle(null)
  }

  const handleAdmin = () => {
    if (currentUser) {
      setCurrentView("admin")
    } else {
      setShowLoginModal(true)
    }
  }

  const renderContent = () => {
    switch (currentView) {
      case "home":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <CategoryTree
                  categories={categories}
                  onCategoryToggle={handleCategoryToggle}
                  onCategorySelect={handleCategorySelect}
                  onSubcategorySelect={handleSubcategorySelect}
                  onArticleSelect={handleArticleSelect}
                  selectedCategories={selectedCategories}
                  selectedSubcategories={selectedSubcategories}
                />
              </div>
            </div>
            <div className="lg:col-span-3 space-y-6">
              {/* Show selected articles if any categories are selected */}
              {selectedCategories.size > 0 || selectedSubcategories.size > 0 ? (
                <SelectedArticles
                  categories={categories}
                  selectedCategories={selectedCategories}
                  selectedSubcategories={selectedSubcategories}
                  onArticleSelect={handleArticleSelect}
                />
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-2xl font-bold mb-4">Welcome to Kuhlekt Knowledge Base</h2>
                  <p className="text-gray-600 mb-6">
                    Browse through our comprehensive knowledge base using the category tree on the left, or use the
                    search functionality to find specific articles. Select categories to view their articles.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Total Categories</h3>
                      <p className="text-2xl font-bold text-blue-600">{categories.length}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Total Articles</h3>
                      <p className="text-2xl font-bold text-green-600">{totalArticles}</p>
                    </div>
                  </div>

                  {/* Moved admin access to bottom */}
                  {!currentUser && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-800 mb-2">
                        <strong>Admin Access:</strong> Login to add articles and manage users.
                      </p>
                      <Button onClick={handleShowLogin} size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Login as Admin
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )
      case "search":
        return (
          <div className="max-w-4xl mx-auto">
            <SearchResults
              results={searchResults}
              categories={categories}
              query={searchQuery}
              onArticleSelect={handleArticleSelect}
            />
          </div>
        )
      case "admin":
        return currentUser ? (
          <AdminDashboard
            categories={categories}
            users={users}
            currentUser={currentUser}
            auditLog={auditLog}
            onAddArticle={handleAddArticle}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
            onCreateUser={handleCreateUser}
            onDeleteUser={handleDeleteUser}
            onImportData={handleImportData}
            onBack={handleHome}
          />
        ) : null
      case "article":
        return selectedArticle ? (
          <ArticleViewer article={selectedArticle} categories={categories} onBack={handleHome} />
        ) : null
      case "edit-article":
        return editingArticle ? (
          <EditArticleForm
            article={editingArticle}
            categories={categories}
            onUpdateArticle={handleUpdateArticle}
            onCancel={() => {
              setEditingArticle(null)
              setCurrentView("admin")
            }}
          />
        ) : null
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        onSearch={handleSearch}
        onHome={handleHome}
        onAdmin={handleAdmin}
        onLogin={handleShowLogin}
        onLogout={handleLogout}
        currentView={currentView}
        currentUser={currentUser}
      />
      <main className="container mx-auto px-4 py-6">{renderContent()}</main>
      {showLoginModal && (
        <LoginModal onLogin={handleLogin} onClose={handleCloseLogin} error={loginError} loading={loginLoading} />
      )}
    </div>
  )
}
