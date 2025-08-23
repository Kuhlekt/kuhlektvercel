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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const user = await response.json()
        onLogin(user)
        onClose()
        setUsername("")
        setPassword("")
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Login failed")
        setPassword("")
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setError("Authentication failed. Please try again.")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setUsername("")
      setPassword("")
      setError("")
      onClose()
    }
  }

  const clearForm = () => {
    setUsername("")
    setPassword("")
    setError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle>Login to Knowledge Base</DialogTitle>
        </DialogHeader>
        <div id="login-description" className="sr-only">
          Enter your username and password to access the knowledge base
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              required
              disabled={isLoading}
            />
          </div>
          {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
          <div className="flex gap-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button type="button" variant="outline" onClick={clearForm}>
              Clear
            </Button>
          </div>
        </form>
        <div className="text-xs text-gray-500 mt-4">
          <p>
            <strong>Demo Accounts:</strong>
          </p>
          <p>Admin: admin / admin123</p>
          <p>Editor: editor / editor123</p>
          <p>Viewer: viewer / viewer123</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
