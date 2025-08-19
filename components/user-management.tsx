"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import type { User, AuditLogEntry, UserManagementProps } from "../types/knowledge-base"

export function UserManagement({ users, onUsersUpdate, onAuditLogUpdate, auditLog }: UserManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })
  const [error, setError] = useState("")

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      role: "viewer",
    })
    setError("")
  }

  const handleAddUser = () => {
    setEditingUser(null)
    resetForm()
    setIsAddDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: user.password,
      email: user.email,
      role: user.role,
    })
    setError("")
    setIsAddDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.username.trim() || !formData.password.trim() || !formData.email.trim()) {
      setError("All fields are required")
      return
    }

    // Check for duplicate username (excluding current user when editing)
    const existingUser = users.find(
      (u) => u.username === formData.username.trim() && (!editingUser || u.id !== editingUser.id),
    )
    if (existingUser) {
      setError("Username already exists")
      return
    }

    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id
          ? { ...user, ...formData, username: formData.username.trim(), email: formData.email.trim() }
          : user,
      )
      onUsersUpdate(updatedUsers)

      // Add audit entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "user_updated",
        entityType: "user",
        entityId: editingUser.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Updated user: ${formData.username}`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username.trim(),
        password: formData.password.trim(),
        email: formData.email.trim(),
        role: formData.role,
        createdAt: new Date(),
      }
      onUsersUpdate([...users, newUser])

      // Add audit entry
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "user_created",
        entityType: "user",
        entityId: newUser.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Created user: ${newUser.username}`,
      }
      onAuditLogUpdate([auditEntry, ...auditLog])
    }

    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
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
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddUser}>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Enter username"
                    required
                  />
                </div>

                <div>
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

                <div>
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

                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "editor" | "viewer") => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingUser ? "Update" : "Add"} User</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
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
      </CardContent>
    </Card>
  )
}
