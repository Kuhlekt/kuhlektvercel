"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle, User } from "lucide-react"
import { storage } from "../utils/storage"
import type { User as UserType } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  users: UserType[]
  onLogin: (user: UserType) => void
}

export function LoginModal({ isOpen, onClose, users = [], onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  console.log("LoginModal rendered with users:", users.length)
  console.log(
    "Users data:",
    users.map((u) => ({ username: u.username, role: u.role })),
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("Login attempt:", { username: username.trim(), password: password.trim() })
    console.log(
      "Available users:",
      users.map((u) => ({ username: u.username, password: u.password })),
    )

    try {
      const trimmedUsername = username.trim()
      const trimmedPassword = password.trim()

      if (!trimmedUsername || !trimmedPassword) {
        setError("Please enter both username and password")
        setIsLoading(false)
        return
      }

      const user = users.find((u) => u.username === trimmedUsername && u.password === trimmedPassword)
      console.log("User found:", user ? { username: user.username, role: user.role } : "No match")

      if (user) {
        const updatedUser = {
          ...user,
          lastLogin: new Date(),
        }

        // Update storage
        const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u))
        storage.saveUsers(updatedUsers)

        // Add audit log entry
        storage.addAuditEntry({
          action: "user_login",
          performedBy: user.username,
          timestamp: new Date(),
          details: `User ${user.username} logged in`,
        })

        console.log("Login successful for:", user.username)
        onLogin(updatedUser)
        setUsername("")
        setPassword("")
      } else {
        console.log("Login failed - invalid credentials")
        setError("Invalid username or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoCredentialClick = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername)
    setPassword(demoPassword)
    setError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription id="login-description">
            Enter your credentials to access the knowledge base
          </DialogDescription>
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
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 pt-4 border-t">
          <div className="text-sm text-gray-600 mb-3">Demo Credentials (click to fill):</div>
          <div className="space-y-2">
            <div
              className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => handleDemoCredentialClick("admin", "admin123")}
            >
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Admin:</span>
                <span className="text-sm">admin / admin123</span>
              </div>
            </div>
            <div
              className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => handleDemoCredentialClick("editor", "editor123")}
            >
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Editor:</span>
                <span className="text-sm">editor / editor123</span>
              </div>
            </div>
            <div
              className="flex items-center justify-between p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => handleDemoCredentialClick("viewer", "viewer123")}
            >
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Viewer:</span>
                <span className="text-sm">viewer / viewer123</span>
              </div>
            </div>
          </div>
        </div>

        {/* Debug info */}
        <div className="mt-4 p-2 bg-yellow-50 rounded text-xs text-gray-600">
          <div>Users loaded: {users.length}</div>
          <div>Available usernames: {users.map((u) => u.username).join(", ")}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
