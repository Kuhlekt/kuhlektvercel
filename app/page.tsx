"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, BookOpen, Users, FileText, Settings, LogIn, Shield, Eye } from "lucide-react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Article, Category, User as UserType } from "@/types/knowledge-base"
import { getStoredData, getCurrentUser, setCurrentUser, initializeStorage } from "@/utils/storage"

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [currentUser, setCurrentUserState] = useState<UserType | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [loginForm, setLoginForm] = useState({ username: "", password: "" })
  const [showAdmin, setShowAdmin] = useState(false)

  useEffect(() => {
    initializeStorage()
    const data = getStoredData()
    setArticles(data.articles)
    setCategories(data.categories)
    setFilteredArticles(data.articles)
    setCurrentUserState(getCurrentUser())
  }, [])

  useEffect(() => {
    let filtered = articles

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
    const data = getStoredData()
    const user = data.users.find((u) => u.username === loginForm.username && u.password === loginForm.password)

    if (user) {
      setCurrentUser(user)
      setCurrentUserState(user)
      setShowLogin(false)
      setLoginForm({ username: "", password: "" })
      if (user.role === "admin") {
        setShowAdmin(true)
      }
    } else {
      alert("Invalid credentials")
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setCurrentUserState(null)
    setShowAdmin(false)
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId)
    return category ? category.name : categoryId
  }

  const renderArticleContent = (content: string) => {
    return content.split("\n").map((line, index) => {
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mb-4 mt-6">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold mb-3 mt-5">
            {line.substring(3)}
          </h2>
        )
      } else if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-medium mb-2 mt-4">
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.substring(2)}
          </li>
        )
      } else if (line.trim() === "") {
        return <br key={index} />
      } else {
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        )
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kuhlekt Knowledge Base
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {currentUser.role === "admin" && <Shield className="h-4 w-4 text-red-500" />}
                    {currentUser.role === "editor" && <FileText className="h-4 w-4 text-blue-500" />}
                    {currentUser.role === "viewer" && <Eye className="h-4 w-4 text-green-500" />}
                    <span className="text-sm font-medium">{currentUser.username}</span>
                  </div>
                  {currentUser.role === "admin" && (
                    <Button variant="outline" size="sm" onClick={() => setShowAdmin(!showAdmin)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Dialog open={showLogin} onOpenChange={setShowLogin}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Login to Knowledge Base</DialogTitle>
                      <DialogDescription>Enter your credentials to access admin features</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Input
                          placeholder="Username"
                          value={loginForm.username}
                          onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Input
                          type="password"
                          placeholder="Password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Login
                      </Button>
                    </form>
                    <div className="text-xs text-gray-500 mt-4">
                      <p>Demo credentials:</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAdmin && currentUser?.role === "admin" ? (
          <AdminDashboard />
        ) : (
          <>
            {/* Search and Filters */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <Badge
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory("all")}
                >
                  All ({articles.length})
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name} ({articles.filter((a) => a.category === category.id).length})
                  </Badge>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer bg-white/60 backdrop-blur-sm"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{getCategoryName(article.category)}</Badge>
                      {article.featured && <Badge variant="default">Featured</Badge>}
                    </div>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <CardDescription>
                      By {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{article.content.substring(0, 150)}...</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setSelectedArticle(article)} className="w-full">
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Article Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedArticle && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{getCategoryName(selectedArticle.category)}</Badge>
                  {selectedArticle.featured && <Badge variant="default">Featured</Badge>}
                </div>
                <DialogTitle className="text-2xl">{selectedArticle.title}</DialogTitle>
                <DialogDescription>
                  By {selectedArticle.author} • {new Date(selectedArticle.createdAt).toLocaleDateString()}
                  {selectedArticle.updatedAt !== selectedArticle.createdAt && (
                    <span> • Updated {new Date(selectedArticle.updatedAt).toLocaleDateString()}</span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="prose max-w-none">{renderArticleContent(selectedArticle.content)}</div>
              <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t">
                {selectedArticle.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AdminDashboard() {
  const [data, setData] = useState(getStoredData())
  const [activeTab, setActiveTab] = useState("overview")

  const refreshData = () => {
    setData(getStoredData())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <Button onClick={refreshData} variant="outline">
          Refresh Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.articles.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.categories.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Audit Entries</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.auditLog.length}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Article Management</CardTitle>
              <CardDescription>Manage your knowledge base articles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{article.title}</h3>
                      <p className="text-sm text-gray-500">
                        {article.category} • By {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>Organize your content with categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {data.articles.filter((a) => a.category === category.id).length} articles
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{user.username}</h3>
                      <p className="text-sm text-gray-500">
                        {user.email} • Created {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          user.role === "admin" ? "destructive" : user.role === "editor" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track system activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {data.auditLog.slice(0, 20).map((entry) => (
                  <div key={entry.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{entry.action}</h3>
                      <p className="text-sm text-gray-600">{entry.details}</p>
                      <p className="text-xs text-gray-500">
                        By {entry.username} • {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline">{entry.entityType}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
