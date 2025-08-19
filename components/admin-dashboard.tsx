"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Admin Dashboard</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="users" className="h-full">
              <UserManagement users={users} currentUser={currentUser} onUpdateUsers={onUpdateUsers} />
            </TabsContent>

            <TabsContent value="categories" className="h-full">
              <CategoryManagement
                categories={categories}
                articles={articles}
                currentUser={currentUser}
                onUpdateCategories={onUpdateCategories}
                onUpdateArticles={onUpdateArticles}
              />
            </TabsContent>

            <TabsContent value="audit" className="h-full">
              <AuditLog auditLog={auditLog} users={users} />
            </TabsContent>

            <TabsContent value="data" className="h-full">
              <DataManagement />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
