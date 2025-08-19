"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Admin Dashboard</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900">Total Users</h3>
                <p className="text-2xl font-bold text-blue-700">{users.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900">Total Articles</h3>
                <p className="text-2xl font-bold text-green-700">{articles.length}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900">Categories</h3>
                <p className="text-2xl font-bold text-purple-700">{categories.length}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">User Management</h3>
              <div className="border rounded-lg">
                <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-medium">
                  <div>Username</div>
                  <div>Email</div>
                  <div>Role</div>
                  <div>Last Login</div>
                </div>
                {users.map((user) => (
                  <div key={user.id} className="grid grid-cols-4 gap-4 p-3 border-t">
                    <div>{user.username}</div>
                    <div>{user.email}</div>
                    <div className="capitalize">{user.role}</div>
                    <div>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Category Management</h3>
              <div className="border rounded-lg">
                <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 font-medium">
                  <div>Name</div>
                  <div>Description</div>
                  <div>Articles</div>
                </div>
                {categories.map((category) => (
                  <div key={category.id} className="grid grid-cols-3 gap-4 p-3 border-t">
                    <div>{category.name}</div>
                    <div>{category.description}</div>
                    <div>{articles.filter((a) => a.categoryId === category.id).length}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="audit" className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Audit Log</h3>
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 font-medium sticky top-0">
                  <div>Action</div>
                  <div>Details</div>
                  <div>Timestamp</div>
                </div>
                {auditLog.map((entry) => (
                  <div key={entry.id} className="grid grid-cols-3 gap-4 p-3 border-t">
                    <div className="font-medium">{entry.action}</div>
                    <div>{entry.details}</div>
                    <div>{new Date(entry.timestamp).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
