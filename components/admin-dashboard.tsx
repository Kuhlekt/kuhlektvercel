"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserManagement } from "./user-management"
import { CategoryManagement } from "./category-management"
import { AuditLog } from "./audit-log"
import { DataManagement } from "./data-management"
import { BackupRestore } from "./backup-restore"
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
  onDataRestored: () => void
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
  onDataRestored,
}: AdminDashboardProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admin Dashboard</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="audit">Audit Log</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <UserManagement users={users} currentUser={currentUser} onUpdateUsers={onUpdateUsers} />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <CategoryManagement
              categories={categories}
              currentUser={currentUser}
              onUpdateCategories={onUpdateCategories}
            />
          </TabsContent>

          <TabsContent value="backup" className="mt-6">
            <BackupRestore
              users={users}
              categories={categories}
              articles={articles}
              auditLog={auditLog}
              currentUser={currentUser}
              onDataRestored={onDataRestored}
            />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AuditLog auditLog={auditLog} />
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <DataManagement users={users} categories={categories} articles={articles} auditLog={auditLog} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
