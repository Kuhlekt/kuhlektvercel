"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { User, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"

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
      const success = await onLogin(username, password)

      if (success) {
        console.log("✅ LoginModal - Login successful")
        setUsername("")
        setPassword("")
        setError("")
        onClose()
      } else {
        console.log("❌ LoginModal - Login failed")
        setError("Invalid username or password")
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

  const defaultCredentials = [
    { username: "admin", password: "admin123", role: "Administrator" },
    { username: "editor", password: "editor123", role: "Editor" },
    { username: "viewer", password: "viewer123", role: "Viewer" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Sign In</span>
          </DialogTitle>
          <DialogDescription>Enter your credentials to access the knowledge base administration</DialogDescription>
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
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="pl-10"
                autoFocus
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="pl-10 pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>

        {/* Default Credentials Help */}
        <Card className="mt-4">
          <CardContent className="pt-4">
            <h4 className="text-sm font-medium mb-2">Default Credentials:</h4>
            <div className="space-y-1 text-xs">
              {defaultCredentials.map((cred) => (
                <div key={cred.username} className="flex justify-between items-center">
                  <span className="font-mono">
                    {cred.username}/{cred.password}
                  </span>
                  <span className="text-gray-500">({cred.role})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
