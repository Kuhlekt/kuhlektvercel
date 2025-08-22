"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CategoryManagement } from "./category-management"
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { Users, FileText, FolderOpen, Activity, Database, BarChart3 } from "lucide-react"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface AdminDashboardProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: () => void
  onUsersUpdate: () => void
  onAuditLogUpdate: () => void
}

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

    return dateObj.toLocaleDateString()
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date Error"
  }
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
  const stats = useMemo(() => {
    let totalArticles = 0
    let totalSubcategories = 0

    categories.forEach((category) => {
      if (category.articles) {
        totalArticles += category.articles.length
      }
      if (category.subcategories) {
        totalSubcategories += category.subcategories.length
        category.subcategories.forEach((sub) => {
          if (sub.articles) {
            totalArticles += sub.articles.length
          }
        })
      }
    })

    const recentActivity = auditLog.slice(0, 5)
    const todayEntries = auditLog.filter((entry) => {
      try {
        const entryDate = new Date(entry.timestamp)
        const today = new Date()
        return entryDate.toDateString() === today.toDateString()
      } catch {
        return false
      }
    })

    return {
      totalCategories: categories.length,
      totalSubcategories,
      totalArticles,
      totalUsers: users.length,
      totalAuditEntries: auditLog.length,
      todayActivity: todayEntries.length,
      recentActivity,
    }
  }, [categories, users, auditLog])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage your knowledge base content, users, and system settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalArticles}</div>
                <p className="text-xs text-muted-foreground">Across {stats.totalCategories} categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCategories}</div>
                <p className="text-xs text-muted-foreground">{stats.totalSubcategories} subcategories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayActivity}</div>
                <p className="text-xs text-muted-foreground">Actions performed today</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest actions performed in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentActivity.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between border-b pb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {entry.action.replace(/_/g, " ").toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{entry.performedBy}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.details || `${entry.action} performed`}</p>
                      </div>
                      <div className="text-xs text-gray-500">{formatDateTime(entry.timestamp)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </CardContent>
          </Card>

          {/* System Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Audit Entries:</span>
                  <span className="text-sm font-medium">{stats.totalAuditEntries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Database Status:</span>
                  <Badge variant="outline" className="text-green-600">
                    Connected
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Updated:</span>
                  <span className="text-sm font-medium">{formatDateTime(new Date())}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Content Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Articles per Category:</span>
                  <span className="text-sm font-medium">
                    {stats.totalCategories > 0 ? Math.round(stats.totalArticles / stats.totalCategories) : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Categories with Subcategories:</span>
                  <span className="text-sm font-medium">
                    {categories.filter((cat) => cat.subcategories && cat.subcategories.length > 0).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Empty Categories:</span>
                  <span className="text-sm font-medium">
                    {
                      categories.filter(
                        (cat) =>
                          (!cat.articles || cat.articles.length === 0) &&
                          (!cat.subcategories || cat.subcategories.length === 0),
                      ).length
                    }
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={categories} onUpdate={onCategoriesUpdate} />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTable users={users} onUpdate={onUsersUpdate} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog auditLog={auditLog} onUpdate={onAuditLogUpdate} />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement onDataUpdate={onAuditLogUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
