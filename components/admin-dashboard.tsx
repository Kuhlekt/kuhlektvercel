"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Activity, Database, TrendingUp, Clock } from "lucide-react"
import { ArticleManagement } from "./article-management"
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
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

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
      const subcategoryArticles = Array.isArray(category.subcategories)
        ? category.subcategories.reduce(
            (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
            0,
          )
        : 0
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  const getRecentActivity = () => {
    return auditLog.slice(0, 5)
  }

  const getTopCategories = () => {
    return categories
      .map((category) => ({
        name: category.name,
        articleCount:
          (Array.isArray(category.articles) ? category.articles.length : 0) +
          (Array.isArray(category.subcategories)
            ? category.subcategories.reduce(
                (total, sub) => total + (Array.isArray(sub.articles) ? sub.articles.length : 0),
                0,
              )
            : 0),
      }))
      .sort((a, b) => b.articleCount - a.articleCount)
      .slice(0, 5)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your knowledge base content and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
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
                <div className="text-2xl font-bold">{getTotalArticles()}</div>
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground">Main categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditLog.length}</div>
                <p className="text-xs text-muted-foreground">Total audit entries</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>Latest actions in the knowledge base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getRecentActivity().map((entry) => (
                    <div key={entry.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Activity className="h-4 w-4 text-gray-400 mt-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{entry.action.replace("_", " ")}</p>
                        <p className="text-sm text-gray-500">{entry.details}</p>
                        <p className="text-xs text-gray-400">
                          {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {auditLog.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Top Categories</span>
                </CardTitle>
                <CardDescription>Categories with the most articles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getTopCategories().map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Badge variant="outline">{index + 1}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{category.name}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{category.articleCount} articles</Badge>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No categories yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="articles">
          <ArticleManagement
            categories={categories}
            onCategoriesUpdate={onCategoriesUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserManagementTable users={users} onUsersUpdate={onUsersUpdate} />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog auditLog={auditLog} />
        </TabsContent>

        <TabsContent value="data">
          <DataManagement
            categories={categories}
            users={users}
            auditLog={auditLog}
            onCategoriesUpdate={onCategoriesUpdate}
            onUsersUpdate={onUsersUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
