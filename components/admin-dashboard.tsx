'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Users, Activity, TrendingUp, Calendar, Eye } from 'lucide-react'
import type { Article, Category, User, AuditLogEntry } from '@/types/knowledge-base'
import { formatDate } from '@/utils/article-utils'

interface AdminDashboardProps {
  articles: Article[]
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
}

export function AdminDashboard({ articles, categories, users, auditLog }: AdminDashboardProps) {
  const publishedArticles = articles.filter(a => a.status === 'published')
  const draftArticles = articles.filter(a => a.status === 'draft')
  const totalViews = articles.reduce((sum, article) => sum + article.viewCount, 0)
  const recentActivity = auditLog.slice(0, 5)

  const getTopArticles = () => {
    return publishedArticles
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 5)
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              {publishedArticles.length} published, {draftArticles.length} drafts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)} subcategories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all articles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.role === 'admin').length} admins, {users.filter(u => u.role === 'editor').length} editors
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions in the knowledge base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Activity className="h-4 w-4 text-blue-500 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {entry.userName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {entry.details}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(entry.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Articles */}
        <Card>
          <CardHeader>
            <CardTitle>Top Articles</CardTitle>
            <CardDescription>Most viewed articles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getTopArticles().map((article, index) => (
                <div key={article.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {article.title}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{article.viewCount} views</span>
                      <span>•</span>
                      <span>{formatDate(article.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
