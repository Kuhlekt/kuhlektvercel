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

      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())

      if (!user) {
        setError("Username not found")
        return
      }

      // Update user's last login
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

  const handleDemoLogin = (user: KnowledgeBaseUser) => {
    const updatedUser = {
      ...user,
      lastLogin: new Date(),
    }
    onLogin(updatedUser)
    setUsername("")
    setError("")
  }

  const handleClose = () => {
    setUsername("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Login to Knowledge Base</span>
          </DialogTitle>
          <DialogDescription>Enter your username to access the knowledge base system.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
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

          {/* Demo Accounts */}
          {users.length > 0 && (
            <div className="border-t pt-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</div>
              <div className="grid gap-2">
                {users.slice(0, 4).map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(user)}
                    disabled={isLoading}
                    className="justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm">{user.username}</span>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="text-xs text-gray-500 mt-2 text-center">Click any demo account to login instantly</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
