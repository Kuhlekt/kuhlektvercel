"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Setup2FAPage() {
  const [secret, setSecret] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Generate a new TOTP secret
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

    // Generate QR code URL for Google Authenticator
    const issuer = "Kuhlekt"
    const accountName = "admin@kuhlekt.com"
    const qrUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${newSecret}&issuer=${encodeURIComponent(issuer)}`
    setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`)
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, you would verify the TOTP code here
    setMessage("2FA setup complete! (This is a demo implementation)")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto mt-20">
        <Card>
          <CardHeader>
            <CardTitle>Setup Two-Factor Authentication</CardTitle>
            <CardDescription>Secure your admin account with 2FA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>1. Scan this QR code with your authenticator app:</Label>
              {qrCode && (
                <div className="flex justify-center mt-2">
                  <img src={qrCode || "/placeholder.svg"} alt="QR Code for 2FA setup" className="border rounded" />
                </div>
              )}
            </div>

            <div>
              <Label>2. Or manually enter this secret:</Label>
              <Input value={secret} readOnly className="font-mono text-sm" />
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <Label htmlFor="verificationCode">3. Enter the verification code:</Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Verify and Enable 2FA
              </Button>

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
