"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import { storage } from "../utils/storage"
import type { User } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: User) => void
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (username: string, password: string) => {
    setLoading(true)
    setError("")

    try {
      const user = storage.authenticateUser(username, password)
      if (user) {
        storage.setCurrentUser(user)
        onLogin(user)
        onClose()
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Login to Knowledge Base</DialogTitle>
        </DialogHeader>
        <LoginForm onLogin={handleLogin} error={error} loading={loading} />
      </DialogContent>
    </Dialog>
  )
}
