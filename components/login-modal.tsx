"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react"

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      console.log("🔐 LoginModal - Attempting login for:", username)
      const success = await onLogin(username.trim(), password)
      if (!success) {
        setError("Invalid username or password")
      } else {
        // Clear form on successful login
        setUsername("")
        setPassword("")
        setError("")
      }
    } catch (error) {
      console.error("❌ LoginModal - Login error:", error)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
    setError("")
    setShowPassword(false)
    onClose()
  }

  const fillCredentials = (user: string, pass: string) => {
    setUsername(user)
    setPassword(pass)
    setError("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Login to Knowledge Base
          </DialogTitle>
          <DialogDescription>
            Enter your credentials to access the knowledge base management features.
          </DialogDescription>
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>

        {/* Available Accounts - No passwords shown */}
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Available Accounts</CardTitle>
            <CardDescription className="text-xs">Click on any account to auto-fill the form</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 gap-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                className="justify-start h-auto p-2 bg-transparent"
                onClick={() => fillCredentials("admin", "admin123")}
                disabled={isLoading}
              >
                <div className="text-left">
                  <div className="font-medium">Administrator</div>
                  <div className="text-gray-500">Full system access</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start h-auto p-2 bg-transparent"
                onClick={() => fillCredentials("editor", "editor123")}
                disabled={isLoading}
              >
                <div className="text-left">
                  <div className="font-medium">Editor</div>
                  <div className="text-gray-500">Content management access</div>
                </div>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start h-auto p-2 bg-transparent"
                onClick={() => fillCredentials("viewer", "viewer123")}
                disabled={isLoading}
              >
                <div className="text-left">
                  <div className="font-medium">Viewer</div>
                  <div className="text-gray-500">Read-only access</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
