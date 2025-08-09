"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, BookOpen, Shield, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Article, Category, User } from "@/types/knowledge-base"
import {
  getArticles,
  getCategories,
  getCurrentUser,
  setCurrentUser,
  getUsers,
  initializeStorage,
  addAuditLogEntry,
} from "@/utils/storage"

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentUser, setCurrentUserState] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    initializeStorage()
    setArticles(getArticles())
    setCategories(getCategories())
    setCurrentUserState(getCurrentUser())
  }, [])

  useEffect(() => {
    let filtered = articles.filter((article) => article.isPublished)

    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((article) => article.category === selectedCategory)
    }

    setFilteredArticles(filtered)
  }, [articles, searchTerm, selectedCategory])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const users = getUsers()
    const user = users.find((u) => u.username === loginForm.username && u.password === loginForm.password)

    if (user) {
      setCurrentUser(user)
      setCurrentUserState(user)
      setShowLoginModal(false)
      setLoginForm({ username: "", password: "" })

      addAuditLogEntry({
        id: Date.now().toString(),
        userId: user.id,
        username: user.username,
        action: "User Login",
        details: `User ${user.username} logged in`,
        timestamp: new Date().toISOString(),
      })
    } else {
      alert("Invalid credentials")
    }
  }

  const handleLogout = () => {
    if (currentUser) {
      addAuditLogEntry({
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.username,
        action: "User Logout",
        details: `User ${currentUser.username} logged out`,
        timestamp: new Date().toISOString(),
      })
    }

    setCurrentUser(null)
    setCurrentUserState(null)
    setShowAdminPanel(false)
  }

  const openArticle = (article: Article) => {
    setSelectedArticle(article)
    // Increment view count
    const updatedArticles = articles.map((a) => (a.id === article.id ? { ...a, viewCount: a.viewCount + 1 } : a))
    setArticles(updatedArticles)
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : "Uncategorized"
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.color : "#6B7280"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kuhlekt Knowledge Base
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {currentUser.username}</span>
                  <Badge
                    variant={
                      currentUser.role === "admin"
                        ? "destructive"
                        : currentUser.role === "editor"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {currentUser.role}
                  </Badge>
                  {(currentUser.role === "admin" || currentUser.role === "editor") && (
                    <Button variant="outline" size="sm" onClick={() => setShowAdminPanel(!showAdminPanel)}>
                      {showAdminPanel ? "Public View" : "Admin Panel"}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Login to Knowledge Base</DialogTitle>
                      <DialogDescription>Enter your credentials to access the knowledge base.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Input
                          placeholder="Username"
                          value={loginForm.username}
                          onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                          required
                        />
                      </div>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button type="submit" className="w-full">
                        Login
                      </Button>
                    </form>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>
                        <strong>Demo Credentials:</strong>
                      </p>
                      <p>Admin: admin / admin123</p>
                      <p>Editor: editor / editor123</p>
                      <p>Viewer: viewer / viewer123</p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Admin Panel */}
      {showAdminPanel && currentUser && (currentUser.role === "admin" || currentUser.role === "editor") && (
        <div className="bg-gray-900 text-white p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Admin Panel</h2>
              <div className="flex space-x-4">
                <Button variant="secondary" size="sm">
                  Manage Articles
                </Button>
                <Button variant="secondary" size="sm">
                  Manage Categories
                </Button>
                {currentUser.role === "admin" && (
                  <Button variant="secondary" size="sm">
                    Manage Users
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedArticle ? (
          /* Article View */
          <div className="max-w-4xl mx-auto">
            <Button variant="ghost" onClick={() => setSelectedArticle(null)} className="mb-6">
              ← Back to Articles
            </Button>

            <Card className="bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge style={{ backgroundColor: getCategoryColor(selectedArticle.category) }} className="text-white">
                    {getCategoryName(selectedArticle.category)}
                  </Badge>
                  <span className="text-sm text-gray-500">{selectedArticle.viewCount} views</span>
                </div>
                <CardTitle className="text-3xl">{selectedArticle.title}</CardTitle>
                <CardDescription>
                  By {selectedArticle.author} • {new Date(selectedArticle.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {selectedArticle.content.split("\n").map((paragraph, index) => {
                    if (paragraph.startsWith("# ")) {
                      return (
                        <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
                          {paragraph.slice(2)}
                        </h1>
                      )
                    } else if (paragraph.startsWith("## ")) {
                      return (
                        <h2 key={index} className="text-xl font-semibold mt-5 mb-3">
                          {paragraph.slice(3)}
                        </h2>
                      )
                    } else if (paragraph.startsWith("### ")) {
                      return (
                        <h3 key={index} className="text-lg font-medium mt-4 mb-2">
                          {paragraph.slice(4)}
                        </h3>
                      )
                    } else if (paragraph.startsWith("- ")) {
                      return (
                        <li key={index} className="ml-4">
                          {paragraph.slice(2)}
                        </li>
                      )
                    } else if (paragraph.trim() === "") {
                      return <br key={index} />
                    } else {
                      return (
                        <p key={index} className="mb-3">
                          {paragraph}
                        </p>
                      )
                    }
                  })}
                </div>

                <div className="mt-8 pt-6 border-t">
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Main View */
          <>
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/70 backdrop-blur-sm"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="bg-white/70 backdrop-blur-sm"
                >
                  All ({articles.filter((a) => a.isPublished).length})
                </Button>
                {categories.map((category) => {
                  const count = articles.filter((a) => a.category === category.id && a.isPublished).length
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="bg-white/70 backdrop-blur-sm"
                      style={{
                        backgroundColor: selectedCategory === category.id ? category.color : undefined,
                        borderColor: category.color,
                        color: selectedCategory === category.id ? "white" : category.color,
                      }}
                    >
                      {category.name} ({count})
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm hover:bg-white/90"
                  onClick={() => openArticle(article)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge style={{ backgroundColor: getCategoryColor(article.category) }} className="text-white">
                        {getCategoryName(article.category)}
                      </Badge>
                      <span className="text-xs text-gray-500">{article.viewCount} views</span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <CardDescription>
                      By {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {article.content.replace(/[#*]/g, "").substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {article.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{article.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "No articles have been published yet."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
