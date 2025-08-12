"use client"

import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { changeAdminPassword } from "./actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ChangePasswordPage() {
  const [state, action] = useFormState(changeAdminPassword, null)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <Link href="/admin/tracking" className="text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
            <div className="w-5" />
          </div>
          <CardDescription>Update your admin password</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                minLength={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                minLength={8}
                required
              />
            </div>

            {state?.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state?.success && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription>{state.success}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Change Password
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/admin/tracking" className="text-sm text-blue-600 hover:underline">
              Back to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
