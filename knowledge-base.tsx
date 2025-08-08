"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Users, Settings, BarChart3, Eye, X } from 'lucide-react'

import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { SearchResults } from "./components/search-results"
import { SelectedArticles } from "./components/selected-articles"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { LoginModal } from "./components/login-modal"
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
      setCategories(storedCategories)
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

  // Search function with proper debouncing
  const performSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: Article[] = []
    const searchTerm = query.toLowerCase().trim()

    categories.forEach((category) => {
      // Search in category articles
      category.articles.forEach((article) => {
        const titleMatch = article.title.toLowerCase().includes(searchTerm)
        const contentMatch = article.content.toLowerCase().includes(searchTerm)
        const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
        
        if (titleMatch || contentMatch || tagMatch) {
          results.push(article)
        }
      })

      // Search in subcategory articles
      category.subcategories.forEach((subcategory) => {
        subcategory.articles.forEach((article) => {
          const titleMatch = article.title.toLowerCase().includes(searchTerm)
          const contentMatch = article.content.toLowerCase().includes(searchTerm)
          const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          
          if (titleMatch || contentMatch || tagMatch) {
            // Avoid duplicates
            if (!results.find(r => r.id === article.id)) {
              results.push(article)
            }
          }
        })
      })
    })

    // Sort results by relevance (title matches first, then content, then tags)
    results.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchTerm)
      const bTitle = b.title.toLowerCase().includes(searchTerm)
      
      if (aTitle && !bTitle) return -1
      if (!aTitle && bTitle) return 1
      
      // If both or neither match title, sort by updated date
      return b.updatedAt.getTime() - a.updatedAt.getTime()
    })

    setSearchResults(results)
  }, [categories])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    performSearch(query)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch(searchQuery)
    }
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
      action: "article_created",
      articleId: newArticle.id,
      articleTitle: newArticle.title,
      categoryName: categories.find(c => c.id === articleData.categoryId)?.name || "Unknown",
      subcategoryName: articleData.subcategoryId ? 
        categories.find(c => c.id === articleData.categoryId)?.subcategories.find(s => s.id === articleData.subcategoryId)?.name : undefined,
      performedBy: currentUser?.username || "anonymous",
      timestamp: new Date()
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
      action: "article_updated",
      articleId: articleData.id,
      articleTitle: articleData.title,
      categoryName: categories.find(c => c.id === articleData.categoryId)?.name || "Unknown",
      subcategoryName: articleData.subcategoryId ? 
        categories.find(c => c.id === articleData.categoryId)?.subcategories.find(s => s.id === articleData.subcategoryId)?.name : undefined,
      performedBy: currentUser?.username || "anonymous",
      timestamp: new Date()
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
      action: "article_deleted",
      articleId: articleId,
      articleTitle: selectedArticle?.title || 'Unknown',
      categoryName: "Unknown",
      performedBy: currentUser?.username || "anonymous",
      timestamp: new Date()
    })

    setSelectedArticle(null)
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setShowLoginModal(false)
    
    // Update users state with the updated user (including lastLogin)
    const updatedUsers = users.map(u => u.id === user.id ? user : u)
    setUsers(updatedUsers)
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
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-10 py-3 text-lg"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={handleClearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
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
