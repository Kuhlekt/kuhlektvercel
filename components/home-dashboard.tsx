"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Users, FolderOpen, TrendingUp, Clock, Star, FileText, Activity, Plus } from "lucide-react"
import type { User, Category, Article } from "../types/knowledge-base"

interface HomeDashboardProps {
  categories?: Category[]
  articles?: Article[]
  users?: User[]
  currentUser?: User | null
  onArticleSelect?: (article: Article) => void
  onCategoryManage?: () => void
}

export function HomeDashboard({
  categories = [],
  articles = [],
  users = [],
  currentUser = null,
  onArticleSelect,
  onCategoryManage,
}: HomeDashboardProps) {
  // Safe array operations with fallbacks
  const totalCategories = categories?.length || 0
  const totalArticles = articles?.length || 0
  const totalUsers = users?.length || 0

  // Get recent articles (safely)
  const recentArticles =
    articles
      ?.filter((article) => article && article.updatedAt)
      ?.sort((a, b) => {
        const dateA = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt)
        const dateB = b.updatedAt instanceof Date ? b.updatedAt : new Date(b.updatedAt)
        return dateB.getTime() - dateA.getTime()
      })
      ?.slice(0, 5) || []

  // Get popular categories (categories with most articles)
  const popularCategories =
    categories
      ?.map((category) => ({
        ...category,
        articleCount: articles?.filter((article) => article?.categoryId === category?.id)?.length || 0,
      }))
      ?.sort((a, b) => (b.articleCount || 0) - (a.articleCount || 0))
      ?.slice(0, 5) || []

  // Get published vs draft counts
  const publishedCount = articles?.filter((article) => article?.status === "published")?.length || 0
  const draftCount = articles?.filter((article) => article?.status === "draft")?.length || 0

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <span>Welcome to Kuhlekt Knowledge Base</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            {currentUser
              ? `Welcome back, ${currentUser.username}! Here's an overview of your knowledge base.`
              : "Welcome to the knowledge base. Here's an overview of the current content."}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{totalArticles}</div>
              <div className="text-sm text-gray-600">Total Articles</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{totalCategories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{publishedCount}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{draftCount}</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Articles</span>
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Article
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {recentArticles.length > 0 ? (
                <div className="space-y-3">
                  {recentArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => onArticleSelect?.(article)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{article.title}</h4>
                        <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                          {article.content?.substring(0, 100)}...
                        </p>
                        <div className="flex items-center space-x-2">
                          <Badge variant={article.status === "published" ? "default" : "secondary"} className="text-xs">
                            {article.status}
                          </Badge>
                          <span className="text-xs text-gray-400">{article.createdBy}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 ml-2">
                        {article.updatedAt instanceof Date
                          ? article.updatedAt.toLocaleDateString()
                          : new Date(article.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No articles yet</p>
                  <p className="text-sm">Create your first article to get started</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Popular Categories */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Categories</span>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onCategoryManage}>
              <Plus className="h-4 w-4 mr-1" />
              Manage
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              {popularCategories.length > 0 ? (
                <div className="space-y-3">
                  {popularCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{category.name}</h4>
                        <p className="text-xs text-gray-500 line-clamp-1">{category.description || "No description"}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {category.articleCount || 0} articles
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No categories yet</p>
                  <p className="text-sm">Create categories to organize your content</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <FileText className="h-6 w-6" />
              <span>Create Article</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
              onClick={onCategoryManage}
            >
              <FolderOpen className="h-6 w-6" />
              <span>Manage Categories</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
            >
              <Users className="h-6 w-6" />
              <span>User Management</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
