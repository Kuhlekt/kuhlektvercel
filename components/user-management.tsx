"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { storage } from "../utils/storage"
import type { User } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  currentUser: User
  onUpdateUsers: (users: User[]) => void
}

export function UserManagement({ users, currentUser, onUpdateUsers }: UserManagementProps) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.username.trim() || !formData.name.trim() || !formData.email.trim()) return

    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      createdAt: new Date(),
      isActive: true,
    }

    const updatedUsers = [...users, newUser]
    onUpdateUsers(updatedUsers)
    storage.saveUsers(updatedUsers)

    storage.addAuditEntry({
      performedBy: currentUser.id,
      action: "CREATE_USER",
      details: `Created user "${newUser.username}" with role ${newUser.role}`,
    })

    setFormData({ username: "", name: "", email: "", role: "viewer" })
    setIsAddUserOpen(false)
  }

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser || !formData.username.trim() || !formData.name.trim() || !formData.email.trim()) return

    const updatedUser: User = {
      ...editingUser,
      username: formData.username.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
    }

    const updatedUsers = users.map((u) => (u.id === editingUser.id ? updatedUser : u))
    onUpdateUsers(updatedUsers)
    storage.saveUsers(updatedUsers)

    storage.addAuditEntry({
      performedBy: currentUser.id,
      action: "UPDATE_USER",
      details: `Updated user "${updatedUser.username}"`,
    })

    setEditingUser(null)
    setFormData({ username: "", name: "", email: "", role: "viewer" })
  }

  const handleDeleteUser = (user: User) => {
    if (user.id === currentUser.id) {
      alert("You cannot delete your own account.")
      return
    }

    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      const updatedUsers = users.filter((u) => u.id !== user.id)
      onUpdateUsers(updatedUsers)
      storage.saveUsers(updatedUsers)

      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "DELETE_USER",
        details: `Deleted user "${user.username}"`,
      })
    }
  }

  const toggleUserStatus = (user: User) => {
    if (user.id === currentUser.id) {
      alert("You cannot deactivate your own account.")
      return
    }

    const updatedUser = { ...user, isActive: !user.isActive }
    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
    onUpdateUsers(updatedUsers)
    storage.saveUsers(updatedUsers)

    storage.addAuditEntry({
      performedBy: currentUser.id,
      action: "UPDATE_USER",
      details: `${updatedUser.isActive ? "Activated" : "Deactivated"} user "${user.username}"`,
    })
  }

  const startEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  }

  const getRoleBadgeColor = (role: string) => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddUserOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-6 gap-4 p-4 font-semibold border-b bg-gray-50">
          <div>Username</div>
          <div>Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-6 gap-4 p-4 border-b last:border-b-0">
            <div className="font-medium">{user.username}</div>
            <div>{user.name}</div>
            <div className="text-sm text-gray-600">{user.email}</div>
            <div>
              <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
            </div>
            <div>
              <Badge variant={user.isActive ? "default" : "secondary"}>{user.isActive ? "Active" : "Inactive"}</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => startEdit(user)}>
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleUserStatus(user)}
                disabled={user.id === currentUser.id}
              >
                {user.isActive ? "Deactivate" : "Activate"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeleteUser(user)}
                disabled={user.id === currentUser.id}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

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
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <Label htmlFor="edit-role">Role</Label>
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
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setEditingUser(null)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Update User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
