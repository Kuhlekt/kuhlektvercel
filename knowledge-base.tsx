"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, FileText, Settings, Database, LogIn, UserIcon } from "lucide-react"

import { CategoryTree } from "./components/category-tree"
import { ArticleViewer } from "./components/article-viewer"
import { DataManagement } from "./components/data-management"
import { LoginModal } from "./components/login-modal"

import { storage } from "./utils/storage"
import { initialUsers } from "./data/initial-users"
import type { Category, Article, User } from "./types/knowledge-base"

export default function KnowledgeBase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [activeTab, setActiveTab] = useState("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      setIsLoading(true)

      // Load categories
      const loadedCategories = storage.getCategories() || []
      setCategories(loadedCategories)

      // Load users - ensure we always have initial users
      let loadedUsers = storage.getUsers() || []
      if (loadedUsers.length === 0) {
        loadedUsers = initialUsers
        storage.saveUsers(initialUsers)
      }
      setUsers(loadedUsers)

      console.log("Data loaded:", {
        categories: loadedCategories.length,
        users: loadedUsers.length,
      })
    } catch (error) {
      console.error("Error loading data:", error)
      // Fallback to initial users
      setUsers(initialUsers)
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
            article.content.toLowerCase().includes(searchLower)
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
                article.content.toLowerCase().includes(searchLower)
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
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setActiveTab("browse")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Browse</span>
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center space-x-2" disabled={!currentUser}>
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2" disabled={!currentUser}>
              <Database className="h-4 w-4" />
              <span>Data</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {searchQuery ? (
                      <div className="space-y-2">
                        {searchResults.map((article) => (
                          <div
                            key={article.id}
                            className="p-2 hover:bg-gray-50 cursor-pointer rounded"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <div className="font-medium text-sm">{article.title}</div>
                          </div>
                        ))}
                        {searchResults.length === 0 && <div className="text-gray-500 text-sm">No results found</div>}
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

          <TabsContent value="data" className="mt-6">
            {currentUser && (
              <DataManagement categories={categories} users={users} auditLog={[]} onDataImported={loadData} />
            )}
          </TabsContent>
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
