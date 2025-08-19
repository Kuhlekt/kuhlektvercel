"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Users, FileText, Folder, Activity } from "lucide-react"
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
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Admin Dashboard</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Users</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">{stats.totalUsers}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Categories</span>
                </div>
                <p className="text-2xl font-bold text-green-900">{stats.totalCategories}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Published</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">{stats.publishedArticles}</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Drafts</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">{stats.draftArticles}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Recent Activity</h3>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {auditLog.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="text-sm">
                      <span className="text-gray-600">{new Date(entry.timestamp).toLocaleString()}</span>
                      <span className="ml-2 text-gray-900">{entry.details}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={user.role === "admin" ? "default" : user.role === "editor" ? "secondary" : "outline"}
                      >
                        {user.role}
                      </Badge>
                      {user.lastLogin && (
                        <span className="text-xs text-gray-500">
                          Last: {new Date(user.lastLogin).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Categories</h3>
                <ScrollArea className="h-48 bg-gray-50 rounded-lg p-2">
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div key={category.id} className="p-2 bg-white rounded text-sm">
                        <p className="font-medium">{category.name}</p>
                        {category.description && <p className="text-gray-600 text-xs">{category.description}</p>}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Recent Articles</h3>
                <ScrollArea className="h-48 bg-gray-50 rounded-lg p-2">
                  <div className="space-y-1">
                    {articles.slice(0, 10).map((article) => (
                      <div key={article.id} className="p-2 bg-white rounded text-sm">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{article.title}</p>
                          <Badge variant={article.status === "published" ? "default" : "secondary"}>
                            {article.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          {article.createdAt.toLocaleDateString()} by {article.createdBy}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Activity className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                        <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">{entry.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
