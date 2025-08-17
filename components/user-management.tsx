"use client"

import { useState } from "react"
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

interface UserManagementProps {
  users: any[]
  currentUser: any
  onUsersUpdate: (users: any[]) => void
  onAuditLogUpdate: (auditLog: any[]) => void
}

export function UserManagement({ users, currentUser, onUsersUpdate, onAuditLogUpdate }: UserManagementProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const resetForm = () => {
    setFormData({
      username: "",
      name: "",
      email: "",
      password: "",
      role: "viewer",
    })
  }

  const handleCreateUser = () => {
    if (!formData.username || !formData.name || !formData.password) {
      setStatus({
        type: "error",
        message: "Username, name, and password are required.",
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

    const newUser = {
      id: Date.now().toString(),
      username: formData.username,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      createdAt: new Date(),
      lastLogin: null,
    }

    const updatedUsers = [...users, newUser]
    storage.saveUsers(updatedUsers)
    onUsersUpdate(updatedUsers)

    // Add audit entry
    const auditEntry = {
      id: Date.now().toString(),
      action: "create_user",
      entityType: "user",
      entityId: newUser.id,
      timestamp: new Date(),
      performedBy: currentUser.username,
      details: `Created user: ${newUser.username} (${newUser.role})`,
      articleTitle: undefined,
      categoryName: undefined,
      subcategoryName: undefined,
    }

    const currentAuditLog = storage.getAuditLog()
    const updatedAuditLog = [auditEntry, ...currentAuditLog]
    storage.saveAuditLog(updatedAuditLog)
    onAuditLogUpdate(updatedAuditLog)

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

    const updatedUser = {
      ...editingUser,
      username: formData.username,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      ...(formData.password && { password: formData.password }),
    }

    const updatedUsers = users.map((user) => (user.id === editingUser.id ? updatedUser : user))
    storage.saveUsers(updatedUsers)
    onUsersUpdate(updatedUsers)

    // Add audit entry
    const auditEntry = {
      id: Date.now().toString(),
      action: "update_user",
      entityType: "user",
      entityId: updatedUser.id,
      timestamp: new Date(),
      performedBy: currentUser.username,
      details: `Updated user: ${updatedUser.username}`,
      articleTitle: undefined,
      categoryName: undefined,
      subcategoryName: undefined,
    }

    const currentAuditLog = storage.getAuditLog()
    const updatedAuditLog = [auditEntry, ...currentAuditLog]
    storage.saveAuditLog(updatedAuditLog)
    onAuditLogUpdate(updatedAuditLog)

    setStatus({
      type: "success",
      message: `User "${updatedUser.username}" updated successfully.`,
    })
    setIsEditDialogOpen(false)
    setEditingUser(null)
    resetForm()
  }

  const handleDeleteUser = (user) => {
    if (user.id === currentUser.id) {
      setStatus({
        type: "error",
        message: "You cannot delete your own account.",
      })
      return
    }

    if (!confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return
    }

    const updatedUsers = users.filter((u) => u.id !== user.id)
    storage.saveUsers(updatedUsers)
    onUsersUpdate(updatedUsers)

    // Add audit entry
    const auditEntry = {
      id: Date.now().toString(),
      action: "delete_user",
      entityType: "user",
      entityId: user.id,
      timestamp: new Date(),
      performedBy: currentUser.username,
      details: `Deleted user: ${user.username}`,
      articleTitle: undefined,
      categoryName: undefined,
      subcategoryName: undefined,
    }

    const currentAuditLog = storage.getAuditLog()
    const updatedAuditLog = [auditEntry, ...currentAuditLog]
    storage.saveAuditLog(updatedAuditLog)
    onAuditLogUpdate(updatedAuditLog)

    setStatus({
      type: "success",
      message: `User "${user.username}" deleted successfully.`,
    })
  }

  const openEditDialog = (user) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email || "",
      password: "",
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const getRoleIcon = (role) => {
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

  const getRoleBadgeVariant = (role) => {
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
                <Label htmlFor="create-password">Password</Label>
                <Input
                  id="create-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <div>
                <Label htmlFor="create-role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
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
                      {user.id !== currentUser.id && (
                        <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
              <Label htmlFor="edit-password">New Password (Leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
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
