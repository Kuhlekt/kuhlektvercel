"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    console.log("[v0] Admin login form submission started")
    setIsSubmitting(true)
    setError("")

    try {
      console.log("[v0] Making fetch request to /api/admin/login")
      const response = await fetch("/api/admin/login", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Fetch response received:", response.status)

      const result = await response.json()
      console.log("[v0] API response:", result)

      if (!result.success) {
        console.log("[v0] Login failed with error:", result.error)
        setError(result.error)
      } else {
        console.log("[v0] Login successful, redirecting to:", result.redirectTo)
        // Redirect to admin dashboard on successful login
        router.push(result.redirectTo || "/admin/tracking")
      }
    } catch (error) {
      console.error("[v0] Admin login error caught:", error)
      console.error("[v0] Error type:", typeof error)
      console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
      console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
      setError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
      console.log("[v0] Admin login form submission completed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 border-red-500 bg-red-50">
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              handleSubmit(formData)
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required disabled={isSubmitting} className="mt-1" />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
