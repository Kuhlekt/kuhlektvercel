"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Eye, EyeOff, X } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (username: string, password: string) => Promise<boolean>
  error?: string
}

export function LoginModal({ isOpen, onClose, onLogin, error }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")

  // Clear form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername("")
      setPassword("")
      setShowPassword(false)
      setLoginError("")
    }
  }, [isOpen])

  // Clear password on failed login
  useEffect(() => {
    if (error) {
      setPassword("")
      setLoginError(error)
    }
  }, [error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setLoginError("Please enter both username and password")
      return
    }

    setIsLoading(true)
    setLoginError("")

    try {
      const success = await onLogin(username.trim(), password)
      if (!success) {
        setPassword("") // Clear password on failed login
        setLoginError("Invalid username or password")
      }
    } catch (err) {
      setPassword("") // Clear password on error
      setLoginError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setUsername("")
    setPassword("")
    setLoginError("")
    setShowPassword(false)
  }

  const handleClose = () => {
    handleClear()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Login Required
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0" aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
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
              autoFocus
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {(loginError || error) && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{loginError || error}</span>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} disabled={isLoading}>
              Clear
            </Button>
          </div>
        </form>

        <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded-md">
          <p className="font-medium mb-1">Default Accounts:</p>
          <p>Admin: admin / admin123</p>
          <p>Editor: editor / editor123</p>
          <p>Viewer: viewer / viewer123</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
