"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { submitDemoRequest } from "./actions"
import ReCAPTCHA from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoFormComponent() {
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

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Schedule Your Demo</h1>
          <p className="text-xl text-gray-600">Fill out the form below and we'll contact you within 24 hours.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Demo Request Form</CardTitle>
              <CardDescription>Get a personalized demo of Kuhlekt's AR automation platform</CardDescription>
            </CardHeader>
            <CardContent>
              {state.success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{state.message}</AlertDescription>
                </Alert>
              )}

              {state.message && !state.success && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{state.message}</AlertDescription>
                </Alert>
              )}

              <form action={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className={state.errors?.firstName ? "border-red-500" : ""}
                    />
                    {state.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className={state.errors?.lastName ? "border-red-500" : ""}
                    />
                    {state.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={state.errors?.email ? "border-red-500" : ""}
                  />
                  {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className={state.errors?.company ? "border-red-500" : ""}
                  />
                  {state.errors?.company && <p className="text-sm text-red-600">{state.errors.company}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className={state.errors?.phone ? "border-red-500" : ""}
                  />
                  {state.errors?.phone && <p className="text-sm text-red-600">{state.errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <ReCAPTCHA onChange={handleRecaptchaChange} />
                  {state.errors?.recaptcha && <p className="text-sm text-red-600">{state.errors.recaptcha}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                  disabled={isPending || !recaptchaToken}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling Demo...
                    </>
                  ) : (
                    "Schedule Demo"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-cyan-600">What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Personalized Demo</h4>
                    <p className="text-gray-600 text-sm">See how Kuhlekt works with your specific AR challenges</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">ROI Analysis</h4>
                    <p className="text-gray-600 text-sm">
                      Get a custom ROI projection based on your current AR metrics
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Implementation Plan</h4>
                    <p className="text-gray-600 text-sm">
                      Receive a tailored implementation roadmap for your organization
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Expert Consultation</h4>
                    <p className="text-gray-600 text-sm">
                      Speak with AR automation experts who understand your industry
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-gradient-to-br from-cyan-50 to-blue-50">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Join 500+ Companies</h3>
                  <p className="text-gray-600 text-sm mb-4">Already using Kuhlekt to optimize their AR operations</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-cyan-600">40%</div>
                      <div className="text-xs text-gray-600">DSO Reduction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-600">85%</div>
                      <div className="text-xs text-gray-600">Faster Collections</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-cyan-600">99%</div>
                      <div className="text-xs text-gray-600">Customer Satisfaction</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
