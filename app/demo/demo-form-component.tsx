"use client"
import { useState } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Users, TrendingUp, Shield, Clock } from "lucide-react"
import { submitDemoRequest, type DemoFormState } from "./actions"
import ReCAPTCHA from "@/components/recaptcha"

const initialState: DemoFormState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoFormComponent() {
  const [state, setState] = useState<DemoFormState>(initialState)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsPending(true)
    const formData = new FormData(event.currentTarget)
    try {
      const result = await submitDemoRequest(state, formData)
      setState(result)
    } catch (error) {
      setState({
        success: false,
        message: "An unexpected error occurred. Please try again.",
        errors: {},
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Request a Demo</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Kuhlekt can transform your accounts receivable process. Schedule a personalized demo with our team
              and discover how to reduce DSO by up to 35%.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Demo Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Schedule Your Demo</CardTitle>
                <CardDescription>Fill out the form below and we'll contact you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className={state.errors?.firstName ? "border-red-500" : ""}
                        disabled={isPending}
                      />
                      {state.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className={state.errors?.lastName ? "border-red-500" : ""}
                        disabled={isPending}
                      />
                      {state.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={state.errors?.email ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      required
                      className={state.errors?.company ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    {state.errors?.company && <p className="text-sm text-red-600">{state.errors.company}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className={state.errors?.phone ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    {state.errors?.phone && <p className="text-sm text-red-600">{state.errors.phone}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" name="jobTitle" type="text" disabled={isPending} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Input
                      id="companySize"
                      name="companySize"
                      type="text"
                      placeholder="e.g., 50-100 employees"
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentSolution">Current AR Solution</Label>
                    <Input
                      id="currentSolution"
                      name="currentSolution"
                      type="text"
                      placeholder="e.g., QuickBooks, SAP, Manual process"
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeline">Implementation Timeline</Label>
                    <Input
                      id="timeline"
                      name="timeline"
                      type="text"
                      placeholder="e.g., Within 3 months"
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="challenges">Current AR Challenges</Label>
                    <Textarea
                      id="challenges"
                      name="challenges"
                      rows={3}
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
                      placeholder="Enter affiliate code if you have one"
                      disabled={isPending}
                    />
                  </div>

                  <ReCAPTCHA />

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scheduling Demo...
                      </>
                    ) : (
                      "Schedule Demo"
                    )}
                  </Button>

                  {state.message && (
                    <Alert className={state.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
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
                </form>
              </CardContent>
            </Card>

            {/* Demo Benefits */}
            <div className="space-y-8">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">What You'll See in Your Demo</CardTitle>
                  <CardDescription>Discover how Kuhlekt can transform your AR process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Real-time Dashboard</h3>
                      <p className="text-gray-600">See live AR metrics, aging reports, and cash flow projections</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Users className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Customer Portal</h3>
                      <p className="text-gray-600">Self-service portal for customers to view and pay invoices</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Shield className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Automated Collections</h3>
                      <p className="text-gray-600">Smart workflows that reduce manual work by 80%</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Quick Implementation</h3>
                      <p className="text-gray-600">Go live in as little as 1 week with our proven process</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Proven Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">30%</div>
                    <div className="text-sm text-gray-600">Average DSO Reduction</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">60%</div>
                      <div className="text-xs text-gray-600">Less Manual Work</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">1 Week</div>
                      <div className="text-xs text-gray-600">Implementation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Demo Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Personalized Demo</h4>
                      <p className="text-sm text-gray-600">1 hour demo tailored to your business</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Implementation Plan</h4>
                      <p className="text-sm text-gray-600">Custom roadmap for your success</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
