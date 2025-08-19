"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserCreationForm } from "./user-creation-form"
import { UserManagementTable } from "./user-management-table"
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react"
import type { User, AuditLogEntry } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  auditLog: AuditLogEntry[]
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function UserManagement({ users, auditLog, onUsersUpdate, onAuditLogUpdate }: UserManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleCreateUser = (userData: Omit<User, "id" | "createdAt">) => {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date(),
      }

      const updatedUsers = [...users, newUser]
      onUsersUpdate(updatedUsers)

      // Add audit log entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "user_created",
        entityType: "user",
        entityId: newUser.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Created user: ${newUser.username} (${newUser.role})`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])

      setMessage({ type: "success", text: `User ${newUser.username} created successfully!` })
      setShowCreateForm(false)
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create user. Please try again." })
    }
  }

  const handleDeleteUser = (userId: string) => {
    try {
      const userToDelete = users.find((u) => u.id === userId)
      if (!userToDelete) return

      if (confirm(`Are you sure you want to delete user "${userToDelete.username}"?`)) {
        const updatedUsers = users.filter((u) => u.id !== userId)
        onUsersUpdate(updatedUsers)

        // Add audit log entry
        const auditEntry: AuditLogEntry = {
          id: Date.now().toString(),
          action: "user_deleted",
          entityType: "user",
          entityId: userId,
          performedBy: "admin",
          timestamp: new Date(),
          details: `Deleted user: ${userToDelete.username}`,
        }
        onAuditLogUpdate([auditEntry, ...auditLog])

        setMessage({ type: "success", text: `User ${userToDelete.username} deleted successfully!` })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete user. Please try again." })
    }
  }

  const handleUpdateUser = (userId: string, updates: Partial<User>) => {
    try {
      const updatedUsers = users.map((user) => (user.id === userId ? { ...user, ...updates } : user))
      onUsersUpdate(updatedUsers)

      // Add audit log entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "user_updated",
        entityType: "user",
        entityId: userId,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Updated user: ${updates.username || "unknown"}`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])

      setMessage({ type: "success", text: "User updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update user. Please try again." })
    }
  }

  const getRoleStats = () => {
    const stats = users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return stats
  }

  const roleStats = getRoleStats()

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "success" ? "default" : "destructive"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{roleStats.admin || 0}</p>
              <p className="text-sm text-gray-500">Admins</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{roleStats.editor || 0}</p>
              <p className="text-sm text-gray-500">Editors</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{roleStats.viewer || 0}</p>
              <p className="text-sm text-gray-500">Viewers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
            <Button onClick={() => setShowCreateForm(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm ? (
            <UserCreationForm
              onSubmit={handleCreateUser}
              onCancel={() => setShowCreateForm(false)}
              existingUsers={users}
            />
          ) : (
            <UserManagementTable users={users} onDeleteUser={handleDeleteUser} onUpdateUser={handleUpdateUser} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
