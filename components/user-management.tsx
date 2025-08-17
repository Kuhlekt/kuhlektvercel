"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Trash2, Shield, Edit, Eye, UserPlus } from "lucide-react"
import { UserCreationForm } from "./user-creation-form"
import type { User, AuditLogEntry } from "../types/knowledge-base"
import { storage } from "../utils/storage"

interface UserManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function UserManagement({ users, onUsersUpdate, onAuditLogUpdate }: UserManagementProps) {
  const [showCreateUser, setShowCreateUser] = useState(false)

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleDeleteUser = (userId: string) => {
    const userToDelete = users.find((u) => u.id === userId)
    if (!userToDelete) return

    const updatedUsers = users.filter((u) => u.id !== userId)
    onUsersUpdate(updatedUsers)
    storage.saveUsers(updatedUsers)

    // Add audit log entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "delete_user",
      entityType: "user",
      entityId: userId,
      timestamp: new Date(),
      performedBy: "admin",
      details: `Deleted user: ${userToDelete.username}`,
      articleTitle: undefined,
      categoryName: undefined,
      subcategoryName: undefined,
    }

    const currentAuditLog = storage.getAuditLog()
    const updatedAuditLog = [auditEntry, ...currentAuditLog]
    storage.saveAuditLog(updatedAuditLog)
    onAuditLogUpdate(updatedAuditLog)
  }

  const handleCreateUser = (userData: { username: string; password: string; role: string }) => {
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      password: userData.password,
      role: userData.role as "admin" | "editor" | "viewer",
      createdAt: new Date(),
      lastLogin: null,
    }

    const updatedUsers = [...users, newUser]
    onUsersUpdate(updatedUsers)
    storage.saveUsers(updatedUsers)

    // Add audit log entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "create_user",
      entityType: "user",
      entityId: newUser.id,
      timestamp: new Date(),
      performedBy: "admin",
      details: `Created user: ${newUser.username} with role: ${newUser.role}`,
      articleTitle: undefined,
      categoryName: undefined,
      subcategoryName: undefined,
    }

    const currentAuditLog = storage.getAuditLog()
    const updatedAuditLog = [auditEntry, ...currentAuditLog]
    storage.saveAuditLog(updatedAuditLog)
    onAuditLogUpdate(updatedAuditLog)

    setShowCreateUser(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Dialog open={showCreateUser} onOpenChange={setShowCreateUser}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="create-user-description">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div id="create-user-description" className="sr-only">
              Create a new user account with username, password, and role
            </div>
            <UserCreationForm onCreateUser={handleCreateUser} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Username</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Created</th>
                  <th className="text-left p-3 font-medium">Last Login</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Badge className={`flex items-center space-x-1 w-fit ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-gray-600">{user.createdAt.toLocaleDateString()}</td>
                    <td className="p-3 text-sm text-gray-600">
                      {user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never"}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found. Create your first user to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
