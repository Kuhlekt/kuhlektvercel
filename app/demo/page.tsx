"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, DollarSign, Clock, TrendingUp } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoPage() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateInfo, setAffiliateInfo] = useState(null)

  const handleSubmit = async (formData: FormData) => {
    formData.append("recaptchaToken", recaptchaToken)
    return formAction(formData)
  }

  const handleAffiliateChange = (value: string) => {
    setAffiliateCode(value)
    if (value.trim()) {
      const info = validateAffiliateCode(value.trim())
      setAffiliateInfo(info)
    } else {
      setAffiliateInfo(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Transform Your</span>{" "}
                  <span className="block text-blue-600 xl:inline">AR Process</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  See how Kuhlekt's AI-powered accounts receivable automation can reduce your DSO by up to 40% and
                  increase cash flow efficiency.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium">
                      Get Your Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/images/ar-dashboard.png"
            alt="Kuhlekt AR Dashboard"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Proven Results for Growing Businesses</h2>
            <p className="mt-3 text-xl text-blue-200 sm:mt-4">
              Join hundreds of companies that have transformed their AR operations
            </p>
          </div>
          <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">Average DSO Reduction</dt>
              <dd className="order-1 text-5xl font-extrabold text-white flex items-center justify-center">
                <TrendingUp className="h-8 w-8 mr-2" />
                40%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">Faster Collections</dt>
              <dd className="order-1 text-5xl font-extrabold text-white flex items-center justify-center">
                <Clock className="h-8 w-8 mr-2" />
                60%
              </dd>
            </div>
            <div className="flex flex-col mt-10 sm:mt-0">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">ROI in First Year</dt>
              <dd className="order-1 text-5xl font-extrabold text-white flex items-center justify-center">
                <DollarSign className="h-8 w-8 mr-2" />
                300%
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Benefits */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose Kuhlekt?</h2>

              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <span className="text-xl font-bold">1</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">AI-Powered Automation</h3>
                    <p className="mt-2 text-base text-gray-500">• Automated invoice processing and follow-ups</p>
                    <p className="text-base text-gray-500">• Smart payment prediction algorithms</p>
                    <p className="text-base text-gray-500">• Intelligent customer segmentation</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <span className="text-xl font-bold">2</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Seamless Integration</h3>
                    <p className="mt-2 text-base text-gray-500">• Connect with your existing ERP/CRM systems</p>
                    <p className="text-base text-gray-500">• Real-time data synchronization</p>
                    <p className="text-base text-gray-500">• No disruption to current workflows</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                      <span className="text-xl font-bold">3</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Advanced Analytics</h3>
                    <p className="mt-2 text-base text-gray-500">• Real-time dashboards and reporting</p>
                    <p className="text-base text-gray-500">• Predictive cash flow forecasting</p>
                    <p className="text-base text-gray-500">• Customer risk assessment tools</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What You'll See in Your Demo:</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Live dashboard walkthrough</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Custom workflow configuration</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">ROI calculator for your business</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">Integration possibilities review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-center">Schedule Your Demo</CardTitle>
                  <CardDescription className="text-center">
                    Get a personalized demonstration of Kuhlekt's AR automation platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {state.message && (
                    <Alert
                      className={`mb-6 ${state.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
                    >
                      <AlertDescription className={state.success ? "text-green-700" : "text-red-700"}>
                        {state.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <form action={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          className={state.errors?.firstName ? "border-red-500" : ""}
                        />
                        {state.errors?.firstName && (
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
                          className={state.errors?.lastName ? "border-red-500" : ""}
                        />
                        {state.errors?.lastName && <p className="text-red-500 text-sm mt-1">{state.errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Business Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className={state.errors?.email ? "border-red-500" : ""}
                      />
                      {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        className={state.errors?.company ? "border-red-500" : ""}
                      />
                      {state.errors?.company && <p className="text-red-500 text-sm mt-1">{state.errors.company}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className={state.errors?.phone ? "border-red-500" : ""}
                      />
                      {state.errors?.phone && <p className="text-red-500 text-sm mt-1">{state.errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="jobTitle">Job Title *</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        required
                        placeholder="e.g., CFO, Controller, AR Manager"
                        className={state.errors?.jobTitle ? "border-red-500" : ""}
                      />
                      {state.errors?.jobTitle && <p className="text-red-500 text-sm mt-1">{state.errors.jobTitle}</p>}
                    </div>

                    <div>
                      <Label htmlFor="companySize">Company Size *</Label>
                      <Select name="companySize" required>
                        <SelectTrigger className={state.errors?.companySize ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1000 employees</SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      {state.errors?.companySize && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.companySize}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="currentARVolume">Monthly AR Volume *</Label>
                      <Select name="currentARVolume" required>
                        <SelectTrigger className={state.errors?.currentARVolume ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select monthly AR volume" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-100k">Under $100K</SelectItem>
                          <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                          <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                          <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                          <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                          <SelectItem value="10m+">$10M+</SelectItem>
                        </SelectContent>
                      </Select>
                      {state.errors?.currentARVolume && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.currentARVolume}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="currentChallenges">Current AR Challenges</Label>
                      <Textarea
                        id="currentChallenges"
                        name="currentChallenges"
                        rows={3}
                        placeholder="Tell us about your current accounts receivable challenges..."
                        className={state.errors?.currentChallenges ? "border-red-500" : ""}
                      />
                      {state.errors?.currentChallenges && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.currentChallenges}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                      <Input
                        id="affiliateCode"
                        name="affiliateCode"
                        type="text"
                        value={affiliateCode}
                        onChange={(e) => handleAffiliateChange(e.target.value)}
                        placeholder="Enter your affiliate code for special pricing"
                        className={state.errors?.affiliateCode ? "border-red-500" : ""}
                      />
                      {state.errors?.affiliateCode && (
                        <p className="text-red-500 text-sm mt-1">{state.errors.affiliateCode}</p>
                      )}
                      {affiliateInfo && (
                        <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              ✓ Valid Code
                            </Badge>
                            <span className="text-sm font-medium text-green-800">
                              {affiliateInfo.discount}% discount applied
                            </span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">
                            Partner: {affiliateInfo.name} | Category: {affiliateInfo.category}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center">
                      <ReCAPTCHA onVerify={setRecaptchaToken} />
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending || !recaptchaToken}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    >
                      {isPending ? "Scheduling..." : "Schedule My Demo"}
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-gray-600">
                    <p>🔒 Your information is secure and will never be shared</p>
                    <p className="mt-1">📅 Demo typically takes 30-45 minutes</p>
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
