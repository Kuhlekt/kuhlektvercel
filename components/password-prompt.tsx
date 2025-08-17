"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Lock, AlertTriangle } from "lucide-react"

interface PasswordPromptProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  title?: string
  description?: string
}

export function PasswordPrompt({
  isOpen,
  onClose,
  onSuccess,
  title = "Access Required",
  description = "Enter your username to continue",
}: PasswordPromptProps) {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem("kb-current-user") || "{}")

      if (currentUser.username === username.trim()) {
        onSuccess()
        onClose()
        setUsername("")
      } else {
        setError("Username does not match current user")
      }
    } catch (error) {
      setError("Verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" aria-describedby="password-prompt-description">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription id="password-prompt-description">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verify-username">Username</Label>
            <Input
              id="verify-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
