"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, AlertCircle } from "lucide-react"
import { loginAdmin } from "./actions"

const initialState = {
  success: false,
  message: "",
  requiresTwoFactor: false,
  errors: {},
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAdmin, initialState)
  const [isPending, setIsPending] = useState(false)
  const [showTwoFactor, setShowTwoFactor] = useState(false)

  // Handle form submission with pending state
  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)

    try {
      await formAction(formData)
      if (state.requiresTwoFactor) {
        setShowTwoFactor(true)
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-400" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">Admin Access</h2>
          <p className="mt-2 text-sm text-gray-300">Secure login to Kuhlekt admin panel</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{showTwoFactor ? "Two-Factor Authentication" : "Sign In"}</CardTitle>
            <CardDescription className="text-gray-300">
              {showTwoFactor ? "Enter your 6-digit authentication code" : "Enter your admin credentials"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.message && (
              <Alert className={`mb-6 ${state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <AlertCircle className={`h-4 w-4 ${state.success ? "text-green-600" : "text-red-600"}`} />
                <AlertDescription className={state.success ? "text-green-800" : "text-red-800"}>
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <form action={handleSubmit} className="space-y-6">
              {!showTwoFactor ? (
                <>
                  <div>
                    <Label htmlFor="password" className="text-white">
                      Admin Password
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                      placeholder="Enter admin password"
                    />
                    {state.errors?.password && <p className="text-red-400 text-sm mt-1">{state.errors.password}</p>}
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="twoFactorCode" className="text-white">
                      Authentication Code
                    </Label>
                    <Input
                      id="twoFactorCode"
                      name="twoFactorCode"
                      type="text"
                      required
                      maxLength={6}
                      className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-gray-400 text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                    {state.errors?.twoFactorCode && (
                      <p className="text-red-400 text-sm mt-1">{state.errors.twoFactorCode}</p>
                    )}
                  </div>
                  <input type="hidden" name="step" value="verify-2fa" />
                </>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {showTwoFactor ? "Verifying..." : "Signing In..."}
                  </>
                ) : showTwoFactor ? (
                  "Verify Code"
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {showTwoFactor && (
              <div className="mt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowTwoFactor(false)}
                  className="text-gray-300 hover:text-white"
                >
                  Back to Password
                </Button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">This is a secure area. All access attempts are logged.</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Need help? Contact{" "}
            <a href="mailto:support@kuhlekt.com" className="text-blue-400 hover:underline">
              support@kuhlekt.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
