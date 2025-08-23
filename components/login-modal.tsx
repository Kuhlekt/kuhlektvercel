"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Lock, Shield, Edit, Eye, AlertCircle, X } from "lucide-react"

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

  // Clear form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername("")
      setPassword("")
      setError(null)
    }
  }, [isOpen])

  const clearForm = () => {
    setUsername("")
    setPassword("")
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const success = await onLogin(username, password)

      if (success) {
        clearForm()
        onClose()
      } else {
        setError("Invalid username or password")
        // Clear password on failed login for security
        setPassword("")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickLogin = (user: string, pass: string, role: string) => {
    setUsername(user)
    setPassword(pass)
    setError(null)
  }

  const handleClose = () => {
    clearForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Login to Knowledge Base
            </div>
            <Button variant="ghost" size="sm" onClick={clearForm} className="h-8 w-8 p-0" title="Clear form">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>Enter your credentials to access the knowledge base admin features</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Login Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Quick Login Options:</h4>
            <div className="space-y-2">
              <Card
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleQuickLogin("admin", "admin123", "admin")}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Admin</span>
                    </div>
                    <Badge variant="destructive">Full Access</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Complete system administration access</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleQuickLogin("editor", "editor123", "editor")}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Edit className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Editor</span>
                    </div>
                    <Badge variant="secondary">Content Management</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Create, edit, and manage articles</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleQuickLogin("viewer", "viewer123", "viewer")}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Viewer</span>
                    </div>
                    <Badge variant="outline">Read Only</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Browse and read articles only</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Manual Login Form */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Or login manually:</h4>
              <Button type="button" variant="ghost" size="sm" onClick={clearForm} className="text-xs">
                Clear
              </Button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
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
                  disabled={isLoading}
                  required
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
                  required
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
