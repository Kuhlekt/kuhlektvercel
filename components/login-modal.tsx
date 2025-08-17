"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User, AlertCircle } from "lucide-react"
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

  const users = storage.getUsers()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!username.trim()) {
        setError("Please enter a username")
        return
      }

      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())

      if (!user) {
        setError("User not found")
        return
      }

      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date(),
      }

      // Update users in storage
      const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
      storage.saveUsers(updatedUsers)

      // Add audit log entry
      storage.addAuditEntry({
        action: "user_login",
        entityType: "user",
        entityId: user.id,
        performedBy: user.username,
        timestamp: new Date(),
        details: `User login: ${user.username}`,
      })

      onLogin(updatedUser)
      setUsername("")
    } catch (err) {
      setError("Login failed. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoUser: KnowledgeBaseUser) => {
    setUsername(demoUser.username)
    // Auto-submit after setting username
    setTimeout(() => {
      const form = document.getElementById("login-form") as HTMLFormElement
      if (form) {
        form.requestSubmit()
      }
    }, 100)
  }

  const handleClose = () => {
    setUsername("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Login to Knowledge Base</span>
          </DialogTitle>
          <DialogDescription id="login-description">
            Enter your username to access the knowledge base system.
          </DialogDescription>
        </DialogHeader>

        <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !username.trim()}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>

        {/* Demo Accounts */}
        {users.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Demo Accounts</h4>
            <div className="space-y-2">
              {users.map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(user)}
                  disabled={isLoading}
                  className="w-full justify-between"
                >
                  <span>{user.username}</span>
                  <Badge
                    variant={user.role === "admin" ? "destructive" : user.role === "editor" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
