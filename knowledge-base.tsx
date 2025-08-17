"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Plus,
  Users,
  FileText,
  Settings,
  BarChart3,
  Database,
  AlertCircle,
  CheckCircle,
  LogIn,
  UserIcon,
} from "lucide-react"

import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { CategoryManagement } from "./components/category-management"
import { UserManagement } from "./components/user-management"
import { AuditLog } from "./components/audit-log"
import { DataManagement } from "./components/data-management"
import { LoginModal } from "./components/login-modal"
import { LoginDebug } from "./components/login-debug"
import { SearchResults } from "./components/search-results"
import { SelectedArticles } from "./components/selected-articles"

import { storage } from "./utils/storage"
import type { Category, Article, KnowledgeBaseUser, AuditLogEntry } from "./types/knowledge-base"

export default function KnowledgeBase() {
  // Data state
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<KnowledgeBaseUser[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [pageVisits, setPageVisits] = useState(0)

  // UI state
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([])
  const [activeTab, setActiveTab] = useState("browse")
  const [isAddingArticle, setIsAddingArticle] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<KnowledgeBaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Track page visits
  useEffect(() => {
    const visits = storage.getPageVisits()
    storage.savePageVisits(visits + 1)
    setPageVisits(visits + 1)
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      // Load all data from storage
      const loadedCategories = storage.getCategories() || []
      const loadedUsers = storage.getUsers() || []
      const loadedAuditLog = storage.getAuditLog() || []
      const loadedPageVisits = storage.getPageVisits() || 0

      setCategories(loadedCategories)
      setUsers(loadedUsers)
      setAuditLog(loadedAuditLog)
      setPageVisits(loadedPageVisits)

      console.log("Data loaded successfully:", {
        categories: loadedCategories.length,
        users: loadedUsers.length,
        auditLog: loadedAuditLog.length,
        pageVisits: loadedPageVisits,
      })
    } catch (error) {
      console.error("Error loading data:", error)
      setError(`Error loading data: ${error instanceof Error ? error.message : "Unknown error"}`)
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
      // Search in category articles
      if (Array.isArray(category.articles)) {
        category.articles.forEach((article) => {
          if (
            article.title.toLowerCase().includes(searchLower) ||
            article.content.toLowerCase().includes(searchLower) ||
            (article.tags && article.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
          ) {
            results.push({ ...article, categoryPath: category.name })
          }
        })
      }

      // Search in subcategory articles
      if (Array.isArray(category.subcategories)) {
        category.subcategories.forEach((subcategory) => {
          if (Array.isArray(subcategory.articles)) {
            subcategory.articles.forEach((article) => {
              if (
                article.title.toLowerCase().includes(searchLower) ||
                article.content.toLowerCase().includes(searchLower) ||
                (article.tags && article.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
              ) {
                results.push({ ...article, categoryPath: `${category.name} > ${subcategory.name}` })
              }
            })
          }
        })
      }
    })

    setSearchResults(results)
  }

  const handleLogin = (user: KnowledgeBaseUser) => {
    setCurrentUser(user)
    setShowLoginModal(false)

    // Update user's last login
    const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date() } : u))
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)

    // Add audit log entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      action: "login",
      details: "User logged in",
      timestamp: new Date(),
    }
    const updatedAuditLog = [auditEntry, ...auditLog]
    setAuditLog(updatedAuditLog)
    storage.saveAuditLog(updatedAuditLog)
  }

  const handleLogout = () => {
    if (currentUser) {
      // Add audit log entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userName: currentUser.name,
        action: "logout",
        details: "User logged out",
        timestamp: new Date(),
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
    setSelectedCategory(null)
    setSearchQuery("")
    setSearchResults([])
    setSelectedArticles([])
    setActiveTab("browse")
  }

  const addToSelected = (article: Article) => {
    if (!selectedArticles.find((a) => a.id === article.id)) {
      setSelectedArticles([...selectedArticles, article])
    }
  }

  const removeFromSelected = (articleId: string) => {
    setSelectedArticles(selectedArticles.filter((a) => a.id !== articleId))
  }

  const clearSelected = () => {
    setSelectedArticles([])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading knowledge base...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-8 w-auto" />
              <h1 className="text-xl font-semibold text-gray-900">Knowledge Base</h1>
              <Badge variant="outline" className="text-xs">
                {pageVisits} visits
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* User Menu */}
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <UserIcon className="h-3 w-3" />
                    <span>{currentUser.name}</span>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="browse" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Browse</span>
            </TabsTrigger>
            <TabsTrigger value="selected" className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Selected ({selectedArticles.length})</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center space-x-2" disabled={!currentUser}>
              <Settings className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2" disabled={!currentUser}>
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2" disabled={!currentUser}>
              <BarChart3 className="h-4 w-4" />
              <span>Audit</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2" disabled={!currentUser}>
              <Database className="h-4 w-4" />
              <span>Data</span>
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Sidebar - Categories */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg">Categories</CardTitle>
                    {currentUser && (
                      <Button size="sm" onClick={() => setIsAddingArticle(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    {searchQuery ? (
                      <SearchResults
                        results={searchResults}
                        onSelectArticle={setSelectedArticle}
                        onAddToSelected={addToSelected}
                        selectedArticles={selectedArticles}
                      />
                    ) : (
                      <CategoryTree
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        onSelectArticle={setSelectedArticle}
                        selectedArticle={selectedArticle}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Content - Article Viewer */}
              <div className="lg:col-span-2">
                <ArticleViewer
                  article={selectedArticle}
                  categories={categories}
                  currentUser={currentUser}
                  onEditArticle={setEditingArticle}
                  onAddToSelected={addToSelected}
                  selectedArticles={selectedArticles}
                />
              </div>
            </div>
          </TabsContent>

          {/* Selected Articles Tab */}
          <TabsContent value="selected" className="mt-6">
            <SelectedArticles
              articles={selectedArticles}
              onSelectArticle={setSelectedArticle}
              onRemoveArticle={removeFromSelected}
              onClearAll={clearSelected}
            />
          </TabsContent>

          {/* Categories Management Tab */}
          <TabsContent value="categories" className="mt-6">
            {currentUser && (
              <CategoryManagement
                categories={categories}
                onCategoriesChange={(newCategories) => {
                  setCategories(newCategories)
                  storage.saveCategories(newCategories)
                }}
                currentUser={currentUser}
                onAuditLog={(entry) => {
                  const updatedAuditLog = [entry, ...auditLog]
                  setAuditLog(updatedAuditLog)
                  storage.saveAuditLog(updatedAuditLog)
                }}
              />
            )}
          </TabsContent>

          {/* Users Management Tab */}
          <TabsContent value="users" className="mt-6">
            {currentUser && (
              <UserManagement
                users={users}
                currentUser={currentUser}
                onUsersChange={(newUsers) => {
                  setUsers(newUsers)
                  storage.saveUsers(newUsers)
                }}
                onAuditLog={(entry) => {
                  const updatedAuditLog = [entry, ...auditLog]
                  setAuditLog(updatedAuditLog)
                  storage.saveAuditLog(updatedAuditLog)
                }}
              />
            )}
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="mt-6">
            {currentUser && <AuditLog auditLog={auditLog} users={users} />}
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data" className="mt-6">
            {currentUser && (
              <DataManagement
                categories={categories}
                users={users}
                auditLog={auditLog}
                onDataImported={handleDataImported}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        users={users}
        onLogin={handleLogin}
      />

      <Dialog open={isAddingArticle} onOpenChange={setIsAddingArticle}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Article</DialogTitle>
            <DialogDescription>Create a new article in the knowledge base</DialogDescription>
          </DialogHeader>
          <AddArticleForm
            categories={categories}
            onSave={(newCategories) => {
              setCategories(newCategories)
              storage.saveCategories(newCategories)
              setIsAddingArticle(false)

              if (currentUser) {
                const auditEntry: AuditLogEntry = {
                  id: Date.now().toString(),
                  userId: currentUser.id,
                  userName: currentUser.name,
                  action: "create_article",
                  details: "Created new article",
                  timestamp: new Date(),
                }
                const updatedAuditLog = [auditEntry, ...auditLog]
                setAuditLog(updatedAuditLog)
                storage.saveAuditLog(updatedAuditLog)
              }
            }}
            onCancel={() => setIsAddingArticle(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingArticle} onOpenChange={() => setEditingArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Article</DialogTitle>
            <DialogDescription>Make changes to the article</DialogDescription>
          </DialogHeader>
          {editingArticle && (
            <EditArticleForm
              article={editingArticle}
              categories={categories}
              onSave={(updatedArticle, newCategories) => {
                setCategories(newCategories)
                storage.saveCategories(newCategories)
                setSelectedArticle(updatedArticle)
                setEditingArticle(null)

                if (currentUser) {
                  const auditEntry: AuditLogEntry = {
                    id: Date.now().toString(),
                    userId: currentUser.id,
                    userName: currentUser.name,
                    action: "edit_article",
                    details: `Edited article: ${updatedArticle.title}`,
                    timestamp: new Date(),
                  }
                  const updatedAuditLog = [auditEntry, ...auditLog]
                  setAuditLog(updatedAuditLog)
                  storage.saveAuditLog(updatedAuditLog)
                }
              }}
              onCancel={() => setEditingArticle(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Debug Panel */}
      <div className="fixed bottom-4 right-4">
        <LoginDebug
          categories={categories}
          users={users}
          auditLog={auditLog}
          pageVisits={pageVisits}
          currentUser={currentUser}
        />
      </div>
    </div>
  )
}
