"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { storage } from "../utils/storage"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Login attempt:", { username, password })

      const users = storage.getUsers()
      console.log(
        "Available users:",
        users.map((u) => ({ username: u.username, password: u.password })),
      )

      const user = users.find((u) => u.username.trim() === username.trim() && u.password === password)
      console.log("Found user:", user)

      if (user) {
        // Update last login
        const updatedUsers = users.map((u) => (u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u))
        storage.saveUsers(updatedUsers)
        storage.setCurrentUser(user)
        storage.addAuditEntry({
          userId: user.id,
          action: "LOGIN",
          details: `User ${user.username} logged in`,
        })

        console.log("Login successful")
        onLogin(user)
        onClose()
        setUsername("")
        setPassword("")
      } else {
        console.log("Login failed - invalid credentials")
        setError("Invalid username or password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
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
              placeholder="Enter username"
              required
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
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <strong>Default credentials:</strong>
            <br />
            Username: admin
            <br />
            Password: admin123
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
