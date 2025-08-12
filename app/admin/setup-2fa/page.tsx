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
  const [verificationResult, setVerificationResult] = useState<string | null>(null)

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
    const qrUrl = `otpauth://totp/${encodeURIComponent(accountName)}?secret=${result}&issuer=${encodeURIComponent(issuer)}`
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`)
  }

  const testTOTP = async () => {
    if (!testCode || !secret) return

    try {
      const response = await fetch("/api/admin/verify-totp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: testCode, secret }),
      })

      const result = await response.json()
      setVerificationResult(result.valid ? "Valid code!" : "Invalid code")
    } catch (error) {
      setVerificationResult("Error verifying code")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup 2FA for Admin</CardTitle>
          <CardDescription>Configure Google Authenticator or similar TOTP app</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Button onClick={generateSecret} className="w-full">
              Generate New Secret
            </Button>
          </div>

          {secret && (
            <>
              <div>
                <Label>Secret Key (save this securely):</Label>
                <div className="mt-2 p-3 bg-gray-100 rounded font-mono text-sm break-all">{secret}</div>
              </div>

              <div className="text-center">
                <Label>QR Code for Authenticator App:</Label>
                {qrCode && (
                  <div className="mt-2">
                    <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="mx-auto" />
                  </div>
                )}
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Instructions:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Open Google Authenticator or similar app</li>
                    <li>Tap "+" to add a new account</li>
                    <li>Scan the QR code above OR manually enter the secret key</li>
                    <li>Test the setup below</li>
                    <li>Add the secret to your ADMIN_2FA_SECRET environment variable</li>
                  </ol>
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="testCode">Test Code from Authenticator:</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="testCode"
                    value={testCode}
                    onChange={(e) => setTestCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                  <Button onClick={testTOTP}>Test</Button>
                </div>
                {verificationResult && (
                  <div
                    className={`mt-2 text-sm ${verificationResult.includes("Valid") ? "text-green-600" : "text-red-600"}`}
                  >
                    {verificationResult}
                  </div>
                )}
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Environment Variable:</strong>
                  <br />
                  Add this to your environment variables:
                  <br />
                  <code className="bg-gray-100 px-2 py-1 rounded">ADMIN_2FA_SECRET={secret}</code>
                </AlertDescription>
              </Alert>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
