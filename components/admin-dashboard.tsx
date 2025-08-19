"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Folder, Activity, Calendar, TrendingUp } from "lucide-react"
import type { User, Category, Article, AuditLog } from "../types/knowledge-base"

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User
  users: User[]
  categories: Category[]
  articles: Article[]
  auditLog: AuditLog[]
  onUpdateUsers: (users: User[]) => void
  onUpdateCategories: (categories: Category[]) => void
  onUpdateArticles: (articles: Article[]) => void
}

export function AdminDashboard({
  isOpen,
  onClose,
  currentUser,
  users,
  categories,
  articles,
  auditLog,
}: AdminDashboardProps) {
  const stats = {
    totalUsers: users.length,
    totalArticles: articles.length,
    totalCategories: categories.length,
    publishedArticles: articles.filter((a) => a.status === "published").length,
    draftArticles: articles.filter((a) => a.status === "draft").length,
    recentActivity: auditLog.slice(0, 10),
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Admin Dashboard</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalArticles}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.publishedArticles} published, {stats.draftArticles} drafts
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Folder className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCategories}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.recentActivity.length}</div>
                  <p className="text-xs text-muted-foreground">Last 10 actions</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.recentActivity.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{log.action}</span>
                        <p className="text-sm text-gray-600">{log.details}</p>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-600">{user.email}</div>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(user.createdAt).toLocaleDateString()}
                          {user.lastLogin && (
                            <span className="ml-2">Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={user.role === "admin" ? "default" : user.role === "editor" ? "secondary" : "outline"}
                      >
                        {user.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categories.map((category) => {
                    const categoryArticles = articles.filter((a) => a.categoryId === category.id)
                    return (
                      <div key={category.id} className="p-4 border rounded">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{category.name}</h3>
                          <Badge variant="outline">{categoryArticles.length} articles</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                        {category.subcategories.length > 0 && (
                          <div className="text-xs text-gray-500">
                            Subcategories: {category.subcategories.map((sub) => sub.name).join(", ")}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {auditLog.map((log) => {
                    const user = users.find((u) => u.id === log.userId)
                    return (
                      <div key={log.id} className="flex items-start justify-between p-3 border rounded">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {log.action}
                            </Badge>
                            {user && <span className="text-sm font-medium">{user.username}</span>}
                          </div>
                          <p className="text-sm text-gray-600">{log.details}</p>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
