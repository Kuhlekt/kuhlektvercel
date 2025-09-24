"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { submitDemoRequest } from "./actions"
import { ReCAPTCHA } from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export function DemoFormComponent() {
  const [state, formAction] = useFormState(submitDemoRequest, initialState)
  const [isPending, setIsPending] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    if (!recaptchaToken) {
      return
    }

    setIsPending(true)
    formData.append("recaptchaToken", recaptchaToken)

    try {
      await formAction(formData)
    } finally {
      setIsPending(false)
      setRecaptchaToken(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Schedule Your Demo</CardTitle>
            <p className="text-gray-600 mt-2">Fill out the form below and we'll contact you within 24 hours.</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {state.message && (
              <Alert className={state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {state.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={state.success ? "text-green-800" : "text-red-800"}>
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <form action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="w-full"
                    placeholder="Enter your first name"
                  />
                  {state.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="w-full"
                    placeholder="Enter your last name"
                  />
                  {state.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Business Email *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full"
                  placeholder="Enter your business email"
                />
                {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Company Name *
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className="w-full"
                  placeholder="Enter your company name"
                />
                {state.errors?.company && <p className="text-sm text-red-600">{state.errors.company}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full"
                  placeholder="Enter your phone number"
                />
                {state.errors?.phone && <p className="text-sm text-red-600">{state.errors.phone}</p>}
              </div>

              <div className="space-y-4">
                <ReCAPTCHA onVerify={setRecaptchaToken} />
                {state.errors?.recaptcha && <p className="text-sm text-red-600">{state.errors.recaptcha}</p>}
              </div>

              <Button
                type="submit"
                disabled={isPending || !recaptchaToken}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 text-lg font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Scheduling Demo...
                  </>
                ) : (
                  "Schedule Demo"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
