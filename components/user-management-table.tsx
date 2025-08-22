"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, UserPlus } from "lucide-react"
import { database } from "@/utils/database"
import type { User } from "@/types/knowledge-base"

interface UserManagementTableProps {
  onDataChange?: () => void
}

export function UserManagementTable({ onDataChange }: UserManagementTableProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
    isActive: true,
  })

  // Load users data
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("👥 Loading users...")

      const usersData = await database.getUsers()
      console.log("✅ Users loaded:", usersData.length)

      setUsers([...usersData]) // Force array update
    } catch (err) {
      console.error("❌ Error loading users:", err)
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      await database.initialize()
      await loadUsers()
    }

    initializeData()
  }, [loadUsers])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setError(null)

      if (editingUser) {
        // Update existing user
        console.log("✏️ Updating user:", editingUser.id)
        await database.updateUser(editingUser.id, {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive,
          // Only update password if it's provided
          ...(formData.password && { password: formData.password }),
        })
        console.log("✅ User updated successfully")
      } else {
        // Create new user
        console.log("➕ Creating new user:", formData.username)
        await database.saveUser({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          role: formData.role,
          lastLogin: null,
        })
        console.log("✅ User created successfully")
      }

      // Reset form and close dialog
      setFormData({
        username: "",
        password: "",
        email: "",
        role: "viewer",
        isActive: true,
      })
      setEditingUser(null)
      setIsCreateDialogOpen(false)

      // Refresh data
      await loadUsers()
      onDataChange?.()
    } catch (err: any) {
      console.error("❌ Error saving user:", err)
      setError(err.message || "Failed to save user")
    }
  }

  // Handle user deletion
  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      setError(null)
      console.log("🗑️ Deleting user:", userId)

      await database.deleteUser(userId)
      console.log("✅ User deleted successfully")

      // Refresh data
      await loadUsers()
      onDataChange?.()
    } catch (err: any) {
      console.error("❌ Error deleting user:", err)
      setError(err.message || "Failed to delete user")
    }
  }

  // Handle edit user
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: "", // Don't pre-fill password for security
      email: user.email,
      role: user.role,
      isActive: user.isActive !== false,
    })
    setIsCreateDialogOpen(true)
  }

  // Handle toggle user active status
  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      setError(null)
      console.log(`🔄 Toggling user active status: ${userId} -> ${isActive}`)

      await database.updateUser(userId, { isActive })
      console.log("✅ User status updated successfully")

      // Refresh data
      await loadUsers()
      onDataChange?.()
    } catch (err: any) {
      console.error("❌ Error updating user status:", err)
      setError(err.message || "Failed to update user status")
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "editor":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "viewer":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">User Management</h3>
          <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingUser(null)
                setFormData({
                  username: "",
                  password: "",
                  email: "",
                  role: "viewer",
                  isActive: true,
                })
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
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
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password {editingUser && "(leave blank to keep current)"}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                  placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setEditingUser(null)
                    setError(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingUser ? "Update User" : "Create User"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={user.isActive !== false}
                        onCheckedChange={(checked) => handleToggleActive(user.id, checked)}
                        size="sm"
                      />
                      <span className="text-sm">{user.isActive !== false ? "Active" : "Inactive"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-gray-600">Total users: {users.length}</div>
    </div>
  )
}
