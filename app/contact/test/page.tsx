"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { testAWSSES } from "../actions"

interface TestResult {
success: boolean
message: string
details?: {
  region: boolean
  accessKey: boolean
  secretKey: boolean
  fromEmail: boolean
}
}

export default function TestAWSPage() {
const [testResult, setTestResult] = useState<TestResult | null>(null)
const [isLoading, setIsLoading] = useState(false)

const handleTest = async () => {
  setIsLoading(true)
  setTestResult(null)
  
  try {
    console.log('Starting AWS SES test...')
    const result = await testAWSSES()
    console.log('Test result:', result)
    setTestResult(result)
  } catch (error) {
    console.error('Test error:', error)
    setTestResult({
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      details: {
        region: false,
        accessKey: false,
        secretKey: false,
        fromEmail: false,
      }
    })
  } finally {
    setIsLoading(false)
  }
}

return (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-2xl mx-auto px-4">
      <Card>
        <CardHeader>
          <CardTitle>AWS SES Configuration Test</CardTitle>
          <CardDescription>
            Test the AWS SES configuration to ensure email sending is working properly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={handleTest} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test AWS SES Configuration"}
          </Button>

          {testResult && (
            <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <div className="flex items-start gap-3">
                {testResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <h3 className={`font-semibold mb-2 ${testResult.success ? "text-green-800" : "text-red-800"}`}>
                    {testResult.success ? "✓ Success" : "✗ Error"}
                  </h3>
                  <AlertDescription className={testResult.success ? "text-green-700" : "text-red-700"}>
                    {testResult.message}
                  </AlertDescription>
                  
                  {testResult.details && (
                    <div className="mt-3 text-sm">
                      <h4 className="font-medium mb-2">Environment Variables Status:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2">
                          {testResult.details.region ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span>AWS_SES_REGION</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {testResult.details.accessKey ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span>AWS_SES_ACCESS_KEY_ID</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {testResult.details.secretKey ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span>AWS_SES_SECRET_ACCESS_KEY</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {testResult.details.fromEmail ? (
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

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Environment Variables Required:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <code>AWS_SES_REGION</code> (e.g., us-east-1, us-west-2)</li>
                <li>• <code>AWS_SES_ACCESS_KEY_ID</code> (Your AWS access key)</li>
                <li>• <code>AWS_SES_SECRET_ACCESS_KEY</code> (Your AWS secret key)</li>
                <li>• <code>AWS_SES_FROM_EMAIL</code> (Verified sender email address)</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Note:</strong> If AWS SES is not configured, the contact forms will still work 
              but will log submissions to the server console instead of sending emails. This allows 
              for manual follow-up of inquiries.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  </div>
)
}
