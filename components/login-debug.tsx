"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Shield, Eye, Edit, RefreshCw } from "lucide-react"

interface LoginDebugProps {
  onLogin: (user: any) => void
}

export function LoginDebug({ onLogin }: LoginDebugProps) {
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadUsers()
    loadCurrentUser()
  }, [])

  const loadUsers = () => {
    try {
      const storedUsers = localStorage.getItem("kb-users")
      if (storedUsers) {
        setUsers(JSON.parse(storedUsers))
      } else {
        // Initialize with default users
        const defaultUsers = [
          {
            id: "1",
            name: "Admin User",
            username: "admin",
            password: "admin123",
            role: "admin",
            email: "admin@example.com",
            createdAt: new Date().toISOString(),
            lastLogin: null,
          },
          {
            id: "2",
            name: "Editor User",
            username: "editor",
            password: "editor123",
            role: "editor",
            email: "editor@example.com",
            createdAt: new Date().toISOString(),
            lastLogin: null,
          },
          {
            id: "3",
            name: "Viewer User",
            username: "viewer",
            password: "viewer123",
            role: "viewer",
            email: "viewer@example.com",
            createdAt: new Date().toISOString(),
            lastLogin: null,
          },
        ]
        localStorage.setItem("kb-users", JSON.stringify(defaultUsers))
        setUsers(defaultUsers)
      }
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const loadCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("kb-current-user")
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading current user:", error)
    }
  }

  const handleLogin = (user: any) => {
    // Update last login
    const updatedUser = { ...user, lastLogin: new Date().toISOString() }

    // Update users array
    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
    localStorage.setItem("kb-users", JSON.stringify(updatedUsers))
    setUsers(updatedUsers)

    // Set current user
    localStorage.setItem("kb-current-user", JSON.stringify(updatedUser))
    setCurrentUser(updatedUser)

    // Add audit log
    const auditLog = JSON.parse(localStorage.getItem("kb-audit-log") || "[]")
    auditLog.unshift({
      id: Date.now().toString(),
      action: "Debug Login",
      user: user.name,
      timestamp: new Date().toISOString(),
      details: `Debug login as ${user.role}`,
    })
    localStorage.setItem("kb-audit-log", JSON.stringify(auditLog))

    onLogin(updatedUser)
  }

  const handleLogout = () => {
    localStorage.removeItem("kb-current-user")
    setCurrentUser(null)
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

  const getRoleColor = (role: string) => {
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>Login Debug Panel</span>
          <Button variant="outline" size="sm" onClick={loadUsers}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentUser && (
          <Alert>
            <User className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Currently logged in as: <strong>{currentUser.name}</strong> ({currentUser.role})
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Available Users ({users.length}):</h4>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found. Click refresh to load default users.</p>
          ) : (
            <div className="grid gap-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(user.role)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{user.name}</span>
                        <Badge variant={getRoleColor(user.role) as any}>{user.role}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLogin(user)}
                    disabled={currentUser?.id === user.id}
                  >
                    {currentUser?.id === user.id ? "Current" : "Login"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            This debug panel allows quick user switching for testing. Users are stored in localStorage.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
