"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { submitContactForm } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recaptcha } from "@/components/recaptcha"
import { VisitorTracker } from "@/components/visitor-tracker"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContactForm, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")

  // Reset form on successful submission
  useEffect(() => {
    if (state?.success) {
      const form = document.getElementById("contact-form") as HTMLFormElement
      if (form) {
        form.reset()
        setRecaptchaToken("")
        // Reset recaptcha
        if (typeof window !== "undefined" && window.grecaptcha) {
          window.grecaptcha.reset()
        }
      }
    }
  }, [state?.success])

  const enhancedFormAction = async (formData: FormData) => {
    // Add recaptcha token
    if (recaptchaToken) {
      formData.append("recaptchaToken", recaptchaToken)
    }

    // Add visitor tracking data if available
    if (typeof window !== "undefined") {
      try {
        const visitorDataStr = localStorage.getItem("kuhlekt_visitor_data")
        if (visitorDataStr) {
          const visitorData = JSON.parse(visitorDataStr)
          formData.append("referrer", visitorData.referrer || "")
          formData.append("utmSource", visitorData.utmSource || "")
          formData.append("utmCampaign", visitorData.utmCampaign || "")
          formData.append("pageViews", visitorData.pageViews?.toString() || "")
        }
      } catch (error) {
        console.error("Error adding visitor data to form:", error)
      }
    }

    return formAction(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VisitorTracker />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">Get in Touch</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about Kuhlekt? We're here to help. Send us a message and we'll get back to you within 24
            hours.
          </p>
        </div>

        <Card className="shadow-xl max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Send us a Message</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="contact-form" action={enhancedFormAction} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" type="text" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" type="text" required className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required className="mt-1" />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" type="text" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="affiliate">Affiliate Code</Label>
                <Input
                  id="affiliate"
                  name="affiliate"
                  type="text"
                  placeholder="Enter your affiliate code (optional)"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">
                  If you have an affiliate or partner code, enter it here for tracking purposes.
                </p>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Select name="subject" required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="What can we help you with?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                    <SelectItem value="product-demo">Product Demo</SelectItem>
                    <SelectItem value="pricing">Pricing Information</SelectItem>
                    <SelectItem value="technical-support">Technical Support</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  placeholder="Tell us more about how we can help you..."
                  className="mt-1"
                />
              </div>

              <Recaptcha
                onVerify={setRecaptchaToken}
                onExpire={() => setRecaptchaToken("")}
                onError={() => setRecaptchaToken("")}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                Send Message
              </Button>

              {state?.success && <div className="text-green-600 text-center font-medium">{state.message}</div>}

              {state?.error && <div className="text-red-600 text-center">{state.message}</div>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
