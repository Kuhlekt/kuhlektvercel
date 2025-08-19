"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, AlertCircle, CheckCircle } from "lucide-react"
import type { User, AuditLogEntry } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
  auditLog: AuditLogEntry[]
}

export function UserManagement({ users, onUsersUpdate, onAuditLogUpdate, auditLog }: UserManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "viewer" as User["role"],
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      role: "viewer",
    })
  }

  const addAuditEntry = (action: string, entityId: string, details: string) => {
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action,
      entityType: "user",
      entityId,
      performedBy: "admin",
      timestamp: new Date(),
      details,
    }
    onAuditLogUpdate([auditEntry, ...auditLog])
  }

  const handleAddUser = () => {
    if (!formData.username.trim() || !formData.password.trim() || !formData.email.trim()) {
      setMessage({ type: "error", text: "All fields are required" })
      return
    }

    if (users.some((u) => u.username === formData.username.trim())) {
      setMessage({ type: "error", text: "Username already exists" })
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username.trim(),
      password: formData.password.trim(),
      email: formData.email.trim(),
      role: formData.role,
      createdAt: new Date(),
    }

    const updatedUsers = [...users, newUser]
    onUsersUpdate(updatedUsers)
    addAuditEntry("user_created", newUser.id, `Created user: ${newUser.username}`)

    setMessage({ type: "success", text: "User added successfully" })
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditUser = () => {
    if (!editingUser || !formData.username.trim() || !formData.email.trim()) {
      setMessage({ type: "error", text: "Username and email are required" })
      return
    }

    if (users.some((u) => u.id !== editingUser.id && u.username === formData.username.trim())) {
      setMessage({ type: "error", text: "Username already exists" })
      return
    }

    const updatedUser: User = {
      ...editingUser,
      username: formData.username.trim(),
      email: formData.email.trim(),
      role: formData.role,
      ...(formData.password.trim() && { password: formData.password.trim() }),
    }

    const updatedUsers = users.map((u) => (u.id === editingUser.id ? updatedUser : u))
    onUsersUpdate(updatedUsers)
    addAuditEntry("user_updated", updatedUser.id, `Updated user: ${updatedUser.username}`)

    setMessage({ type: "success", text: "User updated successfully" })
    setIsEditDialogOpen(false)
    setEditingUser(null)
    resetForm()
  }

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      const updatedUsers = users.filter((u) => u.id !== user.id)
      onUsersUpdate(updatedUsers)
      addAuditEntry("user_deleted", user.id, `Deleted user: ${user.username}`)
      setMessage({ type: "success", text: "User deleted successfully" })
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: "",
      email: user.email,
      role: user.role,
    })
    setIsEditDialogOpen(true)
  }

  const getRoleBadgeVariant = (role: User["role"]) => {
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
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setMessage(null)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="add-user-description">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription id="add-user-description">
                Create a new user account with the specified role and permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="add-username">Username</Label>
                <Input
                  id="add-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-password">Password</Label>
                <Input
                  id="add-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: User["role"]) => setFormData({ ...formData, role: value })}
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
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Users ({users.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
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
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}</TableCell>
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent aria-describedby="edit-user-description">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription id="edit-user-description">
              Update user account information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: User["role"]) => setFormData({ ...formData, role: value })}
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
