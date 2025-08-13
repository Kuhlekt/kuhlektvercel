"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Calendar, Users, TrendingUp, DollarSign } from "lucide-react"
import { submitDemoRequest } from "./actions"
import ReCAPTCHA from "react-google-recaptcha"
import { getVisitorData } from "@/components/visitor-tracker"

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [siteKey, setSiteKey] = useState<string>("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [companySize, setCompanySize] = useState("")

  useEffect(() => {
    // Fetch reCAPTCHA site key
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => {
        setSiteKey(data.siteKey || "")
      })
      .catch((error) => {
        console.error("Error loading reCAPTCHA config:", error)
      })

    // Auto-populate affiliate code from visitor data
    const visitorData = getVisitorData()
    if (visitorData?.affiliate) {
      setAffiliateCode(visitorData.affiliate)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const formData = new FormData(event.currentTarget)

      // Add company size to form data
      if (companySize) {
        formData.append("companySize", companySize)
      }

      // Add reCAPTCHA token to form data
      if (recaptchaToken) {
        formData.append("recaptchaToken", recaptchaToken)
      }

      const result = await submitDemoRequest(formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Reset form
        event.currentTarget.reset()
        setAffiliateCode("")
        setCompanySize("")
        setRecaptchaToken(null)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-xl text-gray-600">See how Kuhlekt can transform your accounts receivable process</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Request Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Schedule Your Demo</CardTitle>
              <CardDescription>Fill out the form below and we'll schedule a personalized demonstration</CardDescription>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert
                  className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                    {message.text}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="Enter your first name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder="Enter your last name"
                      className="mt-1"
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
                    placeholder="Enter your business email"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    required
                    placeholder="Enter your company name"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="Enter your phone number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      type="text"
                      required
                      placeholder="Enter your job title"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select name="companySize" value={companySize} onValueChange={setCompanySize} required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your company size" />
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
                </div>

                <div>
                  <Label htmlFor="challenges">What are your biggest AR challenges? (Optional)</Label>
                  <Textarea
                    id="challenges"
                    name="challenges"
                    placeholder="Tell us about your current challenges with accounts receivable..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="affiliate">Affiliate/Referral Code (Optional)</Label>
                  <Input
                    id="affiliate"
                    name="affiliate"
                    type="text"
                    value={affiliateCode}
                    onChange={(e) => setAffiliateCode(e.target.value)}
                    placeholder="Enter referral code if you have one"
                    className="mt-1"
                  />
                </div>

                {siteKey && (
                  <div className="flex justify-center">
                    <ReCAPTCHA
                      sitekey={siteKey}
                      onChange={(token) => setRecaptchaToken(token)}
                      onExpired={() => setRecaptchaToken(null)}
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting || !recaptchaToken}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Request...
                    </>
                  ) : (
                    "Request Demo"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Information */}
          <div className="space-y-6">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">What to Expect</CardTitle>
                <CardDescription>Your personalized demo will include</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">30-Minute Session</h3>
                    <p className="text-gray-600">Comprehensive walkthrough of Kuhlekt's features</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Tailored to Your Business</h3>
                    <p className="text-gray-600">Demo customized to your industry and company size</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">ROI Analysis</h3>
                    <p className="text-gray-600">See potential savings and efficiency gains</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <DollarSign className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Custom Pricing</h3>
                    <p className="text-gray-600">Receive a personalized quote for your needs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Why Choose Kuhlekt?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Reduce DSO by up to 30%
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Automate 80% of manual AR tasks
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Improve cash flow predictability
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Seamless integration with existing systems
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    24/7 customer support
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Industry-leading security standards
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl">Ready to Get Started?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Join hundreds of companies that have transformed their AR process with Kuhlekt.
                </p>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">Average ROI: 300%</p>
                  <p className="text-sm text-gray-500">Within first 6 months</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
