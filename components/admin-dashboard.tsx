"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CategoryManagement } from "./category-management"
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { BarChart3, Users, FileText, Activity, Database, Settings } from "lucide-react"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

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
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate statistics
  const totalCategories = categories.length
  const totalSubcategories = categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)
  const totalArticles = categories.reduce((sum, cat) => {
    const categoryArticles = cat.articles?.length || 0
    const subcategoryArticles = cat.subcategories?.reduce((subSum, sub) => subSum + (sub.articles?.length || 0), 0) || 0
    return sum + categoryArticles + subcategoryArticles
  }, 0)
  const totalUsers = users.length
  const totalAuditEntries = auditLog.length

  // Recent activity (last 10 entries)
  const recentActivity = auditLog.slice(0, 10)

  // User role distribution
  const userRoles = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Helper function to safely format dates
  const formatDateTime = (date: any): string => {
    try {
      if (!date) return "Unknown"

      let dateObj: Date
      if (date instanceof Date) {
        dateObj = date
      } else if (typeof date === "string") {
        dateObj = new Date(date)
      } else {
        return "Invalid Date"
      }

      if (isNaN(dateObj.getTime())) {
        return "Invalid Date"
      }

      return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString()
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Date Error"
    }
  }

  const handleDataUpdate = async () => {
    console.log("Admin dashboard triggering data update...")
    await onCategoriesUpdate()
    await onUsersUpdate()
    await onAuditLogUpdate()
    console.log("Admin dashboard data update completed")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage your knowledge base content, users, and system settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Audit Log</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCategories}</div>
                <p className="text-xs text-muted-foreground">{totalSubcategories} subcategories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalArticles}</div>
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <div className="flex space-x-1 mt-1">
                  {Object.entries(userRoles).map(([role, count]) => (
                    <Badge key={role} variant="secondary" className="text-xs">
                      {count} {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Audit Entries</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAuditEntries}</div>
                <p className="text-xs text-muted-foreground">Total system activities</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                      <div className="flex-shrink-0">
                        <Activity className="h-4 w-4 text-blue-500 mt-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {entry.action.replace(/_/g, " ").toUpperCase()}
                          </Badge>
                          <span className="text-sm text-gray-500">by {entry.performedBy}</span>
                        </div>
                        <p className="text-sm text-gray-900 mt-1">{entry.details}</p>
                        {entry.articleTitle && (
                          <p className="text-xs text-gray-500 mt-1">Article: {entry.articleTitle}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{formatDateTime(entry.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </CardContent>
          </Card>

          {/* Category Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Category Overview</CardTitle>
              <CardDescription>Articles distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length > 0 ? (
                <div className="space-y-4">
                  {categories.map((category) => {
                    const categoryArticles = category.articles?.length || 0
                    const subcategoryArticles =
                      category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0
                    const totalCategoryArticles = categoryArticles + subcategoryArticles

                    return (
                      <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{category.name}</h4>
                          <p className="text-sm text-gray-500">{category.description}</p>
                          {category.subcategories && category.subcategories.length > 0 && (
                            <p className="text-xs text-gray-400 mt-1">{category.subcategories.length} subcategories</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{totalCategoryArticles}</div>
                          <div className="text-xs text-gray-500">articles</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No categories found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={categories} onCategoriesUpdate={onCategoriesUpdate} />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTable users={users} onUsersUpdate={onUsersUpdate} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog auditLog={auditLog} onAuditLogUpdate={onAuditLogUpdate} />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement onDataUpdate={handleDataUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
