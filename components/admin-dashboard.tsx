"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, FolderOpen, Activity, Settings, TrendingUp, Clock, Shield } from "lucide-react"
import { UserCreationForm } from "./user-creation-form"
import { UserManagementTable } from "./user-management-table"
import { CategoryManagement } from "./category-management"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { database } from "@/utils/database"
import type { User, Category, AuditLogEntry } from "@/types/knowledge-base"

interface AdminDashboardProps {
  currentUser?: User
  onLogout?: () => void
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [pageVisits, setPageVisits] = useState(0)
  const [loading, setLoading] = useState(true)

  // Ensure currentUser has a fallback
  const safeCurrentUser = currentUser || {
    id: "admin",
    username: "admin",
    email: "admin@kuhlekt.com",
    password: "admin123",
    role: "admin" as const,
    createdAt: new Date(),
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const data = database.loadData()

      setUsers(data.users || [])
      setCategories(data.categories || [])
      setAuditLog(data.auditLog || [])
      setPageVisits(data.pageVisits || 0)
    } catch (error) {
      console.error("Error loading admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = (userData: Omit<User, "id" | "createdAt">) => {
    try {
      const updatedUsers = database.addUser(users, userData)
      setUsers(updatedUsers)

      // Add audit log entry
      const updatedAuditLog = database.addAuditEntry(auditLog, {
        action: "CREATE_USER",
        performedBy: safeCurrentUser.username,
        details: `Created user: ${userData.username}`,
      })
      setAuditLog(updatedAuditLog)
    } catch (error) {
      console.error("Error creating user:", error)
    }
  }

  const handleDeleteUser = (userId: string) => {
    try {
      const userToDelete = users.find((u) => u.id === userId)
      if (!userToDelete) return

      const updatedUsers = database.deleteUser(users, userId)
      setUsers(updatedUsers)

      // Add audit log entry
      const updatedAuditLog = database.addAuditEntry(auditLog, {
        action: "DELETE_USER",
        performedBy: safeCurrentUser.username,
        details: `Deleted user: ${userToDelete.username}`,
      })
      setAuditLog(updatedAuditLog)
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const handleCategoryUpdate = () => {
    loadData() // Reload all data when categories are updated
  }

  // Calculate statistics
  const totalArticles = categories.reduce((total, cat) => {
    const categoryArticles = cat.articles?.length || 0
    const subcategoryArticles =
      cat.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
    return total + categoryArticles + subcategoryArticles
  }, 0)

  const recentActivity = auditLog.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
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
                <p className="text-sm text-gray-600">Kuhlekt Knowledge Base</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{safeCurrentUser.username}</p>
                <Badge variant="outline" className="text-xs">
                  {safeCurrentUser.role}
                </Badge>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">Active user accounts</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                  <p className="text-xs text-muted-foreground">Knowledge categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalArticles}</div>
                  <p className="text-xs text-muted-foreground">Published articles</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Visits</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pageVisits}</div>
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
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((entry) => (
                      <div key={entry.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {entry.action
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-500">
                            by {entry.performedBy} • {entry.details}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-xs text-gray-400">
                          {entry.timestamp instanceof Date
                            ? entry.timestamp.toLocaleDateString()
                            : new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <UserCreationForm onCreateUser={handleCreateUser} />
              </div>
              <div className="lg:col-span-2">
                <UserManagementTable users={users} currentUserId={safeCurrentUser.id} onDeleteUser={handleDeleteUser} />
              </div>
            </div>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <CategoryManagement categories={categories} onUpdate={handleCategoryUpdate} currentUser={safeCurrentUser} />
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit">
            <AuditLog auditLog={auditLog} />
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data">
            <DataManagement />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Database Status</h3>
                      <p className="text-sm text-gray-600">Local storage mode</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Page Visits Tracking</h3>
                      <p className="text-sm text-gray-600">Automatically track page visits</p>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Enabled
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">Audit Logging</h3>
                      <p className="text-sm text-gray-600">Track all user actions</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Enabled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
