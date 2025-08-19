"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, AlertCircle } from "lucide-react"
import type { User } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
  onLogin: (user: User) => void
}

export function LoginModal({ isOpen, onClose, users, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("Login attempt:", { username, password, availableUsers: users.length })

      if (!username.trim()) {
        setError("Please enter a username")
        return
      }

      if (!password.trim()) {
        setError("Please enter a password")
        return
      }

      // Find user by username (case insensitive)
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())
      console.log("Found user:", user ? { id: user.id, username: user.username, role: user.role } : "none")

      if (!user) {
        setError("Invalid username or password")
        return
      }

      // Check password (exact match)
      if (user.password !== password) {
        console.log("Password mismatch:", { expected: user.password, provided: password })
        setError("Invalid username or password")
        return
      }

      console.log("Login successful for:", user.username)

      // Successful login
      onLogin(user)
      setUsername("")
      setPassword("")
      setError("")
    } catch (err) {
      console.error("Login error:", err)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    const adminUser = users.find((u) => u.username === "admin")
    console.log("Demo login - admin user:", adminUser)
    if (adminUser) {
      onLogin(adminUser)
      setUsername("")
      setPassword("")
      setError("")
    } else {
      setError("Admin user not found")
    }
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LogIn className="h-5 w-5" />
            <span>Login to Knowledge Base</span>
          </DialogTitle>
          <DialogDescription>Enter your credentials to access the knowledge base system.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button type="submit" disabled={isLoading || !username.trim() || !password.trim()}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Demo Account</span>
              </div>
            </div>

            <Button type="button" variant="outline" onClick={handleDemoLogin} disabled={isLoading}>
              Login as Admin (admin/admin123)
            </Button>
          </div>

          {/* Debug info - remove in production */}
          <div className="text-xs text-gray-500 mt-4 p-2 bg-gray-50 rounded">
            <div>Available users: {users.length}</div>
            {users.map((u) => (
              <div key={u.id}>
                {u.username} ({u.role})
              </div>
            ))}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
