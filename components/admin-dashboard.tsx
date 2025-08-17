"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Activity, Database } from "lucide-react"

import { ArticleManagement } from "./article-management"
import { CategoryManagement } from "./category-management"
import { UserManagement } from "./user-management"
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your knowledge base content and users</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Administrator
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                <p className="text-xs text-muted-foreground">
                  {categories.reduce((total, cat) => total + cat.subcategories.length, 0)} subcategories
                </p>
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
                  {users.filter((u) => u.role === "admin").length} admins,{" "}
                  {users.filter((u) => u.role === "editor").length} editors
                </p>
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

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions performed in the knowledge base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getRecentActivity().map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="text-sm font-medium">
                        {entry.action.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-gray-500">
                        {entry.articleTitle && `Article: ${entry.articleTitle}`}
                        {entry.categoryName && ` in ${entry.categoryName}`}
                        {entry.subcategoryName && ` > ${entry.subcategoryName}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{entry.performedBy}</p>
                      <p className="text-xs text-gray-400">{entry.timestamp.toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {auditLog.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No activity recorded yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <ArticleManagement
            categories={categories}
            onCategoriesUpdate={onCategoriesUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement
            categories={categories}
            onCategoriesUpdate={onCategoriesUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
          />
        </TabsContent>

        <TabsContent value="users">
          <UserManagement users={users} onUsersUpdate={onUsersUpdate} onAuditLogUpdate={onAuditLogUpdate} />
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
