"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, LogIn, Lock } from "lucide-react"
import type { User } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  users: User[]
  onLogin: (user: User) => void
  onClose: () => void
}

export function LoginModal({ isOpen, users = [], onLogin, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  console.log("LoginModal rendered with users:", users.length)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    console.log("Login attempt:", { username, password: "***" })
    console.log(
      "Available users:",
      users.map((u) => ({ username: u.username, role: u.role })),
    )

    try {
      const trimmedUsername = username.trim()
      const user = users.find((u) => u.username === trimmedUsername && u.password === password)

      console.log("User found:", user ? { username: user.username, role: user.role } : "No match")

      if (user) {
        // Update last login
        user.lastLogin = new Date()
        onLogin(user)
        setUsername("")
        setPassword("")
        setError("")
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername)
    setPassword(demoPassword)
    setError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LogIn className="h-5 w-5" />
            <span>Sign In</span>
          </DialogTitle>
          <DialogDescription id="login-description">
            Enter your credentials to access the knowledge base
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <LogIn className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="pl-10"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                <strong>Admin:</strong> admin / admin123
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("admin", "admin123")}
                disabled={isLoading}
              >
                Fill
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                <strong>Editor:</strong> editor / editor123
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("editor", "editor123")}
                disabled={isLoading}
              >
                Fill
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                <strong>Viewer:</strong> viewer / viewer123
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("viewer", "viewer123")}
                disabled={isLoading}
              >
                Fill
              </Button>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs">
          <p className="text-blue-700">
            <strong>Debug:</strong> {users.length} users loaded
          </p>
          {users.length > 0 && (
            <p className="text-blue-600 mt-1">Available: {users.map((u) => u.username).join(", ")}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
