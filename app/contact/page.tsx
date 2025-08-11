"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Recaptcha } from "@/components/recaptcha"
import { VisitorTracker } from "@/components/visitor-tracker"
import { submitContactForm } from "./actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContactForm, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")
  const [isPending, setIsPending] = useState(false)

  // Reset form on successful submission
  useEffect(() => {
    if (state.success) {
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
  }, [state.success])

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
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

    formAction(formData)
    setIsPending(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <VisitorTracker />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Get in touch with our team to learn more about Kuhlekt's AR automation solutions
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
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

            <form id="contact-form" action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" type="text" required className="mt-1" disabled={isPending} />
                  {state.errors?.firstName && <p className="text-sm text-red-600 mt-1">{state.errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" type="text" required className="mt-1" disabled={isPending} />
                  {state.errors?.lastName && <p className="text-sm text-red-600 mt-1">{state.errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required className="mt-1" disabled={isPending} />
                {state.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Input id="company" name="company" type="text" required className="mt-1" disabled={isPending} />
                {state.errors?.company && <p className="text-sm text-red-600 mt-1">{state.errors.company}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" className="mt-1" disabled={isPending} />
                {state.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="affiliate">Affiliate Code (Optional)</Label>
                <Input
                  id="affiliate"
                  name="affiliate"
                  type="text"
                  placeholder="Enter affiliate code if you have one"
                  className="mt-1"
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us how we can help you..."
                  className="mt-1"
                  disabled={isPending}
                />
                {state.errors?.message && <p className="text-sm text-red-600 mt-1">{state.errors.message}</p>}
              </div>

              <Recaptcha
                onVerify={setRecaptchaToken}
                onExpire={() => setRecaptchaToken("")}
                onError={() => setRecaptchaToken("")}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
