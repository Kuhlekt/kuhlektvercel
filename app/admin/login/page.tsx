"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Shield, Lock } from "lucide-react"
import { loginAdmin } from "./actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAdmin, initialState)
  const [isPending, setIsPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showTotpInput, setShowTotpInput] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    const result = await formAction(formData)
    if (result?.requiresTotp) {
      setShowTotpInput(true)
    }
    setIsPending(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">Admin Login</CardTitle>
            <CardDescription className="text-gray-600">Secure access to Kuhlekt administration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {state.message && (
              <Alert className={state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertDescription className={state.success ? "text-green-800" : "text-red-800"}>
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <form action={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Admin Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {state.errors?.password && <p className="text-sm text-red-600">{state.errors.password}</p>}
              </div>

              {showTotpInput && (
                <div className="space-y-2">
                  <Label htmlFor="totpCode" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    2FA Code
                  </Label>
                  <Input
                    id="totpCode"
                    name="totpCode"
                    type="text"
                    required
                    maxLength={6}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                  {state.errors?.totpCode && <p className="text-sm text-red-600">{state.errors.totpCode}</p>}
                  <p className="text-xs text-gray-500">Enter the 6-digit code from your authenticator app</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPending ? "Authenticating..." : showTotpInput ? "Verify & Login" : "Login"}
              </Button>
            </form>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Secure admin access with 2FA protection</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
