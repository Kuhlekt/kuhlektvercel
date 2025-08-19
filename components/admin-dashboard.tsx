"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FolderTree, Activity } from "lucide-react"
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
  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = category.articles?.length || 0
      const subcategoryArticles =
        category.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  const getTotalSubcategories = () => {
    return categories.reduce((total, category) => {
      return total + (category.subcategories?.length || 0)
    }, 0)
  }

  const getRecentActivity = () => {
    return auditLog.slice(0, 5)
  }

  const getUsersByRole = () => {
    const roleCount = { admin: 0, editor: 0, viewer: 0 }
    users.forEach((user) => {
      roleCount[user.role]++
    })
    return roleCount
  }

  const roleCount = getUsersByRole()

  return (
    <div className="space-y-6">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <FolderTree className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <div className="text-2xl font-bold">{getTotalArticles()}</div>
              <div className="text-sm text-gray-600">Total Articles</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <FolderTree className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <div className="text-2xl font-bold">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-purple-500 mr-4" />
            <div>
              <div className="text-2xl font-bold">{users.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <Activity className="h-8 w-8 text-orange-500 mr-4" />
            <div>
              <div className="text-2xl font-bold">{auditLog.length}</div>
              <div className="text-sm text-gray-600">Audit Entries</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderTree className="h-5 w-5" />
              <span>User Roles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Administrators</span>
                <Badge variant="destructive">{roleCount.admin}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Editors</span>
                <Badge variant="default">{roleCount.editor}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Viewers</span>
                <Badge variant="secondary">{roleCount.viewer}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FolderTree className="h-5 w-5" />
              <span>Content Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Categories</span>
                <Badge variant="outline">{categories.length}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Subcategories</span>
                <Badge variant="outline">{getTotalSubcategories()}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Articles</span>
                <Badge variant="outline">{getTotalArticles()}</Badge>
              </div>
            </div>
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
          {getRecentActivity().length > 0 ? (
            <div className="space-y-3">
              {getRecentActivity().map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{entry.details}</div>
                    <div className="text-xs text-gray-500">
                      by {entry.performedBy} • {new Date(entry.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {entry.action.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users ({users.length})</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <FolderTree className="h-4 w-4" />
            <span>Categories ({categories.length})</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Audit Log ({auditLog.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserManagement users={users} onUsersUpdate={onUsersUpdate} />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManagement categories={categories} onCategoriesUpdate={onCategoriesUpdate} />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <AuditLog auditLog={auditLog} onAuditLogUpdate={onAuditLogUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
