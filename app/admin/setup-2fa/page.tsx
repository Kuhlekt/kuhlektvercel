"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Setup2FAPage() {
  const [secret, setSecret] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [testCode, setTestCode] = useState("")
  const [verificationResult, setVerificationResult] = useState<{ valid: boolean; error?: string } | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const generateSecret = () => {
    // Generate a random base32 secret
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
    let result = ""
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setSecret(result)

    // Generate QR code URL for Google Authenticator
    const issuer = "Kuhlekt Admin"
    const accountName = "admin@kuhlekt.com"
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/${encodeURIComponent(accountName)}?secret=${result}&issuer=${encodeURIComponent(issuer)}`
    setQrCode(qrUrl)
  }

  const verifyCode = async () => {
    if (!testCode || !secret) return

    setIsVerifying(true)
    try {
      const response = await fetch("/api/admin/verify-totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: testCode, secret }),
      })

      const result = await response.json()
      setVerificationResult(result)
    } catch (error) {
      setVerificationResult({ valid: false, error: "Network error" })
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Setup Two-Factor Authentication</CardTitle>
          <CardDescription>Configure Google Authenticator or another TOTP app for admin access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Generate Secret */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Generate Secret Key</h3>
            <Button onClick={generateSecret} className="w-full">
              Generate New Secret
            </Button>

            {secret && (
              <div className="space-y-2">
                <Label>Secret Key (save this securely):</Label>
                <div className="p-3 bg-gray-100 rounded font-mono text-sm break-all">{secret}</div>
                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> Save this secret key securely and add it to your ADMIN_2FA_SECRET
                    environment variable.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* Step 2: Scan QR Code */}
          {qrCode && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 2: Scan QR Code</h3>
              <div className="text-center">
                <img src={qrCode || "/placeholder.svg"} alt="2FA QR Code" className="mx-auto border rounded" />
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Instructions:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 mt-2">
                  <li>Open Google Authenticator, Authy, or another TOTP app</li>
                  <li>Tap "Add account" or "+"</li>
                  <li>Scan this QR code with your phone</li>
                  <li>Or manually enter the secret key above</li>
                </ol>
              </div>
            </div>
          )}

          {/* Step 3: Test Code */}
          {secret && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 3: Test Your Setup</h3>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter 6-digit code"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  maxLength={6}
                />
                <Button onClick={verifyCode} disabled={isVerifying || testCode.length !== 6}>
                  {isVerifying ? "Verifying..." : "Verify"}
                </Button>
              </div>

              {verificationResult && (
                <Alert variant={verificationResult.valid ? "default" : "destructive"}>
                  <AlertDescription>
                    {verificationResult.valid ? (
                      <span className="text-green-600">✅ Code verified successfully! Your 2FA is working.</span>
                    ) : (
                      <span>❌ Invalid code. {verificationResult.error || "Please try again."}</span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Step 4: Environment Variable */}
          {secret && verificationResult?.valid && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Step 4: Update Environment Variable</h3>
              <Alert>
                <AlertDescription>
                  <p className="mb-2">Add this to your environment variables:</p>
                  <code className="block p-2 bg-gray-100 rounded text-sm">ADMIN_2FA_SECRET={secret}</code>
                  <p className="mt-2 text-sm">
                    After updating the environment variable, you can use the admin login with your password and 2FA
                    codes.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button asChild variant="outline" className="w-full bg-transparent">
              <a href="/admin/login">Back to Login</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
