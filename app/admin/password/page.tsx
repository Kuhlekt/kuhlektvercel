"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { changeUserPassword } from "@/lib/database/admin-users"
import Link from "next/link"
import { Eye, EyeOff, Key } from "lucide-react"

export default function PasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      requirements: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
      },
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    // Validate password strength
    const validation = validatePassword(newPassword)
    if (!validation.isValid) {
      setMessage({ type: "error", text: "Password does not meet security requirements" })
      return
    }

    try {
      setLoading(true)

      // For now, we'll use user ID 1 (the default admin)
      // In a real implementation, this would come from the current user session
      const result = await changeUserPassword(1, newPassword)

      if (result.success) {
        setMessage({ type: "success", text: "Password changed successfully" })
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setMessage({ type: "error", text: result.error || "Failed to change password" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const passwordValidation = validatePassword(newPassword)

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Password Management</h1>
          <p className="text-muted-foreground">Change your admin password</p>
        </div>
        <Link href="/admin/dashboard">
          <Button variant="outline">← Back to Dashboard</Button>
        </Link>
      </div>

      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your admin account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Password Requirements</Label>
                  <div className="space-y-1 text-sm">
                    <div
                      className={`flex items-center gap-2 ${passwordValidation.requirements.minLength ? "text-green-600" : "text-red-600"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${passwordValidation.requirements.minLength ? "bg-green-600" : "bg-red-600"}`}
                      />
                      At least 8 characters
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordValidation.requirements.hasUpper ? "text-green-600" : "text-red-600"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasUpper ? "bg-green-600" : "bg-red-600"}`}
                      />
                      One uppercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordValidation.requirements.hasLower ? "text-green-600" : "text-red-600"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasLower ? "bg-green-600" : "bg-red-600"}`}
                      />
                      One lowercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordValidation.requirements.hasNumber ? "text-green-600" : "text-red-600"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasNumber ? "bg-green-600" : "bg-red-600"}`}
                      />
                      One number
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordValidation.requirements.hasSpecial ? "text-green-600" : "text-red-600"}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${passwordValidation.requirements.hasSpecial ? "bg-green-600" : "bg-red-600"}`}
                      />
                      One special character
                    </div>
                  </div>
                </div>
              )}

              {message && (
                <Alert
                  className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}
                >
                  <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading || !passwordValidation.isValid}>
                {loading ? "Changing Password..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
