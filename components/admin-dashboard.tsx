"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart3,
  Users,
  FileText,
  Activity,
  Database,
  Settings,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from "lucide-react"
import { UserManagementTable } from "./user-management-table"
import { CategoryManagement } from "./category-management"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"
import { database } from "../utils/database"
import { calculateTotalArticles } from "../utils/article-utils"

// Safe date formatting function
const formatDateTime = (timestamp: any): string => {
  try {
    if (!timestamp) return "Unknown"

    let date: Date
    if (timestamp instanceof Date) {
      date = timestamp
    } else if (typeof timestamp === "string" || typeof timestamp === "number") {
      date = new Date(timestamp)
    } else {
      return "Invalid Date"
    }

    if (isNaN(date.getTime())) {
      return "Invalid Date"
    }

    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  } catch (error) {
    console.error("Date formatting error:", error)
    return "Invalid Date"
  }
}

const formatDate = (timestamp: any): string => {
  try {
    if (!timestamp) return "Unknown"

    let date: Date
    if (timestamp instanceof Date) {
      date = timestamp
    } else if (typeof timestamp === "string" || typeof timestamp === "number") {
      date = new Date(timestamp)
    } else {
      return "Invalid Date"
    }

    if (isNaN(date.getTime())) {
      return "Invalid Date"
    }

    return date.toLocaleDateString()
  } catch (error) {
    console.error("Date formatting error:", error)
    return "Invalid Date"
  }
}

export function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [pageVisits, setPageVisits] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [categoriesData, usersData, auditLogData] = await Promise.all([
        database.getCategories(),
        database.getUsers(),
        database.getAuditLog(),
      ])

      // Get page visits from localStorage
      const visits = Number.parseInt(localStorage.getItem("kb_page_visits") || "0", 10)

      setCategories(categoriesData)
      setUsers(usersData)
      setAuditLog(auditLogData)
      setPageVisits(visits)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Failed to load admin data:", err)
      setError("Failed to load dashboard data. Please try refreshing the page.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDataUpdate = () => {
    loadData()
  }

  const handleRefresh = () => {
    loadData()
  }

  // Calculate statistics
  const totalArticles = calculateTotalArticles(categories)
  const totalCategories = categories.length
  const totalSubcategories = categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.isActive !== false).length
  const adminUsers = users.filter((user) => user.role === "admin").length
  const recentAuditEntries = auditLog.slice(0, 10)

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentActivity = auditLog.filter((entry) => {
    try {
      const entryDate = new Date(entry.timestamp)
      return entryDate >= sevenDaysAgo
    } catch {
      return false
    }
  }).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your knowledge base system</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last updated: {formatDateTime(lastUpdated)}</span>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              Across {totalCategories} categories and {totalSubcategories} subcategories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {activeUsers} active • {adminUsers} admins
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Visits</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pageVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivity}</div>
            <p className="text-xs text-muted-foreground">Actions in last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>Latest actions performed in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAuditEntries.length > 0 ? (
            <div className="space-y-3">
              {recentAuditEntries.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {entry.action.toLowerCase().includes("create") && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {entry.action.toLowerCase().includes("update") && <RefreshCw className="h-4 w-4 text-blue-500" />}
                      {entry.action.toLowerCase().includes("delete") && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                      {!entry.action.toLowerCase().includes("create") &&
                        !entry.action.toLowerCase().includes("update") &&
                        !entry.action.toLowerCase().includes("delete") && (
                          <Activity className="h-4 w-4 text-gray-500" />
                        )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-gray-500">by {entry.performedBy || entry.username || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatDateTime(entry.timestamp)}</p>
                    {entry.details && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {entry.details.length > 30 ? entry.details.substring(0, 30) + "..." : entry.details}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Categories</span>
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

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <UserManagementTable users={users} onUsersUpdate={handleDataUpdate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>Organize and manage knowledge base categories</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManagement categories={categories} onCategoriesUpdate={handleDataUpdate} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track all system activities and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <AuditLog auditLog={auditLog} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <DataManagement onDataUpdate={handleDataUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
