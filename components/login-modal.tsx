"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { User } from "@/types/knowledge-base"
import { getStoredData } from "@/utils/storage"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: User) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    const data = getStoredData()

    // Simple authentication - in production, this would be server-side
    if (username === "admin" && password === "admin123") {
      const user = data.users.find((u) => u.username === "admin")
      if (user) {
        onLogin(user)
        onClose()
        setUsername("")
        setPassword("")
        setError("")
      }
    } else if (username === "editor" && password === "editor123") {
      const user = data.users.find((u) => u.username === "editor")
      if (user) {
        onLogin(user)
        onClose()
        setUsername("")
        setPassword("")
        setError("")
      }
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="text-xs text-gray-500">Demo credentials: admin/admin123 or editor/editor123</div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleLogin}>Login</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
