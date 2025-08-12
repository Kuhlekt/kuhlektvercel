"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Lock, Smartphone, QrCode } from "lucide-react"
import { loginWithPassword, verifyTwoFactor, generateQRCode } from "./actions"

export default function AdminLoginPage() {
  const [step, setStep] = useState<"password" | "2fa" | "setup">("password")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")

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

              <Button onClick={() => setStep("password")} className="w-full">
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
