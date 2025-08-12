"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react"
import { changeAdminPassword } from "./actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ChangePasswordPage() {
  const [state, formAction] = useFormState(changeAdminPassword, initialState)
  const [isPending, setIsPending] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Handle form submission with pending state
  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)

    try {
      await formAction(formData)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Change Admin Password</h2>
          <p className="mt-2 text-sm text-gray-300">Update your admin password for enhanced security</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Password Update</CardTitle>
            <CardDescription className="text-gray-300">
              Enter your current password and choose a new secure password
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{state.message}</AlertDescription>
              </Alert>
            )}

            {state.message && !state.success && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{state.message}</AlertDescription>
              </Alert>
            )}

            <form action={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="currentPassword" className="text-white">
                  Current Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pr-10"
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {state.errors?.currentPassword && (
                  <p className="text-red-400 text-sm mt-1">{state.errors.currentPassword}</p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-white">
                  New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pr-10"
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {state.errors?.newPassword && <p className="text-red-400 text-sm mt-1">{state.errors.newPassword}</p>}
                <p className="text-xs text-gray-400 mt-1">Password must be at least 8 characters long</p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm New Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="bg-slate-700 border-slate-600 text-white placeholder-gray-400 pr-10"
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {state.errors?.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">{state.errors.confirmPassword}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">
                Password changes take effect immediately. You will need to sign in again.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button variant="ghost" className="text-gray-300 hover:text-white" onClick={() => window.history.back()}>
            ← Back to Admin Panel
          </Button>
        </div>
      </div>
    </div>
  )
}
