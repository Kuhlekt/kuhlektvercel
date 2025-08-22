"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { User, Lock, AlertCircle } from "lucide-react"
import type { User as UserType } from "../types/knowledge-base"
import { apiDatabase } from "../utils/api-database"
import Image from "next/image"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: UserType) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const users = await apiDatabase.getUsers()
      const user = users.find((u) => u.username === username && u.password === password)

      if (user) {
        // Update last login
        await apiDatabase.updateUser(users, user.id, { lastLogin: new Date() })
        onLogin({ ...user, lastLogin: new Date() })
        setUsername("")
        setPassword("")
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername)
    setPassword(demoPassword)
    setError("")
    setIsLoading(true)

    try {
      const users = await apiDatabase.getUsers()
      const user = users.find((u) => u.username === demoUsername && u.password === demoPassword)

      if (user) {
        await apiDatabase.updateUser(users, user.id, { lastLogin: new Date() })
        onLogin({ ...user, lastLogin: new Date() })
        setUsername("")
        setPassword("")
      } else {
        setError("Demo account not found")
      }
    } catch (error) {
      console.error("Demo login error:", error)
      setError("Demo login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <Image src="/images/kuhlekt-logo.png" alt="Kuhlekt Logo" width={48} height={48} className="h-12 w-auto" />
            <DialogTitle className="text-center">Login to Knowledge Base</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Demo Accounts */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-900 mb-3">Demo Accounts</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin("admin", "admin123")}
                  disabled={isLoading}
                  className="w-full justify-start text-left"
                >
                  <User className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">Admin</div>
                    <div className="text-xs text-gray-600">admin / admin123</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin("editor", "editor123")}
                  disabled={isLoading}
                  className="w-full justify-start text-left"
                >
                  <User className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">Editor</div>
                    <div className="text-xs text-gray-600">editor / editor123</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin("viewer", "viewer123")}
                  disabled={isLoading}
                  className="w-full justify-start text-left"
                >
                  <User className="h-4 w-4 mr-2" />
                  <div>
                    <div className="font-medium">Viewer</div>
                    <div className="text-xs text-gray-600">viewer / viewer123</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10"
                  disabled={isLoading}
                  required
                />
              </div>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
