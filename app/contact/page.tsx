"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Mail, Phone, MapPin, Clock } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"
import { submitContactForm } from "./actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContactForm, initialState)
  const [isPending, setIsPending] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    formData.append("recaptchaToken", recaptchaToken)

    try {
      await formAction(formData)
    } finally {
      setIsPending(false)
      setRecaptchaToken("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Kuhlekt</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your accounts receivable process? Get in touch with our AR automation experts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Get in Touch
                </CardTitle>
                <CardDescription>We're here to help you streamline your AR process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">contact@kuhlekt.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">
                      123 Business Ave
                      <br />
                      Suite 100
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-gray-600">
                      Monday - Friday
                      <br />
                      9:00 AM - 6:00 PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
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

                <form action={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className={state.errors?.firstName ? "border-red-500" : ""}
                      />
                      {state.errors?.firstName && <p className="text-sm text-red-600 mt-1">{state.errors.firstName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        className={state.errors?.lastName ? "border-red-500" : ""}
                      />
                      {state.errors?.lastName && <p className="text-sm text-red-600 mt-1">{state.errors.lastName}</p>}
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
                    />
                    {state.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        required
                        className={state.errors?.company ? "border-red-500" : ""}
                      />
                      {state.errors?.company && <p className="text-sm text-red-600 mt-1">{state.errors.company}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        className={state.errors?.phone ? "border-red-500" : ""}
                      />
                      {state.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="How can we help you?"
                      className={state.errors?.subject ? "border-red-500" : ""}
                    />
                    {state.errors?.subject && <p className="text-sm text-red-600 mt-1">{state.errors.subject}</p>}
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Tell us about your current AR challenges and how we can help..."
                      className={state.errors?.message ? "border-red-500" : ""}
                    />
                    {state.errors?.message && <p className="text-sm text-red-600 mt-1">{state.errors.message}</p>}
                  </div>

                  <div>
                    <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                    <Input
                      id="affiliateCode"
                      name="affiliateCode"
                      type="text"
                      placeholder="Enter your affiliate code for special pricing"
                      className={state.errors?.affiliateCode ? "border-red-500" : ""}
                    />
                    {state.errors?.affiliateCode && (
                      <p className="text-sm text-red-600 mt-1">{state.errors.affiliateCode}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Have a partner or referral code? Enter it here for special pricing.
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <ReCAPTCHA onVerify={setRecaptchaToken} />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending || !recaptchaToken}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
