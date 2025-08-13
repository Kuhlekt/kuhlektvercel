"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Clock, Users } from "lucide-react"
import { submitDemoRequest } from "./actions"
import ReCAPTCHA from "@/components/recaptcha"

export default function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, null)
  const [captchaToken, setCaptchaToken] = useState("")

  const handleSubmit = async (formData: FormData) => {
    // Execute invisible reCAPTCHA before form submission
    const recaptchaElement = document.querySelector(".invisible-recaptcha") as any
    if (recaptchaElement && recaptchaElement.execute) {
      recaptchaElement.execute()
      // Wait a moment for the token to be generated
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    formData.append("captchaToken", captchaToken)
    formAction(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Kuhlekt can transform your accounts receivable process. Schedule a personalized demo with our team
            and discover how to reduce DSO and improve cash flow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Schedule Your Demo</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll contact you within 24 hours to schedule your personalized
                  demonstration.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form action={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className="w-full"
                        disabled={isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className="w-full"
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Business Email *</Label>
                    <Input
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      required
                      className="w-full"
                      disabled={isPending}
                    />
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="arChallenges">Current AR Challenges (Optional)</Label>
                    <Textarea
                      id="arChallenges"
                      name="arChallenges"
                      rows={3}
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
                    {isPending ? "Submitting..." : "Request Demo"}
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
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  What You'll See
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Complete AR automation workflow</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Real-time dashboard and analytics</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Customer portal and self-service options</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-600">Integration capabilities with your existing systems</p>
                </div>
              </CardContent>
            </Card>

            {/* Proven Results */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-2" />
                  Proven Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">30%</div>
                  <p className="text-sm text-gray-600">Average DSO Reduction</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">80%</div>
                  <p className="text-sm text-gray-600">Manual Tasks Eliminated</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">95%</div>
                  <p className="text-sm text-gray-600">Customer Satisfaction</p>
                </div>
              </CardContent>
            </Card>

            {/* Demo Process */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 mr-2" />
                  Demo Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium">Schedule Call</p>
                    <p className="text-xs text-gray-600">We'll contact you within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium">Personalized Demo</p>
                    <p className="text-xs text-gray-600">30-minute tailored presentation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium">Q&A Session</p>
                    <p className="text-xs text-gray-600">Address your specific needs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="text-sm font-medium">Next Steps</p>
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
