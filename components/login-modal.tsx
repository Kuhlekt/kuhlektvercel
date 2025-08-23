"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (username: string, password: string) => Promise<boolean>
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const success = await onLogin(username.trim(), password)

      if (success) {
        setUsername("")
        setPassword("")
        onClose()
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle>Login to Knowledge Base</DialogTitle>
          <DialogDescription id="login-description">
            Enter your credentials to access the knowledge base system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
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

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 mb-2">Demo Accounts:</p>
          <div className="text-xs space-y-1">
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
