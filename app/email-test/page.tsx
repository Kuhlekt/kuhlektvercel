"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle, Mail, Settings, Send } from "lucide-react"
import { testEmailSystem, sendTestEmail } from "./actions"

interface TestResult {
  success: boolean
  message: string
  details?: {
    region: boolean
    accessKey: boolean
    secretKey: boolean
    fromEmail: boolean
  }
  messageId?: string | null // Changed from string | undefined to string | null to match sendTestEmail return type
}

export default function EmailTestPage() {
  const [configResult, setConfigResult] = useState<TestResult | null>(null)
  const [emailResult, setEmailResult] = useState<TestResult | null>(null)
  const [isTestingConfig, setIsTestingConfig] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [testEmail, setTestEmail] = useState("")

  const handleConfigTest = async () => {
    setIsTestingConfig(true)
    setConfigResult(null)

    try {
      console.log("Starting AWS SES configuration test...")
      const result = await testEmailSystem()
      console.log("Configuration test result:", result)
      setConfigResult(result)
    } catch (error) {
      console.error("Configuration test error:", error)
      setConfigResult({
        success: false,
        message: `Configuration test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        details: {
          region: false,
          accessKey: false,
          secretKey: false,
          fromEmail: false,
        },
      })
    } finally {
      setIsTestingConfig(false)
    }
  }

  const handleEmailTest = async () => {
    if (!testEmail) {
      setEmailResult({
        success: false,
        message: "Please enter a test email address",
      })
      return
    }

    setIsSendingEmail(true)
    setEmailResult(null)

    try {
      console.log("Sending test email to:", testEmail)
      const result = await sendTestEmail(testEmail)
      console.log("Email test result:", result)
      setEmailResult(result)
    } catch (error) {
      console.error("Email test error:", error)
      setEmailResult({
        success: false,
        message: `Email test failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Email System Test</h1>
          <p className="text-gray-600">
            Test the AWS SES configuration and email sending functionality for the Kuhlekt website.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Configuration Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                AWS SES Configuration Test
              </CardTitle>
              <CardDescription>
                Check if all required environment variables are set and AWS SES is properly configured.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button onClick={handleConfigTest} disabled={isTestingConfig} className="w-full">
                {isTestingConfig ? "Testing Configuration..." : "Test AWS SES Configuration"}
              </Button>

              {configResult && (
                <Alert className={configResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-start gap-3">
                    {configResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-2 ${configResult.success ? "text-green-800" : "text-red-800"}`}>
                        {configResult.success ? "✓ Configuration Valid" : "✗ Configuration Issues"}
                      </h3>
                      <AlertDescription
                        className={`whitespace-pre-line ${configResult.success ? "text-green-700" : "text-red-700"}`}
                      >
                        {configResult.message}
                      </AlertDescription>

                      {configResult.details && (
                        <div className="mt-3 text-sm">
                          <h4 className="font-medium mb-2">Environment Variables Status:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2">
                              {configResult.details.region ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>AWS_SES_REGION</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {configResult.details.accessKey ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>AWS_SES_ACCESS_KEY_ID</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {configResult.details.secretKey ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>AWS_SES_SECRET_ACCESS_KEY</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {configResult.details.fromEmail ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span>AWS_SES_FROM_EMAIL</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Email Sending Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Sending Test
              </CardTitle>
              <CardDescription>
                Send a test email to verify that the email system is working end-to-end.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="your-email@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  disabled={isSendingEmail}
                />
                <p className="text-sm text-gray-500">
                  Enter your email address to receive a test email from the system.
                </p>
              </div>

              <Button
                onClick={handleEmailTest}
                disabled={isSendingEmail || !testEmail}
                className="w-full"
                variant="default"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSendingEmail ? "Sending Test Email..." : "Send Test Email"}
              </Button>

              {emailResult && (
                <Alert className={emailResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <div className="flex items-start gap-3">
                    {emailResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-2 ${emailResult.success ? "text-green-800" : "text-red-800"}`}>
                        {emailResult.success ? "✓ Email Sent Successfully" : "✗ Email Failed"}
                      </h3>
                      <AlertDescription
                        className={`whitespace-pre-line ${emailResult.success ? "text-green-700" : "text-red-700"}`}
                      >
                        {emailResult.message}
                      </AlertDescription>
                      {emailResult.messageId !== undefined && (
                        <p className="text-sm text-green-600 mt-2">Message ID: {emailResult.messageId}</p>
                      )}
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Required Environment Variables:</h3>
                <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm space-y-1">
                  <div>AWS_SES_REGION=us-east-1</div>
                  <div>AWS_SES_ACCESS_KEY_ID=your_access_key_id</div>
                  <div>AWS_SES_SECRET_ACCESS_KEY=your_secret_access_key</div>
                  <div>AWS_SES_FROM_EMAIL=noreply@yourdomain.com</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">AWS SES Setup Checklist:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Verify your sender email address in AWS SES console</li>
                  <li>• Create IAM user with SES sending permissions</li>
                  <li>• If in sandbox mode, verify recipient email addresses</li>
                  <li>• Request production access if needed for unrestricted sending</li>
                  <li>• Set up proper DNS records (SPF, DKIM) for better deliverability</li>
                </ul>
              </div>

              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Note:</strong> If AWS SES is not configured, the contact forms will still work but will log
                  submissions to the server console instead of sending emails. This allows for manual follow-up of
                  inquiries.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Current Status Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Current System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-400 mb-1">?</div>
                  <div className="text-sm text-gray-600">Configuration</div>
                  <div className="text-xs text-gray-500">Run test to check</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-400 mb-1">?</div>
                  <div className="text-sm text-gray-600">Email Sending</div>
                  <div className="text-xs text-gray-500">Run test to verify</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500 mb-1">✓</div>
                  <div className="text-sm text-gray-600">Form Logging</div>
                  <div className="text-xs text-gray-500">Always available</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
