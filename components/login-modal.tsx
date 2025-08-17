"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { User, Shield, Edit, Eye, AlertTriangle } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  users: UserType[]
  onLogin: (user: UserType) => void
}

export function LoginModal({ isOpen, onClose, users, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!username.trim()) {
        setError("Please enter a username")
        return
      }

      const user = users.find((u) => u.username === username.trim())
      if (!user) {
        setError("User not found")
        return
      }

      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date(),
      }

      onLogin(updatedUser)
      setUsername("")
      setError("")
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoUser: UserType) => {
    const updatedUser = {
      ...demoUser,
      lastLogin: new Date(),
    }
    onLogin(updatedUser)
    setUsername("")
    setError("")
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive" as const
      case "editor":
        return "default" as const
      case "viewer":
        return "secondary" as const
      default:
        return "outline" as const
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle>Login to Knowledge Base</DialogTitle>
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Demo Login Section */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="text-sm font-medium mb-3">Quick Demo Login:</h4>
          <div className="space-y-2">
            {users.slice(0, 3).map((user) => (
              <Button
                key={user.id}
                variant="outline"
                size="sm"
                className="w-full justify-start bg-transparent"
                onClick={() => handleDemoLogin(user)}
              >
                <div className="flex items-center space-x-2">
                  {getRoleIcon(user.role)}
                  <span>{user.name}</span>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="ml-auto">
                    {user.role}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
