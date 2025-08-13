"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ReCAPTCHA from "@/components/recaptcha"
import { submitContactForm } from "./actions"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [affiliateCode, setAffiliateCode] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const visitorData = localStorage.getItem("kuhlekt_visitor_data")
        if (visitorData) {
          const parsed = JSON.parse(visitorData)
          if (parsed?.affiliate) {
            setAffiliateCode(parsed.affiliate)
          }
        }
      } catch (error) {
        console.error("Error loading visitor data:", error)
      }
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!recaptchaToken) {
      setMessage({ type: "error", text: "Please complete the reCAPTCHA verification." })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const formData = new FormData(event.currentTarget)
      formData.append("recaptchaToken", recaptchaToken)

      const result = await submitContactForm(formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        if (formRef.current) {
          formRef.current.reset()
        }
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

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
    setMessage(null) // Clear any previous error messages
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Ready to transform your credit management? Let's discuss how Kuhlekt can help your business.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Send us a Message</CardTitle>
            <CardDescription className="text-center">
              Fill out the form below and we'll get back to you as soon as possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <div
                className={`mb-6 p-4 rounded-md ${
                  message.type === "success"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-red-50 border border-red-200 text-red-800"
                }`}
              >
                {message.text}
              </div>
            )}

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name *
                  </Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    className="mt-1"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name *
                  </Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    className="mt-1"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address *
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="mt-1"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Company Name
                </Label>
                <Input type="text" id="company" name="company" className="mt-1" placeholder="Enter your company name" />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input type="tel" id="phone" name="phone" className="mt-1" placeholder="Enter your phone number" />
              </div>

              <div>
                <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="mt-1"
                  placeholder="Tell us about your credit management needs..."
                />
              </div>

              <ReCAPTCHA onVerify={handleRecaptchaVerify} />

              {affiliateCode && <input type="hidden" name="affiliate" value={affiliateCode} />}

              <Button
                type="submit"
                disabled={isSubmitting || !recaptchaToken}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Sending Message..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
