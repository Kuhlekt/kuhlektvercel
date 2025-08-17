"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogIn, AlertCircle, Lock } from "lucide-react"
import type { User as KnowledgeBaseUser } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  users?: KnowledgeBaseUser[]
  onLogin: (user: KnowledgeBaseUser) => void
}

export function LoginModal({ isOpen, users = [], onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  console.log("LoginModal rendered with users:", users)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    console.log("Login attempt:", { username: username.trim(), password: password.trim() })
    console.log(
      "Available users:",
      users.map((u) => ({ username: u.username, password: u.password })),
    )

    try {
      const trimmedUsername = username.trim()
      const trimmedPassword = password.trim()

      if (!trimmedUsername || !trimmedPassword) {
        setError("Please enter both username and password")
        return
      }

      const user = users.find((u) => u.username === trimmedUsername && u.password === trimmedPassword)

      console.log("Found user:", user)

      if (user) {
        // Update last login
        const updatedUser = { ...user, lastLogin: new Date() }
        onLogin(updatedUser)
        setUsername("")
        setPassword("")
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const fillCredentials = (user: KnowledgeBaseUser) => {
    setUsername(user.username)
    setPassword(user.password)
    setError("")
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" aria-describedby="login-description">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <LogIn className="h-5 w-5" />
            <span>Sign In to Kuhlekt KB</span>
          </DialogTitle>
        </DialogHeader>

        <div id="login-description" className="sr-only">
          Sign in to access the Kuhlekt Knowledge Base with your username and password
        </div>

        <div className="space-y-6">
          {/* Demo Credentials */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-blue-800">Demo Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {users.length > 0 ? (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => fillCredentials(user)}
                      className="text-left hover:bg-blue-100 p-2 rounded transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {user.role}
                        </Badge>
                        <span className="text-sm font-mono">
                          {user.username} / {user.password}
                        </span>
                      </div>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-blue-700">Loading users...</p>
              )}
            </CardContent>
          </Card>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Username</span>
              </Label>
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
              <Label htmlFor="password" className="flex items-center space-x-2">
                <Lock className="h-4 w-4" />
                <span>Password</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Debug Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Users loaded: {users.length}</p>
            <p>Click on demo credentials above to auto-fill the form</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
