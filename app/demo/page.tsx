"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Calendar, Users, TrendingUp, Shield } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"

export default function DemoPage() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, null)
  const [recaptchaToken, setRecaptchaToken] = useState("")

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request Your Personalized Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Kuhlekt's AR automation platform can transform your accounts receivable process. Get a live
            demonstration tailored to your business needs.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">30-Minute Demo</h3>
            <p className="text-sm text-gray-600">Comprehensive overview of all features</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Expert Guidance</h3>
            <p className="text-sm text-gray-600">AR specialists answer your questions</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">ROI Analysis</h3>
            <p className="text-sm text-gray-600">Custom savings calculation for your business</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Commitment</h3>
            <p className="text-sm text-gray-600">Free demo with no obligations</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Your Demo</CardTitle>
              <CardDescription>
                Fill out the form below and we'll contact you within 2 business hours to schedule your personalized
                demonstration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state?.success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{state.message}</AlertDescription>
                </Alert>
              )}

              {state?.success === false && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{state.message}</AlertDescription>
                </Alert>
              )}

              <form action={formAction} className="space-y-6">
                <input type="hidden" name="recaptchaToken" value={recaptchaToken} />

                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className={state?.errors?.firstName ? "border-red-500" : ""}
                    />
                    {state?.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className={state?.errors?.lastName ? "border-red-500" : ""}
                    />
                    {state?.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={state?.errors?.email ? "border-red-500" : ""}
                  />
                  {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className={state?.errors?.phone ? "border-red-500" : ""}
                  />
                  {state?.errors?.phone && <p className="text-sm text-red-600">{state.errors.phone}</p>}
                </div>

                {/* Company Information */}
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className={state?.errors?.company ? "border-red-500" : ""}
                  />
                  {state?.errors?.company && <p className="text-sm text-red-600">{state.errors.company}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    type="text"
                    required
                    className={state?.errors?.jobTitle ? "border-red-500" : ""}
                  />
                  {state?.errors?.jobTitle && <p className="text-sm text-red-600">{state.errors.jobTitle}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select name="companySize" required>
                    <SelectTrigger className={state?.errors?.companySize ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1,000 employees</SelectItem>
                      <SelectItem value="1000+">1,000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  {state?.errors?.companySize && <p className="text-sm text-red-600">{state.errors.companySize}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentChallenges">Current AR Challenges (Optional)</Label>
                  <Textarea
                    id="currentChallenges"
                    name="currentChallenges"
                    placeholder="Tell us about your current accounts receivable challenges..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                  <Input
                    id="affiliateCode"
                    name="affiliateCode"
                    type="text"
                    placeholder="Enter affiliate code if you have one"
                    className={state?.errors?.affiliateCode ? "border-red-500" : ""}
                  />
                  {state?.errors?.affiliateCode && <p className="text-sm text-red-600">{state.errors.affiliateCode}</p>}
                </div>

                <div className="space-y-4">
                  <ReCAPTCHA onVerify={handleRecaptchaVerify} />
                  {state?.errors?.recaptchaToken && (
                    <p className="text-sm text-red-600">{state.errors.recaptchaToken}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isPending || !recaptchaToken}>
                  {isPending ? "Submitting..." : "Request Demo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What You'll See in Your Demo</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Automated Workflows</h3>
              <p className="text-gray-600">
                See how our platform automates invoice generation, payment reminders, and collection processes.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">
                Explore comprehensive dashboards showing DSO trends, aging reports, and collection performance.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg text-gray-900 mb-3">Integration Capabilities</h3>
              <p className="text-gray-600">
                Learn how Kuhlekt seamlessly integrates with your existing ERP, CRM, and accounting systems.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
