"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Activity, Calendar } from "lucide-react"
import { UserManagement } from "./user-management"
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

  const getUsersByRole = () => {
    const roleCount = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return roleCount
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalArticles()}</div>
            <p className="text-xs text-muted-foreground">Across {categories.length} categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="flex gap-1 mt-1">
              {Object.entries(getUsersByRole()).map(([role, count]) => (
                <Badge key={role} variant="outline" className="text-xs">
                  {role}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {categories.reduce((total, cat) => total + (cat.subcategories?.length || 0), 0)} subcategories
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

      {/* Management Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserManagement users={users} onUsersUpdate={onUsersUpdate} onAuditLogUpdate={onAuditLogUpdate} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <AuditLog auditLog={auditLog} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
