"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { User, AlertCircle } from "lucide-react"
import type { User as KnowledgeBaseUser } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  users: KnowledgeBaseUser[]
  onLogin: (user: KnowledgeBaseUser) => void
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
      if (!username.trim()) {
        setError("Please enter a username")
        return
      }

      if (!password.trim()) {
        setError("Please enter a password")
        return
      }

      const user = users.find((u) => u.username === username && u.password === password)

      if (!user) {
        setError("Invalid username or password")
        return
      }

      onLogin(user)
      setUsername("")
      setPassword("")
    } catch (err) {
      setError("Login failed. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoUser: KnowledgeBaseUser) => {
    onLogin(demoUser)
    setUsername("")
    setPassword("")
    setError("")
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
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
          <DialogDescription id="login-description">Enter your credentials to access admin features.</DialogDescription>
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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              autoComplete="current-password"
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
            <Button type="submit" disabled={isLoading || !username.trim() || !password.trim()}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </form>

        {/* Demo Accounts */}
        {Array.isArray(users) && users.length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Demo Account</h4>
            <div className="space-y-2">
              {users.slice(0, 1).map((user) => (
                <Button
                  key={user.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(user)}
                  disabled={isLoading}
                  className="w-full justify-between"
                >
                  <span>{user.username}</span>
                  <Badge variant="secondary">{user.role}</Badge>
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Click to login with demo credentials</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
