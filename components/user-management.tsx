"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  UserPlus,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Shield,
  Eye,
  PenTool,
} from "lucide-react"
import { storage } from "../utils/storage"
import type { User } from "../types/knowledge-base"

interface UserManagementProps {
  currentUser?: User
}

export function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    try {
      const loadedUsers = storage.getUsers()
      setUsers(loadedUsers)
    } catch (error) {
      console.error("Error loading users:", error)
      setStatus({ type: "error", message: "Failed to load users" })
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.username.trim() || !newUser.email.trim()) {
      setStatus({ type: "error", message: "Username and email are required" })
      return
    }

    try {
      const existingUser = users.find(
        (u) =>
          u.username.toLowerCase() === newUser.username.toLowerCase() ||
          u.email.toLowerCase() === newUser.email.toLowerCase(),
      )

      if (existingUser) {
        setStatus({ type: "error", message: "Username or email already exists" })
        return
      }

      const user: User = {
        id: `user-${Date.now()}`,
        username: newUser.username.trim(),
        email: newUser.email.trim(),
        role: newUser.role,
        isActive: true,
        createdAt: new Date(),
        lastLogin: null,
      }

      const updatedUsers = [...users, user]
      storage.saveUsers(updatedUsers)
      setUsers(updatedUsers)

      // Add audit log entry
      storage.addAuditEntry({
        action: "user_created",
        entityType: "user",
        entityId: user.id,
        performedBy: currentUser?.username || "system",
        timestamp: new Date(),
        details: `Created user ${user.username} with role ${user.role}`,
      })

      setStatus({ type: "success", message: `User ${user.username} created successfully` })
      setNewUser({ username: "", email: "", role: "viewer" })
      setIsCreateDialogOpen(false)
    } catch (error) {
      console.error("Error creating user:", error)
      setStatus({ type: "error", message: "Failed to create user" })
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const updatedUsers = users.map((u) => (u.id === editingUser.id ? { ...editingUser } : u))
      storage.saveUsers(updatedUsers)
      setUsers(updatedUsers)

      storage.addAuditEntry({
        action: "user_updated",
        entityType: "user",
        entityId: editingUser.id,
        performedBy: currentUser?.username || "system",
        timestamp: new Date(),
        details: `Updated user ${editingUser.username}`,
      })

      setStatus({ type: "success", message: `User ${editingUser.username} updated successfully` })
      setEditingUser(null)
    } catch (error) {
      console.error("Error updating user:", error)
      setStatus({ type: "error", message: "Failed to update user" })
    }
  }

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete user ${user.username}?`)) {
      return
    }

    try {
      const updatedUsers = users.filter((u) => u.id !== user.id)
      storage.saveUsers(updatedUsers)
      setUsers(updatedUsers)

      storage.addAuditEntry({
        action: "user_deleted",
        entityType: "user",
        entityId: user.id,
        performedBy: currentUser?.username || "system",
        timestamp: new Date(),
        details: `Deleted user ${user.username}`,
      })

      setStatus({ type: "success", message: `User ${user.username} deleted successfully` })
    } catch (error) {
      console.error("Error deleting user:", error)
      setStatus({ type: "error", message: "Failed to delete user" })
    }
  }

  const toggleUserStatus = async (user: User) => {
    try {
      const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      storage.saveUsers(updatedUsers)
      setUsers(updatedUsers)

      storage.addAuditEntry({
        action: user.isActive ? "user_deactivated" : "user_activated",
        entityType: "user",
        entityId: user.id,
        performedBy: currentUser?.username || "system",
        timestamp: new Date(),
        details: `${user.isActive ? "Deactivated" : "Activated"} user ${user.username}`,
      })

      setStatus({
        type: "success",
        message: `User ${user.username} ${user.isActive ? "deactivated" : "activated"} successfully`,
      })
    } catch (error) {
      console.error("Error toggling user status:", error)
      setStatus({ type: "error", message: "Failed to update user status" })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <PenTool className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
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
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage system users and their permissions</p>
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
                Add a new user to the knowledge base system.
              </DialogDescription>
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
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "editor" | "viewer") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Read only access</SelectItem>
                    <SelectItem value="editor">Editor - Can create and edit articles</SelectItem>
                    <SelectItem value="admin">Admin - Full system access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateUser} className="w-full">
                Create User
              </Button>
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
            <span>Users ({users.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No users found. Create your first user to get started.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center space-x-1 w-fit">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? (
                        <div className="text-sm">
                          {user.lastLogin.toLocaleDateString()}
                          <br />
                          <span className="text-gray-500">{user.lastLogin.toLocaleTimeString()}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{user.createdAt.toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleUserStatus(user)}>
                            {user.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent aria-describedby="edit-user-description">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription id="edit-user-description">Update user information and permissions.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value: "admin" | "editor" | "viewer") =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Read only access</SelectItem>
                    <SelectItem value="editor">Editor - Can create and edit articles</SelectItem>
                    <SelectItem value="admin">Admin - Full system access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleUpdateUser} className="w-full">
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
