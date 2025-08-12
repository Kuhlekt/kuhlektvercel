"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Image from "next/image"
import ReCAPTCHA from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoPage() {
  const [state, formAction] = useFormState(submitDemoRequest, initialState)
  const [isPending, setIsPending] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateInfo, setAffiliateInfo] = useState(null)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    formData.append("recaptchaToken", recaptchaToken)
    await formAction(formData)
    setIsPending(false)
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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left Column - Information */}
          <div className="bg-gray-50 p-8 lg:p-16 flex flex-col justify-center">
            <div className="max-w-lg">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Schedule a Demonstration
              </h1>

              <p className="text-xl text-gray-600 mb-12">
                See how Kuhlekt can transform your accounts receivable process with a personalized demo.
              </p>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg text-gray-700">See how to automate your collections process</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg text-gray-700">Learn how to reduce DSO by 30%</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg text-gray-700">Discover how to eliminate 80% of manual tasks</p>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-lg text-gray-700">Get a personalized walkthrough of our platform</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                </div>
                <p className="text-gray-600">Join 500+ finance teams already using Kuhlekt</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="p-8 lg:p-16 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <Image src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" width={120} height={40} className="mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Demo</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll contact you to schedule a personalized demo.
                </p>
              </div>

              {state.message && (
                <Alert
                  className={`mb-6 ${state.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
                >
                  <AlertDescription className={state.success ? "text-green-700" : "text-red-700"}>
                    {state.message}
                  </AlertDescription>
                </Alert>
              )}

              <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700 font-medium">
                      First name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      required
                      className={`mt-1 ${state.errors?.firstName ? "border-red-500" : "border-gray-300"}`}
                    />
                    {state.errors?.firstName && <p className="text-red-500 text-sm mt-1">{state.errors.firstName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-gray-700 font-medium">
                      Last name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      className={`mt-1 ${state.errors?.lastName ? "border-red-500" : "border-gray-300"}`}
                    />
                    {state.errors?.lastName && <p className="text-red-500 text-sm mt-1">{state.errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    required
                    className={`mt-1 ${state.errors?.email ? "border-red-500" : "border-gray-300"}`}
                  />
                  {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="company" className="text-gray-700 font-medium">
                    Company <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    placeholder="Acme Inc."
                    required
                    className={`mt-1 ${state.errors?.company ? "border-red-500" : "border-gray-300"}`}
                  />
                  {state.errors?.company && <p className="text-red-500 text-sm mt-1">{state.errors.company}</p>}
                </div>

                <div>
                  <Label htmlFor="role" className="text-gray-700 font-medium">
                    Role
                  </Label>
                  <Input
                    id="role"
                    name="role"
                    type="text"
                    placeholder="Finance Manager"
                    className="mt-1 border-gray-300"
                  />
                </div>

                <div>
                  <Label htmlFor="affiliateCode" className="text-gray-700 font-medium">
                    Affiliate Code (Optional)
                  </Label>
                  <Input
                    id="affiliateCode"
                    name="affiliateCode"
                    type="text"
                    placeholder="Enter your affiliate code"
                    value={affiliateCode}
                    onChange={(e) => handleAffiliateChange(e.target.value)}
                    className={`mt-1 ${state.errors?.affiliateCode ? "border-red-500" : "border-gray-300"}`}
                  />
                  {state.errors?.affiliateCode && (
                    <p className="text-red-500 text-sm mt-1">{state.errors.affiliateCode}</p>
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
                  <Label htmlFor="challenges" className="text-gray-700 font-medium">
                    What are your biggest AR challenges?
                  </Label>
                  <Textarea
                    id="challenges"
                    name="challenges"
                    rows={4}
                    placeholder="Tell us about your current process and challenges..."
                    className="mt-1 border-gray-300 resize-none"
                  />
                </div>

                <div className="flex justify-center">
                  <ReCAPTCHA onVerify={setRecaptchaToken} />
                </div>

                <Button
                  type="submit"
                  disabled={isPending || !recaptchaToken}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-lg font-semibold rounded-md"
                >
                  {isPending ? "Submitting..." : "Request Demo"}
                </Button>

                <p className="text-center text-sm text-gray-500">
                  <span className="text-red-500">*</span> Required fields. We'll contact you within 24 hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
