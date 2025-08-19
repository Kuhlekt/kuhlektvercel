"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { User } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: User) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple hardcoded authentication for demo
    const validUsers = [
      {
        id: "1",
        username: "admin",
        password: "admin123",
        role: "admin" as const,
        email: "admin@kuhlekt.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        username: "editor",
        password: "editor123",
        role: "editor" as const,
        email: "editor@kuhlekt.com",
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        username: "viewer",
        password: "viewer123",
        role: "viewer" as const,
        email: "viewer@kuhlekt.com",
        createdAt: new Date().toISOString(),
      },
    ]

    const user = validUsers.find((u) => u.username === username && u.password === password)

    setTimeout(() => {
      if (user) {
        const userWithLogin = { ...user, lastLogin: new Date().toISOString() }
        onLogin(userWithLogin)
        onClose()
        setUsername("")
        setPassword("")
      } else {
        setError("Invalid username or password")
      }
      setIsLoading(false)
    }, 500)
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
          <DialogTitle>Login to Knowledge Base</DialogTitle>
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
              required
              disabled={isLoading}
              autoFocus
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
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
          <p className="font-medium mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-gray-600">
            <p>
              <strong>Admin:</strong> admin / admin123
            </p>
            <p>
              <strong>Editor:</strong> editor / editor123
            </p>
            <p>
              <strong>Viewer:</strong> viewer / viewer123
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
