"use client"

import { useState, useEffect } from "react"
import { Navigation } from "./components/navigation"
import { LoginModal } from "./components/login-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, BookOpen, Users, FileText } from "lucide-react"
import type { Category, Article, User } from "./types/knowledge-base"
import { storage } from "./utils/storage"
import { initialCategories } from "./data/initial-data"
import { initialUsers } from "./data/initial-users"

export default function KnowledgeBase() {
  // State management
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [currentView, setCurrentView] = useState<"browse" | "add" | "edit" | "admin">("browse")
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      try {
        console.log("Initializing knowledge base data...")

        // Load categories
        const storedCategories = storage.getCategories()
        if (storedCategories && storedCategories.length > 0) {
          console.log("Loaded stored categories:", storedCategories)
          setCategories(storedCategories)
        } else {
          console.log("No stored categories, using initial data")
          setCategories(initialCategories)
          storage.saveCategories(initialCategories)
        }

        // Load users
        const storedUsers = storage.getUsers()
        if (storedUsers && storedUsers.length > 0) {
          console.log("Loaded stored users:", storedUsers)
          setUsers(storedUsers)
        } else {
          console.log("No stored users, using initial data")
          setUsers(initialUsers)
          storage.saveUsers(initialUsers)
        }

        console.log("Data initialization complete")
      } catch (error) {
        console.error("Error initializing data:", error)
        // Fallback to initial data
        setCategories(initialCategories)
        setUsers(initialUsers)
      } finally {
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  // Handle login
  const handleLogin = (username: string, password: string): boolean => {
    console.log("Login attempt with:", { username, password })
    console.log("Available users:", users)

    const user = users.find((u) => {
      console.log("Checking user:", {
        storedUsername: u.username,
        storedPassword: u.password,
        inputUsername: username,
        inputPassword: password,
        usernameMatch: u.username === username,
        passwordMatch: u.password === password,
      })
      return u.username === username && u.password === password
    })

    if (user) {
      console.log("Login successful for user:", user)
      const updatedUser = { ...user, lastLogin: new Date() }
      setCurrentUser(updatedUser)

      // Update users array with last login time
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      setUsers(updatedUsers)
      storage.saveUsers(updatedUsers)

      return true
    } else {
      console.log("Login failed - user not found or password incorrect")
      return false
    }
  }

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentView("browse")
  }

  // Get all articles from all categories
  const getAllArticles = (): Article[] => {
    const allArticles: Article[] = []

    categories.forEach((category) => {
      // Add category articles
      allArticles.push(...category.articles)

      // Add subcategory articles
      category.subcategories.forEach((subcategory) => {
        allArticles.push(...subcategory.articles)
      })
    })

    return allArticles
  }

  // Filter articles based on search and category
  const getFilteredArticles = (): Article[] => {
    let articles = getAllArticles()

    // Filter by category if selected
    if (selectedCategory) {
      articles = articles.filter((article) => article.categoryId === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      articles = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    return articles
  }

  const filteredArticles = getFilteredArticles()
  const totalArticles = getAllArticles().length

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
                className="mx-auto mb-4 h-32 w-32 object-contain"
              />
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Kuhlekt Knowledge Base</h1>
              <p className="text-xl text-gray-600 mb-4">
                Your comprehensive resource for technical documentation and guides
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>{totalArticles} articles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{categories.length} categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>{users.length} users</span>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-3 text-lg"
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Categories Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategory === null ? "default" : "ghost"}
                        onClick={() => setSelectedCategory(null)}
                        className="w-full justify-start"
                      >
                        All Articles ({totalArticles})
                      </Button>
                      {categories.map((category) => {
                        const categoryArticleCount =
                          category.articles.length +
                          category.subcategories.reduce((sum, sub) => sum + sub.articles.length, 0)

                        return (
                          <Button
                            key={category.id}
                            variant={selectedCategory === category.id ? "default" : "ghost"}
                            onClick={() => setSelectedCategory(category.id)}
                            className="w-full justify-start"
                          >
                            {category.name} ({categoryArticleCount})
                          </Button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Articles List */}
              <div className="lg:col-span-3">
                {selectedArticle ? (
                  /* Article Viewer */
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mb-4">
                          ← Back to Articles
                        </Button>
                        {currentUser && (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm">
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {selectedArticle.createdAt.toLocaleDateString()}</span>
                        {selectedArticle.createdBy && <span>By: {selectedArticle.createdBy}</span>}
                        <div className="flex space-x-1">
                          {selectedArticle.tags.map((tag, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                          {selectedArticle.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* Articles List */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedCategory
                          ? categories.find((c) => c.id === selectedCategory)?.name || "Articles"
                          : searchQuery
                            ? `Search Results for "${searchQuery}"`
                            : "All Articles"}
                      </h2>
                      <span className="text-gray-500">
                        {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {filteredArticles.length > 0 ? (
                      <div className="grid gap-4">
                        {filteredArticles.map((article) => (
                          <Card
                            key={article.id}
                            className="hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setSelectedArticle(article)}
                          >
                            <CardHeader>
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>{categories.find((c) => c.id === article.categoryId)?.name}</span>
                                <span>{article.createdAt.toLocaleDateString()}</span>
                                {article.createdBy && <span>By {article.createdBy}</span>}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-600 line-clamp-3">{article.content.substring(0, 200)}...</p>
                              {article.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {article.tags.map((tag, index) => (
                                    <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                        <p className="text-gray-500">
                          {searchQuery
                            ? "Try adjusting your search terms or browse categories"
                            : selectedCategory
                              ? "This category doesn't have any articles yet"
                              : "No articles available"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {currentView === "add" && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Add New Article</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Article creation form would go here...</p>
                <Button variant="outline" onClick={() => setCurrentView("browse")} className="mt-4">
                  Back to Browse
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {currentView === "admin" && (
          <div className="max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">Total Articles</p>
                        <p className="text-2xl font-bold text-blue-900">{totalArticles}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <BookOpen className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Categories</p>
                        <p className="text-2xl font-bold text-green-900">{categories.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Users</p>
                        <p className="text-2xl font-bold text-purple-900">{users.length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <p className="text-gray-600">Admin dashboard functionality would go here...</p>
                </div>

                <Button variant="outline" onClick={() => setCurrentView("browse")} className="mt-6">
                  Back to Browse
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />
    </div>
  )
}
