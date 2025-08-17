"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserPlus, Edit, Trash2, Shield, UserCheck, User, AlertCircle, CheckCircle } from "lucide-react"
import { storage } from "../utils/storage"
import type { User as UserType } from "../types/knowledge-base"

interface UserManagementProps {
  currentUser?: UserType
}

export function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<UserType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    try {
      setIsLoading(true)
      const loadedUsers = storage.getUsers()
      setUsers(loadedUsers)
      setError("")
    } catch (error) {
      console.error("Error loading users:", error)
      setError("Failed to load users")
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      // Validate form
      if (!formData.username.trim()) {
        setError("Username is required")
        return
      }

      if (!formData.email.trim()) {
        setError("Email is required")
        return
      }

      // Check if username already exists
      if (users.some((user) => user.username.toLowerCase() === formData.username.toLowerCase())) {
        setError("Username already exists")
        return
      }

      // Check if email already exists
      if (users.some((user) => user.email.toLowerCase() === formData.email.toLowerCase())) {
        setError("Email already exists")
        return
      }

      // Create new user
      const newUser: UserType = {
        id: Date.now().toString(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role,
        createdAt: new Date(),
        isActive: true,
      }

      const updatedUsers = [...users, newUser]
      storage.saveUsers(updatedUsers)
      setUsers(updatedUsers)

      // Add audit log entry
      storage.addAuditEntry({
        action: "user_created",
        performedBy: currentUser?.username || "system",
        timestamp: new Date(),
        details: `Created user: ${newUser.username} (${newUser.role})`,
      })

      setSuccess("User created successfully!")
      setFormData({ username: "", email: "", role: "viewer" })
      setIsCreateDialogOpen(false)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error creating user:", error)
      setError("Failed to create user")
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setError("")
    setSuccess("")

    try {
      // Validate form
      if (!formData.username.trim()) {
        setError("Username is required")
        return
      }

      if (!formData.email.trim()) {
        setError("Email is required")
        return
      }

      // Check if username already exists (excluding current user)
      if (
        users.some(
          (user) => user.id !== editingUser.id && user.username.toLowerCase() === formData.username.toLowerCase(),
        )
      ) {
        setError("Username already exists")
        return
      }

      // Check if email already exists (excluding current user)
      if (
        users.some((user) => user.id !== editingUser.id && user.email.toLowerCase() === formData.email.toLowerCase())
      ) {
        setError("Email already exists")
        return
      }

      // Update user
      const updatedUser: UserType = {
        ...editingUser,
        username: formData.username.trim(),
        email: formData.email.trim(),
        role: formData.role,
      }

      const updatedUsers = users.map((user) => (user.id === editingUser.id ? updatedUser : user))
      storage.saveUsers(updatedUsers)
      setUsers(updatedUsers)

      // Add audit log entry
      storage.addAuditEntry({
        action: "user_updated",
        performedBy: currentUser?.username || "system",
        timestamp: new Date(),
        details: `Updated user: ${updatedUser.username} (${updatedUser.role})`,
      })

      setSuccess("User updated successfully!")
      setFormData({ username: "", email: "", role: "viewer" })
      setIsEditDialogOpen(false)
      setEditingUser(null)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error updating user:", error)
      setError("Failed to update user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      const userToDelete = users.find((user) => user.id === userId)
      if (!userToDelete) return

      // Prevent deleting the current user
      if (currentUser && userToDelete.id === currentUser.id) {
        setError("You cannot delete your own account")
        return
      }

      // Prevent deleting the last admin
      const adminUsers = users.filter((user) => user.role === "admin")
      if (userToDelete.role === "admin" && adminUsers.length === 1) {
        setError("Cannot delete the last admin user")
        return
      }

      const updatedUsers = users.filter((user) => user.id !== userId)
      storage.saveUsers(updatedUsers)
      setUsers(updatedUsers)

      // Add audit log entry
      storage.addAuditEntry({
        action: "user_deleted",
        performedBy: currentUser?.username || "system",
        timestamp: new Date(),
        details: `Deleted user: ${userToDelete.username}`,
      })

      setSuccess("User deleted successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      console.error("Error deleting user:", error)
      setError("Failed to delete user")
    }
  }

  const handleEditClick = (user: UserType) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <UserCheck className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "editor":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="create-user-description">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription id="create-user-description">
                Add a new user to the knowledge base system
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-username">Username</Label>
                <Input
                  id="create-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger id="create-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">
                  Create User
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setFormData({ username: "", email: "", role: "viewer" })
                    setError("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert className="border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
          <CardDescription>Manage user accounts and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
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
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className="font-medium">{user.username}</span>
                        {currentUser && user.id === currentUser.id && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role) as any}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={currentUser && user.id === currentUser.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent aria-describedby="edit-user-description">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription id="edit-user-description">Update user information and permissions</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
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
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Update User
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingUser(null)
                  setFormData({ username: "", email: "", role: "viewer" })
                  setError("")
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
