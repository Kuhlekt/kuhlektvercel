"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, FolderOpen, FileText, Activity } from "lucide-react"
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Admin Dashboard</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Users</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Categories</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{stats.totalCategories}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Published</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{stats.publishedArticles}</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Drafts</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{stats.draftArticles}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <ScrollArea className="h-64 border rounded-lg p-4">
                {auditLog.slice(0, 10).map((entry) => {
                  const user = users.find((u) => u.id === entry.userId)
                  return (
                    <div key={entry.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="text-sm font-medium">{entry.action}</p>
                        <p className="text-xs text-gray-600">{entry.details}</p>
                        <p className="text-xs text-gray-500">
                          {user?.username} • {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">User Management</h3>
              <Button size="sm">Add User</Button>
            </div>

            <ScrollArea className="h-96 border rounded-lg">
              <div className="p-4 space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                        {user.lastLogin && ` • Last login: ${new Date(user.lastLogin).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={user.role === "admin" ? "default" : user.role === "editor" ? "secondary" : "outline"}
                      >
                        {user.role}
                      </Badge>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Categories</h3>
                  <Button size="sm">Add Category</Button>
                </div>
                <ScrollArea className="h-64 border rounded-lg p-4">
                  {categories.map((category) => {
                    const articleCount = articles.filter((a) => a.categoryId === category.id).length
                    return (
                      <div
                        key={category.id}
                        className="flex items-center justify-between py-2 border-b last:border-b-0"
                      >
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-gray-600">{category.description}</p>
                          <p className="text-xs text-gray-500">{articleCount} articles</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    )
                  })}
                </ScrollArea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Recent Articles</h3>
                </div>
                <ScrollArea className="h-64 border rounded-lg p-4">
                  {articles.slice(0, 10).map((article) => {
                    const author = users.find((u) => u.id === article.authorId)
                    const category = categories.find((c) => c.id === article.categoryId)
                    return (
                      <div key={article.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="font-medium">{article.title}</p>
                          <p className="text-sm text-gray-600">
                            {category?.name} • {author?.username}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={article.status === "published" ? "default" : "secondary"}>
                              {article.status}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {new Date(article.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    )
                  })}
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Audit Log</h3>
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{auditLog.length} total entries</span>
              </div>
            </div>

            <ScrollArea className="h-96 border rounded-lg p-4">
              {auditLog.map((entry) => {
                const user = users.find((u) => u.id === entry.userId)
                return (
                  <div key={entry.id} className="flex items-start justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {entry.action}
                        </Badge>
                        <span className="text-sm font-medium">{user?.username || "Unknown User"}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{entry.details}</p>
                      <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                )
              })}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
