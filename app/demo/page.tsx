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
import { CheckCircle, AlertCircle, Calendar, Users, TrendingUp, Clock } from "lucide-react"
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
  const [affiliateInfo, setAffiliateInfo] = useState<any>(null)

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
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Kuhlekt can transform your accounts receivable process. Schedule a personalized demo with our AR
            automation experts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">30-Minute Demo</h3>
              <p className="text-gray-600">Personalized walkthrough of our AR automation platform</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">ROI Analysis</h3>
              <p className="text-gray-600">Custom ROI projections based on your business metrics</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Expert Consultation</h3>
              <p className="text-gray-600">One-on-one session with our AR automation specialists</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-600" />
              Schedule Your Demo
            </CardTitle>
            <CardDescription>
              Fill out the form below and we'll contact you within 2 business hours to schedule your personalized demo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.message && (
              <Alert className={`mb-6 ${state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
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
                  {state.errors?.firstName && <p className="text-sm text-red-600 mt-1">{state.errors.firstName}</p>}
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
                  {state.errors?.lastName && <p className="text-sm text-red-600 mt-1">{state.errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={state.errors?.email ? "border-red-500" : ""}
                  />
                  {state.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email}</p>}
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
                  {state.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className={state.errors?.company ? "border-red-500" : ""}
                  />
                  {state.errors?.company && <p className="text-sm text-red-600 mt-1">{state.errors.company}</p>}
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
                  {state.errors?.jobTitle && <p className="text-sm text-red-600 mt-1">{state.errors.jobTitle}</p>}
                </div>
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
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                  {state.errors?.companySize && <p className="text-sm text-red-600 mt-1">{state.errors.companySize}</p>}
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select name="industry" required>
                    <SelectTrigger className={state.errors?.industry ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="financial-services">Financial Services</SelectItem>
                      <SelectItem value="professional-services">Professional Services</SelectItem>
                      <SelectItem value="construction">Construction</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {state.errors?.industry && <p className="text-sm text-red-600 mt-1">{state.errors.industry}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="currentArVolume">Monthly AR Volume *</Label>
                <Select name="currentArVolume" required>
                  <SelectTrigger className={state.errors?.currentArVolume ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select your monthly AR volume" />
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
                  <p className="text-sm text-red-600 mt-1">{state.errors.currentArVolume}</p>
                )}
              </div>

              <div>
                <Label htmlFor="preferredTime">Preferred Demo Time</Label>
                <Select name="preferredTime">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9 AM - 12 PM EST)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 5 PM EST)</SelectItem>
                    <SelectItem value="evening">Evening (5 PM - 7 PM EST)</SelectItem>
                    <SelectItem value="flexible">I'm flexible</SelectItem>
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
                  <p className="text-sm text-red-600 mt-1">{state.errors.affiliateCode}</p>
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
                <p className="text-sm text-gray-500 mt-1">
                  Have a partner or referral code? Enter it here for special demo pricing.
                </p>
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA onVerify={setRecaptchaToken} />
              </div>

              <Button
                type="submit"
                disabled={isPending || !recaptchaToken}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isPending ? "Submitting Request..." : "Request Demo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
