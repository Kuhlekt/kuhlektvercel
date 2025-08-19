"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserManagement } from "./user-management"
import { CategoryManagement } from "./category-management"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
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
  const [activeTab, setActiveTab] = useState("users")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Dashboard</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            <UserManagement users={users} currentUser={currentUser} onUpdateUsers={onUpdateUsers} />
          </TabsContent>

          <TabsContent value="categories" className="mt-4">
            <CategoryManagement
              categories={categories}
              currentUser={currentUser}
              onUpdateCategories={onUpdateCategories}
            />
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <DataManagement
              users={users}
              categories={categories}
              articles={articles}
              auditLog={auditLog}
              onUpdateUsers={onUpdateUsers}
              onUpdateCategories={onUpdateCategories}
              onUpdateArticles={onUpdateArticles}
            />
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <AuditLog auditLog={auditLog} users={users} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
