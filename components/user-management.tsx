"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import type { User } from "../types/knowledge-base"
import { storage } from "../utils/storage"

interface UserManagementProps {
  users: User[]
  currentUser: User
  onUpdateUsers: (users: User[]) => void
}

export function UserManagement({ users, currentUser, onUpdateUsers }: UserManagementProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user" as "admin" | "user",
  })
  const [error, setError] = useState("")

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      role: "user",
    })
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.username.trim() || !formData.password.trim()) {
      setError("All fields are required")
      return
    }

    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map((user) => (user.id === editingUser.id ? { ...user, ...formData } : user))
      onUpdateUsers(updatedUsers)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "UPDATE_USER",
        details: `Updated user ${formData.username}`,
      })
    } else {
      // Check for duplicate username
      const existingUser = users.find((u) => u.username === formData.username.trim())
      if (existingUser) {
        setError("Username already exists")
        return
      }

      // Add new user
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      }
      onUpdateUsers([...users, newUser])
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "CREATE_USER",
        details: `Created user ${formData.username}`,
      })
    }

    setFormData({ username: "", password: "", role: "user" })
    setIsAddModalOpen(false)
    setEditingUser(null)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: user.password,
      role: user.role,
    })
    setIsAddModalOpen(true)
  }

  const handleDelete = (user: User) => {
    if (user.id === currentUser.id) {
      alert("You cannot delete your own account")
      return
    }

    if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
      const updatedUsers = users.filter((u) => u.id !== user.id)
      onUpdateUsers(updatedUsers)
      storage.addAuditEntry({
        userId: currentUser.id,
        action: "DELETE_USER",
        details: `Deleted user ${user.username}`,
      })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "user":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add User
        </Button>
      </div>

      <div className="border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Username</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th className="px-4 py-2 text-left">Last Login</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${getRoleBadgeColor(user.role)}`}>{user.role}</span>
                </td>
                <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                </td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <Button onClick={() => handleEdit(user)} variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {user.id !== currentUser.id && (
                      <Button onClick={() => handleDelete(user)} variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
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
                onValueChange={(value: "admin" | "user") => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingUser ? "Update User" : "Add User"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false)
                  setEditingUser(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
