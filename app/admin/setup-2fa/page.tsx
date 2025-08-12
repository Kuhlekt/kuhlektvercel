"use client"

import { generateNewAdminTwoFactorSecret } from "@/lib/auth/admin-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import Image from "next/image"

export default async function Setup2FAPage() {
  const { secret, qrCode } = await generateNewAdminTwoFactorSecret()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Setup New 2FA Secret</CardTitle>
          <CardDescription>Generate a new 2FA secret for admin authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-white p-4 rounded-lg border inline-block">
              <Image
                src={qrCode || "/placeholder.svg"}
                alt="2FA QR Code"
                width={200}
                height={200}
                className="mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">Scan this QR code with your authenticator app</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">New 2FA Secret (Base32):</label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">{secret}</code>
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(secret)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Next Steps:</h4>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Copy the secret above</li>
              <li>Update your ADMIN_2FA_SECRET environment variable</li>
              <li>Redeploy your application</li>
              <li>Test login with your authenticator app</li>
            </ol>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <strong>Important:</strong> Save this secret securely. Once you update the environment variable, the old
              2FA codes will no longer work.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
