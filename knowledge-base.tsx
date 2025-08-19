"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Database, LogIn, UserIcon, Eye, Plus, Users } from "lucide-react"

import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { DataManagement } from "./components/data-management"
import { LoginModal } from "./components/login-modal"
import { AddArticleForm } from "./components/add-article-form"
import { AdminDashboard } from "./components/admin-dashboard"

import { storage } from "./utils/storage"
import { initialCategories } from "./data/initial-data"
import { initialUsers } from "./data/initial-users"
import type { Category, Article, User, AuditLogEntry } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [activeTab, setActiveTab] = useState("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pageVisits, setPageVisits] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      setIsLoading(true)

      // Load categories with fallback to initial data
      let loadedCategories = storage.getCategories()
      if (!loadedCategories || loadedCategories.length === 0) {
        loadedCategories = initialCategories
        storage.saveCategories(loadedCategories)
      }
      setCategories(loadedCategories)

      // Load users with fallback to initial users
      let loadedUsers = storage.getUsers()
      if (!loadedUsers || loadedUsers.length === 0) {
        loadedUsers = initialUsers
        storage.saveUsers(loadedUsers)
      }
      setUsers(loadedUsers)

      // Load audit log
      const loadedAuditLog = storage.getAuditLog() || []
      setAuditLog(loadedAuditLog)

      // Load and increment page visits
      const visits = storage.getPageVisits() || 0
      const newVisits = visits + 1
      setPageVisits(newVisits)
      storage.savePageVisits(newVisits)

      console.log("Data loaded successfully:", {
        categories: loadedCategories.length,
        users: loadedUsers.length,
        auditLog: loadedAuditLog.length,
        pageVisits: newVisits,
      })
    } catch (error) {
      console.error("Error loading data:", error)
      // Fallback to initial data
      setCategories(initialCategories)
      setUsers(initialUsers)
      setAuditLog([])
      setPageVisits(1)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    const results: Article[] = []
    const searchLower = query.toLowerCase()

    categories.forEach((category) => {
      if (Array.isArray(category.articles)) {
        category.articles.forEach((article) => {
          if (
            article.title.toLowerCase().includes(searchLower) ||
            article.content.toLowerCase().includes(searchLower) ||
            (Array.isArray(article.tags) && article.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
          ) {
            results.push(article)
          }
        })
      }

      if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach((subcategory) => {
          if (Array.isArray(subcategory.articles)) {
            subcategory.articles.forEach((article) => {
              if (
                article.title.toLowerCase().includes(searchLower) ||
                article.content.toLowerCase().includes(searchLower) ||
                (Array.isArray(article.tags) && article.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
              ) {
                results.push(article)
              }
            })
          }
        })
      }
    })

    setSearchResults(results)
  }

  const handleLogin = (user: User) => {
    console.log("Login successful:", user.username)
    setCurrentUser(user)
    setShowLoginModal(false)

    // Update user's last login
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date() } : u))
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)

    // Add audit log entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "user_login",
      entityType: "user",
      entityId: user.id,
      performedBy: user.username,
      timestamp: new Date(),
      details: `User login: ${user.username}`,
    }
    const updatedAuditLog = [auditEntry, ...auditLog]
    setAuditLog(updatedAuditLog)
    storage.saveAuditLog(updatedAuditLog)
  }

  const handleLogout = () => {
    if (currentUser) {
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "user_logout",
        entityType: "user",
        entityId: currentUser.id,
        performedBy: currentUser.username,
        timestamp: new Date(),
        details: `User logout: ${currentUser.username}`,
      }
      const updatedAuditLog = [auditEntry, ...auditLog]
      setAuditLog(updatedAuditLog)
      storage.saveAuditLog(updatedAuditLog)
    }

    setCurrentUser(null)
    setActiveTab("browse")
  }

  const handleDataImported = () => {
    loadData()
    setSelectedArticle(null)
    setSearchQuery("")
    setSearchResults([])
    setActiveTab("browse")
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
            subcategories: category.subcategories.map((sub) =>
              sub.id === articleData.subcategoryId ? { ...sub, articles: [...(sub.articles || []), newArticle] } : sub,
            ),
          }
        } else {
          // Add to main category
          return {
            ...category,
            articles: [...(category.articles || []), newArticle],
          }
        }
      }
      return category
    })

    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)

    // Add audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "article_created",
      entityType: "article",
      entityId: newArticle.id,
      performedBy: currentUser?.username || "unknown",
      timestamp: new Date(),
      details: `Created article: ${newArticle.title}`,
    }
    const updatedAuditLog = [auditEntry, ...auditLog]
    setAuditLog(updatedAuditLog)
    storage.saveAuditLog(updatedAuditLog)

    setActiveTab("browse")
    setSelectedArticle(newArticle)
  }

  const handleUsersUpdate = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
  }

  const handleAuditLogUpdate = (updatedAuditLog: AuditLogEntry[]) => {
    setAuditLog(updatedAuditLog)
    storage.saveAuditLog(updatedAuditLog)
  }

  const handleCategoriesUpdate = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/placeholder.svg?height=32&width=32&text=KB" alt="Kuhlekt" className="h-8 w-auto" />
              <h1 className="text-xl font-semibold text-gray-900">Knowledge Base</h1>
              <Badge variant="outline" className="text-xs flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{pageVisits} visits</span>
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <UserIcon className="h-3 w-3" />
                    <span>{currentUser.username}</span>
                    <span className="text-xs">({currentUser.role})</span>
                  </Badge>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setShowLoginModal(true)}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="browse" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Browse ({getTotalArticles()})</span>
            </TabsTrigger>
            {currentUser && (
              <TabsTrigger value="add" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Article</span>
              </TabsTrigger>
            )}
            {currentUser?.role === "admin" && (
              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Admin</span>
              </TabsTrigger>
            )}
            {currentUser && (
              <TabsTrigger value="data" className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Data</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {searchQuery ? `Search Results (${searchResults.length})` : "Categories"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {searchQuery ? (
                      <div className="space-y-2">
                        {searchResults.length > 0 ? (
                          searchResults.map((article) => (
                            <div
                              key={article.id}
                              className={`p-3 hover:bg-gray-50 cursor-pointer rounded border ${
                                selectedArticle?.id === article.id ? "bg-blue-50 border-blue-200" : ""
                              }`}
                              onClick={() => setSelectedArticle(article)}
                            >
                              <div className="font-medium text-sm">{article.title}</div>
                              <div className="text-xs text-gray-500 mt-1">{article.content.substring(0, 100)}...</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No articles found for "{searchQuery}"</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <CategoryTree
                        categories={categories}
                        onSelectArticle={setSelectedArticle}
                        selectedArticle={selectedArticle}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <ArticleViewer article={selectedArticle} categories={categories} />
              </div>
            </div>
          </TabsContent>

          {currentUser && (
            <TabsContent value="add" className="mt-6">
              <AddArticleForm
                categories={categories}
                onSubmit={handleAddArticle}
                onCancel={() => setActiveTab("browse")}
              />
            </TabsContent>
          )}

          {currentUser?.role === "admin" && (
            <TabsContent value="admin" className="mt-6">
              <AdminDashboard
                categories={categories}
                users={users}
                auditLog={auditLog}
                onCategoriesUpdate={handleCategoriesUpdate}
                onUsersUpdate={handleUsersUpdate}
                onAuditLogUpdate={handleAuditLogUpdate}
              />
            </TabsContent>
          )}

          {currentUser && (
            <TabsContent value="data" className="mt-6">
              <DataManagement
                categories={categories}
                users={users}
                auditLog={auditLog}
                onDataImported={handleDataImported}
              />
            </TabsContent>
          )}
        </Tabs>
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
