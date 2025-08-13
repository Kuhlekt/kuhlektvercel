"use client"

import { useActionState } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, TrendingUp, ArrowRight } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"

const initialState = {
  success: false,
  message: "",
}

export default function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState)
  const [captchaToken, setCaptchaToken] = useState<string>("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-800">
            🚀 Free Demo
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">See Kuhlekt in Action</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get a personalized demo of our accounts receivable automation platform and discover how we can accelerate
            your cash flow.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Request Your Demo</CardTitle>
              <p className="text-gray-600">Fill out the form below and we'll contact you within 24 hours.</p>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="mt-1"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="mt-1"
                      placeholder="Enter your last name"
                    />
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
                    placeholder="Enter your business email"
                  />
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
                    placeholder="Enter your company name"
                  />
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
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="arChallenges" className="text-sm font-medium text-gray-700">
                    Current AR Challenges (Optional)
                  </Label>
                  <Textarea
                    id="arChallenges"
                    name="arChallenges"
                    rows={4}
                    className="mt-1"
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

                <div className="flex justify-center">
                  <ReCAPTCHA onVerify={setCaptchaToken} />
                </div>

                <input type="hidden" name="recaptchaToken" value={captchaToken} />

                {state?.message && (
                  <div
                    className={`p-4 rounded-md ${
                      state.success
                        ? "bg-green-50 border border-green-200 text-green-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                    }`}
                  >
                    {state.message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                  {isPending ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Requesting Demo...
                    </div>
                  ) : (
                    <>
                      Request Demo <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">What You'll See in Your Demo</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Automated Invoice Processing</h4>
                    <p className="text-sm text-gray-600">See how we streamline your entire invoice-to-cash process</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Real-time Analytics Dashboard</h4>
                    <p className="text-sm text-gray-600">Get instant insights into your AR performance and cash flow</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Smart Collections Workflow</h4>
                    <p className="text-sm text-gray-600">Automated follow-ups and personalized collection strategies</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Integration Capabilities</h4>
                    <p className="text-sm text-gray-600">
                      Seamless connection with your existing ERP and accounting systems
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h3 className="text-xl font-semibold mb-4">Results You Can Expect</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">40%</div>
                  <div className="text-sm text-gray-600">Faster Collections</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">25%</div>
                  <div className="text-sm text-gray-600">DSO Reduction</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">80%</div>
                  <div className="text-sm text-gray-600">Time Savings</div>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">98%</div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Simple 3-Step Process</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Schedule Your Demo</h4>
                    <p className="text-sm text-gray-600">Fill out the form and we'll contact you within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Personalized Walkthrough</h4>
                    <p className="text-sm text-gray-600">30-minute demo tailored to your specific AR challenges</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Get Your Custom Proposal</h4>
                    <p className="text-sm text-gray-600">Receive a tailored solution and implementation plan</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
