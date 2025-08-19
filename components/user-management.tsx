"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, Edit, Trash2, Search, Shield, Eye, AlertTriangle, CheckCircle } from "lucide-react"
import type { User, AuditLogEntry } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function UserManagement({ users, onUsersUpdate, onAuditLogUpdate }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const addAuditEntry = (action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: Date.now().toString(),
      action: action as any,
      entityType: "user",
      performedBy: "admin",
      timestamp: new Date(),
      details,
    }
    onAuditLogUpdate([entry])
  }

  const handleAddUser = () => {
    if (!newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      setMessage({ type: "error", text: "Please fill in all fields" })
      return
    }

    if (users.some((u) => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      setMessage({ type: "error", text: "Username already exists" })
      return
    }

    if (users.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
      setMessage({ type: "error", text: "Email already exists" })
      return
    }

    const user: User = {
      id: Date.now().toString(),
      username: newUser.username.trim(),
      email: newUser.email.trim(),
      password: newUser.password.trim(),
      role: newUser.role,
      createdAt: new Date(),
    }

    const updatedUsers = [...users, user]
    onUsersUpdate(updatedUsers)
    addAuditEntry("user_created", `Created user: ${user.username} (${user.role})`)

    setNewUser({ username: "", email: "", password: "", role: "viewer" })
    setShowAddDialog(false)
    setMessage({ type: "success", text: "User created successfully" })
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewUser({
      username: user.username,
      email: user.email,
      password: (user as any).password || "",
      role: user.role,
    })
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    if (!newUser.username.trim() || !newUser.email.trim()) {
      setMessage({ type: "error", text: "Please fill in all fields" })
      return
    }

    const updatedUsers = users.map((u) =>
      u.id === editingUser.id
        ? {
            ...u,
            username: newUser.username.trim(),
            email: newUser.email.trim(),
            password: newUser.password.trim() || (u as any).password,
            role: newUser.role,
          }
        : u,
    )

    onUsersUpdate(updatedUsers)
    addAuditEntry("user_updated", `Updated user: ${newUser.username} (${newUser.role})`)

    setEditingUser(null)
    setNewUser({ username: "", email: "", password: "", role: "viewer" })
    setMessage({ type: "success", text: "User updated successfully" })
  }

  const handleDeleteUser = (user: User) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return
    }

    const updatedUsers = users.filter((u) => u.id !== user.id)
    onUsersUpdate(updatedUsers)
    addAuditEntry("user_deleted", `Deleted user: ${user.username}`)
    setMessage({ type: "success", text: "User deleted successfully" })
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
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "editor":
        return "secondary"
      case "viewer":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">User Management</h3>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="add-user-description">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div id="add-user-description" className="text-sm text-gray-600 mb-4">
              Create a new user account with specified role and permissions
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
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
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Create User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Message */}
      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          {message.type === "error" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getRoleIcon(user.role)}
                  <CardTitle className="text-lg">{user.username}</CardTitle>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <p>{user.email}</p>
                <p>Created: {user.createdAt.toLocaleDateString()}</p>
                {user.lastLogin && <p>Last login: {user.lastLogin.toLocaleDateString()}</p>}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteUser(user)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No users found</p>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent aria-describedby="edit-user-description">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <div id="edit-user-description" className="text-sm text-gray-600 mb-4">
            Update user account information and permissions
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Password (leave blank to keep current)</Label>
              <Input
                id="edit-password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
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
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Update User</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
