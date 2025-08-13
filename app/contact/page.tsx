"use client"

import type React from "react"

import { useState, useRef } from "react"
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
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const formData = new FormData(event.currentTarget)

      // Add reCAPTCHA token to form data
      if (recaptchaToken) {
        formData.append("recaptchaToken", recaptchaToken)
      }

      // Add affiliate code from visitor data if not manually entered
      if (!affiliateCode) {
        const visitorData = getVisitorData()
        if (visitorData?.affiliate) {
          formData.append("affiliate", visitorData.affiliate)
        }
      }

      const result = await submitContactForm(formData)
      setSubmitResult(result)

      if (result.success) {
        // Reset form on success
        formRef.current?.reset()
        setAffiliateCode("")
        setRecaptchaToken("")
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setSubmitResult({
        success: false,
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Get in touch with our team to learn more about how Kuhlekt can help your business.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    First name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="firstName" name="firstName" type="text" required placeholder="John" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">
                    Last name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="lastName" name="lastName" type="text" required placeholder="Doe" className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="john.doe@company.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="company">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input id="company" name="company" type="text" required placeholder="Acme Inc." className="mt-1" />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your current process and challenges..."
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="affiliate">Affiliate Code</Label>
                <Input
                  id="affiliate"
                  name="affiliate"
                  type="text"
                  placeholder="Enter your affiliate code (optional)"
                  className="mt-1"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value)}
                />
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA onVerify={setRecaptchaToken} />
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
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                disabled={isSubmitting || !recaptchaToken}
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
