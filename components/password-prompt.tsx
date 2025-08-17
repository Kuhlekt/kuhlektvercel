"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock } from "lucide-react"

interface PasswordPromptProps {
  onPasswordSubmit: (password: string) => void
  onCancel: () => void
  error?: string
}

export function PasswordPrompt({ onPasswordSubmit, onCancel, error }: PasswordPromptProps) {
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      onPasswordSubmit(username)
    }
  }

  const handleQuickAccess = () => {
    onPasswordSubmit("admin")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Authentication Required</CardTitle>
          <p className="text-sm text-gray-600">Please enter your username to add articles</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
                required
              />
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="flex-1">
                Submit
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>

            <div className="pt-2 border-t">
              <Button type="button" variant="secondary" onClick={handleQuickAccess} className="w-full">
                Quick Access (Admin)
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
