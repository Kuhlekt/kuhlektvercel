"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Loader2, Calendar, Users, DollarSign } from "lucide-react"
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
  const [affiliateValidation, setAffiliateValidation] = useState<{
    isValid: boolean
    message: string
  } | null>(null)

  // Handle form submission with pending state
  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    formData.append("recaptchaToken", recaptchaToken)
    formData.append("affiliateCode", affiliateCode)

    try {
      await formAction(formData)
    } finally {
      setIsPending(false)
      setRecaptchaToken("")
    }
  }

  // Validate affiliate code in real-time
  useEffect(() => {
    if (affiliateCode.trim()) {
      const info = validateAffiliateCode(affiliateCode)
      if (info) {
        setAffiliateInfo(info)
        setAffiliateValidation({
          isValid: true,
          message: `Valid partner: ${info.name} (${info.commission}% commission)`,
        })
      } else {
        setAffiliateInfo(null)
        setAffiliateValidation({
          isValid: false,
          message: "Invalid affiliate code",
        })
      }
    } else {
      setAffiliateInfo(null)
      setAffiliateValidation(null)
    }
  }, [affiliateCode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See Kuhlekt's AR automation platform in action. Schedule a personalized demo and discover how we can
            transform your accounts receivable process.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">30-Minute Demo</h3>
              <p className="text-gray-600">Comprehensive walkthrough of all features</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personalized</h3>
              <p className="text-gray-600">Tailored to your specific business needs</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">ROI Analysis</h3>
              <p className="text-gray-600">See potential savings and efficiency gains</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Schedule Your Demo</CardTitle>
            <CardDescription>
              Fill out the form below and we'll contact you within 2 business hours to schedule your demo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{state.message}</AlertDescription>
              </Alert>
            )}

            {state.message && !state.success && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{state.message}</AlertDescription>
              </Alert>
            )}

            <form action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" type="text" required className="mt-1" placeholder="John" />
                  {state.errors?.firstName && <p className="text-red-600 text-sm mt-1">{state.errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" type="text" required className="mt-1" placeholder="Doe" />
                  {state.errors?.lastName && <p className="text-red-600 text-sm mt-1">{state.errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1"
                    placeholder="john.doe@company.com"
                  />
                  {state.errors?.email && <p className="text-red-600 text-sm mt-1">{state.errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" type="tel" required className="mt-1" placeholder="+1 (555) 123-4567" />
                  {state.errors?.phone && <p className="text-red-600 text-sm mt-1">{state.errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="CFO, Controller, AR Manager"
                  />
                  {state.errors?.jobTitle && <p className="text-red-600 text-sm mt-1">{state.errors.jobTitle}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  {state.errors?.companySize && <p className="text-red-600 text-sm mt-1">{state.errors.companySize}</p>}
                </div>

                <div>
                  <Label htmlFor="industry">Industry *</Label>
                  <Select name="industry" required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your industry" />
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
                  {state.errors?.industry && <p className="text-red-600 text-sm mt-1">{state.errors.industry}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="currentArVolume">Monthly AR Volume *</Label>
                <Select name="currentArVolume" required>
                  <SelectTrigger className="mt-1">
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
                  <p className="text-red-600 text-sm mt-1">{state.errors.currentArVolume}</p>
                )}
              </div>

              <div>
                <Label htmlFor="preferredTime">Preferred Demo Time</Label>
                <Select name="preferredTime">
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                    <SelectItem value="evening">Evening (5 PM - 7 PM)</SelectItem>
                    <SelectItem value="flexible">I'm flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="affiliateCode">Affiliate/Partner Code</Label>
                <Input
                  id="affiliateCode"
                  name="affiliateCode"
                  type="text"
                  className="mt-1"
                  placeholder="PARTNER001"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                />
                {affiliateValidation && (
                  <div className="mt-2">
                    <Badge variant={affiliateValidation.isValid ? "default" : "destructive"} className="text-xs">
                      {affiliateValidation.message}
                    </Badge>
                  </div>
                )}
                {state.errors?.affiliateCode && (
                  <p className="text-red-600 text-sm mt-1">{state.errors.affiliateCode}</p>
                )}
              </div>

              <div>
                <Label htmlFor="currentChallenges">Current AR Challenges</Label>
                <Textarea
                  id="currentChallenges"
                  name="currentChallenges"
                  rows={4}
                  className="mt-1"
                  placeholder="Tell us about your current accounts receivable challenges, pain points, or specific areas you'd like to focus on during the demo..."
                />
                {state.errors?.currentChallenges && (
                  <p className="text-red-600 text-sm mt-1">{state.errors.currentChallenges}</p>
                )}
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA onVerify={setRecaptchaToken} />
              </div>

              <Button
                type="submit"
                disabled={isPending || !recaptchaToken}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scheduling Demo...
                  </>
                ) : (
                  "Schedule My Demo"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                By submitting this form, you agree to our{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                and consent to being contacted by our sales team.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">What to Expect in Your Demo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <h4 className="font-semibold mb-2">✓ Live Platform Walkthrough</h4>
                  <p className="text-gray-600">See our AR automation tools in action</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✓ Custom ROI Analysis</h4>
                  <p className="text-gray-600">Understand your potential savings</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✓ Integration Discussion</h4>
                  <p className="text-gray-600">Learn how we connect with your systems</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">✓ Q&A Session</h4>
                  <p className="text-gray-600">Get answers to all your questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
