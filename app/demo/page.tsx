"use client"

import { useFormState } from "react-dom"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Info, Calendar, Clock, Users } from "lucide-react"
import { submitDemoForm } from "./actions"
import { VisitorTracker } from "@/components/visitor-tracker"
import ReCAPTCHA from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoPage() {
  const [state, formAction] = useFormState(submitDemoForm, initialState)
  const [isPending, setIsPending] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateStatus, setAffiliateStatus] = useState<"valid" | "invalid" | null>(null)

  // Reset form state on successful submission
  useEffect(() => {
    if (state.success) {
      setRecaptchaToken("")
      setAffiliateCode("")
      setAffiliateStatus(null)
      setIsPending(false)
      // Reset form
      const form = document.getElementById("demo-form") as HTMLFormElement
      if (form) {
        form.reset()
      }
    }
  }, [state.success])

  // Validate affiliate code on change
  useEffect(() => {
    if (affiliateCode.trim()) {
      const validCodes = [
        "STARTUP50",
        "DISCOUNT20",
        "HEALTHCARE",
        "MANUFACTURING",
        "VIP30",
        "PARTNER001",
        "PARTNER002",
        "RESELLER01",
        "CHANNEL01",
        "AFFILIATE01",
        "PROMO2024",
        "SPECIAL01",
        "WELCOME15",
        "GROWTH25",
        "PREMIUM15",
        "ENTERPRISE",
        "SMB40",
        "NONPROFIT",
        "EDUCATION",
        "GOVERNMENT",
        "REFERRAL10",
        "LOYALTY25",
        "BETA35",
        "EARLY45",
      ]

      const isValid = validCodes.includes(affiliateCode.trim().toUpperCase())
      setAffiliateStatus(isValid ? "valid" : "invalid")
    } else {
      setAffiliateStatus(null)
    }
  }, [affiliateCode])

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    await formAction(formData)
    setIsPending(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <VisitorTracker />

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See Kuhlekt in action. Schedule a personalized demo of our AR automation platform tailored to your business
            needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Request Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Schedule Your Demo</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll schedule a personalized demo tailored to your business needs within
                  24 hours.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {state.message && (
                  <Alert
                    className={`mb-6 ${state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                  >
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

                <form id="demo-form" action={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className={`mt-1 ${state.errors?.firstName ? "border-red-500" : ""}`}
                        disabled={isPending}
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
                        className={`mt-1 ${state.errors?.lastName ? "border-red-500" : ""}`}
                        disabled={isPending}
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
                      className={`mt-1 ${state.errors?.email ? "border-red-500" : ""}`}
                      disabled={isPending}
                    />
                    {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        className={`mt-1 ${state.errors?.company ? "border-red-500" : ""}`}
                        disabled={isPending}
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
                        className={`mt-1 ${state.errors?.jobTitle ? "border-red-500" : ""}`}
                        disabled={isPending}
                      />
                      {state.errors?.jobTitle && <p className="text-red-500 text-sm mt-1">{state.errors.jobTitle}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className={`mt-1 ${state.errors?.phone ? "border-red-500" : ""}`}
                        disabled={isPending}
                      />
                      {state.errors?.phone && <p className="text-red-500 text-sm mt-1">{state.errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="companySize">Company Size *</Label>
                      <Select name="companySize" disabled={isPending}>
                        <SelectTrigger className={`mt-1 ${state.errors?.companySize ? "border-red-500" : ""}`}>
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
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select name="industry" disabled={isPending}>
                      <SelectTrigger className={`mt-1 ${state.errors?.industry ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="construction">Construction</SelectItem>
                        <SelectItem value="professional-services">Professional Services</SelectItem>
                        <SelectItem value="financial-services">Financial Services</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="government">Government</SelectItem>
                        <SelectItem value="nonprofit">Non-profit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {state.errors?.industry && <p className="text-red-500 text-sm mt-1">{state.errors.industry}</p>}
                  </div>

                  <div>
                    <Label htmlFor="affiliate">Affiliate Code (Optional)</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Input
                        id="affiliate"
                        name="affiliate"
                        type="text"
                        placeholder="Enter your affiliate code"
                        value={affiliateCode}
                        onChange={(e) => setAffiliateCode(e.target.value)}
                        className={`${state.errors?.affiliate ? "border-red-500" : ""} ${
                          affiliateStatus === "valid"
                            ? "border-green-500"
                            : affiliateStatus === "invalid"
                              ? "border-red-500"
                              : ""
                        }`}
                        disabled={isPending}
                      />
                      {affiliateStatus === "valid" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Valid
                        </Badge>
                      )}
                      {affiliateStatus === "invalid" && <Badge variant="destructive">Invalid</Badge>}
                    </div>
                    {state.errors?.affiliate && <p className="text-red-500 text-sm mt-1">{state.errors.affiliate}</p>}
                    <div className="mt-2">
                      <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 text-sm">
                          Have an affiliate code? Enter it here to receive special pricing on our services.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="currentSolution">Current AR Solution</Label>
                    <Select name="currentSolution" disabled={isPending}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="What do you currently use?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual processes (Excel, paper)</SelectItem>
                        <SelectItem value="quickbooks">QuickBooks</SelectItem>
                        <SelectItem value="sage">Sage</SelectItem>
                        <SelectItem value="netsuite">NetSuite</SelectItem>
                        <SelectItem value="sap">SAP</SelectItem>
                        <SelectItem value="other-erp">Other ERP system</SelectItem>
                        <SelectItem value="other-ar">Other AR software</SelectItem>
                        <SelectItem value="none">No current solution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="challenges">Current AR Challenges</Label>
                    <Textarea
                      id="challenges"
                      name="challenges"
                      rows={4}
                      placeholder="Tell us about your current accounts receivable challenges, pain points, and what you're hoping to achieve with automation..."
                      className="mt-1"
                      disabled={isPending}
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredTime">Preferred Demo Time</Label>
                    <Select name="preferredTime" disabled={isPending}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="When would you prefer the demo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                        <SelectItem value="evening">Evening (5 PM - 7 PM)</SelectItem>
                        <SelectItem value="flexible">I'm flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <ReCAPTCHA onVerify={setRecaptchaToken} />
                  <input type="hidden" name="recaptchaToken" value={recaptchaToken} />

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                    disabled={isPending || !recaptchaToken}
                  >
                    {isPending ? "Scheduling..." : "Schedule Demo"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Demo Information Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-600" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Duration</p>
                    <p className="text-gray-600">30-45 minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Format</p>
                    <p className="text-gray-600">Live screen share</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Follow-up</p>
                    <p className="text-gray-600">Custom proposal</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Demo Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Automated invoice processing</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Smart payment reminders</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Real-time AR analytics</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>ERP system integration</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Customer portal features</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Collections workflow automation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Affiliate Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">STARTUP50</span>
                    <Badge variant="secondary">50% off</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">HEALTHCARE</span>
                    <Badge variant="secondary">15% off</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">MANUFACTURING</span>
                    <Badge variant="secondary">20% off</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">NONPROFIT</span>
                    <Badge variant="secondary">30% off</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">EDUCATION</span>
                    <Badge variant="secondary">35% off</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
