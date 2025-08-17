"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, FileText, Activity, Database, Settings, Shield } from "lucide-react"
import { UserManagement } from "./user-management"
import { DataManagement } from "./data-management"
import { AuditLog } from "./audit-log"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface AdminDashboardProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: (categories: Category[]) => void
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
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
  const totalArticles = categories.reduce((total, category) => {
    const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
    const subcategoryArticles = Array.isArray(category.subcategories)
      ? category.subcategories.reduce(
          (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
          0,
        )
      : 0
    return total + categoryArticles + subcategoryArticles
  }, 0)

  const totalCategories = categories.length
  const totalSubcategories = categories.reduce(
    (total, category) => total + (Array.isArray(category.subcategories) ? category.subcategories.length : 0),
    0,
  )

  const adminUsers = users.filter((user) => user.role === "admin").length
  const editorUsers = users.filter((user) => user.role === "editor").length
  const viewerUsers = users.filter((user) => user.role === "viewer").length

  const recentAuditEntries = auditLog.slice(0, 5)

  const handleDataImported = () => {
    // Refresh all data after import
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your knowledge base system</p>
        </div>
        <Badge variant="outline" className="flex items-center space-x-1">
          <Shield className="h-3 w-3" />
          <span>Administrator</span>
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Data</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Audit Log</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCategories}</div>
                <p className="text-xs text-muted-foreground">{totalSubcategories} subcategories</p>
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
                  {adminUsers} admin, {editorUsers} editor, {viewerUsers} viewer
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Audit Entries</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditLog.length}</div>
                <p className="text-xs text-muted-foreground">Total logged actions</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              {recentAuditEntries.length > 0 ? (
                <div className="space-y-3">
                  {recentAuditEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {entry.action.replace("_", " ").toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{entry.performedBy}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" onClick={() => setActiveTab("users")} className="h-auto p-4">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Manage Users</div>
                    <div className="text-sm text-gray-600">Add, edit, or remove users</div>
                  </div>
                </Button>

                <Button variant="outline" onClick={() => setActiveTab("data")} className="h-auto p-4">
                  <div className="text-center">
                    <Database className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">Import/Export</div>
                    <div className="text-sm text-gray-600">Backup and restore data</div>
                  </div>
                </Button>

                <Button variant="outline" onClick={() => setActiveTab("audit")} className="h-auto p-4">
                  <div className="text-center">
                    <Activity className="h-6 w-6 mx-auto mb-2" />
                    <div className="font-medium">View Audit Log</div>
                    <div className="text-sm text-gray-600">Track system changes</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement users={users} onUsersUpdate={onUsersUpdate} />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement onDataImported={handleDataImported} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog auditLog={auditLog} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
