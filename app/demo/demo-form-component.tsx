"use client"

import { useState, useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Users, TrendingUp } from "lucide-react"
import { submitDemoRequest } from "./actions"
import { ReCaptcha } from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    if (captchaToken) {
      formData.append("captchaToken", captchaToken)
    }
    formAction(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Form */}
          <div>
            <div className="mb-8">
              <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700">Free Demo</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">See Kuhlekt in Action</h1>
              <p className="text-xl text-gray-600">
                Schedule a personalized demo and discover how Kuhlekt can transform your accounts receivable process.
              </p>
            </div>

            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Request Your Demo</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll schedule a personalized demonstration of our platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {state.success ? (
                  <div className="text-center py-8">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Demo Request Submitted!</h3>
                    <p className="text-gray-600 mb-4">{state.message}</p>
                    <p className="text-sm text-gray-500">
                      We'll contact you within 24 hours to schedule your personalized demo.
                    </p>
                  </div>
                ) : (
                  <form action={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          className="mt-1"
                          placeholder="John"
                        />
                        {state.errors?.firstName && (
                          <p className="text-red-600 text-sm mt-1">{state.errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          className="mt-1"
                          placeholder="Smith"
                        />
                        {state.errors?.lastName && <p className="text-red-600 text-sm mt-1">{state.errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1"
                        placeholder="john.smith@company.com"
                      />
                      {state.errors?.email && <p className="text-red-600 text-sm mt-1">{state.errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        className="mt-1"
                        placeholder="Your Company Inc."
                      />
                      {state.errors?.company && <p className="text-red-600 text-sm mt-1">{state.errors.company}</p>}
                    </div>

                    <div>
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        required
                        className="mt-1"
                        placeholder="CFO, Finance Manager, etc."
                      />
                      {state.errors?.jobTitle && <p className="text-red-600 text-sm mt-1">{state.errors.jobTitle}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" className="mt-1" placeholder="+1 (555) 123-4567" />
                    </div>

                    <div>
                      <Label htmlFor="companySize">Company Size *</Label>
                      <Select name="companySize" required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="501-1000">501-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      {state.errors?.companySize && (
                        <p className="text-red-600 text-sm mt-1">{state.errors.companySize}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="currentSolution">Current AR Solution</Label>
                      <Select name="currentSolution">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="What do you currently use?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spreadsheets">Excel/Spreadsheets</SelectItem>
                          <SelectItem value="quickbooks">QuickBooks</SelectItem>
                          <SelectItem value="sap">SAP</SelectItem>
                          <SelectItem value="oracle">Oracle</SelectItem>
                          <SelectItem value="netsuite">NetSuite</SelectItem>
                          <SelectItem value="other-erp">Other ERP</SelectItem>
                          <SelectItem value="manual">Manual Process</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="timeline">Implementation Timeline</Label>
                      <Select name="timeline">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="When are you looking to implement?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediately</SelectItem>
                          <SelectItem value="1-3-months">1-3 months</SelectItem>
                          <SelectItem value="3-6-months">3-6 months</SelectItem>
                          <SelectItem value="6-12-months">6-12 months</SelectItem>
                          <SelectItem value="exploring">Just exploring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="challenges">Current AR Challenges</Label>
                      <Textarea
                        id="challenges"
                        name="challenges"
                        className="mt-1"
                        rows={3}
                        placeholder="Tell us about your current accounts receivable challenges..."
                      />
                    </div>

                    <ReCaptcha onVerify={setCaptchaToken} />

                    <Button
                      type="submit"
                      disabled={isPending || !captchaToken}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {isPending ? "Submitting..." : "Schedule My Demo"}
                    </Button>

                    {state.message && !state.success && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-red-600 text-sm">{state.message}</p>
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Benefits */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll See in Your Demo</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Live Platform Walkthrough</h3>
                    <p className="text-gray-600">See our intuitive dashboard and key features in action</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">ROI Calculator</h3>
                    <p className="text-gray-600">Calculate your potential savings and time reduction</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Custom Use Cases</h3>
                    <p className="text-gray-600">Tailored scenarios based on your specific industry and needs</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Implementation Timeline</h3>
                    <p className="text-gray-600">Clear roadmap for getting started with Kuhlekt</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Results After 90 Days</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">35%</div>
                    <div className="text-sm text-gray-600">DSO Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">80%</div>
                    <div className="text-sm text-gray-600">Time Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
                    <div className="text-sm text-gray-600">Collection Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-1">300%</div>
                    <div className="text-sm text-gray-600">ROI</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What Our Customers Say</h3>
              <blockquote className="text-gray-600 italic mb-3">
                "The demo showed us exactly how Kuhlekt could solve our biggest AR challenges. Within 3 months of
                implementation, we reduced our DSO by 40% and freed up 15 hours per week for our finance team."
              </blockquote>
              <div className="text-sm">
                <div className="font-medium text-gray-900">Sarah Johnson</div>
                <div className="text-gray-500">CFO, TechSolutions Inc.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
