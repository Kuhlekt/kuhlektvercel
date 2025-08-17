"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bug, RefreshCw, LogIn, User, Shield, Eye, Edit, Trash2 } from "lucide-react"
import { storage } from "../utils/storage"
import { initialUsers } from "../data/initial-users"
import type { User as KnowledgeBaseUser } from "../types/knowledge-base"

interface LoginDebugProps {
  users: KnowledgeBaseUser[]
  onLogin: (user: KnowledgeBaseUser) => void
}

export function LoginDebug({ users: propUsers, onLogin }: LoginDebugProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [storageUsers, setStorageUsers] = useState<any[]>([])

  useEffect(() => {
    const storedUser = localStorage.getItem("kb-current-user")
    const storedUsers = localStorage.getItem("kb-users")

    setCurrentUser(storedUser ? JSON.parse(storedUser) : null)
    setStorageUsers(storedUsers ? JSON.parse(storedUsers) : [])
  }, [])

  const handleResetUsers = () => {
    try {
      storage.saveUsers(initialUsers)
      window.location.reload()
    } catch (error) {
      console.error("Failed to reset users:", error)
    }
  }

  const loginAs = (user: any) => {
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

    loadData()
    window.location.reload()
  }

  const logout = () => {
    localStorage.removeItem("kb-current-user")
    loadData()
    window.location.reload()
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
        return "bg-red-100 text-red-800"
      case "editor":
        return "bg-blue-100 text-blue-800"
      case "viewer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const loadData = () => {
    const storedUser = localStorage.getItem("kb-current-user")
    const storedUsers = localStorage.getItem("kb-users")

    setCurrentUser(storedUser ? JSON.parse(storedUser) : null)
    setStorageUsers(storedUsers ? JSON.parse(storedUsers) : [])
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug Login
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 overflow-y-auto">
      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-yellow-800 flex items-center space-x-2">
              <Bug className="h-4 w-4" />
              <span>Login Debug Panel</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
              ×
            </Button>
          </div>
          <CardDescription className="text-yellow-700">Debug login functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current User Status */}
          {currentUser ? (
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Logged in as <strong>{currentUser.name}</strong> ({currentUser.role})
                </span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertDescription>Not logged in</AlertDescription>
            </Alert>
          )}

          {/* Quick Login Buttons */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Available Users:</h4>
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>

            {propUsers.length > 0 || storageUsers.length > 0 || initialUsers.length > 0 ? (
              <div className="grid gap-2">
                {[...propUsers, ...storageUsers, ...initialUsers].map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className="font-medium">{user.username}</span>
                      <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      <span className="text-sm text-muted-foreground">({user.username})</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loginAs(user)}
                      disabled={currentUser?.id === user.id}
                    >
                      {currentUser?.id === user.id ? "Current" : "Login"}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No users found. Users will be created automatically when you first access the system.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Users from Props */}
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Users from Props ({propUsers.length})</h4>
            <div className="space-y-1">
              {propUsers.length > 0 ? (
                propUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      <span>{user.username}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => loginAs(user)} className="h-6 px-2 text-xs">
                      <LogIn className="h-3 w-3 mr-1" />
                      Login
                    </Button>
                  </div>
                ))
              ) : (
                <Alert className="py-2">
                  <AlertDescription className="text-xs">No users in props</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Users from Storage */}
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Users from Storage ({storageUsers.length})</h4>
            <div className="space-y-1">
              {storageUsers.length > 0 ? (
                storageUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                      <span>{user.username}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => loginAs(user)} className="h-6 px-2 text-xs">
                      <LogIn className="h-3 w-3 mr-1" />
                      Login
                    </Button>
                  </div>
                ))
              ) : (
                <Alert className="py-2">
                  <AlertDescription className="text-xs">No users in storage</AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Initial Users */}
          <div>
            <h4 className="text-sm font-medium text-yellow-800 mb-2">Initial Users ({initialUsers.length})</h4>
            <div className="space-y-1">
              {initialUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                    <span>
                      {user.username} / {user.password}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => loginAs(user)} className="h-6 px-2 text-xs">
                    <LogIn className="h-3 w-3 mr-1" />
                    Login
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <Button variant="destructive" size="sm" onClick={handleResetUsers} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Users to Initial State
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
