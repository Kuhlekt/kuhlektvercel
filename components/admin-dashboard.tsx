"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddArticleForm } from "./add-article-form"
import { UserCreationForm } from "./user-creation-form"
import { UserManagementTable } from "./user-management-table"
import { ArticleManagement } from "./article-management"
import { AuditLog } from "./audit-log"
import { Plus, Users, FileText, BarChart3, Activity } from 'lucide-react'
import type { Category, Article, User, AuditLogEntry } from "../types/knowledge-base"
import { calculateTotalArticles, getArticleStats } from "../utils/article-utils"

interface AdminDashboardProps {
  categories: Category[]
  users: User[]
  currentUser: User
  auditLog: AuditLogEntry[]
  onAddArticle: (article: Omit<Article, "id" | "createdAt" | "updatedAt">) => void
  onEditArticle: (article: Article) => void
  onDeleteArticle: (articleId: string) => void
  onCreateUser: (userData: Omit<User, "id" | "createdAt" | "lastLogin">) => void
  onDeleteUser: (userId: string) => void
  onBack: () => void
}

export function AdminDashboard({
  categories,
  users,
  currentUser,
  auditLog,
  onAddArticle,
  onEditArticle,
  onDeleteArticle,
  onCreateUser,
  onDeleteUser,
  onBack,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate stats using memoization for performance
  const stats = useMemo(() => getArticleStats(categories), [categories])

  const recentArticles = useMemo(() => {
    return categories
      .flatMap((cat) => [...cat.articles, ...cat.subcategories.flatMap((sub) => sub.articles)])
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
  }, [categories])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentUser.username}</p>
        </div>
        <Button variant="outline" onClick={onBack}>
          Back to Knowledge Base
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Articles</span>
          </TabsTrigger>
          <TabsTrigger value="add-article" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Article</span>
          </TabsTrigger>
          <TabsTrigger value="audit-log" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Audit Log</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="create-user" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create User</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCategories}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.categoriesWithArticles} with articles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalArticles}</div>
                <p className="text-xs text-muted-foreground">
                  Across all categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subcategories</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSubcategories}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.subcategoriesWithArticles} with articles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active system users
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
              </CardHeader>
              <CardContent>
                {recentArticles.length > 0 ? (
                  <div className="space-y-2">
                    {recentArticles.map((article) => (
                      <div key={article.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-gray-600">Created: {article.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No articles yet</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Articles per Category</span>
                    <span className="font-medium">
                      {stats.totalCategories > 0 ? (stats.totalArticles / stats.totalCategories).toFixed(1) : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Categories with Content</span>
                    <span className="font-medium">
                      {stats.categoriesWithArticles}/{stats.totalCategories}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Recent Activity</span>
                    <span className="font-medium">
                      {auditLog.filter(entry => {
                        const dayAgo = new Date()
                        dayAgo.setDate(dayAgo.getDate() - 1)
                        return entry.timestamp > dayAgo
                      }).length} actions today
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <ArticleManagement categories={categories} onEditArticle={onEditArticle} onDeleteArticle={onDeleteArticle} />
        </TabsContent>

        <TabsContent value="add-article">
          <AddArticleForm
            categories={categories}
            onAddArticle={onAddArticle}
            onCancel={() => setActiveTab("overview")}
          />
        </TabsContent>

        <TabsContent value="audit-log">
          <AuditLog auditLog={auditLog} />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTable users={users} currentUserId={currentUser.id} onDeleteUser={onDeleteUser} />
        </TabsContent>

        <TabsContent value="create-user">
          <UserCreationForm onCreateUser={onCreateUser} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
