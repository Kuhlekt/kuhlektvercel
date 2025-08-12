"use client"

import { useState, useTransition } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, TrendingUp, ArrowRight, Star } from "lucide-react"
import { submitDemoRequest } from "./actions"
import { ReCAPTCHA } from "@/components/recaptcha"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoPage() {
  const [state, formAction] = useFormState(submitDemoRequest, initialState)
  const [isPending, startTransition] = useTransition()
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateInfo, setAffiliateInfo] = useState<any>(null)

  const handleAffiliateCodeChange = (value: string) => {
    setAffiliateCode(value)
    if (value.trim()) {
      const info = validateAffiliateCode(value.trim())
      setAffiliateInfo(info)
    } else {
      setAffiliateInfo(null)
    }
  }

  const handleSubmit = (formData: FormData) => {
    formData.set("recaptchaToken", recaptchaToken)
    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">See Kuhlekt in Action</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Schedule a personalized demo and discover how Kuhlekt can transform your accounts receivable process
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Benefits */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    What You'll See in Your Demo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Automated Collections Workflow</h3>
                      <p className="text-gray-600 text-sm">
                        See how Kuhlekt automatically sends payment reminders and follows up with customers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Real-time Dashboard</h3>
                      <p className="text-gray-600 text-sm">
                        Monitor your receivables, DSO, and collection performance in real-time
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Customer Portal</h3>
                      <p className="text-gray-600 text-sm">
                        Give customers a self-service portal to view invoices and make payments
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Integration Capabilities</h3>
                      <p className="text-gray-600 text-sm">
                        Connect seamlessly with your existing ERP, CRM, and accounting systems
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">30%</div>
                    <div className="text-sm text-gray-600">DSO Reduction</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">80%</div>
                    <div className="text-sm text-gray-600">Time Saved</div>
                  </CardContent>
                </Card>
              </div>

              {/* Process Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Demo Process</CardTitle>
                  <CardDescription>What happens after you submit this form</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      1
                    </div>
                    <div>
                      <div className="font-medium">We'll contact you within 24 hours</div>
                      <div className="text-sm text-gray-600">Schedule a convenient time for your demo</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      2
                    </div>
                    <div>
                      <div className="font-medium">30-minute personalized demo</div>
                      <div className="text-sm text-gray-600">See Kuhlekt in action with your specific use case</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                      3
                    </div>
                    <div>
                      <div className="font-medium">Q&A and next steps</div>
                      <div className="text-sm text-gray-600">Discuss implementation and pricing options</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Request Your Demo</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  {state.success ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Demo Request Submitted!</h3>
                      <p className="text-gray-600 mb-6">{state.message}</p>
                      <Button onClick={() => window.location.reload()} variant="outline">
                        Submit Another Request
                      </Button>
                    </div>
                  ) : (
                    <form action={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            required
                            className={state.errors?.firstName ? "border-red-500" : ""}
                          />
                          {state.errors?.firstName && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.firstName}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            required
                            className={state.errors?.lastName ? "border-red-500" : ""}
                          />
                          {state.errors?.lastName && (
                            <p className="text-red-500 text-sm mt-1">{state.errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Business Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className={state.errors?.email ? "border-red-500" : ""}
                        />
                        {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
                      </div>

                      <div>
                        <Label htmlFor="company">Company Name *</Label>
                        <Input
                          id="company"
                          name="company"
                          required
                          className={state.errors?.company ? "border-red-500" : ""}
                        />
                        {state.errors?.company && <p className="text-red-500 text-sm mt-1">{state.errors.company}</p>}
                      </div>

                      <div>
                        <Label htmlFor="role">Your Role</Label>
                        <Input id="role" name="role" placeholder="e.g., CFO, Controller, AR Manager" />
                      </div>

                      <div>
                        <Label htmlFor="affiliateCode">Affiliate/Partner Code</Label>
                        <Input
                          id="affiliateCode"
                          name="affiliateCode"
                          value={affiliateCode}
                          onChange={(e) => handleAffiliateCodeChange(e.target.value)}
                          placeholder="Enter code if you have one"
                          className={state.errors?.affiliateCode ? "border-red-500" : ""}
                        />
                        {state.errors?.affiliateCode && (
                          <p className="text-red-500 text-sm mt-1">{state.errors.affiliateCode}</p>
                        )}
                        {affiliateInfo && (
                          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">
                                Valid partner code: {affiliateInfo.name}
                              </span>
                            </div>
                            <p className="text-sm text-green-700 mt-1">
                              {affiliateInfo.discount}% discount available • {affiliateInfo.category}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="challenges">Current AR Challenges (Optional)</Label>
                        <Textarea
                          id="challenges"
                          name="challenges"
                          placeholder="Tell us about your current accounts receivable challenges..."
                          rows={4}
                        />
                      </div>

                      <div>
                        <ReCAPTCHA onVerify={setRecaptchaToken} onExpire={() => setRecaptchaToken("")} />
                        {state.errors?.recaptchaToken && (
                          <p className="text-red-500 text-sm mt-1">{state.errors.recaptchaToken}</p>
                        )}
                      </div>

                      {state.message && !state.success && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-800 text-sm">{state.message}</p>
                        </div>
                      )}

                      <Button type="submit" className="w-full" disabled={isPending || !recaptchaToken}>
                        {isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            Request Demo
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>

                      <p className="text-xs text-gray-500 text-center">
                        By submitting this form, you agree to our{" "}
                        <a href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </a>{" "}
                        and{" "}
                        <a href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </a>
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
