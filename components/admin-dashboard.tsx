"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "./user-management"
import { CategoryManagement } from "./category-management"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { storage } from "../utils/storage"
import type { User, Category, Article, AuditLog as AuditLogType } from "../types/knowledge-base"

interface AdminDashboardProps {
  isOpen: boolean
  onClose: () => void
  currentUser: User
  users: User[]
  categories: Category[]
  articles: Article[]
  auditLog: AuditLogType[]
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

  const handleUpdateUsers = (updatedUsers: User[]) => {
    onUpdateUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
  }

  const handleUpdateCategories = (updatedCategories: Category[]) => {
    onUpdateCategories(updatedCategories)
    storage.saveCategories(updatedCategories)
  }

  const handleUpdateArticles = (updatedArticles: Article[]) => {
    onUpdateArticles(updatedArticles)
    storage.saveArticles(updatedArticles)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Dashboard</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{users.length}</div>
                <div className="text-sm text-blue-600">Total Users</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{categories.length}</div>
                <div className="text-sm text-green-600">Categories</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{articles.length}</div>
                <div className="text-sm text-purple-600">Articles</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {articles.filter((a) => a.status === "published").length}
                </div>
                <div className="text-sm text-orange-600">Published</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <div className="space-y-2">
                {auditLog.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{entry.action}</div>
                      <div className="text-sm text-gray-600">{entry.details}</div>
                    </div>
                    <div className="text-sm text-gray-500">{entry.timestamp.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={users} onUpdateUsers={handleUpdateUsers} currentUser={currentUser} />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement categories={categories} onUpdateCategories={handleUpdateCategories} />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLog auditLog={auditLog} users={users} />
          </TabsContent>

          <TabsContent value="data">
            <DataManagement
              users={users}
              categories={categories}
              articles={articles}
              auditLog={auditLog}
              onUpdateUsers={handleUpdateUsers}
              onUpdateCategories={handleUpdateCategories}
              onUpdateArticles={handleUpdateArticles}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
