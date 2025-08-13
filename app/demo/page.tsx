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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    challenges: "",
    affiliate: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [siteKey, setSiteKey] = useState<string>("")

  useEffect(() => {
    // Load reCAPTCHA site key
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => setSiteKey(data.siteKey))
      .catch((error) => console.error("Error loading reCAPTCHA config:", error))

    // Auto-populate affiliate code from visitor data
    const visitorData = getVisitorData()
    if (visitorData?.affiliate) {
      setFormData((prev) => ({ ...prev, affiliate: visitorData.affiliate }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!recaptchaToken) {
      setSubmitStatus({
        type: "error",
        message: "Please complete the reCAPTCHA verification.",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: "" })

    try {
      const formDataToSubmit = new FormData()
      formDataToSubmit.append("firstName", formData.firstName)
      formDataToSubmit.append("lastName", formData.lastName)
      formDataToSubmit.append("email", formData.email)
      formDataToSubmit.append("company", formData.company)
      formDataToSubmit.append("phone", formData.phone)
      formDataToSubmit.append("challenges", formData.challenges)
      formDataToSubmit.append("affiliate", formData.affiliate)
      formDataToSubmit.append("recaptchaToken", recaptchaToken)

      const result = await submitDemoRequest(formDataToSubmit)

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Demo request submitted successfully! We'll contact you soon.",
        })
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          phone: "",
          challenges: "",
          affiliate: "",
        })
        setRecaptchaToken(null)
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "Failed to submit demo request. Please try again.",
        })
      }
    } catch (error) {
      console.error("Demo form submission error:", error)
      setSubmitStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
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

        <Card>
          <CardHeader>
            <CardTitle>Schedule Your Personalized Demo</CardTitle>
            <CardDescription>
              Fill out the form below and our team will contact you to schedule a demo tailored to your business needs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitStatus.type && (
              <Alert
                className={`mb-6 ${submitStatus.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
              >
                {submitStatus.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={submitStatus.type === "success" ? "text-green-800" : "text-red-800"}>
                  {submitStatus.message}
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
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
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
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
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
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your business email"
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
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
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
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <Label htmlFor="challenges">What are your biggest AR challenges? (Optional)</Label>
                <Textarea
                  id="challenges"
                  name="challenges"
                  value={formData.challenges}
                  onChange={handleInputChange}
                  placeholder="Tell us about your current accounts receivable challenges..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="affiliate">Affiliate/Referral Code (Optional)</Label>
                <Input
                  id="affiliate"
                  name="affiliate"
                  type="text"
                  value={formData.affiliate}
                  onChange={handleInputChange}
                  placeholder="Enter referral code if you have one"
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

              <Button type="submit" className="w-full" disabled={isSubmitting || !recaptchaToken}>
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

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Need immediate assistance?{" "}
            <a href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
              Contact us directly
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
