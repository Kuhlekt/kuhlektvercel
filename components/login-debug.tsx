"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Shield, Eye, Edit, LogOut } from "lucide-react"

interface LoginDebugProps {
  onLogin: (user: any) => void
  currentUser?: any
  onLogout: () => void
}

export function LoginDebug({ onLogin, currentUser, onLogout }: LoginDebugProps) {
  const [debugInfo, setDebugInfo] = useState("")

  const demoUsers = [
    {
      id: "1",
      name: "Admin User",
      username: "admin",
      role: "admin",
      email: "admin@example.com",
      permissions: ["read", "write", "delete", "manage_users", "manage_system"],
    },
    {
      id: "2",
      name: "Editor User",
      username: "editor",
      role: "editor",
      email: "editor@example.com",
      permissions: ["read", "write"],
    },
    {
      id: "3",
      name: "Viewer User",
      username: "viewer",
      role: "viewer",
      email: "viewer@example.com",
      permissions: ["read"],
    },
  ]

  const handleLogin = (user: any) => {
    // Store user in localStorage
    localStorage.setItem("kb-current-user", JSON.stringify(user))

    // Add audit log entry
    const auditLog = JSON.parse(localStorage.getItem("kb-audit-log") || "[]")
    auditLog.unshift({
      id: Date.now().toString(),
      action: "Debug Login",
      user: user.name,
      timestamp: new Date().toISOString(),
      details: `Debug login as ${user.role}`,
    })
    localStorage.setItem("kb-audit-log", JSON.stringify(auditLog))

    setDebugInfo(`Logged in as ${user.name} (${user.role})`)
    onLogin(user)
  }

  const handleLogout = () => {
    localStorage.removeItem("kb-current-user")
    setDebugInfo("Logged out")
    onLogout()
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
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentUser ? (
          <div className="space-y-4">
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription>
                Currently logged in as <strong>{currentUser.name}</strong> ({currentUser.role})
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                {getRoleIcon(currentUser.role)}
                <div>
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
                <Badge variant={getRoleColor(currentUser.role) as any}>{currentUser.role}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click any user below to login instantly (no password required):
            </p>

            <div className="grid gap-3">
              {demoUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(user.role)}
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant={getRoleColor(user.role) as any}>{user.role}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleLogin(user)}>
                    Login
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {debugInfo && (
          <Alert>
            <AlertDescription>{debugInfo}</AlertDescription>
          </Alert>
        )}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">Debug Panel - Remove this component in production</p>
        </div>
      </CardContent>
    </Card>
  )
}
