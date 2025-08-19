"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, X, Home } from "lucide-react"

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

type NavigationContext = {
  type: "all" | "search" | "filtered"
  searchQuery?: string
  selectedCategories?: Set<string>
  selectedSubcategories?: Set<string>
}

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
  const [navigationContext, setNavigationContext] = useState<NavigationContext>({ type: "all" })
  const [currentView, setCurrentView] = useState<"browse" | "add" | "edit" | "admin">("browse")
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize data - NO AUTO-LOGIN
  useEffect(() => {
    const initializeData = async () => {
      try {
        console.log("Starting data initialization...")

        // Load existing data or initialize with defaults
        let storedCategories: Category[] = []
        let storedUsers: User[] = []
        let storedAuditLog: AuditLogEntry[] = []

        try {
          storedCategories = storage.getCategories()
          console.log("Loaded categories:", storedCategories)
        } catch (error) {
          console.error("Error loading categories:", error)
          storedCategories = []
        }

        try {
          storedUsers = storage.getUsers()
          console.log("Loaded users:", storedUsers)
        } catch (error) {
          console.error("Error loading users:", error)
          storedUsers = []
        }

        try {
          storedAuditLog = storage.getAuditLog()
          console.log("Loaded audit log:", storedAuditLog)
        } catch (error) {
          console.error("Error loading audit log:", error)
          storedAuditLog = []
        }

        if (!Array.isArray(storedCategories) || storedCategories.length === 0) {
          // First time setup - initialize with default data
          console.log("Initializing with default categories...")
          const categoriesWithDates = initialCategories.map((category) => ({
            ...category,
            articles: (category.articles || []).map((article) => ({
              ...article,
              createdAt: new Date(article.createdAt),
              updatedAt: new Date(article.updatedAt),
              editCount: 0,
            })),
            subcategories: (category.subcategories || []).map((subcategory) => ({
              ...subcategory,
              articles: (subcategory.articles || []).map((article) => ({
                ...article,
                createdAt: new Date(article.createdAt),
                updatedAt: new Date(article.updatedAt),
                editCount: 0,
              })),
            })),
          }))

          setCategories(categoriesWithDates)
          storage.saveCategories(categoriesWithDates)
        } else {
          setCategories(storedCategories)
        }

        if (!Array.isArray(storedUsers) || storedUsers.length === 0) {
          console.log("Initializing with default users...")
          setUsers(initialUsers)
          storage.saveUsers(initialUsers)
        } else {
          setUsers(storedUsers)
        }

        if (!Array.isArray(storedAuditLog) || storedAuditLog.length === 0) {
          console.log("Initializing with default audit log...")
          setAuditLog(initialAuditLog)
          storage.saveAuditLog(initialAuditLog)
        } else {
          setAuditLog(storedAuditLog)
        }

        // NO AUTO-LOGIN - Users must authenticate manually
        console.log("Data initialization completed - login required for admin features")

        // Increment page visits
        const newVisitCount = storage.incrementPageVisits()
        setPageVisits(newVisitCount)

        console.log("Data initialization completed successfully")
      } catch (error) {
        console.error("Error during initialization:", error)
        setError("Failed to load application data. Please refresh the page.")

        // Set fallback empty data
        setCategories([])
        setUsers([])
        setAuditLog([])
        setPageVisits(0)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  // Fixed search function
  const handleSearch = (query: string) => {
    console.log("Search triggered with query:", query)
    setSearchQuery(query)

    if (!query.trim()) {
      console.log("Empty query, clearing results")
      setSearchResults([])
      setNavigationContext({ type: "all" })
      return
    }

    const results: Article[] = []
    const searchTerm = query.toLowerCase()
    console.log("Searching for:", searchTerm)

    categories.forEach((category) => {
      console.log(`Searching in category: ${category.name}`)

      // Search in category articles
      if (Array.isArray(category.articles)) {
        category.articles.forEach((article) => {
          const titleMatch = article.title.toLowerCase().includes(searchTerm)
          const contentMatch = article.content.toLowerCase().includes(searchTerm)
          const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

          if (titleMatch || contentMatch || tagMatch) {
            console.log(`Found match in category article: ${article.title}`)
            results.push(article)
          }
        })
      }

      // Search in subcategory articles
      if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach((subcategory) => {
          console.log(`Searching in subcategory: ${subcategory.name}`)
          if (Array.isArray(subcategory.articles)) {
            subcategory.articles.forEach((article) => {
              const titleMatch = article.title.toLowerCase().includes(searchTerm)
              const contentMatch = article.content.toLowerCase().includes(searchTerm)
              const tagMatch = article.tags.some((tag) => tag.toLowerCase().includes(searchTerm))

              if (titleMatch || contentMatch || tagMatch) {
                console.log(`Found match in subcategory article: ${article.title}`)
                results.push(article)
              }
            })
          }
        })
      }
    })

    console.log("Search results:", results)
    setSearchResults(results)
    setNavigationContext({ type: "search", searchQuery: query })
  }

  const handleClearSearch = () => {
    console.log("Clearing search")
    setSearchQuery("")
    setSearchResults([])
    setNavigationContext({ type: "all" })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery)
    }
  }

  // Fixed category toggle function
  const handleCategoryToggle = (categoryId: string) => {
    console.log("Category toggle:", categoryId)
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId)
      console.log("Removed category:", categoryId)
    } else {
      newSelected.add(categoryId)
      console.log("Added category:", categoryId)
    }
    setSelectedCategories(newSelected)
    console.log("Selected categories:", Array.from(newSelected))

    // Update navigation context
    if (newSelected.size > 0 || selectedSubcategories.size > 0) {
      setNavigationContext({
        type: "filtered",
        selectedCategories: newSelected,
        selectedSubcategories,
      })
    } else {
      setNavigationContext({ type: "all" })
    }

    // Clear search when category selection changes
    if (searchQuery) {
      setSearchQuery("")
      setSearchResults([])
    }
  }

  // Fixed subcategory toggle function
  const handleSubcategoryToggle = (subcategoryId: string) => {
    console.log("Subcategory toggle:", subcategoryId)
    const newSelected = new Set(selectedSubcategories)
    if (newSelected.has(subcategoryId)) {
      newSelected.delete(subcategoryId)
      console.log("Removed subcategory:", subcategoryId)
    } else {
      newSelected.add(subcategoryId)
      console.log("Added subcategory:", subcategoryId)
    }
    setSelectedSubcategories(newSelected)
    console.log("Selected subcategories:", Array.from(newSelected))

    // Update navigation context
    if (selectedCategories.size > 0 || newSelected.size > 0) {
      setNavigationContext({
        type: "filtered",
        selectedCategories,
        selectedSubcategories: newSelected,
      })
    } else {
      setNavigationContext({ type: "all" })
    }

    // Clear search when subcategory selection changes
    if (searchQuery) {
      setSearchQuery("")
      setSearchResults([])
    }
  }

  const handleArticleSelect = (article: Article) => {
    console.log("Article selected:", article.title)
    console.log("Article content:", article.content)

    // Get the most current version of the article from categories state
    const currentArticle = getCurrentArticleData(article.id) || article

    // Ensure images are available for viewing
    console.log("Setting selected article:", currentArticle)

    setSelectedArticle(currentArticle)
  }

  const handleBackToArticles = () => {
    setSelectedArticle(null)
    // Navigation context is preserved, so we return to the previous state
  }

  const handleResetFilters = () => {
    setSelectedCategories(new Set())
    setSelectedSubcategories(new Set())
    setSearchQuery("")
    setSearchResults([])
    setNavigationContext({ type: "all" })
  }

  const getNavigationTitle = () => {
    switch (navigationContext.type) {
      case "search":
        return `Search Results for "${navigationContext.searchQuery}"`
      case "filtered":
        const categoryCount = navigationContext.selectedCategories?.size || 0
        const subcategoryCount = navigationContext.selectedSubcategories?.size || 0
        return `Filtered Articles (${categoryCount + subcategoryCount} filters)`
      default:
        return "All Articles"
    }
  }

  const getBackButtonText = () => {
    switch (navigationContext.type) {
      case "search":
        return "Back to Search Results"
      case "filtered":
        return "Back to Filtered Articles"
      default:
        return "Back to All Articles"
    }
  }

  const handleAddArticle = (articleData: Omit<Article, "id" | "createdAt" | "updatedAt">) => {
    const newArticle: Article = {
      ...articleData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      editCount: 0,
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
    storage.addAuditEntry({
      action: "article_created",
      articleId: newArticle.id,
      articleTitle: newArticle.title,
      categoryName: categories.find((c) => c.id === articleData.categoryId)?.name || "Unknown",
      subcategoryName: articleData.subcategoryId
        ? categories
            .find((c) => c.id === articleData.categoryId)
            ?.subcategories.find((s) => s.id === articleData.subcategoryId)?.name
        : undefined,
      performedBy: currentUser?.username || "admin",
      timestamp: new Date(),
    })

    setCurrentView("browse")
  }

  const handleEditArticle = (articleData: Omit<Article, "createdAt">) => {
    console.log("handleEditArticle called with:", articleData)
    console.log("Current editing article:", editingArticle)

    const updatedCategories = categories.map((category) => {
      // Remove from current location first
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
        const updatedArticle = {
          ...articleData,
          createdAt: editingArticle!.createdAt,
        }

        // Ensure images are preserved in the content
        console.log("Saving article with content:", updatedArticle.content)
        console.log("Current images in memory:", (window as any).textareaImages)

        console.log("Adding updated article to category:", updatedArticle)

        if (articleData.subcategoryId) {
          return {
            ...updatedCategory,
            subcategories: updatedCategory.subcategories.map((subcategory) =>
              subcategory.id === articleData.subcategoryId
                ? {
                    ...subcategory,
                    articles: [...subcategory.articles, updatedArticle],
                  }
                : subcategory,
            ),
          }
        } else {
          return {
            ...updatedCategory,
            articles: [...updatedCategory.articles, updatedArticle],
          }
        }
      }

      return updatedCategory
    })

    console.log("Updated categories:", updatedCategories)

    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)

    // Add audit log entry
    const updatedAuditLog = [...auditLog]
    const newAuditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "article_updated",
      articleId: articleData.id,
      articleTitle: articleData.title,
      categoryName: categories.find((c) => c.id === articleData.categoryId)?.name || "Unknown",
      subcategoryName: articleData.subcategoryId
        ? categories
            .find((c) => c.id === articleData.categoryId)
            ?.subcategories.find((s) => s.id === articleData.subcategoryId)?.name
        : undefined,
      performedBy: currentUser?.username || "admin",
      timestamp: new Date(),
      details: `Edit #${articleData.editCount || 1}`,
    }

    updatedAuditLog.unshift(newAuditEntry)
    setAuditLog(updatedAuditLog)
    storage.saveAuditLog(updatedAuditLog)

    // Update the selected article to show the changes immediately
    const finalUpdatedArticle = { ...articleData, createdAt: editingArticle!.createdAt }
    setSelectedArticle(finalUpdatedArticle)

    setCurrentView("browse")
    setEditingArticle(null)

    console.log("Article update completed")
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
      articleTitle: selectedArticle?.title || "Unknown",
      categoryName: "Unknown",
      performedBy: currentUser?.username || "admin",
      timestamp: new Date(),
    })

    setSelectedArticle(null)
  }

  // Add this function after the handleDeleteArticle function
  const getCurrentArticleData = (articleId: string): Article | null => {
    for (const category of categories) {
      // Check category articles
      const categoryArticle = category.articles.find((a) => a.id === articleId)
      if (categoryArticle) return categoryArticle

      // Check subcategory articles
      for (const subcategory of category.subcategories) {
        const subcategoryArticle = subcategory.articles.find((a) => a.id === articleId)
        if (subcategoryArticle) return subcategoryArticle
      }
    }
    return null
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setShowLoginModal(false)

    // Update users state with the updated user (including lastLogin)
    const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
    setUsers(updatedUsers)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
    setSelectedArticle(null)
    setEditingArticle(null)
  }

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
      const subcategoryArticles = Array.isArray(category.subcategories)
        ? category.subcategories.reduce(
            (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
            0,
          )
        : 0
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Knowledge Base...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Refresh Page</Button>
        </div>
      </div>
    )
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
              <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt Logo" className="mx-auto mb-4 h-40 w-auto" />
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
                  onChange={(e) => {
                    const newQuery = e.target.value
                    setSearchQuery(newQuery)
                    handleSearch(newQuery) // Trigger search immediately on input change
                  }}
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
                    {(selectedCategories.size > 0 || selectedSubcategories.size > 0 || searchQuery) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="flex items-center space-x-1 bg-transparent"
                      >
                        <Home className="h-3 w-3" />
                        <span>Reset</span>
                      </Button>
                    )}
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
                    onBack={handleBackToArticles}
                    backButtonText={getBackButtonText()}
                    onEdit={(article) => {
                      setEditingArticle(article)
                      setCurrentView("edit")
                    }}
                    onDelete={handleDeleteArticle}
                  />
                ) : searchQuery.trim() ? (
                  // Show search results when there's a search query
                  <SearchResults
                    results={searchResults}
                    categories={categories}
                    query={searchQuery}
                    onArticleSelect={handleArticleSelect}
                  />
                ) : (
                  // Show filtered articles when no search query
                  <SelectedArticles
                    categories={categories}
                    selectedCategories={selectedCategories}
                    selectedSubcategories={selectedSubcategories}
                    onArticleSelect={handleArticleSelect}
                    navigationTitle={getNavigationTitle()}
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
            currentUser={currentUser}
            onSubmit={handleEditArticle}
            onCancel={() => {
              setCurrentView("browse")
              setEditingArticle(null)
            }}
          />
        )}

        {currentView === "admin" && (
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
