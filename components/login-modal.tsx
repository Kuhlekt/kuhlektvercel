"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Lock, AlertCircle, X } from "lucide-react"
import type { User as UserType } from "@/types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: UserType) => void
  users: UserType[]
}

export function LoginModal({ isOpen, onClose, onLogin, users }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Clear form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername("")
      setPassword("")
      setError("")
      setShowPassword(false)
      setIsLoading(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("🔐 LoginModal - Attempting login for username:", username)
      console.log("🔐 LoginModal - Available users:", users?.map((u) => u.username) || [])

      // Validate inputs
      if (!username.trim()) {
        setError("Please enter a username")
        setIsLoading(false)
        return
      }

      if (!password.trim()) {
        setError("Please enter a password")
        setIsLoading(false)
        return
      }

      // Check if users array exists and has data
      if (!Array.isArray(users) || users.length === 0) {
        console.error("❌ LoginModal - No users available for authentication")
        setError("Authentication system not available. Please try again.")
        setIsLoading(false)
        return
      }

      // Find user by username
      const user = users.find((u) => u.username === username.trim())

      if (!user) {
        console.log("❌ LoginModal - User not found:", username)
        setError("Invalid username or password")
        setPassword("") // Clear password on failed login
        setIsLoading(false)
        return
      }

      // Check if user is active
      if (!user.isActive) {
        console.log("❌ LoginModal - User account is inactive:", username)
        setError("Account is inactive. Please contact an administrator.")
        setPassword("") // Clear password on failed login
        setIsLoading(false)
        return
      }

      // Verify password
      if (user.password !== password) {
        console.log("❌ LoginModal - Invalid password for user:", username)
        setError("Invalid username or password")
        setPassword("") // Clear password on failed login
        setIsLoading(false)
        return
      }

      console.log("✅ LoginModal - Login successful for user:", username, "Role:", user.role)

      // Successful login
      onLogin(user)
      onClose()
    } catch (error) {
      console.error("❌ LoginModal - Login error:", error)
      setError("An error occurred during login. Please try again.")
      setPassword("") // Clear password on error
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setUsername("")
    setPassword("")
    setError("")
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
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Login to Knowledge Base
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} disabled={isLoading}>
              Clear
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded-md">
          <p className="font-medium mb-1">Default Accounts:</p>
          <p>Admin: admin / admin123</p>
          <p>Editor: editor / editor123</p>
          <p>Viewer: viewer / viewer123</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
