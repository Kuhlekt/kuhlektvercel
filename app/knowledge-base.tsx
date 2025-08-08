'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, LogIn, User, FileText, BookOpen, Users, Eye } from 'lucide-react'

import { Article, Category, User as UserType, AuditLogEntry } from '../types/knowledge-base'
import { initialData } from '../data/initial-data'
import { initialUsers } from '../data/initial-users'
import { initialAuditLog } from '../data/initial-audit-log'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import { formatDate, getArticlesByCategory, searchArticles, getCategoryPath } from '../utils/article-utils'

import { Navigation } from '../components/navigation'
import { CategoryTree } from '../components/category-tree'
import { SelectedArticles } from '../components/selected-articles'
import { SearchResults } from '../components/search-results'
import { ArticleViewer } from '../components/article-viewer'
import { LoginModal } from '../components/login-modal'
import { AdminDashboard } from '../components/admin-dashboard'
import { ArticleManagement } from '../components/article-management'
import { CategoryManagement } from '../components/category-management'
import { AuditLog } from '../components/audit-log'
import { DataManagement } from '../components/data-management'

export default function KnowledgeBase() {
  // Data state
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])

  // UI state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public')
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  // Load data on component mount
  useEffect(() => {
    const loadedArticles = loadFromStorage('articles', initialData.articles)
    const loadedCategories = loadFromStorage('categories', initialData.categories)
    const loadedUsers = loadFromStorage('users', initialUsers)
    const loadedAuditLog = loadFromStorage('auditLog', initialAuditLog)

    setArticles(loadedArticles)
    setCategories(loadedCategories)
    setUsers(loadedUsers)
    setAuditLog(loadedAuditLog)
  }, [])

  // Save data when it changes
  useEffect(() => {
    if (articles.length > 0) {
      saveToStorage('articles', articles)
    }
  }, [articles])

  useEffect(() => {
    if (categories.length > 0) {
      saveToStorage('categories', categories)
    }
  }, [categories])

  useEffect(() => {
    if (users.length > 0) {
      saveToStorage('users', users)
    }
  }, [users])

  useEffect(() => {
    if (auditLog.length > 0) {
      saveToStorage('auditLog', auditLog)
    }
  }, [auditLog])

  // Computed values
  const publishedArticles = useMemo(() => 
    articles.filter(article => article.status === 'published'), 
    [articles]
  )

  const filteredArticles = useMemo(() => {
    if (searchQuery) {
      return searchArticles(publishedArticles, searchQuery)
    }
    if (selectedCategoryId) {
      return getArticlesByCategory(publishedArticles, selectedCategoryId, categories)
    }
    return publishedArticles
  }, [publishedArticles, searchQuery, selectedCategoryId, categories])

  const featuredArticles = useMemo(() => 
    publishedArticles.filter(article => article.featured).slice(0, 3), 
    [publishedArticles]
  )

  // Event handlers
  const handleLogin = (user: UserType) => {
    setCurrentUser(user)
    setCurrentView('admin')
    
    // Add audit log entry
    const logEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: 'login',
      userId: user.id,
      userName: user.name,
      timestamp: new Date(),
      details: `User ${user.name} logged in`
    }
    setAuditLog(prev => [logEntry, ...prev])
  }

  const handleLogout = () => {
    if (currentUser) {
      // Add audit log entry
      const logEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: 'logout',
        userId: currentUser.id,
        userName: currentUser.name,
        timestamp: new Date(),
        details: `User ${currentUser.name} logged out`
      }
      setAuditLog(prev => [logEntry, ...prev])
    }
    
    setCurrentUser(null)
    setCurrentView('public')
  }

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategoryId(categoryId)
    setSelectedArticle(null)
    setSearchQuery('')
  }

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article)
    
    // Increment view count
    setArticles(prev => prev.map(a => 
      a.id === article.id 
        ? { ...a, viewCount: a.viewCount + 1 }
        : a
    ))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setSelectedCategoryId(null)
    setSelectedArticle(null)
  }

  const handleBackToList = () => {
    setSelectedArticle(null)
  }

  const addAuditLogEntry = (action: string, details: string, targetId?: string) => {
    if (!currentUser) return
    
    const logEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action,
      userId: currentUser.id,
      userName: currentUser.name,
      timestamp: new Date(),
      details,
      targetId
    }
    setAuditLog(prev => [logEntry, ...prev])
  }

  // Admin view
  if (currentView === 'admin' && currentUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <img 
                  src="/images/kuhlekt-logo.jpg" 
                  alt="Kuhlekt" 
                  className="h-8 w-auto"
                />
                <h1 className="text-2xl font-bold text-gray-900">Knowledge Base Admin</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{currentUser.name}</span>
                  <Badge variant={currentUser.role === 'admin' ? 'default' : 'secondary'}>
                    {currentUser.role}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentView('public')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Public View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
              <TabsTrigger value="data">Data</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <AdminDashboard 
                articles={articles}
                categories={categories}
                users={users}
                auditLog={auditLog}
              />
            </TabsContent>

            <TabsContent value="articles">
              <ArticleManagement
                articles={articles}
                categories={categories}
                currentUser={currentUser}
                onArticlesChange={setArticles}
                onAuditLog={addAuditLogEntry}
              />
            </TabsContent>

            <TabsContent value="categories">
              <CategoryManagement
                categories={categories}
                articles={articles}
                onCategoriesChange={setCategories}
                onAuditLog={addAuditLogEntry}
              />
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">User Management</h3>
                    <p className="text-gray-500">
                      User management features are coming soon.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audit">
              <AuditLog auditLog={auditLog} />
            </TabsContent>

            <TabsContent value="data">
              <DataManagement
                articles={articles}
                categories={categories}
                users={users}
                auditLog={auditLog}
                onDataImport={(data) => {
                  if (data.articles) setArticles(data.articles)
                  if (data.categories) setCategories(data.categories)
                  if (data.users) setUsers(data.users)
                  if (data.auditLog) setAuditLog(data.auditLog)
                }}
                onAuditLog={addAuditLogEntry}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  // Public view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img 
                src="/images/kuhlekt-logo.jpg" 
                alt="Kuhlekt" 
                className="h-8 w-auto"
              />
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <LoginModal onLogin={handleLogin} users={users} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Navigation */}
              <Navigation
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={handleCategorySelect}
                totalArticles={publishedArticles.length}
              />

              {/* Category Tree */}
              <CategoryTree
                categories={categories}
                articles={publishedArticles}
                selectedCategoryId={selectedCategoryId}
                onCategorySelect={handleCategorySelect}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedArticle ? (
              <ArticleViewer
                article={selectedArticle}
                categories={categories}
                onBack={handleBackToList}
              />
            ) : searchQuery ? (
              <SearchResults
                articles={filteredArticles}
                searchQuery={searchQuery}
                onArticleSelect={handleArticleSelect}
                categories={categories}
              />
            ) : selectedCategoryId ? (
              <SelectedArticles
                articles={filteredArticles}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onArticleSelect={handleArticleSelect}
              />
            ) : (
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to Kuhlekt Knowledge Base
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Your comprehensive resource for technical documentation, guides, and best practices. 
                    Explore our articles or use the search to find exactly what you need.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="flex items-center p-6">
                      <FileText className="h-8 w-8 text-blue-600 mr-4" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{publishedArticles.length}</p>
                        <p className="text-gray-600">Articles</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center p-6">
                      <BookOpen className="h-8 w-8 text-green-600 mr-4" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                        <p className="text-gray-600">Categories</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center p-6">
                      <Eye className="h-8 w-8 text-purple-600 mr-4" />
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {publishedArticles.reduce((sum, article) => sum + article.viewCount, 0).toLocaleString()}
                        </p>
                        <p className="text-gray-600">Total Views</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Featured Articles */}
                {featuredArticles.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {featuredArticles.map((article) => (
                        <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                            <CardDescription className="line-clamp-3">
                              {article.excerpt}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                              <span>{formatDate(article.updatedAt)}</span>
                              <span>{article.viewCount} views</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mb-4">
                              {article.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Button 
                              onClick={() => handleArticleSelect(article)}
                              className="w-full"
                            >
                              Read Article
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Articles */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Articles</h3>
                  <div className="space-y-4">
                    {publishedArticles
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .slice(0, 5)
                      .map((article) => (
                        <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 
                                  className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer"
                                  onClick={() => handleArticleSelect(article)}
                                >
                                  {article.title}
                                </h4>
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                  {article.excerpt}
                                </p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span>{formatDate(article.updatedAt)}</span>
                                  <span>{article.viewCount} views</span>
                                  {categories.find(c => c.id === article.categoryId) && (
                                    <span>
                                      {getCategoryPath(categories.find(c => c.id === article.categoryId)!, categories)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 ml-4">
                                {article.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
