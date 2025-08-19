"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Database, Activity, TrendingUp, Calendar } from "lucide-react"

import { UserManagement } from "./user-management"
import { CategoryManagement } from "./category-management"
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

  const getTotalSubcategories = () => {
    return categories.reduce((total, category) => {
      return total + (Array.isArray(category.subcategories) ? category.subcategories.length : 0)
    }, 0)
  }

  const getRecentActivity = () => {
    return auditLog.slice(0, 5)
  }

  const getUserStats = () => {
    const adminCount = users.filter((u) => u.role === "admin").length
    const editorCount = users.filter((u) => u.role === "editor").length
    const viewerCount = users.filter((u) => u.role === "viewer").length

    return { adminCount, editorCount, viewerCount }
  }

  const userStats = getUserStats()

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <Badge variant="outline" className="text-sm">
          System Administrator
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
          <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
          <TabsTrigger value="audit">Audit Log ({auditLog.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{getTotalArticles()}</p>
                    <p className="text-sm text-gray-600">Total Articles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{categories.length}</p>
                    <p className="text-sm text-gray-600">Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{users.length}</p>
                    <p className="text-sm text-gray-600">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{auditLog.length}</p>
                    <p className="text-sm text-gray-600">Audit Entries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Content Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Articles:</span>
                  <Badge variant="outline">{getTotalArticles()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Categories:</span>
                  <Badge variant="outline">{categories.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Subcategories:</span>
                  <Badge variant="outline">{getTotalSubcategories()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Articles per Category:</span>
                  <Badge variant="outline">
                    {categories.length > 0 ? Math.round(getTotalArticles() / categories.length) : 0}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>User Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Administrators:</span>
                  <Badge variant="default">{userStats.adminCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Editors:</span>
                  <Badge variant="secondary">{userStats.editorCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Viewers:</span>
                  <Badge variant="outline">{userStats.viewerCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Users:</span>
                  <Badge variant="outline">{users.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Recent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getRecentActivity().length > 0 ? (
                  getRecentActivity().map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {entry.action.includes("article") ? (
                            <FileText className="h-4 w-4 text-blue-600" />
                          ) : entry.action.includes("user") ? (
                            <Users className="h-4 w-4 text-purple-600" />
                          ) : (
                            <Database className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{entry.details || entry.action}</p>
                          <p className="text-xs text-gray-500">by {entry.performedBy}</p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">{entry.timestamp.toLocaleDateString()}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UserManagement users={users} onUsersUpdate={onUsersUpdate} onAuditLogUpdate={onAuditLogUpdate} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement
            categories={categories}
            onCategoriesUpdate={onCategoriesUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
          />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLog auditLog={auditLog} onAuditLogUpdate={onAuditLogUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
