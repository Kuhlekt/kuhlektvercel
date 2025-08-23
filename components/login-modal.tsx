"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { User } from "@/types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: User) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { apiDatabase } = await import("@/utils/api-database")
      const user = await apiDatabase.authenticateUser(username, password)

      if (user) {
        onLogin(user)
        setUsername("")
        setPassword("")
        onClose()
      } else {
        setError("Invalid username or password")
        setPassword("")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setUsername("")
    setPassword("")
    setError("")
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClear()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading || !username || !password} className="flex-1">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} disabled={isLoading}>
              Clear
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
          <p className="font-medium mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs">
            <div>
              <strong>Admin:</strong> admin / admin123
            </div>
            <div>
              <strong>Editor:</strong> editor / editor123
            </div>
            <div>
              <strong>Viewer:</strong> viewer / viewer123
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
