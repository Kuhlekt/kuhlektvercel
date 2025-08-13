"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, ArrowRight, Users, TrendingUp, Clock } from "lucide-react"
import { submitDemoRequest } from "./actions"
import ReCaptcha from "@/components/recaptcha"

export default function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const benefits = [
    "Reduce DSO by up to 40% with automated workflows",
    "Increase collection rates through intelligent prioritization",
    "Save 15+ hours per week on manual AR tasks",
    "Get real-time visibility into your receivables pipeline",
  ]

  return (
    <div className="min-h-screen bg-white">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Benefits */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">See Kuhlekt in Action</h1>
                <p className="text-xl text-gray-600">
                  Get a personalized demo and discover how Kuhlekt can transform your accounts receivable process.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>

              {/* Demo Process Steps */}
              <div className="flex items-center gap-4 pt-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                </div>
                <p className="text-gray-600">15-minute setup • Live demo • Implementation plan</p>
              </div>
            </div>

            {/* Right Column - Demo Form */}
            <Card className="p-8 rounded-lg border border-gray-200 shadow-sm">
              <CardContent className="p-0 space-y-6">
                {/* Logo */}
                <div className="text-center">
                  <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-10 mx-auto mb-6" />
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Your Demo</h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll contact you within 24 hours to schedule your personalized demo.
                  </p>
                </div>

                {state?.success && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-green-800 font-medium">Success!</p>
                    </div>
                    <p className="text-green-700 mt-1">{state.message}</p>
                  </div>
                )}

                {state?.success === false && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{state.message}</p>
                  </div>
                )}

                <form action={formAction} className="space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name *
                      </Label>
                      <Input id="firstName" name="firstName" type="text" required className="mt-1" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </Label>
                      <Input id="lastName" name="lastName" type="text" required className="mt-1" placeholder="Smith" />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="businessEmail" className="text-sm font-medium text-gray-700">
                      Email *
                    </Label>
                    <Input
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      required
                      className="mt-1"
                      placeholder="john.smith@company.com"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                      Company *
                    </Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      className="mt-1"
                      placeholder="Your Company Name"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                      Phone *
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      className="mt-1"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* AR Challenges */}
                  <div>
                    <Label htmlFor="arChallenges" className="text-sm font-medium text-gray-700">
                      What are your biggest AR challenges?
                    </Label>
                    <Textarea
                      id="arChallenges"
                      name="arChallenges"
                      rows={4}
                      className="mt-1"
                      placeholder="Tell us about your current accounts receivable challenges..."
                    />
                  </div>

                  {/* Affiliate Code */}
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

                  {/* ReCaptcha */}
                  <ReCaptcha onVerify={setCaptchaToken} />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isPending || !captchaToken}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    {isPending ? (
                      "Submitting..."
                    ) : (
                      <>
                        Request Demo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>

                  <input type="hidden" name="captchaToken" value={captchaToken || ""} />
                </form>

                <p className="text-xs text-gray-500 text-center">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Finance Teams Worldwide</h2>
            <p className="text-xl text-gray-600">
              Join hundreds of companies that have transformed their AR process with Kuhlekt
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">40% DSO Reduction</h3>
              <p className="text-gray-600">Average reduction in Days Sales Outstanding across our client base</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">500+ Companies</h3>
              <p className="text-gray-600">Finance teams using Kuhlekt to streamline their AR operations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">15+ Hours Saved</h3>
              <p className="text-gray-600">Weekly time savings through automation and intelligent workflows</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
