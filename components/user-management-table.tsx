"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Users, Plus, Edit, Trash2, Save, X, Shield, UserIcon } from "lucide-react"
import { apiDatabase } from "../utils/api-database"
import type { User } from "../types/knowledge-base"

interface UserManagementTableProps {
  users: User[]
  onDataUpdate: () => void
  currentUser: User
}

export function UserManagementTable({ users = [], onDataUpdate, currentUser }: UserManagementTableProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer",
    isActive: true,
  })
  const [editUser, setEditUser] = useState({
    username: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
    isActive: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const safeUsers = Array.isArray(users) ? users : []

  const handleAdd = async () => {
    if (!newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      setMessage({ type: "error", text: "All fields are required" })
      return
    }

    // Check if username already exists
    if (safeUsers.some((user) => user.username === newUser.username.trim())) {
      setMessage({ type: "error", text: "Username already exists" })
      return
    }

    try {
      setIsSaving(true)
      const currentData = await apiDatabase.loadData()

      const user: User = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        username: newUser.username.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: new Date().toISOString(),
      }

      const auditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        action: "create_user",
        performedBy: currentUser.username,
        timestamp: new Date().toISOString(),
        details: `Created user "${user.username}" with role "${user.role}"`,
      }

      const updatedData = {
        ...currentData,
        users: [...(currentData.users || []), user],
        auditLog: [...(currentData.auditLog || []), auditEntry],
      }

      await apiDatabase.saveData(updatedData)

      setNewUser({ username: "", email: "", password: "", role: "viewer", isActive: true })
      setIsAdding(false)
      setMessage({ type: "success", text: "User created successfully" })
      onDataUpdate()
    } catch (error) {
      console.error("Failed to create user:", error)
      setMessage({ type: "error", text: "Failed to create user" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setEditUser({
      username: user.username,
      email: user.email || "",
      role: user.role,
      isActive: user.isActive,
    })
  }

  const handleUpdate = async () => {
    if (!editUser.username.trim() || !editUser.email.trim()) {
      setMessage({ type: "error", text: "Username and email are required" })
      return
    }

    try {
      setIsSaving(true)
      const currentData = await apiDatabase.loadData()

      const updatedUsers = (currentData.users || []).map((user) =>
        user.id === editingId
          ? {
              ...user,
              username: editUser.username.trim(),
              email: editUser.email.trim(),
              role: editUser.role,
              isActive: editUser.isActive,
            }
          : user,
      )

      const auditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        action: "update_user",
        performedBy: currentUser.username,
        timestamp: new Date().toISOString(),
        details: `Updated user "${editUser.username}"`,
      }

      const updatedData = {
        ...currentData,
        users: updatedUsers,
        auditLog: [...(currentData.auditLog || []), auditEntry],
      }

      await apiDatabase.saveData(updatedData)

      setEditingId(null)
      setMessage({ type: "success", text: "User updated successfully" })
      onDataUpdate()
    } catch (error) {
      console.error("Failed to update user:", error)
      setMessage({ type: "error", text: "Failed to update user" })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (user: User) => {
    if (user.id === currentUser.id) {
      setMessage({ type: "error", text: "You cannot delete your own account" })
      return
    }

    if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return
    }

    try {
      setIsSaving(true)
      const currentData = await apiDatabase.loadData()

      const updatedUsers = (currentData.users || []).filter((u) => u.id !== user.id)

      const auditEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        action: "delete_user",
        performedBy: currentUser.username,
        timestamp: new Date().toISOString(),
        details: `Deleted user "${user.username}"`,
      }

      const updatedData = {
        ...currentData,
        users: updatedUsers,
        auditLog: [...(currentData.auditLog || []), auditEntry],
      }

      await apiDatabase.saveData(updatedData)

      setMessage({ type: "success", text: "User deleted successfully" })
      onDataUpdate()
    } catch (error) {
      console.error("Failed to delete user:", error)
      setMessage({ type: "error", text: "Failed to delete user" })
    } finally {
      setIsSaving(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4 text-red-500" />
      case "editor":
        return <Edit className="h-4 w-4 text-blue-500" />
      default:
        return <UserIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive",
      editor: "default",
      viewer: "secondary",
    } as const

    return <Badge variant={variants[role as keyof typeof variants] || "secondary"}>{role}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">User Management</h2>
        </div>
        <Button onClick={() => setIsAdding(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Add User Form */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-username">Username *</Label>
                <Input
                  id="new-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email *</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Password *</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "editor" | "viewer") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="new-active"
                checked={newUser.isActive}
                onCheckedChange={(checked) => setNewUser({ ...newUser, isActive: checked })}
              />
              <Label htmlFor="new-active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleAdd} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className="font-medium">{user.username}</span>
                      {user.id === currentUser.id && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(user)} disabled={isSaving}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user)}
                        disabled={isSaving || user.id === currentUser.id}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {safeUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-6">Create your first user account</p>
              <Button onClick={() => setIsAdding(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add User</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>Edit User</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username *</Label>
                <Input
                  id="edit-username"
                  value={editUser.username}
                  onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={editUser.role}
                onValueChange={(value: "admin" | "editor" | "viewer") => setEditUser({ ...editUser, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={editUser.isActive}
                onCheckedChange={(checked) => setEditUser({ ...editUser, isActive: checked })}
              />
              <Label htmlFor="edit-active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleUpdate} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => setEditingId(null)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
