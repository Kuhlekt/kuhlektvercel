"use client"

import { useState, useEffect, useCallback } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleList } from "./components/article-list"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { SearchResults } from "./components/search-results"
import { SelectedArticles } from "./components/selected-articles"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { apiDatabase } from "./utils/api-database"
import type { Category, Article, User, SearchResult } from "./types/knowledge-base"

export default function KnowledgeBase() {
  // State management
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<any[]>([])
  const [pageVisits, setPageVisits] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [currentView, setCurrentView] = useState<"browse" | "add" | "edit" | "admin" | "search" | "selected">("browse")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load data from API
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("🔄 Loading data from API...")

      const data = await apiDatabase.loadData()

      setCategories(data.categories || [])
      setUsers(data.users || [])
      setAuditLog(data.auditLog || [])
      setPageVisits(data.pageVisits || 0)

      console.log("✅ Data loaded successfully:", {
        categories: data.categories?.length || 0,
        users: data.users?.length || 0,
        auditLog: data.auditLog?.length || 0,
        pageVisits: data.pageVisits || 0,
      })
    } catch (error) {
      console.error("❌ Failed to load data:", error)
      setError("Failed to load data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save data to API
  const saveData = useCallback(async () => {
    try {
      console.log("💾 Saving data to API...")
      await apiDatabase.saveData({
        categories,
        users,
        auditLog,
        pageVisits,
      })
      console.log("✅ Data saved successfully")
    } catch (error) {
      console.error("❌ Failed to save data:", error)
      setError("Failed to save data. Please try again.")
    }
  }, [categories, users, auditLog, pageVisits])

  // Initialize data on component mount
  useEffect(() => {
    loadData()
  }, [loadData])

  // Increment page visits on mount
  useEffect(() => {
    const incrementVisits = async () => {
      try {
        const newVisits = await apiDatabase.incrementPageVisits()
        setPageVisits(newVisits)
      } catch (error) {
        console.warn("Failed to increment page visits:", error)
      }
    }
    incrementVisits()
  }, [])

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      if (currentView === "search") {
        setCurrentView("browse")
      }
      return
    }

    const results: SearchResult[] = []
    const query = searchQuery.toLowerCase()

    // Search through categories and articles
    categories.forEach((category) => {
      // Search category name and description
      if (category.name.toLowerCase().includes(query) || category.description.toLowerCase().includes(query)) {
        results.push({
          type: "category",
          id: category.id,
          title: category.name,
          content: category.description,
          relevance: category.name.toLowerCase().includes(query) ? 1 : 0.8,
        })
      }

      // Search articles in category
      category.articles.forEach((article) => {
        if (
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
        ) {
          results.push({
            type: "article",
            id: article.id,
            title: article.title,
            content: article.content.substring(0, 200) + "...",
            categoryPath: category.name,
            relevance: article.title.toLowerCase().includes(query) ? 1 : 0.7,
          })
        }
      })

      // Search subcategories
      category.subcategories?.forEach((subcategory) => {
        if (subcategory.name.toLowerCase().includes(query) || subcategory.description.toLowerCase().includes(query)) {
          results.push({
            type: "category",
            id: subcategory.id,
            title: subcategory.name,
            content: subcategory.description,
            categoryPath: `${category.name} > ${subcategory.name}`,
            relevance: subcategory.name.toLowerCase().includes(query) ? 1 : 0.8,
          })
        }

        subcategory.articles.forEach((article) => {
          if (
            article.title.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query) ||
            article.tags.some((tag) => tag.toLowerCase().includes(query))
          ) {
            results.push({
              type: "article",
              id: article.id,
              title: article.title,
              content: article.content.substring(0, 200) + "...",
              categoryPath: `${category.name} > ${subcategory.name}`,
              relevance: article.title.toLowerCase().includes(query) ? 1 : 0.7,
            })
          }
        })
      })
    })

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance)
    setSearchResults(results)
    setCurrentView("search")
  }, [searchQuery, categories])

  // Event handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user)
    console.log("User logged in:", user.username)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
    console.log("User logged out")
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    setSelectedArticle(null)
    setCurrentView("browse")
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    setCurrentView("browse")

    // Increment article views
    const updatedCategories = categories.map((cat) => ({
      ...cat,
      articles: cat.articles.map((art) => (art.id === article.id ? { ...art, views: art.views + 1 } : art)),
      subcategories: cat.subcategories?.map((subcat) => ({
        ...subcat,
        articles: subcat.articles.map((art) => (art.id === article.id ? { ...art, views: art.views + 1 } : art)),
      })),
    }))
    setCategories(updatedCategories)
  }

  const handleAddToSelected = (article: Article) => {
    if (!selectedArticles.find((a) => a.id === article.id)) {
      setSelectedArticles([...selectedArticles, article])
    }
  }

  const handleRemoveFromSelected = (articleId: string) => {
    setSelectedArticles(selectedArticles.filter((a) => a.id !== articleId))
  }

  const handleDataUpdate = async () => {
    console.log("🔄 Refreshing data after update...")
    await loadData()
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading knowledge base...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mb-4">{error}</AlertDescription>
          </Alert>
          <Button onClick={loadData} className="w-full mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onShowAdmin={() => setCurrentView("admin")}
        pageVisits={pageVisits}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CategoryTree
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              selectedArticles={selectedArticles}
              onShowSelected={() => setCurrentView("selected")}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {currentView === "browse" && (
              <>
                {selectedArticle ? (
                  <ArticleViewer
                    article={selectedArticle}
                    onBack={() => setSelectedArticle(null)}
                    onEdit={
                      currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
                        ? () => setCurrentView("edit")
                        : undefined
                    }
                    onAddToSelected={() => handleAddToSelected(selectedArticle)}
                    isInSelected={selectedArticles.some((a) => a.id === selectedArticle.id)}
                  />
                ) : selectedCategory ? (
                  <ArticleList
                    category={selectedCategory}
                    onArticleSelect={handleArticleSelect}
                    onAddArticle={
                      currentUser && (currentUser.role === "admin" || currentUser.role === "editor")
                        ? () => setCurrentView("add")
                        : undefined
                    }
                    onAddToSelected={handleAddToSelected}
                    selectedArticles={selectedArticles}
                  />
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Kuhlekt Knowledge Base</h2>
                    <p className="text-gray-600 mb-8">Select a category from the sidebar to browse articles.</p>
                    {categories.length === 0 && (
                      <p className="text-gray-500">No categories available. Please contact an administrator.</p>
                    )}
                  </div>
                )}
              </>
            )}

            {currentView === "search" && (
              <SearchResults
                results={searchResults}
                query={searchQuery}
                onArticleSelect={handleArticleSelect}
                onCategorySelect={handleCategorySelect}
                onAddToSelected={handleAddToSelected}
                selectedArticles={selectedArticles}
              />
            )}

            {currentView === "selected" && (
              <SelectedArticles
                articles={selectedArticles}
                onArticleSelect={handleArticleSelect}
                onRemoveFromSelected={handleRemoveFromSelected}
                onBack={() => setCurrentView("browse")}
              />
            )}

            {currentView === "add" &&
              currentUser &&
              (currentUser.role === "admin" || currentUser.role === "editor") && (
                <AddArticleForm
                  categories={categories}
                  selectedCategory={selectedCategory}
                  currentUser={currentUser}
                  onSave={(newCategories) => {
                    setCategories(newCategories)
                    setCurrentView("browse")
                    saveData()
                  }}
                  onCancel={() => setCurrentView("browse")}
                />
              )}

            {currentView === "edit" &&
              selectedArticle &&
              currentUser &&
              (currentUser.role === "admin" || currentUser.role === "editor") && (
                <EditArticleForm
                  article={selectedArticle}
                  categories={categories}
                  currentUser={currentUser}
                  onSave={(updatedCategories) => {
                    setCategories(updatedCategories)
                    setCurrentView("browse")
                    saveData()
                  }}
                  onCancel={() => setCurrentView("browse")}
                />
              )}

            {currentView === "admin" && currentUser && currentUser.role === "admin" && (
              <AdminDashboard
                categories={categories}
                users={users}
                auditLog={auditLog}
                onCategoriesUpdate={(newCategories) => {
                  setCategories(newCategories)
                  saveData()
                }}
                onUsersUpdate={(newUsers) => {
                  setUsers(newUsers)
                  saveData()
                }}
                onAuditLogUpdate={(newAuditLog) => {
                  setAuditLog(newAuditLog)
                  saveData()
                }}
                onDataUpdate={handleDataUpdate}
                onBack={() => setCurrentView("browse")}
                currentUser={currentUser}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
