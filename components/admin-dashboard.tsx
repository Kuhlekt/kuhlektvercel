"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, FolderOpen, TrendingUp, Clock, Eye, Plus, Settings, BarChart3 } from "lucide-react"
import type { Article, User, Category, AuditLogEntry } from "../types/knowledge-base"
import { AddArticleForm } from "./add-article-form"
import { UserManagement } from "./user-management"
import { CategoryManagement } from "./category-management"
import { AuditLog } from "./audit-log"

interface AdminDashboardProps {
  articles: Article[]
  users: User[]
  categories: Category[]
  auditLog: AuditLogEntry[]
  onAddArticle: (article: Omit<Article, "id" | "createdAt" | "updatedAt" | "views">) => void
  onCategoriesUpdate: (categories: Category[]) => void
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function AdminDashboard({
  articles,
  users,
  categories,
  auditLog,
  onAddArticle,
  onCategoriesUpdate,
  onUsersUpdate,
  onAuditLogUpdate,
}: AdminDashboardProps) {
  const [showAddArticle, setShowAddArticle] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const publishedArticles = articles.filter((a) => a.isPublished)
  const draftArticles = articles.filter((a) => !a.isPublished)
  const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0)
  const recentArticles = articles
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
  const recentActivity = auditLog
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  const stats = [
    {
      title: "Total Articles",
      value: articles.length,
      description: `${publishedArticles.length} published, ${draftArticles.length} drafts`,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Categories",
      value: categories.length,
      description: `${categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)} subcategories`,
      icon: FolderOpen,
      color: "text-green-600",
    },
    {
      title: "Users",
      value: users.length,
      description: `${users.filter((u) => u.role === "admin").length} admins, ${users.filter((u) => u.role === "editor").length} editors`,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      description: "Across all articles",
      icon: Eye,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your knowledge base.</p>
        </div>
        <Button onClick={() => setShowAddArticle(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Article
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recent Articles
            </CardTitle>
            <CardDescription>Latest articles in your knowledge base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{article.title}</p>
                      <p className="text-xs text-muted-foreground">
                        by {article.author} • {new Date(article.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={article.isPublished ? "default" : "secondary"}>
                        {article.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {article.views || 0}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No articles yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest actions in your knowledge base</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    <div className="space-y-1 flex-1">
                      <p className="text-sm">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">
                        by {entry.user} • {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => setShowAddArticle(true)}
            >
              <Plus className="h-6 w-6" />
              <span>Add Article</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => setActiveTab("users")}
            >
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => setActiveTab("categories")}
            >
              <FolderOpen className="h-6 w-6" />
              <span>Manage Categories</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col gap-2 bg-transparent"
              onClick={() => setActiveTab("activity")}
            >
              <Clock className="h-6 w-6" />
              <span>View Activity Log</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <TrendingUp className="h-6 w-6" />
              <span>View Trends</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent">
              <BarChart3 className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Add Article Modal */}
      <AddArticleForm
        isOpen={showAddArticle}
        onClose={() => setShowAddArticle(false)}
        onSubmit={onAddArticle}
        categories={categories}
      />

      {/* Tabs Content */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-medium text-sm">{entry.action}</div>
                      <div className="text-xs text-gray-500">by {entry.user}</div>
                    </div>
                    <div className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleDateString()}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <div className={activeTab === "users" ? "" : "hidden"}>
        <UserManagement
          users={users}
          onUsersUpdate={onUsersUpdate}
          onAuditLogUpdate={onAuditLogUpdate}
          auditLog={auditLog}
        />
      </div>

      {/* Category Management */}
      <div className={activeTab === "categories" ? "" : "hidden"}>
        <CategoryManagement
          categories={categories}
          onCategoriesUpdate={onCategoriesUpdate}
          onAuditLogUpdate={onAuditLogUpdate}
          auditLog={auditLog}
        />
      </div>

      {/* Audit Log */}
      <div className={activeTab === "activity" ? "" : "hidden"}>
        <AuditLog auditLog={auditLog} />
      </div>
    </div>
  )
}
