"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  FileText,
  Database,
  Activity,
  Settings,
  Shield,
  TrendingUp,
  Clock,
  Eye,
  Edit3,
  UserPlus,
  FolderPlus,
  HardDrive,
} from "lucide-react"
import { CategoryManagement } from "./category-management"
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface AdminDashboardProps {
  categories?: Category[]
  users?: User[]
  auditLog?: AuditLogEntry[]
  currentUser?: User | null
  onCategoriesUpdate?: (categories: Category[]) => void
  onUsersUpdate?: (users: User[]) => void
  onAuditLogUpdate?: (auditLog: AuditLogEntry[]) => void
}

export function AdminDashboard({
  categories = [],
  users = [],
  auditLog = [],
  currentUser = null,
  onCategoriesUpdate,
  onUsersUpdate,
  onAuditLogUpdate,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    totalUsers: 0,
    recentActivity: 0,
    pageViews: 0,
  })

  // Calculate statistics
  useEffect(() => {
    const totalArticles = categories.reduce((total, category) => {
      const categoryArticles = category.articles?.length || 0
      const subcategoryArticles =
        category.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
      return total + categoryArticles + subcategoryArticles
    }, 0)

    const totalSubcategories = categories.reduce((total, category) => total + (category.subcategories?.length || 0), 0)

    const recentActivity = auditLog.filter(
      (entry) => new Date(entry.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000),
    ).length

    const pageViews =
      typeof window !== "undefined" ? Number.parseInt(localStorage.getItem("kb_page_visits") || "0", 10) : 0

    setStats({
      totalArticles,
      totalCategories: categories.length,
      totalSubcategories,
      totalUsers: users.length,
      recentActivity,
      pageViews,
    })
  }, [categories, users, auditLog])

  const recentAuditEntries = auditLog.slice(0, 5)

  const statCards = [
    {
      title: "Total Articles",
      value: stats.totalArticles,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Published articles",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Database,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Main categories",
    },
    {
      title: "Subcategories",
      value: stats.totalSubcategories,
      icon: FolderPlus,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Sub-categories",
    },
    {
      title: "Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Registered users",
    },
    {
      title: "Page Views",
      value: stats.pageViews,
      icon: Eye,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Total page views",
    },
    {
      title: "Recent Activity",
      value: stats.recentActivity,
      icon: Activity,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Last 24 hours",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser?.username || "Admin"}. Manage your knowledge base.
          </p>
        </div>
        {currentUser && (
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {currentUser.role}
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Categories
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
            <HardDrive className="h-4 w-4" />
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest actions in your knowledge base</CardDescription>
              </CardHeader>
              <CardContent>
                {recentAuditEntries.length > 0 ? (
                  <div className="space-y-3">
                    {recentAuditEntries.map((entry) => (
                      <div key={entry.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                        <div className="flex-shrink-0">
                          {entry.action.includes("CREATE") && (
                            <div className="p-1 rounded-full bg-green-100">
                              <UserPlus className="h-3 w-3 text-green-600" />
                            </div>
                          )}
                          {entry.action.includes("UPDATE") && (
                            <div className="p-1 rounded-full bg-blue-100">
                              <Edit3 className="h-3 w-3 text-blue-600" />
                            </div>
                          )}
                          {entry.action.includes("DELETE") && (
                            <div className="p-1 rounded-full bg-red-100">
                              <FileText className="h-3 w-3 text-red-600" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {entry.articleTitle || entry.details || "System Action"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.action.replace(/_/g, " ").toLowerCase()} by {entry.performedBy}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setActiveTab("categories")}
                >
                  <FolderPlus className="h-4 w-4 mr-2" />
                  Manage Categories
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setActiveTab("users")}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Manage Users
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setActiveTab("data")}
                >
                  <HardDrive className="h-4 w-4 mr-2" />
                  Backup Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => setActiveTab("audit")}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  View Audit Log
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current system information and health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Database</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Connected
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stats.totalArticles + stats.totalCategories + stats.totalUsers} total records
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Storage</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Local Storage
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Browser storage active</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Backup</span>
                    <Badge variant="outline">Manual</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Use Data tab to create backups</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement
            categories={categories}
            currentUser={currentUser}
            onCategoriesUpdate={onCategoriesUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTable
            users={users}
            currentUser={currentUser}
            onUsersUpdate={onUsersUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
          />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog auditLog={auditLog} />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
