"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Eye,
  FileEdit,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { storage } from "../utils/storage"
import type { User } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
}

export function UserManagement({ users = [], onUsersUpdate }: UserManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  // Form states
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })

  const [editUser, setEditUser] = useState({
    username: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })

  const handleCreateUser = () => {
    if (!newUser.username.trim() || !newUser.email.trim()) {
      setStatus({ type: "error", message: "Username and email are required" })
      return
    }

    // Check if username already exists
    if (users.some((user) => user.username === newUser.username)) {
      setStatus({ type: "error", message: "Username already exists" })
      return
    }

    // Check if email already exists
    if (users.some((user) => user.email === newUser.email)) {
      setStatus({ type: "error", message: "Email already exists" })
      return
    }

    try {
      const user: User = {
        id: Date.now().toString(),
        username: newUser.username.trim(),
        email: newUser.email.trim(),
        role: newUser.role,
        createdAt: new Date(),
        lastLogin: undefined,
      }

      const updatedUsers = [...users, user]
      storage.saveUsers(updatedUsers)
      onUsersUpdate(updatedUsers)

      // Add audit entry
      storage.addAuditEntry({
        action: "user_created",
        entityType: "user",
        entityId: user.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Created user: ${user.username} (${user.role})`,
      })

      setStatus({ type: "success", message: "User created successfully" })
      setNewUser({ username: "", email: "", role: "viewer" })
      setIsCreateDialogOpen(false)

      setTimeout(() => setStatus({ type: null, message: "" }), 3000)
    } catch (error) {
      console.error("Error creating user:", error)
      setStatus({ type: "error", message: "Failed to create user" })
    }
  }

  const handleEditUser = () => {
    if (!editingUser || !editUser.username.trim() || !editUser.email.trim()) {
      setStatus({ type: "error", message: "Username and email are required" })
      return
    }

    // Check if username already exists (excluding current user)
    if (users.some((user) => user.username === editUser.username && user.id !== editingUser.id)) {
      setStatus({ type: "error", message: "Username already exists" })
      return
    }

    // Check if email already exists (excluding current user)
    if (users.some((user) => user.email === editUser.email && user.id !== editingUser.id)) {
      setStatus({ type: "error", message: "Email already exists" })
      return
    }

    try {
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              username: editUser.username.trim(),
              email: editUser.email.trim(),
              role: editUser.role,
            }
          : user,
      )

      storage.saveUsers(updatedUsers)
      onUsersUpdate(updatedUsers)

      // Add audit entry
      storage.addAuditEntry({
        action: "user_updated",
        entityType: "user",
        entityId: editingUser.id,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Updated user: ${editUser.username} (${editUser.role})`,
      })

      setStatus({ type: "success", message: "User updated successfully" })
      setIsEditDialogOpen(false)
      setEditingUser(null)

      setTimeout(() => setStatus({ type: null, message: "" }), 3000)
    } catch (error) {
      console.error("Error updating user:", error)
      setStatus({ type: "error", message: "Failed to update user" })
    }
  }

  const handleDeleteUser = (user: User) => {
    if (user.role === "admin" && users.filter((u) => u.role === "admin").length === 1) {
      setStatus({ type: "error", message: "Cannot delete the last admin user" })
      return
    }

    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      try {
        const updatedUsers = users.filter((u) => u.id !== user.id)
        storage.saveUsers(updatedUsers)
        onUsersUpdate(updatedUsers)

        // Add audit entry
        storage.addAuditEntry({
          action: "user_deleted",
          entityType: "user",
          entityId: user.id,
          performedBy: "admin",
          timestamp: new Date(),
          details: `Deleted user: ${user.username} (${user.role})`,
        })

        setStatus({ type: "success", message: "User deleted successfully" })
        setTimeout(() => setStatus({ type: null, message: "" }), 3000)
      } catch (error) {
        console.error("Error deleting user:", error)
        setStatus({ type: "error", message: "Failed to delete user" })
      }
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setEditUser({
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
        return <FileEdit className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <Eye className="h-4 w-4" />
    }
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
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>Add a new user to the knowledge base system.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-username">Username</Label>
                <Input
                  id="new-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser}>Create User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Alert */}
      {status.type && (
        <Alert className={status.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          {status.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={status.type === "error" ? "text-red-800" : "text-green-800"}>
            {status.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>System Users</span>
          </CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center space-x-1 w-fit">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>{user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never"}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600"
                            disabled={user.role === "admin" && users.filter((u) => u.role === "admin").length === 1}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first user account.</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={editUser.role} onValueChange={(value: any) => setEditUser({ ...editUser, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditUser}>Update User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
