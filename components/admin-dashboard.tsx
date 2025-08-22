"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CategoryManagement } from "./category-management"
import { AuditLog } from "./audit-log"
import { Activity, Users, FileText, FolderTree } from "lucide-react"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

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
  const totalArticles = categories.reduce((total, category) => {
    const categoryArticles = category.articles?.length || 0
    const subcategoryArticles =
      category.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
    return total + categoryArticles + subcategoryArticles
  }, 0)

  const totalCategories = categories.length
  const totalSubcategories = categories.reduce((total, category) => total + (category.subcategories?.length || 0), 0)

  // Get recent activity
  const recentActivity = auditLog.slice(0, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your knowledge base and monitor activity</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Articles</p>
                    <p className="text-2xl font-bold text-blue-600">{totalArticles}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-2xl font-bold text-green-600">{totalCategories}</p>
                  </div>
                  <FolderTree className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Subcategories</p>
                    <p className="text-2xl font-bold text-purple-600">{totalSubcategories}</p>
                  </div>
                  <FolderTree className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Users</p>
                    <p className="text-2xl font-bold text-orange-600">{users.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
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
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {entry.action.includes("article") ? (
                            <FileText className="h-5 w-5 text-blue-600" />
                          ) : entry.action.includes("user") ? (
                            <Users className="h-5 w-5 text-green-600" />
                          ) : (
                            <Activity className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {entry.details || entry.action.replace(/_/g, " ")}
                          </p>
                          <p className="text-xs text-gray-600">
                            by {entry.performedBy} • {new Date(entry.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {entry.action.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={categories} onCategoriesUpdate={onCategoriesUpdate} />
        </TabsContent>

        <TabsContent value="activity">
          <AuditLog auditLog={auditLog} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
