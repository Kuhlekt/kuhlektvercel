'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { getUsers, addUser } from '../utils/storage'
import { User } from '../types/knowledge-base'
import { Plus, Users, Shield, Eye } from 'lucide-react'

interface UserManagementProps {
  currentUser: User
}

export function UserManagement({ currentUser }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    setUsers(getUsers())
  }

  const handleCreateUser = () => {
    if (!formData.username || !formData.password) return

    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username,
      password: formData.password,
      role: formData.role,
      createdAt: new Date().toISOString()
    }

    addUser(newUser)
    loadUsers()
    setIsCreateModalOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: 'viewer'
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-600" />
      case 'editor':
        return <Users className="h-4 w-4 text-blue-600" />
      case 'viewer':
        return <Eye className="h-4 w-4 text-green-600" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'editor':
        return 'default'
      case 'viewer':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        {currentUser.role === 'admin' && (
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        )}
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {users.map(user => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <div>
                      <h3 className="font-semibold">{user.username}</h3>
                      <p className="text-sm text-gray-500">
                        Created {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(user.role) as any}>
                    {user.role}
                  </Badge>
                  {user.id === currentUser.id && (
                    <Badge variant="outline">Current User</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create User Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Admin:</strong> Full system access</p>
              <p><strong>Editor:</strong> Can create and edit content</p>
              <p><strong>Viewer:</strong> Read-only access</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateUser}>
                Add User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
