"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Database, Activity, TrendingUp, Shield } from "lucide-react"
import { CategoryManagement } from "./category-management"
import { ArticleManagement } from "./article-management"
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import type { User, Category, AuditLogEntry } from "@/types/knowledge-base"

interface AdminDashboardProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: () => void
  onUsersUpdate: () => void
  onAuditLogUpdate: () => void
}

export function AdminDashboard({
  categories,
  users,
  auditLog,
  onCategoriesUpdate,
  onUsersUpdate,
  onAuditLogUpdate,
}: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalAuditEntries: 0,
    pageVisits: 0,
  })

  useEffect(() => {
    // Calculate stats whenever data changes
    const totalArticles = categories.reduce((total, category) => {
      const categoryArticles = category.articles?.length || 0
      const subcategoryArticles =
        category.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
      return total + categoryArticles + subcategoryArticles
    }, 0)

    const pageVisits = Number.parseInt(localStorage.getItem("kb_page_visits") || "0", 10)

    setStats({
      totalArticles,
      totalCategories: categories.length,
      totalUsers: users.length,
      totalAuditEntries: auditLog.length,
      pageVisits,
    })
  }, [categories, users, auditLog])

  const handleDataUpdate = () => {
    onCategoriesUpdate()
    onUsersUpdate()
    onAuditLogUpdate()
  }

  const recentActivity = auditLog.slice(0, 5).map((entry) => ({
    id: entry.id,
    action: entry.action,
    user: entry.username || entry.performedBy || "Unknown",
    target: entry.articleTitle || entry.categoryName || "Unknown",
    timestamp: entry.timestamp,
  }))

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "Unknown"

    try {
      const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleDateString()
      }
      return "Invalid Date"
    } catch {
      return "Invalid Date"
    }
  }

  const formatTime = (dateValue: any): string => {
    if (!dateValue) return "Unknown"

    try {
      const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue
      if (date instanceof Date && !isNaN(date.getTime())) {
        return date.toLocaleTimeString()
      }
      return "Invalid Time"
    } catch {
      return "Invalid Time"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage your knowledge base</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalArticles}</div>
                  <p className="text-xs text-muted-foreground">Across all categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCategories}</div>
                  <p className="text-xs text-muted-foreground">Knowledge base sections</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">Registered accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Visits</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pageVisits}</div>
                  <p className="text-xs text-muted-foreground">Total page views</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest actions performed in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between py-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">
                              {activity.action} - {activity.target}
                            </p>
                            <p className="text-xs text-gray-500">by {activity.user}</p>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{formatTime(activity.timestamp)}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoryManagement categories={categories} onCategoriesUpdate={onCategoriesUpdate} />
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles">
            <ArticleManagement categories={categories} onUpdate={onCategoriesUpdate} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UserManagementTable users={users} onUsersUpdate={onUsersUpdate} />
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <AuditLog auditLog={auditLog} onUpdate={onAuditLogUpdate} />
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data">
            <DataManagement onDataUpdate={handleDataUpdate} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
