"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LogIn, AlertTriangle, User, Shield, FileEdit, Eye } from "lucide-react"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError("Username is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const users = storage.getUsers()
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())

      if (!user) {
        setError("User not found")
        setIsLoading(false)
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
        details: `User login: ${user.username} (${user.role})`,
      })

      onLogin({ ...user, lastLogin: new Date() })
      onClose()
      setUsername("")
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setUsername("")
    setError("")
    onClose()
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />
      case "editor":
        return <FileEdit className="h-3 w-3" />
      case "viewer":
        return <Eye className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
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

  // Get available users for demo purposes
  const availableUsers = storage.getUsers().slice(0, 3)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LogIn className="h-5 w-5" />
            <span>Login to Knowledge Base</span>
          </DialogTitle>
          <DialogDescription id="login-description">
            Enter your username to access the knowledge base system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || !username.trim()}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {availableUsers.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700">Available Demo Accounts:</div>
              <div className="space-y-2">
                {availableUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3 text-gray-500" />
                      <span className="text-sm font-medium">{user.username}</span>
                    </div>
                    <Badge variant={getRoleBadgeVariant(user.role)} className="flex items-center space-x-1">
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="text-xs text-gray-500">
                Use any of the usernames above to login. No password required for demo.
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
