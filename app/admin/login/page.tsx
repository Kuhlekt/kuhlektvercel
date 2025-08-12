"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginAdmin } from "./actions"
import Link from "next/link"

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your admin credentials and 2FA code</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={isPending} />
            </div>

            <div>
              <Label htmlFor="twofa">2FA Code</Label>
              <Input
                id="twofa"
                name="twofa"
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
                disabled={isPending}
              />
            </div>

            {state?.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/admin/setup-2fa" className="text-sm text-blue-600 hover:underline">
              Need to setup 2FA? Click here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
