"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { LogIn, AlertCircle, Shield, FileEdit, Eye } from "lucide-react"
import { storage } from "../utils/storage"
import type { KnowledgeBaseUser } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: KnowledgeBaseUser) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const users = storage.getUsers()
      const user = users.find((u) => u.username === username.trim())

      if (!user) {
        setError("User not found")
        return
      }

      // Update last login
      const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date() } : u))
      storage.saveUsers(updatedUsers)

      // Add audit entry
      storage.addAuditEntry({
        action: "user_login",
        entityType: "user",
        entityId: user.id,
        performedBy: user.username,
        timestamp: new Date(),
        details: `User logged in: ${user.username} (${user.role})`,
      })

      onLogin({ ...user, lastLogin: new Date() })
      setUsername("")
      onClose()
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoUsername: string) => {
    setUsername(demoUsername)
    setTimeout(() => handleLogin(), 100)
  }

  const getDemoUsers = () => {
    try {
      const users = storage.getUsers()
      return users.slice(0, 3) // Show first 3 users as demo options
    } catch (error) {
      return []
    }
  }

  const demoUsers = getDemoUsers()

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />
      case "editor":
        return <FileEdit className="h-3 w-3" />
      case "viewer":
        return <Eye className="h-3 w-3" />
      default:
        return <Shield className="h-3 w-3" /> // Changed from User to Shield
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
        return "secondary"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LogIn className="h-5 w-5" />
            <span>Login to Knowledge Base</span>
          </DialogTitle>
          <DialogDescription>Enter your username to access the knowledge base system.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Demo Users */}
          {demoUsers.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Quick Login (Demo Users)</Label>
              <div className="grid gap-2">
                {demoUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(user.username)}
                    disabled={isLoading}
                    className="justify-start h-auto p-3"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" /> {/* Changed from User to Shield */}
                        <span>{user.username}</span>
                      </div>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {demoUsers.length > 0 && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
              </div>
            </div>
          )}

          {/* Manual Login */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleLogin} disabled={isLoading || !username.trim()}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
