"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Settings, Eye } from 'lucide-react'
import { useState, useEffect } from "react"
import { CategoryTree } from "./components/category-tree"
import { SearchResults } from "./components/search-results"
import { SelectedArticles } from "./components/selected-articles"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
import { Navigation } from "./components/navigation"
import { storage } from "./utils/storage"
import { initialCategories } from "./data/initial-data"
import { initialUsers } from "./data/initial-users"
import { initialAuditLog } from "./data/initial-audit-log"
import type { Category, Article, User, AuditLogEntry } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [pageVisits, setPageVisits] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set())
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [currentView, setCurrentView] = useState<"browse" | "add" | "edit" | "admin">("browse")
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Initialize data and increment page visits
  useEffect(() => {
    // Load existing data or initialize with defaults
    const storedCategories = storage.getCategories()
    const storedUsers = storage.getUsers()
    const storedAuditLog = storage.getAuditLog()

    if (storedCategories.length === 0) {
      // First time setup - initialize with default data
      const categoriesWithDates = initialCategories.map(category => ({
        ...category,
        articles: category.articles.map(article => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt)
        })),
        subcategories: category.subcategories.map(subcategory => ({
          ...subcategory,
          articles: subcategory.articles.map(article => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt)
          }))
        }))
      }))
      
      setCategories(categoriesWithDates)
      storage.saveCategories(categoriesWithDates)
    } else {
      // Parse stored dates
      const categoriesWithDates = storedCategories.map(category => ({
        ...category,
        articles: category.articles.map(article => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt)
        })),
        subcategories: category.subcategories.map(subcategory => ({
          ...subcategory,
          articles: subcategory.articles.map(article => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt)
          }))
        }))
      }))
      setCategories(categoriesWithDates)
    }

    if (storedUsers.length === 0) {
      setUsers(initialUsers)
      storage.saveUsers(initialUsers)
    } else {
      setUsers(storedUsers)
    }

    if (storedAuditLog.length === 0) {
      setAuditLog(initialAuditLog)
      storage.saveAuditLog(initialAuditLog)
    } else {
      setAuditLog(storedAuditLog)
    }

    // Increment page visits
    const newVisitCount = storage.incrementPageVisits()
    setPageVisits(newVisitCount)
  }, [])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: Article[] = []
    const searchTerm = query.toLowerCase()

    categories.forEach((category) => {
      // Search in category articles
      category.articles.forEach((article) => {
        if (
          article.title.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        ) {
          results.push(article)
        }
      })

      // Search in subcategory articles
      category.subcategories.forEach((subcategory) => {
        subcategory.articles.forEach((article) => {
          if (
            article.title.toLowerCase().includes(searchTerm) ||
            article.content.toLowerCase().includes(searchTerm) ||
            article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          ) {
            results.push(article)
          }
        })
      })
    })

    setSearchResults(results)
  }

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId)
    } else {
      newSelected.add(categoryId)
    }
    setSelectedCategories(newSelected)
  }

  const handleSubcategoryToggle = (subcategoryId: string) => {
    const newSelected = new Set(selectedSubcategories)
    if (newSelected.has(subcategoryId)) {
      newSelected.delete(subcategoryId)
    } else {
      newSelected.add(subcategoryId)
    }
    setSelectedSubcategories(newSelected)
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    setSearchQuery("")
    setSearchResults([])
  }

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
                : subcategory
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
    storage.addAuditEntry({
      action: "create",
      entityType: "article",
      entityId: newArticle.id,
      details: `Created article: ${newArticle.title}`,
      userId: currentUser?.id || "anonymous"
    })

    setCurrentView("browse")
  }

  const handleEditArticle = (articleData: Omit<Article, "createdAt">) => {
    const updatedCategories = categories.map((category) => {
      // Remove from current location
      const updatedCategory = {
        ...category,
        articles: category.articles.filter((a) => a.id !== articleData.id),
        subcategories: category.subcategories.map((sub) => ({
          ...sub,
          articles: sub.articles.filter((a) => a.id !== articleData.id),
        })),
      }

      // Add to new location if this is the target category
      if (category.id === articleData.categoryId) {
        if (articleData.subcategoryId) {
          return {
            ...updatedCategory,
            subcategories: updatedCategory.subcategories.map((subcategory) =>
              subcategory.id === articleData.subcategoryId
                ? { ...subcategory, articles: [...subcategory.articles, { ...articleData, createdAt: editingArticle!.createdAt }] }
                : subcategory
            ),
          }
        } else {
          return {
            ...updatedCategory,
            articles: [...updatedCategory.articles, { ...articleData, createdAt: editingArticle!.createdAt }],
          }
        }
      }

      return updatedCategory
    })

    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
    
    // Add audit log entry
    storage.addAuditEntry({
      action: "update",
      entityType: "article",
      entityId: articleData.id,
      details: `Updated article: ${articleData.title}`,
      userId: currentUser?.id || "anonymous"
    })

    setCurrentView("browse")
    setEditingArticle(null)
    setSelectedArticle({ ...articleData, createdAt: editingArticle!.createdAt })
  }

  const handleDeleteArticle = (articleId: string) => {
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
    storage.addAuditEntry({
      action: "delete",
      entityType: "article",
      entityId: articleId,
      details: `Deleted article: ${selectedArticle?.title || 'Unknown'}`,
      userId: currentUser?.id || "anonymous"
    })

    setSelectedArticle(null)
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setShowLoginModal(false)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
  }

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = category.articles.length
      const subcategoryArticles = category.subcategories.reduce(
        (subTotal, sub) => subTotal + sub.articles.length,
        0
      )
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentUser={currentUser}
        onLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        onViewChange={setCurrentView}
        currentView={currentView}
      />

      <div className="container mx-auto px-4 py-8">
        {currentView === "browse" && (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <img
                src="/images/kuhlekt-logo.jpg"
                alt="Kuhlekt Logo"
                className="mx-auto mb-4 h-16 w-auto"
              />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Kuhlekt Knowledge Base</h1>
              <p className="text-xl text-gray-600 mb-4">
                Your comprehensive resource for technical documentation and guides
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <span>{getTotalArticles()} articles</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{categories.length} categories</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{pageVisits} visits</span>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search articles, categories, or tags..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 text-lg"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Sidebar - Categories */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Categories</h2>
                    {selectedCategories.size > 0 || selectedSubcategories.size > 0 ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCategories(new Set())
                          setSelectedSubcategories(new Set())
                        }}
                      >
                        Clear
                      </Button>
                    ) : null}
                  </div>
                  <CategoryTree
                    categories={categories}
                    selectedCategories={selectedCategories}
                    selectedSubcategories={selectedSubcategories}
                    onCategoryToggle={handleCategoryToggle}
                    onSubcategoryToggle={handleSubcategoryToggle}
                  />
                </div>
              </div>

              {/* Right Content */}
              <div className="lg:col-span-2">
                {selectedArticle ? (
                  <ArticleViewer
                    article={selectedArticle}
                    categories={categories}
                    onBack={() => setSelectedArticle(null)}
                    onEdit={
                      currentUser?.role === "admin"
                        ? (article) => {
                            setEditingArticle(article)
                            setCurrentView("edit")
                          }
                        : undefined
                    }
                    onDelete={
                      currentUser?.role === "admin" ? handleDeleteArticle : undefined
                    }
                  />
                ) : searchResults.length > 0 ? (
                  <SearchResults
                    results={searchResults}
                    categories={categories}
                    query={searchQuery}
                    onArticleSelect={handleArticleSelect}
                  />
                ) : (
                  <SelectedArticles
                    categories={categories}
                    selectedCategories={selectedCategories}
                    selectedSubcategories={selectedSubcategories}
                    onArticleSelect={handleArticleSelect}
                  />
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
              setCurrentView("browse")
              setEditingArticle(null)
            }}
          />
        )}

        {currentView === "admin" && currentUser?.role === "admin" && (
          <AdminDashboard
            categories={categories}
            users={users}
            auditLog={auditLog}
            onCategoriesUpdate={(newCategories) => {
              setCategories(newCategories)
              setAuditLog(storage.getAuditLog())
            }}
            onUsersUpdate={(newUsers) => {
              setUsers(newUsers)
              setAuditLog(storage.getAuditLog())
            }}
            onAuditLogUpdate={setAuditLog}
          />
        )}
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        users={users}
        onLogin={handleLogin}
      />
    </div>
  )
}
