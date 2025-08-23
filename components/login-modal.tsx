"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Trash2 } from "lucide-react"

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
      // Clear form when opening
      setUsername("")
      setPassword("")
      setError("")
      setShowPassword(false)
    } else {
      onClose()
    }
  }

  // Manual clear function
  const handleClearForm = () => {
    setUsername("")
    setPassword("")
    setError("")
    setShowPassword(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await onLogin(username, password)
      if (success) {
        // Clear form on successful login
        setUsername("")
        setPassword("")
        setError("")
        setShowPassword(false)
      } else {
        setError("Invalid username or password")
        // Clear password on failed login for security
        setPassword("")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
      // Clear password on error for security
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
          <DialogDescription>Enter your credentials to access the admin features</DialogDescription>
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
              placeholder="Enter username"
              required
              disabled={isLoading}
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
                placeholder="Enter password"
                required
                disabled={isLoading}
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

          <div className="flex justify-between space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearForm}
              disabled={isLoading}
              className="flex items-center space-x-2 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </Button>

            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
