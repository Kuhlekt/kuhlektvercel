"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { storage } from "../utils/storage"
import type { User } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  users: User[]
  onLogin: (user: User) => void
}

export function LoginModal({ isOpen, onClose, users, onLogin }: LoginModalProps) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (username: string, password: string) => {
    setLoading(true)
    setError("")

    try {
      // Find user with matching credentials
      const user = users.find(u => u.username === username && u.password === password)
      
      if (!user) {
        setError("Invalid username or password")
        return
      }

      // Update user's last login time
      const updatedUser = { ...user, lastLogin: new Date() }
      const updatedUsers = users.map(u => u.id === user.id ? updatedUser : u)
      
      // Save updated users to storage
      storage.saveUsers(updatedUsers)
      
      // Add audit log entry
      storage.addAuditEntry({
        action: "login",
        entityType: "user",
        entityId: user.id,
        details: `User ${user.username} logged in`,
        userId: user.username
      })

      onLogin(updatedUser)
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0">
        <LoginForm
          onLogin={handleLogin}
          error={error}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  )
}
