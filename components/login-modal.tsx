"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LogIn, Shield, Edit, Eye, AlertCircle } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (username: string, password: string) => Promise<boolean>
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const success = await onLogin(username, password)
      if (!success) {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user)
    setPassword(pass)
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
    setError(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <LogIn className="h-5 w-5 mr-2" />
            Login to Knowledge Base
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Quick Login Options */}
          <div className="space-y-3">
            <div className="text-sm font-medium text-gray-700">Quick Login Options:</div>

            <div className="grid gap-2">
              <Card
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleQuickLogin("admin", "admin123")}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-red-600" />
                      <div>
                        <div className="font-medium">Administrator</div>
                        <div className="text-xs text-gray-500">Full system access</div>
                      </div>
                    </div>
                    <Badge variant="default">Admin</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleQuickLogin("editor", "editor123")}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Edit className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">Editor</div>
                        <div className="text-xs text-gray-500">Content management</div>
                      </div>
                    </div>
                    <Badge variant="secondary">Editor</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleQuickLogin("viewer", "viewer123")}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">Viewer</div>
                        <div className="text-xs text-gray-500">Read-only access</div>
                      </div>
                    </div>
                    <Badge variant="outline">Viewer</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
