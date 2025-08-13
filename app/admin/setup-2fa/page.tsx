"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Copy, Check } from "lucide-react"
import QRCode from "qrcode"

export default function Setup2FAPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [secret, setSecret] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Generate a random secret for demo purposes
    const generateSecret = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
      let result = ""
      for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    const newSecret = generateSecret()
    setSecret(newSecret)

    // Generate QR code
    const otpAuthUrl = `otpauth://totp/Kuhlekt%20Admin?secret=${newSecret}&issuer=Kuhlekt`
    QRCode.toDataURL(otpAuthUrl)
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error("Error generating QR code:", err))
  }, [])

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy secret:", err)
    }
  }

  const verifyCode = async () => {
    try {
      const response = await fetch("/api/admin/verify-totp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secret,
          token: verificationCode,
        }),
      })

      const result = await response.json()

      if (result.valid) {
        setIsVerified(true)
        setError("")
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (err) {
      setError("Error verifying code. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Set Up 2FA</CardTitle>
          <CardDescription>Secure your admin account with two-factor authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!isVerified ? (
            <>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
                {qrCodeUrl && <img src={qrCodeUrl || "/placeholder.svg"} alt="2FA QR Code" className="mx-auto" />}
              </div>

              <div>
                <Label htmlFor="secret">Or enter this secret manually:</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input id="secret" value={secret} readOnly className="font-mono text-xs" />
                  <Button type="button" size="sm" onClick={copySecret} className="flex-shrink-0">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="verificationCode">Enter verification code:</Label>
                <Input
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="mt-1"
                />
              </div>

              {error && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={verifyCode} className="w-full" disabled={verificationCode.length !== 6}>
                Verify Code
              </Button>
            </>
          ) : (
            <div className="text-center">
              <Alert className="border-green-500 bg-green-50 mb-4">
                <AlertDescription className="text-green-700">
                  2FA has been set up successfully! You can now use this authenticator app to log in.
                </AlertDescription>
              </Alert>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Save this secret key in a secure location:
                </p>
                <code className="block mt-2 p-2 bg-white rounded text-xs font-mono break-all">{secret}</code>
              </div>

              <Button asChild className="w-full">
                <a href="/admin/login">Go to Login</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
