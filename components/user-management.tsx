"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Edit, Shield, Eye, AlertTriangle, CheckCircle, User } from "lucide-react"
import { storage } from "../utils/storage"
import type { User as UserType } from "../types/knowledge-base"

export function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserType | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  // Load users on component mount
  useEffect(() => {
    const loadUsers = () => {
      try {
        const loadedUsers = storage.getUsers()
        setUsers(loadedUsers || [])
      } catch (error) {
        console.error("Error loading users:", error)
        setUsers([])
      }
    }

    loadUsers()
  }, [])

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      email: "",
      role: "viewer",
    })
  }

  const handleCreateUser = () => {
    if (!formData.username || !formData.name) {
      setStatus({
        type: "error",
        message: "Username and name are required.",
      })
      return
    }

    if (users.some((user) => user.username === formData.username)) {
      setStatus({
        type: "error",
        message: "Username already exists.",
      })
      return
    }

    const newUser: UserType = {
      id: Date.now().toString(),
      username: formData.username,
      name: formData.name,
      email: formData.email,
      password: "demo123", // Default password, hidden from UI
      role: formData.role,
      createdAt: new Date(),
      lastLogin: null,
    }

    const updatedUsers = [...users, newUser]
    storage.saveUsers(updatedUsers)
    setUsers(updatedUsers)

    // Add audit entry
    storage.addAuditEntry({
      action: "user_created",
      articleId: undefined,
      articleTitle: undefined,
      categoryName: undefined,
      subcategoryName: undefined,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Created user: ${newUser.username} (${newUser.role})`,
    })

    setStatus({
      type: "success",
      message: `User "${newUser.username}" created successfully.`,
    })
    setIsCreateDialogOpen(false)
    resetForm()
  }

  const handleEditUser = () => {
    if (!editingUser || !formData.username || !formData.name) {
      setStatus({
        type: "error",
        message: "Username and name are required.",
      })
      return
    }

    if (users.some((user) => user.username === formData.username && user.id !== editingUser.id)) {
      setStatus({
        type: "error",
        message: "Username already exists.",
      })
      return
    }

    const updatedUser: UserType = {
      ...editingUser,
      username: formData.username,
      name: formData.name,
      email: formData.email,
      role: formData.role,
    }

    const updatedUsers = users.map((user) => (user.id === editingUser.id ? updatedUser : user))
    storage.saveUsers(updatedUsers)
    setUsers(updatedUsers)

    // Add audit entry
    storage.addAuditEntry({
      action: "user_updated",
      articleId: undefined,
      articleTitle: undefined,
      categoryName: undefined,
      subcategoryName: undefined,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Updated user: ${updatedUser.username}`,
    })

    setStatus({
      type: "success",
      message: `User "${updatedUser.username}" updated successfully.`,
    })
    setIsEditDialogOpen(false)
    setEditingUser(null)
    resetForm()
  }

  const handleDeleteUser = (user: UserType) => {
    if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return
    }

    const updatedUsers = users.filter((u) => u.id !== user.id)
    storage.saveUsers(updatedUsers)
    setUsers(updatedUsers)

    // Add audit entry
    storage.addAuditEntry({
      action: "user_deleted",
      articleId: undefined,
      articleTitle: undefined,
      categoryName: undefined,
      subcategoryName: undefined,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Deleted user: ${user.username}`,
    })

    setStatus({
      type: "success",
      message: `User "${user.username}" deleted successfully.`,
    })
  }

  const openEditDialog = (user: UserType) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email || "",
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive" as const
      case "editor":
        return "default" as const
      case "viewer":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
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
              <div>
                <Label htmlFor="create-username">Username</Label>
                <Input
                  id="create-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="create-name">Full Name</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="create-email">Email (Optional)</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="create-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                >
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Alert */}
      {status.type && (
        <Alert className={status.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {status.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={status.type === "success" ? "text-green-800" : "text-red-800"}>
            {status.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
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
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                      {user.email && <div className="text-sm text-gray-500">{user.email}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center space-x-1 w-fit">
                      {getRoleIcon(user.role)}
                      <span>{user.role}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>{user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No users found. Create your first user to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent aria-describedby="edit-user-description">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription id="edit-user-description">Update user information and permissions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div>
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email (Optional)</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as any })}>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Update User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
