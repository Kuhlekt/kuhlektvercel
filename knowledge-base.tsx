"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Search, Plus, Home, Database, FileText, FolderOpen, Shield, Activity } from "lucide-react"

import { LoginModal } from "./components/login-modal"
import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { SearchResults } from "./components/search-results"
import { AddArticleForm } from "./components/add-article-form"
import { EditArticleForm } from "./components/edit-article-form"
import { UserManagement } from "./components/user-management"
import { CategoryManagement } from "./components/category-management"
import { DataManagement } from "./components/data-management"
import { ArticleManagement } from "./components/article-management"
import { AuditLog } from "./components/audit-log"
import { AdminDashboard } from "./components/admin-dashboard"
import { Navigation } from "./components/navigation"

import { storage } from "./utils/storage"
import type { User, Category, Article, AuditLog as AuditLogType } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogType[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [showAddArticle, setShowAddArticle] = useState(false)
  const [activeTab, setActiveTab] = useState("home")

  // Initialize storage and auto-login as admin (bypass login)
  useEffect(() => {
    console.log("🚀 Initializing Knowledge Base...")
    storage.init()
    loadData()

    // Auto-login as admin - bypass login completely
    const loadedUsers = storage.getUsers()
    let adminUser = loadedUsers.find((user) => user.role === "admin")

    if (!adminUser) {
      // Create default admin if none exists
      console.log("👤 Creating default admin user...")
      const defaultAdmin: User = {
        id: "admin-default",
        username: "admin",
        email: "admin@kuhlekt.com",
        password: "admin123",
        role: "admin",
        createdAt: new Date(),
        lastLogin: new Date(),
      }
      const updatedUsers = [...loadedUsers, defaultAdmin]
      storage.saveUsers(updatedUsers)
      setUsers(updatedUsers)
      adminUser = defaultAdmin
    }

    console.log("🔓 Auto-logging in as admin:", adminUser.username)
    setCurrentUser(adminUser)
    storage.setCurrentUser(adminUser)
  }, [])

  const loadData = () => {
    console.log("📊 Loading data from storage...")
    const loadedCategories = storage.getCategories()
    const loadedArticles = storage.getArticles()
    const loadedUsers = storage.getUsers()
    const loadedAuditLog = storage.getAuditLog()

    // Ensure dates are properly converted and data is safe
    const processedArticles = Array.isArray(loadedArticles)
      ? loadedArticles.map((article) => ({
          ...article,
          createdAt: article.createdAt instanceof Date ? article.createdAt : new Date(article.createdAt),
          updatedAt: article.updatedAt instanceof Date ? article.updatedAt : new Date(article.updatedAt),
        }))
      : []

    const processedCategories = Array.isArray(loadedCategories) ? loadedCategories : []
    const processedUsers = Array.isArray(loadedUsers) ? loadedUsers : []
    const processedAuditLog = Array.isArray(loadedAuditLog) ? loadedAuditLog : []

    setCategories(processedCategories)
    setArticles(processedArticles)
    setUsers(processedUsers)
    setAuditLog(processedAuditLog)

    console.log("✅ Data loaded:", {
      categories: processedCategories.length,
      articles: processedArticles.length,
      users: processedUsers.length,
      auditLog: processedAuditLog.length,
    })
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setShowLogin(false)
    loadData()
  }

  const handleLogout = () => {
    // Don't actually log out - just refresh data
    console.log("🔄 Refreshing data...")
    loadData()
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const safeArticles = Array.isArray(articles) ? articles : []
      const results = safeArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.content.toLowerCase().includes(query.toLowerCase()) ||
          (Array.isArray(article.tags) && article.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))),
      )
      setSearchResults(results)
      setActiveTab("search")
    } else {
      setSearchResults([])
    }
  }

  const handleAddArticle = (articleData: {
    title: string
    content: string
    categoryId: string
    tags: string[]
    status: "draft" | "published"
  }) => {
    if (!currentUser) return

    const newArticle: Article = {
      id: Date.now().toString(),
      ...articleData,
      authorId: currentUser.id,
      createdBy: currentUser.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedArticles = [...articles, newArticle]
    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)

    storage.addAuditEntry({
      performedBy: currentUser.id,
      action: "CREATE_ARTICLE",
      details: `Created article: ${newArticle.title}`,
    })

    setShowAddArticle(false)
    loadData()
  }

  const handleEditArticle = (updatedArticle: Omit<Article, "createdAt">) => {
    if (!currentUser) return

    const articleWithDates: Article = {
      ...updatedArticle,
      createdAt: editingArticle?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    const updatedArticles = articles.map((article) => (article.id === updatedArticle.id ? articleWithDates : article))

    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)

    storage.addAuditEntry({
      performedBy: currentUser.id,
      action: "UPDATE_ARTICLE",
      details: `Updated article: ${updatedArticle.title}`,
    })

    setEditingArticle(null)
    loadData()
  }

  const handleDeleteArticle = (articleId: string) => {
    if (!currentUser) return

    const articleToDelete = articles.find((a) => a.id === articleId)
    const updatedArticles = articles.filter((article) => article.id !== articleId)

    setArticles(updatedArticles)
    storage.saveArticles(updatedArticles)

    if (articleToDelete) {
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "DELETE_ARTICLE",
        details: `Deleted article: ${articleToDelete.title}`,
      })
    }

    if (selectedArticle?.id === articleId) {
      setSelectedArticle(null)
    }

    loadData()
  }

  const handleCategoriesUpdate = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
    loadData()
  }

  const handleUsersUpdate = (updatedUsers: User[]) => {
    setUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
    loadData()
  }

  // Get articles for categories (with proper date and safety handling)
  const getCategoriesWithArticles = (): Category[] => {
    const safeCategories = Array.isArray(categories) ? categories : []
    const safeArticles = Array.isArray(articles) ? articles : []

    return safeCategories.map((category) => ({
      ...category,
      articles: safeArticles
        .filter((article) => article.categoryId === category.id && !article.subcategoryId)
        .map((article) => ({
          ...article,
          createdAt: article.createdAt instanceof Date ? article.createdAt : new Date(article.createdAt),
          updatedAt: article.updatedAt instanceof Date ? article.updatedAt : new Date(article.updatedAt),
        })),
      subcategories: Array.isArray(category.subcategories)
        ? category.subcategories.map((subcategory) => ({
            ...subcategory,
            articles: safeArticles
              .filter((article) => article.subcategoryId === subcategory.id)
              .map((article) => ({
                ...article,
                createdAt: article.createdAt instanceof Date ? article.createdAt : new Date(article.createdAt),
                updatedAt: article.updatedAt instanceof Date ? article.updatedAt : new Date(article.updatedAt),
              })),
          }))
        : [],
    }))
  }

  const categoriesWithArticles = getCategoriesWithArticles()

  // Always allow access - no authentication required
  const requireAuth = (action: () => void) => {
    action()
  }

  // Always admin access - bypass login
  const isAdmin = true
  const canEdit = true

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentUser={currentUser}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </TabsTrigger>
            <TabsTrigger value="browse" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Browse</span>
            </TabsTrigger>
            {searchQuery && (
              <TabsTrigger value="search" className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
            )}
            <TabsTrigger value="manage" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Articles</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Admin</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6">
            <AdminDashboard
              categories={categoriesWithArticles}
              articles={articles}
              users={users}
              auditLog={auditLog}
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <FolderOpen className="h-5 w-5" />
                      <span>Categories</span>
                    </CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowAddArticle(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Article
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <CategoryTree
                      categories={categoriesWithArticles}
                      onArticleSelect={setSelectedArticle}
                      selectedArticleId={selectedArticle?.id}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                {selectedArticle ? (
                  <ArticleViewer
                    article={selectedArticle}
                    onClose={() => setSelectedArticle(null)}
                    onEdit={() => setEditingArticle(selectedArticle)}
                    onDelete={() => handleDeleteArticle(selectedArticle.id)}
                  />
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-96">
                      <div className="text-center text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Select an article from the categories to view its content</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {searchQuery && (
            <TabsContent value="search" className="mt-6">
              <SearchResults
                results={searchResults}
                query={searchQuery}
                onArticleSelect={setSelectedArticle}
                onClearSearch={() => {
                  setSearchQuery("")
                  setSearchResults([])
                  setActiveTab("browse")
                }}
              />
            </TabsContent>
          )}

          <TabsContent value="manage" className="mt-6">
            <ArticleManagement
              categories={categoriesWithArticles}
              onEditArticle={setEditingArticle}
              onDeleteArticle={handleDeleteArticle}
            />
          </TabsContent>

          <TabsContent value="admin" className="mt-6">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center space-x-2">
                  <FolderOpen className="h-4 w-4" />
                  <span>Categories</span>
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>Audit Log</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-6">
                <UserManagement users={users} currentUser={currentUser} onUpdateUsers={handleUsersUpdate} />
              </TabsContent>

              <TabsContent value="categories" className="mt-6">
                <CategoryManagement
                  categories={categories}
                  currentUser={currentUser}
                  onUpdateCategories={handleCategoriesUpdate}
                />
              </TabsContent>

              <TabsContent value="audit" className="mt-6">
                <AuditLog auditLog={auditLog} users={users} />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <DataManagement
              users={users}
              categories={categories}
              articles={articles}
              auditLog={auditLog}
              onDataChange={loadData}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onLogin={handleLogin} />

      <AddArticleForm
        isOpen={showAddArticle}
        onClose={() => setShowAddArticle(false)}
        onSubmit={handleAddArticle}
        categories={categories}
        currentUser={currentUser || ({ id: "admin", username: "admin", role: "admin" } as User)}
      />

      {editingArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <EditArticleForm
              article={editingArticle}
              categories={categories}
              currentUser={currentUser}
              onSubmit={handleEditArticle}
              onCancel={() => setEditingArticle(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
