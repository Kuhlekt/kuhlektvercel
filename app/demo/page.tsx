"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { submitDemoRequest } from "./actions"
import { getVisitorData } from "@/components/visitor-tracker"
import ReCAPTCHA from "react-google-recaptcha"

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [affiliateCode, setAffiliateCode] = useState("")

  // Auto-populate affiliate code from visitor data
  useEffect(() => {
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-xl text-gray-600">See how Kuhlekt can transform your accounts receivable process</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Schedule Your Personalized Demo</CardTitle>
            <CardDescription className="text-center">
              Fill out the form below and we'll contact you within 24 hours to schedule your demo
            </CardDescription>
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
                  <Label htmlFor="firstName">
                    First Name <span className="text-red-500">*</span>
                  </Label>
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
                  <Label htmlFor="lastName">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
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
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="company">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  placeholder="Enter your company name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
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
                <Label htmlFor="challenges">What are your biggest AR challenges? (Optional)</Label>
                <Textarea
                  id="challenges"
                  name="challenges"
                  placeholder="Tell us about your current accounts receivable challenges..."
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

              <div className="flex justify-center">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  onChange={(token) => setRecaptchaToken(token)}
                />
              </div>

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

            <div className="mt-8 text-center text-sm text-gray-600">
              <p>
                By submitting this form, you agree to our{" "}
                <a href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Need immediate assistance? Contact us directly:</p>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900">📧 sales@kuhlekt.com</p>
            <p className="text-lg font-semibold text-gray-900">📞 1-800-KUHLEKT</p>
          </div>
        </div>
      </div>
    </div>
  )
}
