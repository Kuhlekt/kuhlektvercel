"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Loader2, ArrowRight, Users, TrendingUp, Shield } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"

export default function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div>
            <div className="mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Schedule Your Free Demo</h1>
              <p className="text-xl text-gray-600">
                See how Kuhlekt can transform your accounts receivable process in just 30 minutes.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Request Your Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={formAction} className="space-y-6">
                  <input type="hidden" name="captchaToken" value={captchaToken || ""} />

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="mt-1"
                        disabled={isPending}
                      />
                      {state?.fieldErrors?.firstName && (
                        <p className="text-sm text-red-600 mt-1">{state.fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" type="text" required className="mt-1" disabled={isPending} />
                      {state?.fieldErrors?.lastName && (
                        <p className="text-sm text-red-600 mt-1">{state.fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessEmail">Business Email *</Label>
                    <Input
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      required
                      className="mt-1"
                      disabled={isPending}
                    />
                    {state?.fieldErrors?.businessEmail && (
                      <p className="text-sm text-red-600 mt-1">{state.fieldErrors.businessEmail}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      className="mt-1"
                      disabled={isPending}
                    />
                    {state?.fieldErrors?.companyName && (
                      <p className="text-sm text-red-600 mt-1">{state.fieldErrors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      className="mt-1"
                      disabled={isPending}
                    />
                    {state?.fieldErrors?.phoneNumber && (
                      <p className="text-sm text-red-600 mt-1">{state.fieldErrors.phoneNumber}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="arChallenges">Current AR Challenges (Optional)</Label>
                    <Textarea
                      id="arChallenges"
                      name="arChallenges"
                      rows={4}
                      className="mt-1"
                      placeholder="Tell us about your current accounts receivable challenges..."
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                    <Input
                      id="affiliateCode"
                      name="affiliateCode"
                      type="text"
                      className="mt-1"
                      placeholder="Enter affiliate code if you have one"
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <ReCAPTCHA onVerify={setCaptchaToken} />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                    disabled={isPending || !captchaToken}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Scheduling Demo...
                      </>
                    ) : (
                      <>
                        Schedule Demo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  {state?.success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">{state.message}</AlertDescription>
                    </Alert>
                  )}

                  {state?.error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{state.message}</AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll See in Your Demo</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Complete AR Automation</h3>
                    <p className="text-gray-600">
                      See how to automate your entire accounts receivable process from credit applications to
                      collections.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Dashboard</h3>
                    <p className="text-gray-600">
                      Get insights into your AR performance with comprehensive analytics and reporting tools.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Collections</h3>
                    <p className="text-gray-600">
                      Learn how AI-powered collection strategies can improve your recovery rates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Customer Portal</h3>
                    <p className="text-gray-600">
                      Discover how self-service capabilities can reduce your team's workload.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-semibold text-sm">
                    1
                  </div>
                  <p className="text-gray-700">We'll contact you within 24 hours to schedule your demo</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-semibold text-sm">
                    2
                  </div>
                  <p className="text-gray-700">30-minute personalized demo based on your specific needs</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-semibold text-sm">
                    3
                  </div>
                  <p className="text-gray-700">Receive a custom proposal with ROI projections</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Finance Teams</div>
              </div>
              <div>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-cyan-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">35%</div>
                <div className="text-sm text-gray-600">DSO Reduction</div>
              </div>
              <div>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-cyan-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">99%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
