"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, FileText, FolderOpen, Activity, X } from "lucide-react"
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
  onUpdateUsers,
  onUpdateCategories,
  onUpdateArticles,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = {
    totalUsers: users.length,
    totalCategories: categories.length,
    totalArticles: articles.length,
    publishedArticles: articles.filter((a) => a.status === "published").length,
    draftArticles: articles.filter((a) => a.status === "draft").length,
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Admin Dashboard</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
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
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCategories}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.publishedArticles}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.draftArticles}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {auditLog.slice(0, 10).map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between py-2 border-b">
                      <div>
                        <div className="font-medium">{entry.action}</div>
                        <div className="text-sm text-gray-500">{entry.details}</div>
                      </div>
                      <div className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</div>
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
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">
                          Created: {new Date(user.createdAt).toLocaleDateString()}
                          {user.lastLogin && (
                            <span className="ml-2">Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={user.role === "admin" ? "default" : user.role === "editor" ? "secondary" : "outline"}
                        >
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const categoryArticles = articles.filter((a) => a.categoryId === category.id)
                      return (
                        <div key={category.id} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{category.name}</div>
                            {category.description && (
                              <div className="text-sm text-gray-500">{category.description}</div>
                            )}
                          </div>
                          <Badge variant="outline">{categoryArticles.length} articles</Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {articles
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 10)
                      .map((article) => {
                        const author = users.find((u) => u.id === article.authorId)
                        return (
                          <div key={article.id} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <div className="font-medium">{article.title}</div>
                              <div className="text-sm text-gray-500">
                                By {author?.username} • {new Date(article.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant={article.status === "published" ? "default" : "secondary"}>
                              {article.status}
                            </Badge>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Audit Log</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {auditLog.map((entry) => {
                    const user = users.find((u) => u.id === entry.userId)
                    return (
                      <div key={entry.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{entry.action}</div>
                          <div className="text-sm text-gray-500">{entry.details}</div>
                          <div className="text-xs text-gray-400">By {user?.username || "Unknown"}</div>
                        </div>
                        <div className="text-xs text-gray-400">{new Date(entry.timestamp).toLocaleString()}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
