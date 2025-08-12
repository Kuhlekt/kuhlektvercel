"use client"

import { useActionState, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Info, Phone, Mail, Clock } from "lucide-react"
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

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to transform your accounts receivable process? Get in touch with our team and discover how Kuhlekt can
            streamline your AR operations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Get Started Today</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 24 hours with a personalized solution.
                </CardDescription>
              </CardHeader>

              <CardContent>
                {state.message && (
                  <Alert
                    className={`mb-6 ${state.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
                  >
                    {state.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
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
                        className={`mt-1 ${state.errors?.firstName ? "border-red-500" : ""}`}
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
                        className={`mt-1 ${state.errors?.lastName ? "border-red-500" : ""}`}
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
                      className={`mt-1 ${state.errors?.email ? "border-red-500" : ""}`}
                      disabled={isPending}
                    />
                    {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" type="text" className="mt-1" disabled={isPending} />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        className={`mt-1 ${state.errors?.phone ? "border-red-500" : ""}`}
                        disabled={isPending}
                      />
                      {state.errors?.phone && <p className="text-red-500 text-sm mt-1">{state.errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="affiliate">Affiliate Code (Optional)</Label>
                    <div className="flex items-center space-x-2 mt-1">
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
                    <div className="mt-2">
                      <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800 text-sm">
                          Have an affiliate code? Enter it here to receive special pricing on our services.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={4}
                      placeholder="Tell us about your current AR challenges and what you're looking to achieve..."
                      className="mt-1"
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
              </CardContent>
            </Card>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-gray-600">contact@kuhlekt.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-gray-600">1-800-KUHLEKT</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Response Time</p>
                    <p className="text-gray-600">Within 24 hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Choose Kuhlekt?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Reduce DSO by up to 40%</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Automate 80% of AR processes</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Improve cash flow visibility</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Seamless ERP integration</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>24/7 customer support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Popular Affiliate Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono">STARTUP50</span>
                    <Badge variant="secondary">50% off</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">HEALTHCARE</span>
                    <Badge variant="secondary">15% off</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">MANUFACTURING</span>
                    <Badge variant="secondary">20% off</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">NONPROFIT</span>
                    <Badge variant="secondary">30% off</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
