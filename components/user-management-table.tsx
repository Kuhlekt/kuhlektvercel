"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Shield, Eye, AlertCircle, CheckCircle } from "lucide-react"
import { apiDatabase } from "../utils/api-database"
import type { User as KnowledgeBaseUser } from "../types/knowledge-base"

interface UserManagementTableProps {
  users: KnowledgeBaseUser[]
  onUsersUpdate: () => void
}

export function UserManagementTable({ users, onUsersUpdate }: UserManagementTableProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<KnowledgeBaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Form state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"admin" | "editor" | "viewer">("viewer")
  const [isActive, setIsActive] = useState(true)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const resetForm = () => {
    setUsername("")
    setPassword("")
    setEmail("")
    setRole("viewer")
    setIsActive(true)
    setError(null)
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    if (!password.trim()) {
      setError("Password is required")
      return
    }

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    // Check if username already exists
    if (users.some((user) => user.username === username.trim())) {
      setError("Username already exists")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const newUser: KnowledgeBaseUser = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        username: username.trim(),
        password: password.trim(),
        email: email.trim(),
        role,
        isActive,
        createdAt: new Date(),
        lastLogin: null,
      }

      const updatedUsers = [...users, newUser]

      await apiDatabase.saveData({ users: updatedUsers })

      showMessage("success", "User created successfully!")
      setShowAddDialog(false)
      resetForm()
      await onUsersUpdate()
    } catch (error) {
      console.error("Error creating user:", error)
      setError("Failed to create user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingUser) return

    if (!username.trim()) {
      setError("Username is required")
      return
    }

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    // Check if username already exists (excluding current user)
    if (users.some((user) => user.username === username.trim() && user.id !== editingUser.id)) {
      setError("Username already exists")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const updatedUsers = users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              username: username.trim(),
              email: email.trim(),
              role,
              isActive,
              // Only update password if a new one is provided
              ...(password.trim() ? { password: password.trim() } : {}),
            }
          : user,
      )

      await apiDatabase.saveData({ users: updatedUsers })

      showMessage("success", "User updated successfully!")
      setShowEditDialog(false)
      setEditingUser(null)
      resetForm()
      await onUsersUpdate()
    } catch (error) {
      console.error("Error updating user:", error)
      setError("Failed to update user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      return
    }

    try {
      setIsLoading(true)

      const updatedUsers = users.filter((user) => user.id !== userId)

      await apiDatabase.saveData({ users: updatedUsers })

      showMessage("success", "User deleted successfully!")
      await onUsersUpdate()
    } catch (error) {
      console.error("Error deleting user:", error)
      showMessage("error", "Failed to delete user. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const openEditDialog = (user: KnowledgeBaseUser) => {
    setEditingUser(user)
    setUsername(user.username)
    setPassword("") // Don't prefill password for security
    setEmail(user.email)
    setRole(user.role)
    setIsActive(user.isActive)
    setShowEditDialog(true)
  }

  const closeDialogs = () => {
    setShowAddDialog(false)
    setShowEditDialog(false)
    setEditingUser(null)
    resetForm()
  }

  const getRoleBadgeVariant = (role: string) => {
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />
      case "editor":
        return <Edit className="h-3 w-3" />
      case "viewer":
        return <Eye className="h-3 w-3" />
      default:
        return <Edit className="h-3 w-3" />
    }
  }

  const formatDate = (date: Date | string | null): string => {
    if (!date) return "Never"
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium mb-2">User Management</h3>
          <p className="text-sm text-gray-600">Manage user accounts and their access permissions.</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setShowAddDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with appropriate permissions.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddUser} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="add-username">Username *</Label>
                <Input
                  id="add-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-password">Password *</Label>
                <Input
                  id="add-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-email">Email *</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="add-role">Role *</Label>
                <Select value={role} onValueChange={(value: any) => setRole(value)} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin - Full system access</SelectItem>
                    <SelectItem value="editor">Editor - Content management</SelectItem>
                    <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="add-active" checked={isActive} onCheckedChange={setIsActive} disabled={isLoading} />
                <Label htmlFor="add-active">Active account</Label>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={closeDialogs} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user accounts, roles, and permissions.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Edit className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">{user.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center w-fit">
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(user.lastLogin)}</TableCell>
                    <TableCell className="text-sm text-gray-500">{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditDialog(user)} disabled={isLoading}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          disabled={isLoading}
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
          ) : (
            <div className="text-center py-12">
              <Edit className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first user account.</p>
              <Button
                onClick={() => {
                  resetForm()
                  setShowAddDialog(true)
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update the user account information and permissions.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="edit-username">Username *</Label>
              <Input
                id="edit-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500">Leave blank to keep the current password</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-role">Role *</Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin - Full system access</SelectItem>
                  <SelectItem value="editor">Editor - Content management</SelectItem>
                  <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="edit-active" checked={isActive} onCheckedChange={setIsActive} disabled={isLoading} />
              <Label htmlFor="edit-active">Active account</Label>
            </div>

            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update User
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={closeDialogs} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
