"use client"

import { useActionState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, TrendingUp, DollarSign, Shield } from 'lucide-react'
import { submitDemoRequest } from "./actions"
import ReCAPTCHA from "@/components/recaptcha"

export default function DemoPage() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">See Kuhlekt in Action</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule a personalized demo and discover how Kuhlekt can transform your accounts receivable process
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Reduce DSO by 30%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Accelerate cash flow with automated follow-ups and intelligent collection strategies
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Save 15+ Hours/Week</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Automate manual AR tasks and focus on strategic business activities</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-xl">Increase Collections by 25%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Improve collection rates with data-driven insights and personalized communication
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Demo Form */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Request Your Demo</CardTitle>
              <CardDescription className="text-center">
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state?.success && (
                <Alert className="mb-6 border-green-500 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Thank you! Your demo request has been submitted successfully. We'll contact you within 24 hours to
                    schedule your personalized demo.
                  </AlertDescription>
                </Alert>
              )}

              {state?.error && (
                <Alert className="mb-6 border-red-500 bg-red-50">
                  <AlertDescription className="text-red-700">{state.error}</AlertDescription>
                </Alert>
              )}

              <form action={formAction} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" required className="mt-1" disabled={isPending} />
                    {state?.fieldErrors?.firstName && (
                      <p className="text-red-500 text-sm mt-1">{state.fieldErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" required className="mt-1" disabled={isPending} />
                    {state?.fieldErrors?.lastName && (
                      <p className="text-red-500 text-sm mt-1">{state.fieldErrors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Business Email *</Label>
                  <Input id="email" name="email" type="email" required className="mt-1" disabled={isPending} />
                  {state?.fieldErrors?.email && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required className="mt-1" disabled={isPending} />
                  {state?.fieldErrors?.phone && <p className="text-red-500 text-sm mt-1">{state.fieldErrors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input id="company" name="company" required className="mt-1" disabled={isPending} />
                  {state?.fieldErrors?.company && (
                    <p className="text-red-500 text-sm mt-1">{state.fieldErrors.company}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input id="jobTitle" name="jobTitle" required className="mt-1" disabled={isPending} />
                  {state?.fieldErrors?.jobTitle && (
                    <p className="text-red-500 text-sm mt-1">{state.fieldErrors.jobTitle}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                  <Input
                    id="affiliateCode"
                    name="affiliateCode"
                    placeholder="Enter affiliate code if you have one"
                    className="mt-1"
                    disabled={isPending}
                  />
                  {state?.fieldErrors?.affiliateCode && (
                    <p className="text-red-500 text-sm mt-1">{state.fieldErrors.affiliateCode}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message">Additional Information (Optional)</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your current AR challenges or specific areas you'd like to focus on during the demo"
                    className="mt-1"
                    rows={4}
                    disabled={isPending}
                  />
                  {state?.fieldErrors?.message && (
                    <p className="text-red-500 text-sm mt-1">{state.fieldErrors.message}</p>
                  )}
                </div>

                <div className="flex justify-center">
                  <ReCAPTCHA onVerify={() => {}} />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                  {isPending ? "Submitting..." : "Request Demo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              SOC 2 Compliant
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Trusted by 500+ Companies
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Clock className="h-4 w-4 mr-2" />
              30-Minute Demo
            </Badge>
          </div>
          <p className="text-gray-600">
            No commitment required. See how Kuhlekt can transform your AR process in just 30 minutes.
          </p>
        </div>
      </div>
    </div>
  )
}
