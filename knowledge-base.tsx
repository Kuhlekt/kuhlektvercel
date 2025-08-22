"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { CategoryTree } from "./components/category-tree"
import { ArticleList } from "./components/article-list"
import { ArticleViewer } from "./components/article-viewer"
import { SearchResults } from "./components/search-results"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { AdminDashboard } from "./components/admin-dashboard"
import { UserManagementTable } from "./components/user-management-table"
import { DataManagement } from "./components/data-management"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Home,
  FolderTree,
  FileText,
  Users,
  Activity,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react"
import Image from "next/image"
import type { Category, User, Article, AuditLogEntry } from "./types/knowledge-base"
import { apiDatabase } from "./utils/api-database"

type ViewMode = "home" | "category" | "article" | "search" | "add-article" | "edit-article" | "admin" | "users" | "data"

export default function KnowledgeBase() {
  // State
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("home")
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [pageVisits, setPageVisits] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Initialize data
  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      await apiDatabase.initialize()
      await loadData()
      await incrementPageVisits()
    } catch (error) {
      console.error("Failed to initialize:", error)
      setError("Failed to load data. Please refresh the page.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadData = async () => {
    try {
      const [categoriesData, usersData, auditLogData, visitsData] = await Promise.all([
        apiDatabase.getCategories(),
        apiDatabase.getUsers(),
        apiDatabase.getAuditLog(),
        apiDatabase.getPageVisits(),
      ])

      setCategories(categoriesData)
      setUsers(usersData)
      setAuditLog(auditLogData)
      setPageVisits(visitsData)
    } catch (error) {
      console.error("Failed to load data:", error)
      throw error
    }
  }

  const incrementPageVisits = async () => {
    try {
      const newVisits = await apiDatabase.incrementPageVisits()
      setPageVisits(newVisits)
    } catch (error) {
      console.error("Failed to increment page visits:", error)
    }
  }

  const refreshData = async () => {
    try {
      setError(null)
      await loadData()
    } catch (error) {
      console.error("Failed to refresh data:", error)
      setError("Failed to refresh data. Please try again.")
    }
  }

  // Event handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user)
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setViewMode("home")
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setViewMode("home")
      return
    }

    const results: Article[] = []
    const query = searchQuery.toLowerCase()

    categories.forEach((category) => {
      // Search in category articles
      category.articles.forEach((article) => {
        if (
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
        ) {
          results.push(article)
        }
      })

      // Search in subcategory articles
      category.subcategories.forEach((subcategory) => {
        subcategory.articles.forEach((article) => {
          if (
            article.title.toLowerCase().includes(query) ||
            article.content.toLowerCase().includes(query) ||
            article.tags.some((tag) => tag.toLowerCase().includes(query))
          ) {
            results.push(article)
          }
        })
      })
    })

    setSearchResults(results)
    setViewMode("search")
    setShowMobileMenu(false)
  }

  const handleCategorySelect = (category: Category, subcategoryId?: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory(subcategoryId || null)
    setViewMode("category")
    setShowMobileMenu(false)
  }

  const handleArticleView = (article: Article) => {
    setSelectedArticle(article)
    setViewMode("article")
    setShowMobileMenu(false)
  }

  const handleArticleEdit = (article: Article) => {
    setSelectedArticle(article)
    setViewMode("edit-article")
    setShowMobileMenu(false)
  }

  const handleAddArticle = () => {
    setViewMode("add-article")
    setShowMobileMenu(false)
  }

  const handleArticleAdded = async () => {
    await refreshData()
    setViewMode("home")
  }

  const handleArticleUpdated = async () => {
    await refreshData()
    setViewMode("home")
  }

  const handleShowAdmin = () => {
    setViewMode("admin")
    setShowMobileMenu(false)
  }

  const handleShowUsers = () => {
    setViewMode("users")
    setShowMobileMenu(false)
  }

  const handleShowData = () => {
    setViewMode("data")
    setShowMobileMenu(false)
  }

  // Get stats
  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = category.articles.length
      const subcategoryArticles = category.subcategories.reduce((subTotal, sub) => subTotal + sub.articles.length, 0)
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  const getRecentArticles = () => {
    const allArticles: Article[] = []
    categories.forEach((category) => {
      allArticles.push(...category.articles)
      category.subcategories.forEach((sub) => {
        allArticles.push(...sub.articles)
      })
    })
    return allArticles.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)
  }

  const getSelectedArticles = () => {
    if (!selectedCategory) return []

    if (selectedSubcategory) {
      const subcategory = selectedCategory.subcategories.find((sub) => sub.id === selectedSubcategory)
      return subcategory?.articles || []
    }

    return selectedCategory.articles
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading knowledge base...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        onShowAdmin={handleShowAdmin}
        showMobileMenu={showMobileMenu}
        onToggleMobileMenu={() => setShowMobileMenu(!showMobileMenu)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="outline" size="sm" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Home View */}
        {viewMode === "home" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <Image
                src="/images/kuhlekt-logo.png"
                alt="Kuhlekt Logo"
                width={128}
                height={128}
                className="h-32 w-auto mx-auto mb-6"
              />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Kuhlekt Knowledge Base</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Your central hub for company knowledge, documentation, and best practices.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Articles</p>
                      <p className="text-2xl font-bold text-blue-600">{getTotalArticles()}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl font-bold text-green-600">{categories.length}</p>
                    </div>
                    <FolderTree className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Users</p>
                      <p className="text-2xl font-bold text-purple-600">{users.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Page Visits</p>
                      <p className="text-2xl font-bold text-orange-600">{pageVisits}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Categories */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FolderTree className="h-5 w-5 mr-2" />
                      Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CategoryTree categories={categories} onCategorySelect={handleCategorySelect} />
                  </CardContent>
                </Card>
              </div>

              {/* Recent Articles */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Recent Articles
                    </CardTitle>
                    {(currentUser?.role === "admin" || currentUser?.role === "editor") && (
                      <Button onClick={handleAddArticle}>
                        <FileText className="h-4 w-4 mr-2" />
                        Add Article
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ArticleList
                      articles={getRecentArticles()}
                      currentUser={currentUser}
                      onViewArticle={handleArticleView}
                      onEditArticle={handleArticleEdit}
                      showCategory={true}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            {currentUser && (
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" onClick={() => setViewMode("home")}>
                      <Home className="h-4 w-4 mr-2" />
                      Home
                    </Button>
                    {(currentUser.role === "admin" || currentUser.role === "editor") && (
                      <>
                        <Button variant="outline" onClick={handleAddArticle}>
                          <FileText className="h-4 w-4 mr-2" />
                          Add Article
                        </Button>
                        <Button variant="outline" onClick={handleShowAdmin}>
                          <Activity className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      </>
                    )}
                    {currentUser.role === "admin" && (
                      <>
                        <Button variant="outline" onClick={handleShowUsers}>
                          <Users className="h-4 w-4 mr-2" />
                          Manage Users
                        </Button>
                        <Button variant="outline" onClick={handleShowData}>
                          <BookOpen className="h-4 w-4 mr-2" />
                          Data Management
                        </Button>
                      </>
                    )}
                    <Button variant="outline" onClick={refreshData}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Category View */}
        {viewMode === "category" && selectedCategory && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Button variant="ghost" onClick={() => setViewMode("home")} className="mb-4">
                  ← Back to Home
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedCategory.name}
                  {selectedSubcategory && (
                    <>
                      {" > "}
                      {selectedCategory.subcategories.find((sub) => sub.id === selectedSubcategory)?.name}
                    </>
                  )}
                </h1>
                {selectedCategory.description && <p className="text-gray-600 mt-2">{selectedCategory.description}</p>}
              </div>
              {(currentUser?.role === "admin" || currentUser?.role === "editor") && (
                <Button onClick={handleAddArticle}>
                  <FileText className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              )}
            </div>

            <ArticleList
              articles={getSelectedArticles()}
              currentUser={currentUser}
              onViewArticle={handleArticleView}
              onEditArticle={handleArticleEdit}
              categoryName={selectedCategory.name}
              subcategoryName={
                selectedSubcategory
                  ? selectedCategory.subcategories.find((sub) => sub.id === selectedSubcategory)?.name
                  : undefined
              }
            />
          </div>
        )}

        {/* Article View */}
        {viewMode === "article" && selectedArticle && (
          <ArticleViewer
            article={selectedArticle}
            currentUser={currentUser}
            onBack={() => setViewMode("home")}
            onEdit={() => handleArticleEdit(selectedArticle)}
          />
        )}

        {/* Search Results */}
        {viewMode === "search" && (
          <SearchResults
            query={searchQuery}
            results={searchResults}
            currentUser={currentUser}
            onViewArticle={handleArticleView}
            onEditArticle={handleArticleEdit}
            onBack={() => setViewMode("home")}
          />
        )}

        {/* Add Article */}
        {viewMode === "add-article" && (
          <AddArticleForm
            categories={categories}
            currentUser={currentUser}
            onArticleAdded={handleArticleAdded}
            onCancel={() => setViewMode("home")}
          />
        )}

        {/* Edit Article */}
        {viewMode === "edit-article" && selectedArticle && (
          <EditArticleForm
            article={selectedArticle}
            categories={categories}
            currentUser={currentUser}
            onArticleUpdated={handleArticleUpdated}
            onCancel={() => setViewMode("home")}
          />
        )}

        {/* Admin Dashboard */}
        {viewMode === "admin" && (currentUser?.role === "admin" || currentUser?.role === "editor") && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setViewMode("home")}>
                ← Back to Home
              </Button>
              <div className="flex space-x-2">
                {currentUser.role === "admin" && (
                  <>
                    <Button variant="outline" onClick={handleShowUsers}>
                      <Users className="h-4 w-4 mr-2" />
                      Users
                    </Button>
                    <Button variant="outline" onClick={handleShowData}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Data
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={refreshData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            <AdminDashboard
              categories={categories}
              users={users}
              auditLog={auditLog}
              onCategoriesUpdate={refreshData}
              onUsersUpdate={refreshData}
              onAuditLogUpdate={refreshData}
            />
          </div>
        )}

        {/* User Management */}
        {viewMode === "users" && currentUser?.role === "admin" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setViewMode("admin")}>
                ← Back to Admin
              </Button>
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <UserManagementTable users={users} currentUser={currentUser} onUsersUpdate={refreshData} />
          </div>
        )}

        {/* Data Management */}
        {viewMode === "data" && currentUser?.role === "admin" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => setViewMode("admin")}>
                ← Back to Admin
              </Button>
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>

            <DataManagement
              categories={categories}
              users={users}
              auditLog={auditLog}
              pageVisits={pageVisits}
              onDataUpdate={refreshData}
            />
          </div>
        )}
      </div>
    </div>
  )
}
