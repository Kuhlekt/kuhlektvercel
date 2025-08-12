"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Smartphone, QrCode, CheckCircle } from "lucide-react"
import { loginWithPassword, verifyTwoFactor, generateQRCode } from "./actions"

export default function AdminLoginPage() {
  const [step, setStep] = useState<"password" | "2fa" | "setup" | "verify">("password")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [setupComplete, setSetupComplete] = useState(false)

  const handlePasswordSubmit = async (formData: FormData) => {
    setLoading(true)
    setError("")

    try {
      const result = await loginWithPassword(formData)

      if (result.success && result.requiresTwoFactor) {
        setStep("2fa")
      } else if (!result.success) {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    }

    setLoading(false)
  }

  const handleTwoFactorSubmit = async (formData: FormData) => {
    setLoading(true)
    setError("")

    try {
      await verifyTwoFactor(formData)
      // Redirect happens in the server action
    } catch (err) {
      setError("Invalid 2FA token")
    }

    setLoading(false)
  }

  const handleSetupTwoFactor = async () => {
    setLoading(true)
    try {
      const result = await generateQRCode()
      if (result.success) {
        setQrCode(result.qrCode)
        setSecret(result.secret)
        setStep("setup")
      } else {
        setError("Failed to generate setup code")
      }
    } catch (err) {
      setError("Failed to setup 2FA")
    }
    setLoading(false)
  }

  const handleSetupVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: verificationCode,
          secret: secret,
        }),
      })

      if (!response.ok) {
        throw new Error("Invalid verification code")
      }

      setSetupComplete(true)
      setTimeout(() => {
        setStep("password")
        setSetupComplete(false)
        setVerificationCode("")
      }, 3000)
    } catch (err) {
      setError("Invalid verification code. Please check your authenticator app and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-cyan-600" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <p className="text-gray-600">
            {step === "password" && "Enter your admin password"}
            {step === "2fa" && "Enter your 2FA code"}
            {step === "setup" && "Setup Two-Factor Authentication"}
            {step === "verify" && (setupComplete ? "Setup Complete!" : "Verify Your Setup")}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {step === "password" && (
            <form action={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Admin Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter admin password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Continue"}
              </Button>

              <div className="text-center">
                <Button type="button" variant="link" onClick={handleSetupTwoFactor} className="text-sm">
                  Setup 2FA
                </Button>
              </div>
            </form>
          )}

          {step === "2fa" && (
            <form action={handleTwoFactorSubmit} className="space-y-4">
              <div>
                <Label htmlFor="token">2FA Code</Label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="token"
                    name="token"
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="pl-10"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">Enter the 6-digit code from your authenticator app</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Login"}
              </Button>

              <Button type="button" variant="outline" onClick={() => setStep("password")} className="w-full">
                Back
              </Button>
            </form>
          )}

          {step === "setup" && (
            <div className="space-y-4">
              <div className="text-center">
                <QrCode className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                <h3 className="font-semibold mb-2">Scan QR Code</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
              </div>

              {qrCode && (
                <div className="flex justify-center">
                  <img src={qrCode || "/placeholder.svg"} alt="2FA QR Code" className="border rounded" />
                </div>
              )}

              {secret && (
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-medium mb-1">Manual Entry Key:</p>
                  <code className="text-xs break-all">{secret}</code>
                </div>
              )}

              <Button onClick={() => setStep("verify")} className="w-full">
                Continue to Verification
              </Button>

              <Button onClick={() => setStep("password")} variant="outline" className="w-full">
                Back to Login
              </Button>
            </div>
          )}

          {step === "verify" && (
            <div className="space-y-4">
              {setupComplete ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-yellow-800 mb-2">
                      ⚠️ IMPORTANT: Update Environment Variable
                    </p>
                    <p className="text-sm text-yellow-700 mb-2">
                      You MUST update your ADMIN_2FA_SECRET environment variable with this new secret:
                    </p>
                    <code className="block mt-2 p-2 bg-yellow-100 rounded text-xs font-mono break-all border">
                      {secret}
                    </code>
                    <div className="mt-3 text-xs text-yellow-600">
                      <p>1. Go to Vercel Project Settings → Environment Variables</p>
                      <p>2. Update ADMIN_2FA_SECRET with the code above</p>
                      <p>3. Redeploy your application</p>
                      <p>4. Then you can log in with your authenticator app</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Returning to login...</p>
                </div>
              ) : (
                <form onSubmit={handleSetupVerification} className="space-y-4">
                  <div>
                    <Label htmlFor="verification-code">6-Digit Verification Code</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="verification-code"
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="pl-10 text-center text-lg font-mono tracking-widest"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Enter the current code from your authenticator app</p>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading || verificationCode.length !== 6}>
                    {loading ? "Verifying..." : "Verify & Complete Setup"}
                  </Button>

                  <Button type="button" variant="outline" onClick={() => setStep("setup")} className="w-full">
                    Back to QR Code
                  </Button>
                </form>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
