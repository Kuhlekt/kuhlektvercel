"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { testEmailSend } from "./actions"

export default function EmailTestPage() {
  const [to, setTo] = useState("")
  const [subject, setSubject] = useState("Test Email from Kuhlekt")
  const [message, setMessage] = useState("This is a test email sent from the Kuhlekt website.")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await testEmailSend({ to, subject, message })
      setResult(response)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Email Test</CardTitle>
          <CardDescription>Test the AWS SES email configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">To Email</Label>
              <Input
                id="to"
                type="email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Email message"
                rows={5}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Test Email"}
            </Button>
          </form>

          {result && (
            <Alert className={`mt-4 ${result.success ? "border-green-500" : "border-red-500"}`}>
              <AlertDescription>
                {result.success ? "✅ " : "❌ "}
                {result.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
