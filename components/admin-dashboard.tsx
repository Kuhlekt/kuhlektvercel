"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, FileText, Folder, Eye, Activity, Settings } from "lucide-react"
import { CategoryManagement } from "./category-management"
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface AdminDashboardProps {
  categories: Category[]
  articles: any[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
  onDataUpdate: () => void
  onBack: () => void
  currentUser: User
}

export function AdminDashboard({
  categories = [],
  articles = [],
  users = [],
  auditLog = [],
  pageVisits = 0,
  onDataUpdate,
  onBack,
  currentUser,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Safe array handling
  const safeCategories = Array.isArray(categories) ? categories : []
  const safeArticles = Array.isArray(articles) ? articles : []
  const safeUsers = Array.isArray(users) ? users : []
  const safeAuditLog = Array.isArray(auditLog) ? auditLog : []

  // Calculate stats
  const totalArticles = safeArticles.length
  const totalCategories = safeCategories.length
  const totalUsers = safeUsers.length
  const totalViews = safeArticles.reduce((sum, article) => sum + (article.views || 0), 0)
  const publishedArticles = safeArticles.filter((article) => article.isPublished).length
  const draftArticles = totalArticles - publishedArticles
  const activeUsers = safeUsers.filter((user) => user.isActive).length

  // Recent activity (last 10 entries)
  const recentActivity = safeAuditLog
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Browse</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Settings className="h-8 w-8 mr-3" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600">Manage your knowledge base</p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          Logged in as {currentUser.username}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalArticles}</div>
                <p className="text-xs text-muted-foreground">
                  {publishedArticles} published, {draftArticles} drafts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Folder className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCategories}</div>
                <p className="text-xs text-muted-foreground">Organized content structure</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">{activeUsers} active users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalViews + pageVisits}</div>
                <p className="text-xs text-muted-foreground">{pageVisits} page visits</p>
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
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{entry.details}</p>
                        <p className="text-xs text-gray-500">
                          by {entry.performedBy} • {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.action.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={safeCategories} onDataUpdate={onDataUpdate} currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTable users={safeUsers} onDataUpdate={onDataUpdate} currentUser={currentUser} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog auditLog={safeAuditLog} />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement onDataUpdate={onDataUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
