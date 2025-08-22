"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Activity, Database, Settings, BarChart3 } from "lucide-react"
import { CategoryManagement } from "./category-management"
import { ArticleManagement } from "./article-management"
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"

interface AdminDashboardProps {
  currentUser: {
    id: string
    username: string
    role: string
  }
  onLogout: () => void
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {currentUser.username}
                <Badge variant="secondary" className="ml-2">
                  {currentUser.role}
                </Badge>
              </p>
            </div>
            <button onClick={onLogout} className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Articles
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Audit Log
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">Across all categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">Including subcategories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Page Visits</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">--</div>
                  <p className="text-xs text-muted-foreground">Total visits</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <button
                  onClick={() => setActiveTab("categories")}
                  className="p-4 text-left border rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">Manage Categories</div>
                  <div className="text-sm text-muted-foreground">Add, edit, or organize categories</div>
                </button>

                <button
                  onClick={() => setActiveTab("articles")}
                  className="p-4 text-left border rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">Create Article</div>
                  <div className="text-sm text-muted-foreground">Add new knowledge base content</div>
                </button>

                <button
                  onClick={() => setActiveTab("users")}
                  className="p-4 text-left border rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">User Management</div>
                  <div className="text-sm text-muted-foreground">Manage user accounts and permissions</div>
                </button>

                <button
                  onClick={() => setActiveTab("audit")}
                  className="p-4 text-left border rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">View Activity</div>
                  <div className="text-sm text-muted-foreground">Check recent system activity</div>
                </button>

                <button
                  onClick={() => setActiveTab("data")}
                  className="p-4 text-left border rounded-lg hover:bg-gray-50"
                >
                  <div className="font-medium">Backup Data</div>
                  <div className="text-sm text-muted-foreground">Export or import knowledge base</div>
                </button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="articles">
            <ArticleManagement currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagementTable currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLog />
          </TabsContent>

          <TabsContent value="data">
            <DataManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
