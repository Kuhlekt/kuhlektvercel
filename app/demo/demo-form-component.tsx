"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Clock, Users, TrendingUp, Shield } from "lucide-react"
import { submitDemoForm } from "./actions"
import ReCAPTCHA from "@/components/recaptcha"
import { useState } from "react"

const initialState = {
  success: false,
  message: "",
}

export default function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoForm, initialState)
  const [captchaToken, setCaptchaToken] = useState<string>("")

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Request Your Free Demo</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Kuhlekt can transform your accounts receivable process. Get a personalized demo tailored to your
              business needs.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Demo Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Your Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <form action={formAction} className="space-y-6">
                    <input type="hidden" name="captchaToken" value={captchaToken} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name *</Label>
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
                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          required
                          className="mt-1"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
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
                    </div>

                    <div>
                      <Label htmlFor="companySize">Company Size</Label>
                      <Select name="companySize">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-500">201-500 employees</SelectItem>
                          <SelectItem value="500+">500+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="currentArProcess">Current AR Process</Label>
                      <Select name="currentArProcess">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="How do you currently manage AR?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual processes (Excel, email)</SelectItem>
                          <SelectItem value="basic-software">Basic accounting software</SelectItem>
                          <SelectItem value="erp">ERP system</SelectItem>
                          <SelectItem value="ar-software">Dedicated AR software</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="painPoints">Main Pain Points (Optional)</Label>
                      <Textarea
                        id="painPoints"
                        name="painPoints"
                        rows={3}
                        className="mt-1"
                        placeholder="What challenges are you facing with your current AR process?"
                      />
                    </div>

                    <div>
                      <Label htmlFor="timeframe">Implementation Timeframe</Label>
                      <Select name="timeframe">
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="When are you looking to implement?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate (within 1 month)</SelectItem>
                          <SelectItem value="short-term">Short-term (1-3 months)</SelectItem>
                          <SelectItem value="medium-term">Medium-term (3-6 months)</SelectItem>
                          <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                          <SelectItem value="exploring">Just exploring options</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
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

                    {state?.message && (
                      <Alert className={state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                        <div className="flex items-center gap-2">
                          {state.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <AlertDescription className={state.success ? "text-green-800" : "text-red-800"}>
                            {state.message}
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Requesting Demo...
                        </>
                      ) : (
                        "Request Free Demo"
                      )}
                    </Button>

                    <p className="text-sm text-gray-500 text-center">
                      * Required fields. We'll contact you within 24 hours.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What You'll See in Your Demo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Real-time AR Dashboard</h4>
                      <p className="text-sm text-gray-600">See your complete receivables overview at a glance</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Automated Workflows</h4>
                      <p className="text-sm text-gray-600">Streamline follow-ups and payment reminders</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Customer Portal</h4>
                      <p className="text-sm text-gray-600">Self-service payment and dispute resolution</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-sm">Risk Management</h4>
                      <p className="text-sm text-gray-600">AI-powered credit scoring and risk assessment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Demo Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      1
                    </div>
                    <p className="text-sm">We'll contact you within 24 hours</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      2
                    </div>
                    <p className="text-sm">Schedule a convenient time for your demo</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      3
                    </div>
                    <p className="text-sm">30-minute personalized demonstration</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      4
                    </div>
                    <p className="text-sm">Q&A and next steps discussion</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Typical Results</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 40% reduction in DSO</li>
                    <li>• 60% less manual work</li>
                    <li>• 25% improvement in cash flow</li>
                    <li>• 90% faster month-end close</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
