"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, User, Shield } from "lucide-react"
import type { User as KBUser } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  users: KBUser[]
  onLogin: (user: KBUser) => void
}

export function LoginModal({ isOpen, onClose, users, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      console.log("Attempting login with:", username)
      console.log(
        "Available users:",
        users.map((u) => ({ username: u.username, role: u.role })),
      )

      const user = users.find((u) => u.username === username && u.password === password)

      if (user) {
        console.log("Login successful for:", user.username)
        onLogin(user)
        setUsername("")
        setPassword("")
        setError("")
      } else {
        console.log("Login failed - user not found or wrong password")
        setError("Invalid username or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = (demoUser: KBUser) => {
    console.log("Demo login for:", demoUser.username)
    onLogin(demoUser)
    setUsername("")
    setPassword("")
    setError("")
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login to Knowledge Base</DialogTitle>
          <DialogDescription>Enter your credentials to access admin features</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
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
                placeholder="Enter password"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Demo Accounts */}
          {users.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <div className="text-sm font-medium text-gray-700">Demo Accounts:</div>
              <div className="grid gap-2">
                {users.slice(0, 4).map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(user)}
                    disabled={isLoading}
                    className="flex items-center justify-between w-full"
                  >
                    <div className="flex items-center space-x-2">
                      {user.role === "admin" ? (
                        <Shield className="h-4 w-4 text-red-500" />
                      ) : (
                        <User className="h-4 w-4 text-blue-500" />
                      )}
                      <span className="font-mono text-sm">{user.username}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {user.role}
                    </Badge>
                  </Button>
                ))}
              </div>
              <div className="text-xs text-gray-500 text-center">Click any demo account to login instantly</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
