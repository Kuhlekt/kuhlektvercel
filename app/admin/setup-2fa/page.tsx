"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Eye, EyeOff, CheckCircle } from "lucide-react"
import Image from "next/image"

interface TwoFactorData {
  secret: string
  qrCode: string
}

export default function Setup2FAPage() {
  const [step, setStep] = useState<"password" | "setup" | "verify">("password")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationSuccess, setVerificationSuccess] = useState(false)

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

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: verificationCode,
          secret: twoFactorData?.secret,
        }),
      })

      if (!response.ok) {
        throw new Error("Invalid verification code. Please check your authenticator app and try again.")
      }

      setVerificationSuccess(true)
      setTimeout(() => {
        window.location.href = "/admin/login"
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
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

  if (step === "setup") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Setup New 2FA Secret</CardTitle>
            <CardDescription>Scan the QR code with your authenticator app</CardDescription>
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
                  <Label className="text-sm font-medium text-gray-700">Manual Entry Code:</Label>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                      {twoFactorData.secret}
                    </code>
                    <Button size="sm" variant="outline" onClick={copySecret}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Setup Instructions:</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
                    <li>Scan the QR code above or manually enter the code</li>
                    <li>Your app should now show 6-digit codes for "Kuhlekt Admin"</li>
                    <li>Click "Continue" below to verify your setup</li>
                  </ol>
                </div>

                <Button onClick={() => setStep("verify")} className="w-full">
                  Continue to Verification
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {verificationSuccess ? "Setup Complete!" : "Verify Your Setup"}
            </CardTitle>
            <CardDescription>
              {verificationSuccess
                ? "Your 2FA has been successfully configured"
                : "Enter the 6-digit code from your authenticator app"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {verificationSuccess ? (
              <div className="text-center space-y-4">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 mb-2">
                    <strong>Success!</strong> Your 2FA is now configured.
                  </p>
                  <p className="text-sm text-green-600">
                    Don't forget to update your ADMIN_2FA_SECRET environment variable with:
                  </p>
                  <code className="block mt-2 p-2 bg-green-100 rounded text-xs font-mono break-all">
                    {twoFactorData?.secret}
                  </code>
                </div>
                <p className="text-sm text-gray-600">Redirecting to login page...</p>
              </div>
            ) : (
              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">6-Digit Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg font-mono tracking-widest"
                    required
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Enter the current code from your authenticator app
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={loading || verificationCode.length !== 6}>
                    {loading ? "Verifying..." : "Verify & Complete Setup"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setStep("setup")}
                  >
                    Back to QR Code
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
