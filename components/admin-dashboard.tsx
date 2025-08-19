"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, FolderTree, Activity } from "lucide-react"
import { UserManagement } from "./user-management"
import { CategoryManagement } from "./category-management"
import { AuditLog } from "./audit-log"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface AdminDashboardProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: (categories: Category[]) => void
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function AdminDashboard({
  categories,
  users,
  auditLog,
  onCategoriesUpdate,
  onUsersUpdate,
  onAuditLogUpdate,
}: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage users, categories, and view system activity.</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <FolderTree className="h-4 w-4" />
            <span>Categories</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Audit Log</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <UserManagement
            users={users}
            onUsersUpdate={onUsersUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
            auditLog={auditLog}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategoryManagement
            categories={categories}
            onCategoriesUpdate={onCategoriesUpdate}
            onAuditLogUpdate={onAuditLogUpdate}
            auditLog={auditLog}
          />
        </TabsContent>

        <TabsContent value="audit" className="mt-6">
          <AuditLog auditLog={auditLog} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
