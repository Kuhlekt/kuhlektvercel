"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Edit, Trash2, User } from "lucide-react"
import { storage } from "../utils/storage"
import type { User as UserType } from "../types/knowledge-base"

interface UserManagementProps {
  users: UserType[]
  currentUser: UserType
  onUpdateUsers: (users: UserType[]) => void
}

export function UserManagement({ users, currentUser, onUpdateUsers }: UserManagementProps) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "viewer",
    })
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.username.trim() && formData.email.trim() && formData.password.trim()) {
      const newUser: UserType = {
        id: Date.now().toString(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        createdAt: new Date(),
      }

      const updatedUsers = [...users, newUser]
      onUpdateUsers(updatedUsers)
      storage.saveUsers(updatedUsers)
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "CREATE_USER",
        details: `Created user ${newUser.username} with role ${newUser.role}`,
      })

      resetForm()
      setIsAddUserOpen(false)
    }
  }

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser && formData.username.trim() && formData.email.trim()) {
      const updatedUser: UserType = {
        ...editingUser,
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password || editingUser.password,
        role: formData.role,
      }

      const updatedUsers = users.map((u) => (u.id === editingUser.id ? updatedUser : u))
      onUpdateUsers(updatedUsers)
      storage.saveUsers(updatedUsers)
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "UPDATE_USER",
        details: `Updated user ${updatedUser.username}`,
      })

      resetForm()
      setEditingUser(null)
    }
  }

  const handleDeleteUser = (user: UserType) => {
    if (user.id === currentUser.id) {
      alert("You cannot delete your own account")
      return
    }

    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      const updatedUsers = users.filter((u) => u.id !== user.id)
      onUpdateUsers(updatedUsers)
      storage.saveUsers(updatedUsers)
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "DELETE_USER",
        details: `Deleted user ${user.username}`,
      })
    }
  }

  const startEdit = (user: UserType) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "editor":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <h3 className="text-lg font-semibold">User Management</h3>
          <Badge variant="outline">{users.length} users</Badge>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-2">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium">{user.username}</h4>
                  <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  {user.id === currentUser.id && (
                    <Badge variant="outline" className="text-xs">
                      You
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-xs text-gray-500">
                  Created: {user.createdAt.toLocaleDateString()}
                  {user.lastLogin && ` • Last login: ${user.lastLogin.toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                {user.id !== currentUser.id && (
                  <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditUser} className="space-y-4">
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Leave blank to keep current password"
                />
              </div>
              <div>
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
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button type="submit">Update User</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
