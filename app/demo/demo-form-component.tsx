"use client"

import { useActionState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock, Users, TrendingUp, Shield, Zap } from "lucide-react"
import { submitDemoForm } from "./actions"
import { ReCaptcha } from "@/components/recaptcha"

export function DemoFormComponent() {
  const [state, action, isPending] = useActionState(submitDemoForm, null)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Schedule Your Personalized Demo</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Kuhlekt can transform your accounts receivable process and accelerate your cash flow in just 30
              minutes.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Demo Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Request Your Demo</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll contact you within 24 hours to schedule your personalized demo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {state?.success && (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{state.message}</AlertDescription>
                  </Alert>
                )}

                {state?.success ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Demo Request Submitted!</h3>
                    <p className="text-gray-600">
                      We'll be in touch within 24 hours to schedule your personalized demo.
                    </p>
                  </div>
                ) : (
                  <form action={action} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          className={state?.errors?.firstName ? "border-red-500" : ""}
                        />
                        {state?.errors?.firstName && (
                          <p className="text-red-500 text-sm mt-1">{state.errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          className={state?.errors?.lastName ? "border-red-500" : ""}
                        />
                        {state?.errors?.lastName && (
                          <p className="text-red-500 text-sm mt-1">{state.errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className={state?.errors?.email ? "border-red-500" : ""}
                      />
                      {state?.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company *</Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          required
                          className={state?.errors?.company ? "border-red-500" : ""}
                        />
                        {state?.errors?.company && <p className="text-red-500 text-sm mt-1">{state.errors.company}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          className={state?.errors?.phone ? "border-red-500" : ""}
                        />
                        {state?.errors?.phone && <p className="text-red-500 text-sm mt-1">{state.errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        required
                        className={state?.errors?.jobTitle ? "border-red-500" : ""}
                      />
                      {state?.errors?.jobTitle && <p className="text-red-500 text-sm mt-1">{state.errors.jobTitle}</p>}
                    </div>

                    <div>
                      <Label htmlFor="companySize">Company Size *</Label>
                      <Select name="companySize" required>
                        <SelectTrigger className={state?.errors?.companySize ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                          <SelectItem value="1000+">1,000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      {state?.errors?.companySize && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.companySize}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="currentSolution">Current AR Solution *</Label>
                      <Select name="currentSolution" required>
                        <SelectTrigger className={state?.errors?.currentSolution ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select your current solution" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual processes (Excel, email)</SelectItem>
                          <SelectItem value="quickbooks">QuickBooks</SelectItem>
                          <SelectItem value="xero">Xero</SelectItem>
                          <SelectItem value="sage">Sage</SelectItem>
                          <SelectItem value="netsuite">NetSuite</SelectItem>
                          <SelectItem value="sap">SAP</SelectItem>
                          <SelectItem value="other-erp">Other ERP system</SelectItem>
                          <SelectItem value="other-ar">Other AR solution</SelectItem>
                          <SelectItem value="none">No current solution</SelectItem>
                        </SelectContent>
                      </Select>
                      {state?.errors?.currentSolution && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.currentSolution}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="challenges">What are your biggest AR challenges? *</Label>
                      <Textarea
                        id="challenges"
                        name="challenges"
                        rows={4}
                        required
                        placeholder="e.g., slow payment collection, manual follow-ups, lack of visibility into receivables..."
                        className={state?.errors?.challenges ? "border-red-500" : ""}
                      />
                      {state?.errors?.challenges && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.challenges}</p>
                      )}
                    </div>

                    <input type="hidden" name="affiliate" value="" />

                    <ReCaptcha />

                    {state?.message && !state?.success && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">{state.message}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                      {isPending ? "Submitting..." : "Request Demo"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Benefits & What to Expect */}
            <div className="space-y-8">
              {/* What You'll See */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-cyan-600" />
                    What You'll See in Your Demo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Live walkthrough of the Kuhlekt platform</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Automated collection workflows in action</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Real-time analytics and reporting dashboard</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Integration capabilities with your existing systems</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Customized ROI projection for your business</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Key Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-600" />
                    Key Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 p-2 rounded-lg">
                        <Zap className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">40% Faster Collections</h4>
                        <p className="text-sm text-gray-600">Automated workflows accelerate payment cycles</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 p-2 rounded-lg">
                        <Users className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">75% Less Manual Work</h4>
                        <p className="text-sm text-gray-600">Free up your team for strategic activities</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-cyan-100 p-2 rounded-lg">
                        <Shield className="h-4 w-4 text-cyan-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">25% DSO Reduction</h4>
                        <p className="text-sm text-gray-600">Improve cash flow and working capital</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demo Process */}
              <Card>
                <CardHeader>
                  <CardTitle>Demo Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <div>
                        <h4 className="font-semibold">Submit Request</h4>
                        <p className="text-sm text-gray-600">Complete the form with your business details</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                        2
                      </div>
                      <div>
                        <h4 className="font-semibold">Schedule Call</h4>
                        <p className="text-sm text-gray-600">We'll contact you within 24 hours to schedule</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <div>
                        <h4 className="font-semibold">Live Demo</h4>
                        <p className="text-sm text-gray-600">30-minute personalized demonstration</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                        4
                      </div>
                      <div>
                        <h4 className="font-semibold">Next Steps</h4>
                        <p className="text-sm text-gray-600">Discuss implementation and pricing options</p>
                      </div>
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
