"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { User } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  onUpdateUsers: (users: User[]) => void
  currentUser: User
}

export function UserManagement({ users, onUpdateUsers, currentUser }: UserManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })

  const handleAddUser = () => {
    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date(),
    }

    onUpdateUsers([...users, newUser])
    setIsAddModalOpen(false)
    resetForm()
  }

  const handleEditUser = () => {
    if (!editingUser) return

    const updatedUsers = users.map((user) =>
      user.id === editingUser.id
        ? {
            ...user,
            username: formData.username,
            email: formData.email,
            role: formData.role,
            ...(formData.password && { password: formData.password }),
          }
        : user,
    )

    onUpdateUsers(updatedUsers)
    setEditingUser(null)
    resetForm()
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) {
      alert("You cannot delete your own account")
      return
    }

    if (confirm("Are you sure you want to delete this user?")) {
      onUpdateUsers(users.filter((user) => user.id !== userId))
    }
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "viewer",
    })
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
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
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4">
              <div>
                <div className="font-medium">{user.username}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
              <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>
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

      {/* Add/Edit User Modal */}
      <Dialog
        open={isAddModalOpen || !!editingUser}
        onOpenChange={() => {
          setIsAddModalOpen(false)
          setEditingUser(null)
          resetForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password {editingUser && "(leave blank to keep current)"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
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
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setEditingUser(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={editingUser ? handleEditUser : handleAddUser}>
                {editingUser ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
