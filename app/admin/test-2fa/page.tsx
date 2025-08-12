"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Test2FAPage() {
  const [code, setCode] = useState("")
  const [result, setResult] = useState<{ valid: boolean; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || code.length !== 6) {
      setResult({ valid: false, message: "Please enter a 6-digit code" })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ valid: false, message: "Verification failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test 2FA Code</CardTitle>
          <CardDescription>Enter a 6-digit code from your authenticator app to verify it's working</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading || code.length !== 6}>
              {loading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>

          {result && (
            <Alert className={`mt-4 ${result.valid ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
              <AlertDescription className={result.valid ? "text-green-700" : "text-red-700"}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
