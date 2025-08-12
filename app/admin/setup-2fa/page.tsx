"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Eye, EyeOff } from "lucide-react"
import Image from "next/image"

interface TwoFactorData {
  secret: string
  qrCode: string
}

export default function Setup2FAPage() {
  const [step, setStep] = useState<"password" | "setup">("password")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Verify password
      const passwordResponse = await fetch("/api/admin/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (!passwordResponse.ok) {
        throw new Error("Invalid password")
      }

      // Generate new 2FA secret
      const secretResponse = await fetch("/api/admin/generate-2fa-secret")
      if (!secretResponse.ok) {
        throw new Error("Failed to generate 2FA secret")
      }

      const data = await secretResponse.json()
      setTwoFactorData(data)
      setStep("setup")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copySecret = () => {
    if (twoFactorData?.secret) {
      navigator.clipboard.writeText(twoFactorData.secret)
    }
  }

  if (step === "password") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Admin Verification</CardTitle>
            <CardDescription>Enter admin password to generate new 2FA secret</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Generate New 2FA Secret"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Setup New 2FA Secret</CardTitle>
          <CardDescription>Generate a new 2FA secret for admin authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {twoFactorData && (
            <>
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg border inline-block">
                  <Image
                    src={twoFactorData.qrCode || "/placeholder.svg"}
                    alt="2FA QR Code"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">Scan this QR code with your authenticator app</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">New 2FA Secret (Base32):</Label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                    {twoFactorData.secret}
                  </code>
                  <Button size="sm" variant="outline" onClick={copySecret}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Next Steps:</h4>
                <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                  <li>Copy the secret above</li>
                  <li>Update your ADMIN_2FA_SECRET environment variable with this value:</li>
                  <li className="font-mono text-xs bg-yellow-100 p-1 rounded">{twoFactorData.secret}</li>
                  <li>Redeploy your application</li>
                  <li>Test login with your authenticator app</li>
                </ol>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  <strong>Important:</strong> Save this secret securely. Once you update the environment variable, the
                  old 2FA codes will no longer work.
                </p>
              </div>

              <Button onClick={() => (window.location.href = "/admin/login")} className="w-full">
                Go to Admin Login
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
