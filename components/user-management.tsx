"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Edit, Trash2, AlertCircle } from "lucide-react"
import type { User, AuditLogEntry } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function UserManagement({ users, onUsersUpdate, onAuditLogUpdate }: UserManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer" as const,
  })
  const [error, setError] = useState("")

  const handleAddUser = () => {
    setError("")

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All fields are required")
      return
    }

    if (users.some((u) => u.username === formData.username)) {
      setError("Username already exists")
      return
    }

    if (users.some((u) => u.email === formData.email)) {
      setError("Email already exists")
      return
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      createdAt: new Date(),
    }

    const updatedUsers = [...users, newUser]
    onUsersUpdate(updatedUsers)

    // Add audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "user_created",
      entityType: "user",
      entityId: newUser.id,
      performedBy: "admin", // You might want to pass current user
      timestamp: new Date(),
      details: `Created user: ${newUser.username} (${newUser.role})`,
    }

    setFormData({ username: "", email: "", password: "", role: "viewer" })
    setIsAddDialogOpen(false)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
    })
    setError("")
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    setError("")

    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError("All fields are required")
      return
    }

    if (users.some((u) => u.id !== editingUser.id && u.username === formData.username)) {
      setError("Username already exists")
      return
    }

    if (users.some((u) => u.id !== editingUser.id && u.email === formData.email)) {
      setError("Email already exists")
      return
    }

    const updatedUser: User = {
      ...editingUser,
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      updatedAt: new Date(),
    }

    const updatedUsers = users.map((u) => (u.id === editingUser.id ? updatedUser : u))
    onUsersUpdate(updatedUsers)

    setEditingUser(null)
    setFormData({ username: "", email: "", password: "", role: "viewer" })
  }

  const handleDeleteUser = (user: User) => {
    if (users.length === 1) {
      setError("Cannot delete the last user")
      return
    }

    const updatedUsers = users.filter((u) => u.id !== user.id)
    onUsersUpdate(updatedUsers)

    // Add audit entry
    const auditEntry: AuditLogEntry = {
      id: Date.now().toString(),
      action: "user_deleted",
      entityType: "user",
      entityId: user.id,
      performedBy: "admin",
      timestamp: new Date(),
      details: `Deleted user: ${user.username}`,
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
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>User Management</CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account for the knowledge base.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
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
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: any) => setFormData({ ...formData, role: value })}
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
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
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
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user account information.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

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
                <Label htmlFor="edit-password">Password</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
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

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser}>Update User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
