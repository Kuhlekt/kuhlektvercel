"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User } from "lucide-react"
import type { KnowledgeBaseUser } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  users: KnowledgeBaseUser[]
  onLogin: (user: KnowledgeBaseUser) => void
}

export function LoginModal({ isOpen, onClose, users, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password)
    if (user) {
      onLogin(user)
      setUsername("")
      setPassword("")
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  const handleDemoLogin = (demoUser: KnowledgeBaseUser) => {
    onLogin(demoUser)
    setUsername("")
    setPassword("")
    setError("")
  }

  const demoUsers = users.filter((u) => u.username.startsWith("demo"))

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login to Knowledge Base</DialogTitle>
          <DialogDescription>Enter your credentials to access admin features</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
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
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleLogin} className="w-full">
            Login
          </Button>

          {demoUsers.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 text-center">Demo Accounts</div>
              <div className="grid gap-2">
                {demoUsers.map((user) => (
                  <Button
                    key={user.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleDemoLogin(user)}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>
                      {user.name} ({user.role})
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
