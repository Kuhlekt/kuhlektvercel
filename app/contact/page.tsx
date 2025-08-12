"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { submitContactForm } from "./actions"
import { VisitorTracker } from "@/components/visitor-tracker"
import ReCAPTCHA from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateStatus, setAffiliateStatus] = useState<"valid" | "invalid" | null>(null)

  // Reset form state on successful submission
  useEffect(() => {
    if (state.success) {
      setRecaptchaToken("")
      setAffiliateCode("")
      setAffiliateStatus(null)
      // Reset form
      const form = document.getElementById("contact-form") as HTMLFormElement
      if (form) {
        form.reset()
      }
    }
  }, [state.success])

  // Validate affiliate code on change
  useEffect(() => {
    if (affiliateCode.trim()) {
      // Simple client-side validation for immediate feedback
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <VisitorTracker />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Ready to transform your accounts receivable process? Get in touch with our team.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Get Started Today</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you within 24 hours with a personalized solution.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {state.message && (
              <Alert className={`mb-6 ${state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <AlertDescription className={state.success ? "text-green-800" : "text-red-800"}>
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <form id="contact-form" action={formAction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className={state.errors?.firstName ? "border-red-500" : ""}
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
                    className={state.errors?.lastName ? "border-red-500" : ""}
                    disabled={isPending}
                  />
                  {state.errors?.lastName && <p className="text-red-500 text-sm mt-1">{state.errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={state.errors?.email ? "border-red-500" : ""}
                  disabled={isPending}
                />
                {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" type="text" disabled={isPending} />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    className={state.errors?.phone ? "border-red-500" : ""}
                    disabled={isPending}
                  />
                  {state.errors?.phone && <p className="text-red-500 text-sm mt-1">{state.errors.phone}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="affiliate">Affiliate Code (Optional)</Label>
                <div className="flex items-center space-x-2">
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
                <p className="text-sm text-gray-500 mt-1">
                  Have an affiliate code? Enter it here to receive special pricing.
                </p>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your current AR challenges and what you're looking to achieve..."
                  disabled={isPending}
                />
              </div>

              <ReCAPTCHA onVerify={setRecaptchaToken} />
              <input type="hidden" name="recaptchaToken" value={recaptchaToken} />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={isPending || !recaptchaToken}
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Other Ways to Reach Us</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">contact@kuhlekt.com</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">1-800-KUHLEKT</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
