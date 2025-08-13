"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, ArrowRight, Shield, Zap, TrendingUp } from "lucide-react"
import { submitDemoRequest } from "./actions"
import { ReCaptcha } from "@/components/recaptcha"

export function DemoFormComponent() {
  const [state, action, isPending] = useActionState(submitDemoRequest, null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">See Kuhlekt in Action</h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              Get a personalized demo and discover how our AR automation platform can transform your business
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>30-minute personalized demo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>ROI calculation included</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No commitment required</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Demo Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Request Your Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <form action={action} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium">
                        First Name *
                      </Label>
                      <Input id="firstName" name="firstName" type="text" required className="mt-1" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium">
                        Last Name *
                      </Label>
                      <Input id="lastName" name="lastName" type="text" required className="mt-1" placeholder="Smith" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="businessEmail" className="text-sm font-medium">
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
                  </div>

                  <div>
                    <Label htmlFor="companyName" className="text-sm font-medium">
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
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">
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
                  </div>

                  <div>
                    <Label htmlFor="arChallenges" className="text-sm font-medium">
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
                    <Label htmlFor="affiliateCode" className="text-sm font-medium">
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

                  <ReCaptcha />

                  {state?.error && (
                    <Alert variant="destructive">
                      <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                  )}

                  {state?.success && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">{state.message}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    {isPending ? (
                      "Scheduling Demo..."
                    ) : (
                      <>
                        Schedule My Demo <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What You'll See in Your Demo</h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Credit Management in Action</h3>
                      <p className="text-gray-600">
                        See how automated credit scoring and limit management can reduce your risk exposure by up to
                        40%.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Smart Collections Workflow</h3>
                      <p className="text-gray-600">
                        Watch AI-powered prioritization and automated dunning sequences accelerate your collections by
                        50%.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Real-Time Analytics</h3>
                      <p className="text-gray-600">
                        Explore comprehensive dashboards that provide instant insights into your AR performance and
                        trends.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <Card className="bg-gray-50 border-0">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">Trusted by Finance Teams</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">500+</div>
                      <div className="text-sm text-gray-600">Companies</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">35%</div>
                      <div className="text-sm text-gray-600">Avg DSO Reduction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">$1.2M</div>
                      <div className="text-sm text-gray-600">Avg Annual Savings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3">What Happens Next?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <span>We'll contact you within 24 hours to schedule your demo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <span>30-minute personalized demo tailored to your business needs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <span>Receive a custom ROI analysis and implementation roadmap</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
