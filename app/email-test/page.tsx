"use client"

import { useState } from "react"
import { testEmail } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EmailTestPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null)

  const handleTest = async () => {
    if (!email) {
      setResult({ success: false, message: "Please enter an email address" })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const res = await testEmail(email)
      setResult(res)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Email Configuration Test</CardTitle>
          <CardDescription>Test your AWS SES email configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <Button onClick={handleTest} disabled={loading} className="w-full">
            {loading ? "Sending..." : "Send Test Email"}
          </Button>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <AlertDescription>
                {result.success ? "✅ Email sent successfully!" : `❌ ${result.message || "Failed to send email"}`}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              <strong>Note:</strong> Make sure you have the following environment variables set:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>AWS_SES_REGION</li>
              <li>AWS_SES_ACCESS_KEY_ID</li>
              <li>AWS_SES_SECRET_ACCESS_KEY</li>
              <li>AWS_SES_FROM_EMAIL</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
