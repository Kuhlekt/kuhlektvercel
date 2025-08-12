"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function Debug2FAPage() {
  const [token, setToken] = useState("")
  const [testSecret, setTestSecret] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleDebug = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/debug-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, testSecret: testSecret || undefined }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Debug error:", error)
      setResult({ error: "Failed to debug 2FA" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>2FA Debug Tool</CardTitle>
            <CardDescription>Debug your 2FA setup to identify token verification issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="token">6-Digit Token from Authenticator</Label>
              <Input
                id="token"
                type="text"
                placeholder="123456"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="testSecret">Test Secret (Optional)</Label>
              <Input
                id="testSecret"
                type="text"
                placeholder="Enter a different secret to test"
                value={testSecret}
                onChange={(e) => setTestSecret(e.target.value)}
              />
              <p className="text-sm text-gray-600">Leave empty to test with your current ADMIN_2FA_SECRET</p>
            </div>

            <Button onClick={handleDebug} disabled={!token || token.length !== 6 || loading} className="w-full">
              {loading ? "Debugging..." : "Debug 2FA Token"}
            </Button>

            {result && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Debug Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Overall Success:</span>
                      <span className={result.success ? "text-green-600" : "text-red-600"}>
                        {result.success ? "✓ Valid" : "✗ Invalid"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">Environment Secret:</span>
                      <span className="font-mono">{result.envSecret}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">Env Secret Result:</span>
                      <span className={result.envResult ? "text-green-600" : "text-red-600"}>
                        {result.envResult ? "✓ Valid" : "✗ Invalid"}
                      </span>
                    </div>

                    {result.testResult !== null && (
                      <div className="flex justify-between">
                        <span className="font-medium">Test Secret Result:</span>
                        <span className={result.testResult ? "text-green-600" : "text-red-600"}>
                          {result.testResult ? "✓ Valid" : "✗ Invalid"}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="font-medium">Your Token:</span>
                      <span className="font-mono">{result.providedToken}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium">Expected (Env):</span>
                      <span className="font-mono">{result.currentTokenEnv}</span>
                    </div>

                    {result.currentTokenTest && (
                      <div className="flex justify-between">
                        <span className="font-medium">Expected (Test):</span>
                        <span className="font-mono">{result.currentTokenTest}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="font-medium">Timestamp:</span>
                      <span className="text-xs">{result.timestamp}</span>
                    </div>

                    {result.error && <div className="text-red-600 font-medium">Error: {result.error}</div>}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">Troubleshooting Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Make sure your phone's time is synchronized</li>
                <li>• Check that ADMIN_2FA_SECRET matches your authenticator app</li>
                <li>• Try generating a new secret at /admin/setup-2fa</li>
                <li>• Tokens change every 30 seconds - use a fresh one</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
