"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Users</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalUsers}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Categories</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalCategories}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Articles</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.totalArticles}</p>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium">Published</span>
                </div>
                <p className="text-2xl font-bold mt-2">{stats.publishedArticles}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">Recent Activity</h3>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {auditLog.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="text-sm">
                        <span className="text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                        <p className="text-gray-700">{entry.details}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">System Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Storage</span>
                    <Badge variant="secondary">Local Storage</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className="bg-green-500">Online</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Version</span>
                    <Badge variant="outline">1.0.0</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
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

          <TabsContent value="articles" className="space-y-4">
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {articles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{article.title}</p>
                      <p className="text-sm text-gray-500">
                        by {article.createdBy} • {article.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={article.status === "published" ? "default" : "secondary"}>{article.status}</Badge>
                      <span className="text-xs text-gray-500">{article.tags.length} tags</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <ScrollArea className="h-64">
              <div className="space-y-2">
                {auditLog.map((entry) => (
                  <div key={entry.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline">{entry.action}</Badge>
                      <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-gray-700">{entry.details}</p>
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
