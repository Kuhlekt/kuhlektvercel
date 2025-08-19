"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginForm } from "./login-form"
import type { User } from "../types/knowledge-base"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (user: User) => void
  error?: string
}

export function LoginModal({ isOpen, onClose, onLogin, error }: LoginModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Sign In to Kuhlekt KB</DialogTitle>
        </DialogHeader>
        <LoginForm onLogin={onLogin} onCancel={onClose} error={error} />
      </DialogContent>
    </Dialog>
  )
}
