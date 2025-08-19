"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2 } from "lucide-react"
import { storage } from "../utils/storage"
import type { User } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  currentUser: User
  onUpdateUsers: (users: User[]) => void
}

export function UserManagement({ users, currentUser, onUpdateUsers }: UserManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })
  const [error, setError] = useState("")

  const handleAddUser = () => {
    setFormData({ username: "", email: "", password: "", role: "viewer" })
    setError("")
    setIsAddModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
    })
    setEditingUser(user)
    setError("")
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      setError("Cannot delete your own account")
      return
    }

    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((u) => u.id !== userId)
      onUpdateUsers(updatedUsers)
      storage.saveUsers(updatedUsers)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "DELETE_USER",
        details: `Deleted user with ID ${userId}`,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All fields are required")
      return
    }

    if (editingUser) {
      // Edit existing user
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
      onUpdateUsers(updatedUsers)
      storage.saveUsers(updatedUsers)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "UPDATE_USER",
        details: `Updated user ${formData.username}`,
      })
      setIsEditModalOpen(false)
    } else {
      // Add new user
      if (users.some((u) => u.username === formData.username.trim())) {
        setError("Username already exists")
        return
      }

      const newUser: User = {
        id: Date.now().toString(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: formData.role,
        createdAt: new Date(),
      }

      const updatedUsers = [...users, newUser]
      onUpdateUsers(updatedUsers)
      storage.saveUsers(updatedUsers)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "CREATE_USER",
        details: `Created user ${newUser.username}`,
      })
      setIsAddModalOpen(false)
    }

    setEditingUser(null)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "editor":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Button onClick={handleAddUser} className="flex items-center space-x-1">
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{user.username}</span>
                  <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                </div>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400">
                  Created: {user.createdAt.toLocaleDateString()}
                  {user.lastLogin && ` • Last login: ${user.lastLogin.toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex space-x-1">
                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                {user.id !== currentUser.id && (
                  <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "editor" | "viewer") => setFormData({ ...formData, role: value })}
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
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add User</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "editor" | "viewer") => setFormData({ ...formData, role: value })}
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
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
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
