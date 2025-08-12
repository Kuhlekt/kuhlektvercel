"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, RefreshCw, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function Reset2FAPage() {
  const [step, setStep] = useState<"password" | "reset" | "complete">("password")
  const [password, setPassword] = useState("")
  const [resetData, setResetData] = useState<{
    secret: string
    qrCode: string
    message: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/reset-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        setResetData(data)
        setStep("reset")
      } else {
        setError(data.error || "Failed to reset 2FA")
      }
    } catch (error) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const handleComplete = () => {
    setStep("complete")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="w-6 h-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Reset 2FA System</CardTitle>
          <CardDescription>Generate a new 2FA secret and reconfigure authentication</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This will generate a new 2FA secret. You'll need to reconfigure your authenticator app.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Admin Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset 2FA System"}
              </Button>
            </form>
          )}

          {step === "reset" && resetData && (
            <div className="space-y-6">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>New 2FA secret generated successfully!</AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">New 2FA Secret</label>
                  <div className="flex gap-2">
                    <Input value={resetData.secret} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(resetData.secret)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium mb-2">Scan QR Code</p>
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img src={resetData.qrCode || "/placeholder.svg"} alt="2FA QR Code" className="w-48 h-48" />
                  </div>
                </div>

                <Alert>
                  <AlertDescription className="text-sm">
                    <strong>Important:</strong> Update your ADMIN_2FA_SECRET environment variable with the new secret
                    above, then restart your application.
                  </AlertDescription>
                </Alert>
              </div>

              <Button onClick={handleComplete} className="w-full">
                I've Updated the Environment Variable
              </Button>
            </div>
          )}

          {step === "complete" && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">2FA Reset Complete</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Your 2FA system has been reset. You can now use your newly configured authenticator app to log in.
                </p>
              </div>
              <Link href="/admin/login">
                <Button className="w-full">Go to Admin Login</Button>
              </Link>
            </div>
          )}

          <div className="text-center">
            <Link href="/admin/login" className="text-sm text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
