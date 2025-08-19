"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Users, Shield, Mail, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import type { User, AuditLogEntry } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
  auditLog: AuditLogEntry[]
}

export function UserManagement({ users, onUsersUpdate, onAuditLogUpdate, auditLog }: UserManagementProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer" as User["role"],
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "viewer",
    })
  }

  const addAuditEntry = (action: string, entityId: string, details: string) => {
    const entry: AuditLogEntry = {
      id: Date.now().toString(),
      action,
      entityType: "user",
      entityId,
      performedBy: "admin", // In a real app, this would be the current user
      timestamp: new Date(),
      details,
    }
    onAuditLogUpdate([entry, ...auditLog])
  }

  const handleCreateUser = () => {
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      showMessage("error", "Please fill in all required fields")
      return
    }

    if (users.some((u) => u.username.toLowerCase() === formData.username.toLowerCase())) {
      showMessage("error", "Username already exists")
      return
    }

    if (users.some((u) => u.email.toLowerCase() === formData.email.toLowerCase())) {
      showMessage("error", "Email already exists")
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      role: formData.role,
      createdAt: new Date(),
    }

    const updatedUsers = [...users, newUser]
    onUsersUpdate(updatedUsers)
    addAuditEntry("user_created", newUser.id, `Created user: ${newUser.username} (${newUser.role})`)

    setShowCreateDialog(false)
    resetForm()
    showMessage("success", `User ${newUser.username} created successfully`)
  }

  const handleEditUser = () => {
    if (!editingUser || !formData.username.trim() || !formData.email.trim()) {
      showMessage("error", "Please fill in all required fields")
      return
    }

    if (users.some((u) => u.id !== editingUser.id && u.username.toLowerCase() === formData.username.toLowerCase())) {
      showMessage("error", "Username already exists")
      return
    }

    if (users.some((u) => u.id !== editingUser.id && u.email.toLowerCase() === formData.email.toLowerCase())) {
      showMessage("error", "Email already exists")
      return
    }

    const updatedUser: User = {
      ...editingUser,
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim() || editingUser.password,
      role: formData.role,
    }

    const updatedUsers = users.map((u) => (u.id === editingUser.id ? updatedUser : u))
    onUsersUpdate(updatedUsers)
    addAuditEntry("user_updated", updatedUser.id, `Updated user: ${updatedUser.username}`)

    setShowEditDialog(false)
    setEditingUser(null)
    resetForm()
    showMessage("success", `User ${updatedUser.username} updated successfully`)
  }

  const handleDeleteUser = (user: User) => {
    if (users.length === 1) {
      showMessage("error", "Cannot delete the last user")
      return
    }

    if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return
    }

    const updatedUsers = users.filter((u) => u.id !== user.id)
    onUsersUpdate(updatedUsers)
    addAuditEntry("user_deleted", user.id, `Deleted user: ${user.username}`)
    showMessage("success", `User ${user.username} deleted successfully`)
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    })
    setShowEditDialog(true)
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
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>User Management</span>
            </CardTitle>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{user.username}</span>
                      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                      {user.lastLogin && (
                        <div className="flex items-center space-x-1">
                          <Shield className="h-3 w-3" />
                          <span>Last login {new Date(user.lastLogin).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user)}
                    disabled={users.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the knowledge base system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="create-username">Username *</Label>
              <Input
                id="create-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email *</Label>
              <Input
                id="create-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Password *</Label>
              <Input
                id="create-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: User["role"]) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>Create User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username *</Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Leave blank to keep current password"
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
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditDialog(false)
                  setEditingUser(null)
                  resetForm()
                }}
              >
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
