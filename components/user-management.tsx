"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import type { UserManagementProps } from "../types/knowledge-base"

export function UserManagement({ users, onUsersUpdate, onAuditLogUpdate, auditLog }: UserManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer",
  })
  const [error, setError] = useState("")

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "viewer",
    })
    setError("")
  }

  const handleAddUser = () => {
    setIsAddDialogOpen(true)
    resetForm()
  }

  const handleEditUser = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
    })
    setError("")
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (userId) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      const updatedUsers = users.filter((u) => u.id !== userId)
      onUsersUpdate(updatedUsers)

      // Add audit log entry
      const auditEntry = {
        id: Date.now().toString(),
        action: "user_deleted",
        entityType: "user",
        entityId: userId,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Deleted user: ${user.username}`,
      }
      const updatedAuditLog = [auditEntry, ...auditLog]
      onAuditLogUpdate(updatedAuditLog)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All fields are required")
      return
    }

    // Check for duplicate username (excluding current user when editing)
    const existingUser = users.find((u) => u.username === formData.username.trim() && u.id !== editingUser?.id)
    if (existingUser) {
      setError("Username already exists")
      return
    }

    // Check for duplicate email (excluding current user when editing)
    const existingEmail = users.find((u) => u.email === formData.email.trim() && u.id !== editingUser?.id)
    if (existingEmail) {
      setError("Email already exists")
      return
    }

    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              username: formData.username.trim(),
              email: formData.email.trim(),
              password: formData.password.trim(),
              role: formData.role,
            }
          : u,
      )
      onUsersUpdate(updatedUsers)

      // Add audit log entry
      const auditEntry = {
        id: Date.now().toString(),
        action: "user_updated",
        entityType: "user",
        entityId: editingUser.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Updated user: ${formData.username}`,
      }
      const updatedAuditLog = [auditEntry, ...auditLog]
      onAuditLogUpdate(updatedAuditLog)

      setIsEditDialogOpen(false)
    } else {
      // Add new user
      const newUser = {
        id: Date.now().toString(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: formData.role,
        createdAt: new Date(),
      }
      onUsersUpdate([...users, newUser])

      // Add audit log entry
      const auditEntry = {
        id: Date.now().toString(),
        action: "user_created",
        entityType: "user",
        entityId: newUser.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Created user: ${newUser.username}`,
      }
      const updatedAuditLog = [auditEntry, ...auditLog]
      onAuditLogUpdate(updatedAuditLog)

      setIsAddDialogOpen(false)
    }

    resetForm()
    setEditingUser(null)
  }

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "editor":
        return "default"
      case "viewer":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
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

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 text-gray-400">User Icon</div>
                <div>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400">
                    Created: {new Date(user.createdAt).toLocaleDateString()}
                    {user.lastLogin && (
                      <span className="ml-2">Last login: {new Date(user.lastLogin).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
                required
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
                required
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
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

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
