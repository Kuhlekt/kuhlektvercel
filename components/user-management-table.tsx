"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Shield, Edit, Eye } from "lucide-react"
import type { User } from "../types/knowledge-base"

interface UserManagementTableProps {
  users: User[]
  currentUserId: string
  onDeleteUser: (userId: string) => void
}

export function UserManagementTable({ users, currentUserId, onDeleteUser }: UserManagementTableProps) {
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "editor":
        return <Edit className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Username</th>
                <th className="text-left p-2">Role</th>
                <th className="text-left p-2">Created</th>
                <th className="text-left p-2">Last Login</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{user.username}</span>
                      {user.id === currentUserId && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-2">
                    <Badge className={`flex items-center space-x-1 w-fit ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </Badge>
                  </td>
                  <td className="p-2 text-sm text-gray-600">{user.createdAt.toLocaleDateString()}</td>
                  <td className="p-2 text-sm text-gray-600">
                    {user.lastLogin ? user.lastLogin.toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-2">
                    {user.id !== currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
