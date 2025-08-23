"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (username: string, password: string) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Clear form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername("")
      setPassword("")
      setIsLoading(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return

    setIsLoading(true)
    try {
      await onLogin(username.trim(), password)
    } catch (error) {
      // Clear password on failed login
      setPassword("")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setUsername("")
    setPassword("")
  }

  const handleClose = () => {
    setUsername("")
    setPassword("")
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Login Required
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>Please enter your credentials to access the knowledge base.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={!username.trim() || !password.trim() || isLoading} className="flex-1">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <Button type="button" variant="outline" onClick={handleClear} disabled={isLoading}>
              Clear
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
