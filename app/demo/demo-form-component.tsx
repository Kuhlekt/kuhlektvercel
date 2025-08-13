"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock, Users, Shield, ArrowRight } from "lucide-react"
import { submitDemoRequest } from "./actions"
import ReCAPTCHA from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState)
  const [captchaToken, setCaptchaToken] = useState<string>("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Form */}
          <div>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">See Kuhlekt in Action</h1>
              <p className="text-xl text-gray-600">
                Schedule a personalized demo and discover how Kuhlekt can transform your accounts receivable process
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Request Your Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={formAction} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name *
                      </Label>
                      <Input id="firstName" name="firstName" type="text" required className="mt-1" placeholder="John" />
                      {state?.errors?.firstName && (
                        <p className="text-sm text-red-600 mt-1">{state.errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </Label>
                      <Input id="lastName" name="lastName" type="text" required className="mt-1" placeholder="Smith" />
                      {state?.errors?.lastName && <p className="text-sm text-red-600 mt-1">{state.errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessEmail" className="text-sm font-medium text-gray-700">
                      Business Email *
                    </Label>
                    <Input
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      required
                      className="mt-1"
                      placeholder="john.smith@company.com"
                    />
                    {state?.errors?.businessEmail && (
                      <p className="text-sm text-red-600 mt-1">{state.errors.businessEmail}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      className="mt-1"
                      placeholder="Your Company Inc."
                    />
                    {state?.errors?.companyName && (
                      <p className="text-sm text-red-600 mt-1">{state.errors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      className="mt-1"
                      placeholder="+1 (555) 123-4567"
                    />
                    {state?.errors?.phoneNumber && (
                      <p className="text-sm text-red-600 mt-1">{state.errors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="arChallenges" className="text-sm font-medium text-gray-700">
                      Current AR Challenges (Optional)
                    </Label>
                    <Textarea
                      id="arChallenges"
                      name="arChallenges"
                      className="mt-1"
                      rows={4}
                      placeholder="Tell us about your current accounts receivable challenges..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="affiliateCode" className="text-sm font-medium text-gray-700">
                      Affiliate Code (Optional)
                    </Label>
                    <Input
                      id="affiliateCode"
                      name="affiliateCode"
                      type="text"
                      className="mt-1"
                      placeholder="Enter affiliate code if you have one"
                    />
                  </div>

                  <ReCAPTCHA onVerify={setCaptchaToken} />

                  {state?.message && (
                    <Alert className={state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                      <AlertDescription className={state.success ? "text-green-800" : "text-red-800"}>
                        {state.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending || !captchaToken}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
                  >
                    {isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Scheduling Demo...
                      </>
                    ) : (
                      <>
                        Schedule My Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <input type="hidden" name="captchaToken" value={captchaToken} />

                  <p className="text-sm text-gray-500 text-center">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">What You'll See in Your Demo</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Complete AR Automation</h4>
                      <p className="text-blue-100">See how we automate your entire receivables process</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Smart Collections</h4>
                      <p className="text-blue-100">AI-powered prioritization and automated workflows</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Real-time Analytics</h4>
                      <p className="text-blue-100">Comprehensive dashboards and reporting</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Custom Integration</h4>
                      <p className="text-blue-100">Seamless connection with your existing systems</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900">30 Minutes</h4>
                <p className="text-sm text-gray-600">Demo Duration</p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900">1000+</h4>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-6 w-6 text-green-600" />
                <h4 className="font-semibold text-gray-900">Enterprise Security</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Your data is protected with enterprise-grade security, SOC 2 compliance, and bank-level encryption.
              </p>
            </Card>

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">What Happens Next?</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <span className="text-sm text-gray-700">We'll contact you within 24 hours</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <span className="text-sm text-gray-700">Schedule a convenient demo time</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <span className="text-sm text-gray-700">See Kuhlekt tailored to your needs</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
