"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import ReCAPTCHA from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoPage() {
  const [state, formAction] = useFormState(submitDemoRequest, initialState)
  const [isPending, setIsPending] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateInfo, setAffiliateInfo] = useState(null)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    formData.append("recaptchaToken", recaptchaToken)
    await formAction(formData)
    setIsPending(false)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-xl text-gray-600">
            See how Kuhlekt can transform your accounts receivable process with a personalized demo.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Schedule Your Demo</CardTitle>
            <CardDescription className="text-center">
              Our team will contact you within 2 business hours to schedule your personalized demo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.message && (
              <Alert className={`mb-6 ${state.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
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
                  {state.errors?.firstName && <p className="text-red-500 text-sm mt-1">{state.errors.firstName}</p>}
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
                <Label htmlFor="email">Email Address *</Label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                      <SelectItem value="1000+">1,000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  {state.errors?.companySize && <p className="text-red-500 text-sm mt-1">{state.errors.companySize}</p>}
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select name="industry" required>
                    <SelectTrigger className={state.errors?.industry ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="distribution">Distribution</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="professional-services">Professional Services</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {state.errors?.industry && <p className="text-red-500 text-sm mt-1">{state.errors.industry}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="currentArVolume">Monthly AR Volume *</Label>
                <Select name="currentArVolume" required>
                  <SelectTrigger className={state.errors?.currentArVolume ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select monthly AR volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-100k">Under $100K</SelectItem>
                    <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                    <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                    <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                    <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                    <SelectItem value="over-10m">Over $10M</SelectItem>
                  </SelectContent>
                </Select>
                {state.errors?.currentArVolume && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.currentArVolume}</p>
                )}
              </div>

              <div>
                <Label htmlFor="preferredTime">Preferred Demo Time</Label>
                <Select name="preferredTime">
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9AM - 12PM EST)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12PM - 5PM EST)</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currentChallenges">Current AR Challenges (Optional)</Label>
                <Textarea
                  id="currentChallenges"
                  name="currentChallenges"
                  rows={4}
                  placeholder="Tell us about your current AR challenges, pain points, or specific areas you'd like to see in the demo..."
                />
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
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
              >
                {isPending ? "Submitting..." : "Request Demo"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">What to expect:</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                  <div>
                    <h4 className="font-semibold text-gray-800">30-45 Minutes</h4>
                    <p>Comprehensive demo tailored to your business</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Live Q&A</h4>
                    <p>Ask questions and see real-time solutions</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Custom Proposal</h4>
                    <p>Receive a tailored proposal with ROI projections</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
