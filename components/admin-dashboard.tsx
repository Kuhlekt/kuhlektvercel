"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CategoryManagement } from "./category-management"
import { ArticleManagement } from "./article-management"
import { UserManagementTable } from "./user-management-table"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { Settings, Users, FileText, FolderTree, Activity, Database } from "lucide-react"
import type { Category, User, AuditLogEntry, Article } from "../types/knowledge-base"
import { calculateTotalArticles } from "../utils/article-utils"

interface AdminDashboardProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: () => void
  onUsersUpdate: () => void
  onAuditLogUpdate: () => void
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
  const totalArticles = calculateTotalArticles(categories)
  const totalCategories = categories.length
  const totalSubcategories = categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)
  const totalUsers = users.length
  const recentAuditEntries = auditLog.slice(0, 5)

  // Handle data updates - this will refresh all data
  const handleDataUpdate = () => {
    onCategoriesUpdate()
    onUsersUpdate()
    onAuditLogUpdate()
  }

  // Handle edit article
  const handleEditArticle = (article: Article) => {
    // This would typically open an edit modal or navigate to edit page
    console.log("Edit article:", article)
  }

  // Handle delete article
  const handleDeleteArticle = (articleId: string) => {
    // This would typically call an API to delete the article
    console.log("Delete article:", articleId)
    onCategoriesUpdate() // Refresh categories after deletion
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your knowledge base content, users, and settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <FolderTree className="h-4 w-4" />
            <span className="hidden sm:inline">Categories</span>
          </TabsTrigger>
          <TabsTrigger value="articles" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Articles</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Audit Log</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Data</span>
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
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <FolderTree className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCategories}</div>
                <p className="text-xs text-muted-foreground">{totalSubcategories} subcategories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <p className="text-xs text-muted-foreground">Registered users</p>
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
            </CardHeader>
            <CardContent>
              {recentAuditEntries.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentAuditEntries.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{entry.action}</Badge>
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
              )}
            </CardContent>
          </Card>

          {/* Category Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Category Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No categories created yet</p>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => {
                    const categoryArticles = category.articles?.length || 0
                    const subcategoryArticles =
                      category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) || 0
                    const totalCategoryArticles = categoryArticles + subcategoryArticles

                    return (
                      <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{category.name}</span>
                          {category.description && <p className="text-sm text-gray-600">{category.description}</p>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{totalCategoryArticles} articles</Badge>
                          <Badge variant="outline">{category.subcategories?.length || 0} subcategories</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <CategoryManagement categories={categories} onCategoriesUpdate={onCategoriesUpdate} />
        </TabsContent>

        {/* Articles Tab */}
        <TabsContent value="articles">
          <ArticleManagement
            categories={categories}
            onEditArticle={handleEditArticle}
            onDeleteArticle={handleDeleteArticle}
          />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <UserManagementTable users={users} onUsersUpdate={onUsersUpdate} />
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit">
          <AuditLog auditLog={auditLog} onAuditLogUpdate={onAuditLogUpdate} />
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data">
          <DataManagement categories={categories} users={users} auditLog={auditLog} onDataUpdate={handleDataUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
