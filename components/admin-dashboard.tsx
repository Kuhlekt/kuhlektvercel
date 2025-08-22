"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  FileText,
  Database,
  Activity,
  Settings,
  TrendingUp,
  Clock,
  Shield,
  AlertCircle,
} from "lucide-react"
import { CategoryManagement } from "./category-management"
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { database } from "@/utils/database"
import type { Category, User, AuditLogEntry } from "@/types/knowledge-base"

interface AdminDashboardProps {
  currentUser?: User
  onLogout?: () => void
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [pageVisits, setPageVisits] = useState(0)
  const [loading, setLoading] = useState(true)

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriesData, usersData, auditLogData] = await Promise.all([
        database.getCategories(),
        database.getUsers(),
        database.getAuditLog(),
      ])

      setCategories(categoriesData)
      setUsers(usersData)
      setAuditLog(auditLogData)

      // Get page visits from localStorage
      const visits = Number.parseInt(localStorage.getItem("kb_page_visits") || "0", 10)
      setPageVisits(visits)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalArticles = categories.reduce((total, category) => {
    const categoryArticles = category.articles?.length || 0
    const subcategoryArticles =
      category.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
    return total + categoryArticles + subcategoryArticles
  }, 0)

  const totalSubcategories = categories.reduce((total, category) => total + (category.subcategories?.length || 0), 0)

  const recentAuditEntries = auditLog.slice(0, 5)

  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return "Never"
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) return "Invalid Date"
      return dateObj.toLocaleDateString()
    } catch {
      return "Invalid Date"
    }
  }

  const formatDateTime = (date: Date | string | undefined): string => {
    if (!date) return "Never"
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      if (isNaN(dateObj.getTime())) return "Invalid Date"
      return dateObj.toLocaleString()
    } catch {
      return "Invalid Date"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Kuhlekt Knowledge Base Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser?.username || "Admin"}</p>
                <p className="text-xs text-gray-500">{currentUser?.role || "Administrator"}</p>
              </div>
              {onLogout && (
                <Button variant="outline" onClick={onLogout}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
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

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalArticles}</div>
                  <p className="text-xs text-muted-foreground">Across {categories.length} categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">{totalSubcategories} subcategories</p>
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
                    {users.filter((u) => u.role === "admin").length} admins
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Visits</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pageVisits}</div>
                  <p className="text-xs text-muted-foreground">Total visits</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>Latest actions in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAuditEntries.length > 0 ? (
                      recentAuditEntries.map((entry) => (
                        <div key={entry.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <Activity className="h-4 w-4 text-blue-500 mt-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                            <p className="text-sm text-gray-500">{entry.details}</p>
                            <p className="text-xs text-gray-400">
                              {formatDateTime(entry.timestamp)} by {entry.performedBy}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>System Status</span>
                  </CardTitle>
                  <CardDescription>Current system information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database Status</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Online
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage Type</span>
                      <Badge variant="outline">Local Storage</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Backup</span>
                      <span className="text-sm text-gray-500">Manual only</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Admin Users</span>
                      <span className="text-sm text-gray-900">{users.filter((u) => u.role === "admin").length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoryManagement
              categories={categories}
              onCategoriesUpdate={(newCategories) => {
                setCategories(newCategories)
                loadData() // Reload to get updated audit log
              }}
            />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UserManagementTable
              users={users}
              onUsersUpdate={(newUsers) => {
                setUsers(newUsers)
                loadData() // Reload to get updated audit log
              }}
            />
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <AuditLog auditLog={auditLog} />
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data">
            <DataManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
