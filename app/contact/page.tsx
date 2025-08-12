"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ReCAPTCHA } from "@/components/recaptcha"
import { submitContactForm } from "./actions"
import { getVisitorData } from "@/components/visitor-tracker"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [affiliateCode, setAffiliateCode] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // Get affiliate code from visitor data
    const visitorData = getVisitorData()
    if (visitorData?.affiliate) {
      setAffiliateCode(visitorData.affiliate)
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!captchaToken) {
      setSubmitResult({
        success: false,
        message: "Please complete the reCAPTCHA verification.",
      })
      return
    }

    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("captchaToken", captchaToken)
      formData.append("affiliateCode", affiliateCode)

      const result = await submitContactForm(formData)
      setSubmitResult(result)

      if (result.success && formRef.current) {
        formRef.current.reset()
        setCaptchaToken(null)
        setAffiliateCode("")
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Ready to transform your accounts receivable process? Let's talk about how Kuhlekt can help your business.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your full name"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your.email@company.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  placeholder="Your company name"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your current AR challenges and how we can help..."
                  className="min-h-[120px]"
                  disabled={isSubmitting}
                />
              </div>

              {affiliateCode && (
                <div className="space-y-2">
                  <Label htmlFor="affiliateCode">Affiliate Code</Label>
                  <Input
                    id="affiliateCode"
                    value={affiliateCode}
                    onChange={(e) => setAffiliateCode(e.target.value)}
                    placeholder="Enter affiliate code (optional)"
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="flex justify-center">
                <ReCAPTCHA onChange={handleCaptchaChange} />
              </div>

              {submitResult && (
                <Alert className={submitResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                  <AlertDescription className={submitResult.success ? "text-green-800" : "text-red-800"}>
                    {submitResult.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={isSubmitting || !captchaToken}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              <p className="text-sm text-gray-500 text-center">* Required fields. We'll contact you within 24 hours.</p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
