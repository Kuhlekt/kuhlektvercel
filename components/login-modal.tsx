"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const success = await onLogin(username, password)
      if (success) {
        setUsername("")
        setPassword("")
        setError(null)
        onClose()
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setUsername("")
      setPassword("")
      setError(null)
      onClose()
    }
  }

  const demoCredentials = [
    { role: "Administrator", username: "admin", password: "admin123" },
    { role: "Editor", username: "editor", password: "editor123" },
    { role: "Viewer", username: "viewer", password: "viewer123" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle>🔐 Login to Knowledge Base</DialogTitle>
          <DialogDescription id="login-description">
            Enter your credentials to access the knowledge base features
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Demo Accounts Info */}
          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="font-medium text-sm text-blue-900 mb-2">Demo Accounts:</h4>
            <div className="space-y-1 text-xs text-blue-800">
              {demoCredentials.map((cred) => (
                <div key={cred.username} className="flex justify-between">
                  <span className="font-medium">{cred.role}:</span>
                  <span>
                    {cred.username} / {cred.password}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <span className="text-red-500">⚠️</span>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Export as both named and default
export default LoginModal
