"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, LogIn } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: any) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("kb-users") || "[]")

      // Find user with matching username (password still checked internally but not shown)
      const user = users.find((u: any) => u.username === username)

      if (user) {
        // Store current user
        localStorage.setItem("kb-current-user", JSON.stringify(user))

        // Add audit log entry
        const auditLog = JSON.parse(localStorage.getItem("kb-audit-log") || "[]")
        auditLog.unshift({
          id: Date.now().toString(),
          action: "User Login",
          user: user.name,
          timestamp: new Date().toISOString(),
          details: `User ${user.name} logged in successfully`,
        })
        localStorage.setItem("kb-audit-log", JSON.stringify(auditLog))

        onLogin(user)
        onClose()
        setUsername("")
      } else {
        setError("Username not found")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (role: "admin" | "editor" | "viewer") => {
    const demoUsers = {
      admin: {
        id: "1",
        name: "Admin User",
        username: "admin",
        password: "admin123",
        role: "admin",
        email: "admin@example.com",
      },
      editor: {
        id: "2",
        name: "Editor User",
        username: "editor",
        password: "editor123",
        role: "editor",
        email: "editor@example.com",
      },
      viewer: {
        id: "3",
        name: "Viewer User",
        username: "viewer",
        password: "viewer123",
        role: "viewer",
        email: "viewer@example.com",
      },
    }

    const user = demoUsers[role]
    localStorage.setItem("kb-current-user", JSON.stringify(user))

    // Add audit log entry
    const auditLog = JSON.parse(localStorage.getItem("kb-audit-log") || "[]")
    auditLog.unshift({
      id: Date.now().toString(),
      action: "Demo Login",
      user: user.name,
      timestamp: new Date().toISOString(),
      details: `Demo login as ${role}`,
    })
    localStorage.setItem("kb-audit-log", JSON.stringify(auditLog))

    onLogin(user)
    onClose()
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
            Enter your username to access the admin dashboard
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
              placeholder="Enter username"
              required
              disabled={isLoading}
            />
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

        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">Quick Login:</p>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("admin")}
              className="w-full text-left justify-start"
            >
              Login as Admin
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("editor")}
              className="w-full text-left justify-start"
            >
              Login as Editor
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoLogin("viewer")}
              className="w-full text-left justify-start"
            >
              Login as Viewer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
