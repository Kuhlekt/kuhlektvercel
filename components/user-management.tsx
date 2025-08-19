"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, User, Mail, Shield, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import type { User as UserType, AuditLogEntry } from "../types/knowledge-base"

interface UserManagementProps {
  users: UserType[]
  auditLog: AuditLogEntry[]
  onUsersUpdate: (users: UserType[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function UserManagement({ users, auditLog, onUsersUpdate, onAuditLogUpdate }: UserManagementProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "editor" as "admin" | "editor",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "editor",
    })
  }

  const handleCreateUser = () => {
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      showMessage("error", "Please fill in all fields")
      return
    }

    if (users.some((u) => u.username.toLowerCase() === formData.username.toLowerCase())) {
      showMessage("error", "Username already exists")
      return
    }

    if (users.some((u) => u.email.toLowerCase() === formData.email.toLowerCase())) {
      showMessage("error", "Email already exists")
      return
    }

    const newUser: UserType = {
      id: Date.now().toString(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      role: formData.role,
      createdAt: new Date(),
    }

    const updatedUsers = [...users, newUser]
    onUsersUpdate(updatedUsers)

    // Add audit entry
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

    setShowCreateDialog(false)
    resetForm()
    showMessage("success", "User created successfully")
  }

  const handleEditUser = (user: UserType) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
    })
    setShowEditDialog(true)
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      showMessage("error", "Please fill in all fields")
      return
    }

    // Check for duplicate username (excluding current user)
    if (users.some((u) => u.id !== editingUser.id && u.username.toLowerCase() === formData.username.toLowerCase())) {
      showMessage("error", "Username already exists")
      return
    }

    // Check for duplicate email (excluding current user)
    if (users.some((u) => u.id !== editingUser.id && u.email.toLowerCase() === formData.email.toLowerCase())) {
      showMessage("error", "Email already exists")
      return
    }

    const updatedUser: UserType = {
      ...editingUser,
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      role: formData.role,
      updatedAt: new Date(),
    }

    const updatedUsers = users.map((u) => (u.id === editingUser.id ? updatedUser : u))
    onUsersUpdate(updatedUsers)

    // Add audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "user_updated",
      entityType: "user",
      entityId: editingUser.id,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Updated user: ${updatedUser.username}`,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])

    setShowEditDialog(false)
    setEditingUser(null)
    resetForm()
    showMessage("success", "User updated successfully")
  }

  const handleDeleteUser = (user: UserType) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return
    }

    const updatedUsers = users.filter((u) => u.id !== user.id)
    onUsersUpdate(updatedUsers)

    // Add audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "user_deleted",
      entityType: "user",
      entityId: user.id,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Deleted user: ${user.username}`,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])

    showMessage("success", "User deleted successfully")
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          <div className="flex items-center">
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription className="ml-2">{message.text}</AlertDescription>
          </div>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.username}</span>
                </CardTitle>
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-3 w-3" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-3 w-3" />
                <span>Created {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>

              {user.lastLogin && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-3 w-3" />
                  <span>Last login {new Date(user.lastLogin).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)} className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteUser(user)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent aria-describedby="create-user-description">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription id="create-user-description">
              Add a new user to the knowledge base system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-username">Username</Label>
              <Input
                id="create-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "editor") => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent aria-describedby="edit-user-description">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription id="edit-user-description">Update user information and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "editor") => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false)
                  setEditingUser(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Update User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
