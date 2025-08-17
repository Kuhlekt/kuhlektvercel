"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { User, AlertCircle, Shield, UserCheck } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  users: UserType[]
  onLogin: (user: UserType) => void
}

export function LoginModal({ isOpen, onClose, users, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) {
      setError("Please enter a username")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Find user by username
      const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase())

      if (!user) {
        setError("User not found")
        setIsLoading(false)
        return
      }

      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date(),
      }

      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      onLogin(updatedUser)
      setUsername("")
      setError("")
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoUser: UserType) => {
    setIsLoading(true)
    setError("")

    // Update last login
    const updatedUser = {
      ...demoUser,
      lastLogin: new Date(),
    }

    // Simulate login delay
    setTimeout(() => {
      onLogin(updatedUser)
      setUsername("")
      setError("")
      setIsLoading(false)
    }, 300)
  }

  const handleClose = () => {
    setUsername("")
    setError("")
    onClose()
  }

  // Get demo users for quick login
  const adminUser = users.find((u) => u.role === "admin")
  const editorUser = users.find((u) => u.role === "editor")
  const viewerUser = users.find((u) => u.role === "viewer")

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Login to Knowledge Base</span>
          </DialogTitle>
          <DialogDescription id="login-description">Enter your username to access the admin features</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          {error && (
            <Alert className="border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* Demo Login Section */}
        {(adminUser || editorUser || viewerUser) && (
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
              </div>
            </div>

            <div className="grid gap-2">
              {adminUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(adminUser)}
                  disabled={isLoading}
                  className="justify-start"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">{adminUser.username}</span>
                  <Badge variant="destructive" className="ml-2">
                    Admin
                  </Badge>
                </Button>
              )}

              {editorUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(editorUser)}
                  disabled={isLoading}
                  className="justify-start"
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">{editorUser.username}</span>
                  <Badge variant="secondary" className="ml-2">
                    Editor
                  </Badge>
                </Button>
              )}

              {viewerUser && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin(viewerUser)}
                  disabled={isLoading}
                  className="justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">{viewerUser.username}</span>
                  <Badge variant="outline" className="ml-2">
                    Viewer
                  </Badge>
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
