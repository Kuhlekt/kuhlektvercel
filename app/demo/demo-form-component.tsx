"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitDemoRequest } from "./actions"
import ReCAPTCHA from "@/components/recaptcha"
import { CheckCircle, Clock, Users } from 'lucide-react'

const initialState = {
  success: false,
  message: "",
}

export default function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState)
  const [captchaToken, setCaptchaToken] = useState("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const formData = new FormData(event.currentTarget)
    formData.append("captchaToken", captchaToken)
    
    // Execute invisible reCAPTCHA before form submission
    const recaptchaElement = document.querySelector(".invisible-recaptcha") as any
    if (recaptchaElement && recaptchaElement.execute) {
      recaptchaElement.execute()
    }
    
    // Submit the form
    formAction(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Kuhlekt can transform your accounts receivable process. Schedule a personalized demo with our team
            and discover how to reduce DSO by 30% and eliminate 80% of manual AR tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Schedule Your Demo</CardTitle>
                <CardDescription>Fill out the form below and we'll contact you within 24 hours to schedule your personalized demo.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" type="text" required className="w-full" disabled={isPending} />
                      {state?.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" type="text" required className="w-full" disabled={isPending} />
                      {state?.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Business Email *</Label>
                    <Input id="businessEmail" name="businessEmail" type="email" required className="w-full" disabled={isPending} />
                    {state?.errors?.businessEmail && <p className="text-sm text-red-600">{state.errors.businessEmail}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      className="w-full"
                      disabled={isPending}
                    />
                    {state?.errors?.companyName && <p className="text-sm text-red-600">{state.errors.companyName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      className="w-full"
                      disabled={isPending}
                    />
                    {state?.errors?.phoneNumber && <p className="text-sm text-red-600">{state.errors.phoneNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arChallenges">Current AR Challenges</Label>
                    <Textarea
                      id="arChallenges"
                      name="arChallenges"
                      rows={4}
                      className="w-full"
                      placeholder="Tell us about your current accounts receivable challenges..."
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                    <Input
                      id="affiliateCode"
                      name="affiliateCode"
                      type="text"
                      className="w-full"
                      placeholder="Enter affiliate code if you have one"
                      disabled={isPending}
                    />
                  </div>

                  <ReCAPTCHA onVerify={setCaptchaToken} />

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    disabled={isPending}
                  >
                    {isPending ? "Scheduling Demo..." : "Schedule Demo"}
                  </Button>

                  {state?.message && (
                    <div
                      className={`p-4 rounded-md ${
                        state.success
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {state.message}
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What You'll See */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  What You'll See
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Complete AR automation workflow</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Real-time dashboard and analytics</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Customer portal and self-service options</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Integration capabilities with your existing systems</p>
                </div>
              </CardContent>
            </Card>

            {/* Proven Results */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Proven Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">30%</div>
                  <div className="text-sm text-gray-600">DSO Reduction</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">80%</div>
                  <div className="text-sm text-gray-600">Manual Tasks Eliminated</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">Customer Satisfaction</div>
                </div>
              </CardContent>
            </Card>

            {/* Demo Process */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Demo Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Schedule Call</p>
                    <p className="text-xs text-gray-600">We'll contact you within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Personalized Demo</p>
                    <p className="text-xs text-gray-600">30-minute tailored presentation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Q&A Session</p>
                    <p className="text-xs text-gray-600">Address your specific needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-sm">Next Steps</p>
                    <p className="text-xs text-gray-600">Custom proposal and implementation plan</p>
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
