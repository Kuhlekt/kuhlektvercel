"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit } from "lucide-react"
import { storage } from "../utils/storage"
import type { User } from "../types/knowledge-base"

interface UserManagementProps {
  users: User[]
  onUpdateUsers: (users: User[]) => void
  currentUser: User
}

export function UserManagement({ users, onUpdateUsers, currentUser }: UserManagementProps) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer" as "admin" | "editor" | "viewer",
  })

  const handleAddUser = () => {
    if (!newUser.username || !newUser.email || !newUser.password) return

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      createdAt: new Date(),
    }

    const updatedUsers = [...users, user]
    onUpdateUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
    storage.addAuditEntry({
      userId: currentUser.id,
      action: "CREATE_USER",
      details: `Created user ${user.username}`,
    })

    setNewUser({ username: "", email: "", password: "", role: "viewer" })
    setIsAddUserOpen(false)
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser.id) return // Can't delete self

    const updatedUsers = users.filter((u) => u.id !== userId)
    onUpdateUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
    storage.addAuditEntry({
      userId: currentUser.id,
      action: "DELETE_USER",
      details: `Deleted user ${users.find((u) => u.id === userId)?.username}`,
    })
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    const updatedUsers = users.map((u) => (u.id === editingUser.id ? editingUser : u))
    onUpdateUsers(updatedUsers)
    storage.saveUsers(updatedUsers)
    storage.addAuditEntry({
      userId: currentUser.id,
      action: "UPDATE_USER",
      details: `Updated user ${editingUser.username}`,
    })

    setEditingUser(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">User Management</h3>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
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
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add User</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-gray-50">
          <div>Username</div>
          <div>Email</div>
          <div>Role</div>
          <div>Created</div>
          <div>Actions</div>
        </div>
        {users.map((user) => (
          <div key={user.id} className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0">
            <div className="font-medium">{user.username}</div>
            <div className="text-gray-600">{user.email}</div>
            <div>
              <Badge variant={user.role === "admin" ? "default" : user.role === "editor" ? "secondary" : "outline"}>
                {user.role}
              </Badge>
            </div>
            <div className="text-gray-600">{user.createdAt.toLocaleDateString()}</div>
            <div className="flex space-x-2">
              <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                  </DialogHeader>
                  {editingUser && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="edit-username">Username</Label>
                        <Input
                          id="edit-username"
                          value={editingUser.username}
                          onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editingUser.email}
                          onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-role">Role</Label>
                        <Select
                          value={editingUser.role}
                          onValueChange={(value: any) => setEditingUser({ ...editingUser, role: value })}
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
                        <Button variant="outline" onClick={() => setEditingUser(null)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateUser}>Update User</Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              {user.id !== currentUser.id && (
                <Button variant="outline" size="sm" onClick={() => handleDeleteUser(user.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
