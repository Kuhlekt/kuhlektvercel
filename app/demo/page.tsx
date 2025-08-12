"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Check } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoPage() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateInfo, setAffiliateInfo] = useState<any>(null)

  const handleSubmit = async (formData: FormData) => {
    formData.append("recaptchaToken", recaptchaToken)
    await formAction(formData)
  }

  const handleAffiliateChange = (value: string) => {
    setAffiliateCode(value)
    if (value.trim()) {
      const info = validateAffiliateCode(value.trim())
      setAffiliateInfo(info)
    } else {
      setAffiliateInfo(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Schedule a<br />
                Demonstration
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                See how Kuhlekt can transform your accounts receivable process with a personalized demo.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-lg text-gray-700">See how to automate your collections process</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-lg text-gray-700">Learn how to reduce DSO by 30%</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-lg text-gray-700">Discover how to eliminate 80% of manual tasks</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-lg text-gray-700">Get a personalized walkthrough of our platform</span>
              </div>
            </div>

            <div className="pt-8">
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                    1
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                    2
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                    3
                  </div>
                </div>
                <span className="text-gray-600">Join 500+ finance teams already using Kuhlekt</span>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-12" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Book Your Demo</CardTitle>
                <CardDescription className="text-gray-600">
                  Fill out the form below and we'll contact you to schedule a personalized demo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {state.message && (
                  <Alert
                    className={`mb-6 ${state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                  >
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

                <form action={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        placeholder="John"
                        className={`mt-1 ${state.errors?.firstName ? "border-red-500" : ""}`}
                      />
                      {state.errors?.firstName && <p className="text-sm text-red-600 mt-1">{state.errors.firstName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        placeholder="Doe"
                        className={`mt-1 ${state.errors?.lastName ? "border-red-500" : ""}`}
                      />
                      {state.errors?.lastName && <p className="text-sm text-red-600 mt-1">{state.errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john.doe@company.com"
                      className={`mt-1 ${state.errors?.email ? "border-red-500" : ""}`}
                    />
                    {state.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email}</p>}
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Company *
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      required
                      placeholder="Acme Inc."
                      className={`mt-1 ${state.errors?.company ? "border-red-500" : ""}`}
                    />
                    {state.errors?.company && <p className="text-sm text-red-600 mt-1">{state.errors.company}</p>}
                  </div>

                  <div>
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Role
                    </Label>
                    <Input id="role" name="role" type="text" placeholder="Finance Manager" className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="affiliateCode" className="text-sm font-medium text-gray-700">
                      Affiliate Code (Optional)
                    </Label>
                    <Input
                      id="affiliateCode"
                      name="affiliateCode"
                      type="text"
                      value={affiliateCode}
                      onChange={(e) => handleAffiliateChange(e.target.value)}
                      placeholder="Enter your affiliate code"
                      className={`mt-1 ${state.errors?.affiliateCode ? "border-red-500" : ""}`}
                    />
                    {state.errors?.affiliateCode && (
                      <p className="text-sm text-red-600 mt-1">{state.errors.affiliateCode}</p>
                    )}
                    {affiliateInfo && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            ✓ Valid Code
                          </Badge>
                          <span className="text-sm font-medium text-green-800">
                            {affiliateInfo.discount}% discount applied
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Partner: {affiliateInfo.name} | Category: {affiliateInfo.category}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="challenges" className="text-sm font-medium text-gray-700">
                      What are your biggest AR challenges?
                    </Label>
                    <Textarea
                      id="challenges"
                      name="challenges"
                      rows={4}
                      placeholder="Tell us about your current process and challenges..."
                      className="mt-1 resize-none"
                    />
                  </div>

                  <div className="flex justify-center py-4">
                    <ReCAPTCHA onVerify={setRecaptchaToken} />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending || !recaptchaToken}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 text-lg"
                  >
                    {isPending ? "Submitting..." : "Request Demo"}
                  </Button>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    * Required fields. We'll contact you within 24 hours.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
