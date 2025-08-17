"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, LogIn } from "lucide-react"
import { storage } from "../utils/storage"
import type { User as UserType } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: UserType) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const users = storage.getUsers()
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())

      if (!user) {
        setError("User not found")
        return
      }

      // Update last login
      user.lastLogin = new Date()
      storage.saveUsers(users)

      // Add audit log entry
      storage.addAuditEntry({
        action: "user_login",
        entityType: "user",
        entityId: user.id,
        performedBy: user.username,
        timestamp: new Date(),
        details: `User ${user.username} logged in`,
      })

      onLogin(user)
      onClose()
      setUsername("")
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: "admin" | "editor" | "viewer") => {
    setIsLoading(true)
    setError("")

    try {
      const users = storage.getUsers()
      let demoUser = users.find((u) => u.role === role && u.username.includes("demo"))

      if (!demoUser) {
        // Create demo user if not exists
        demoUser = {
          id: `demo-${role}-${Date.now()}`,
          username: `demo-${role}`,
          email: `demo-${role}@example.com`,
          role,
          isActive: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        }
        users.push(demoUser)
        storage.saveUsers(users)
      } else {
        demoUser.lastLogin = new Date()
        storage.saveUsers(users)
      }

      storage.addAuditEntry({
        action: "demo_login",
        entityType: "user",
        entityId: demoUser.id,
        performedBy: demoUser.username,
        timestamp: new Date(),
        details: `Demo ${role} login`,
      })

      onLogin(demoUser)
      onClose()
      setUsername("")
    } catch (error) {
      console.error("Demo login error:", error)
      setError("Demo login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or try demo accounts</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("admin")}
              disabled={isLoading}
              className="text-xs"
            >
              Demo Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("editor")}
              disabled={isLoading}
              className="text-xs"
            >
              Demo Editor
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("viewer")}
              disabled={isLoading}
              className="text-xs"
            >
              Demo Viewer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
