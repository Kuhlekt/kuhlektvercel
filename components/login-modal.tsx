"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn, X } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (username: string, password: string) => Promise<boolean>
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Clear form when modal opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setUsername("")
      setPassword("")
      setError("")
      setShowPassword(false)
    } else {
      onClose()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await onLogin(username.trim(), password)

      if (success) {
        // Clear form on successful login
        setUsername("")
        setPassword("")
        setError("")
        setShowPassword(false)
      } else {
        setError("Invalid username or password")
        // Clear password on failed login
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
    setShowPassword(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <LogIn className="h-5 w-5 mr-2" />
            Login to Knowledge Base
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to access the knowledge base management features.
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-10"
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

          <div className="flex items-center justify-between space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isLoading}
              className="flex items-center bg-transparent"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>

            <div className="flex space-x-2">
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 mb-2">Default accounts:</p>
          <div className="text-xs text-gray-500 space-y-1">
            <div>
              Admin: <code className="bg-white px-1 rounded">admin</code> /{" "}
              <code className="bg-white px-1 rounded">admin123</code>
            </div>
            <div>
              Editor: <code className="bg-white px-1 rounded">editor</code> /{" "}
              <code className="bg-white px-1 rounded">editor123</code>
            </div>
            <div>
              Viewer: <code className="bg-white px-1 rounded">viewer</code> /{" "}
              <code className="bg-white px-1 rounded">viewer123</code>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
