"use client"

import { useState, useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Mail, Phone, MapPin, Clock } from "lucide-react"
import { submitContactForm } from "./actions"
import { ReCaptcha } from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactFormComponent() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    if (captchaToken) {
      formData.append("captchaToken", captchaToken)
    }
    formAction(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Contact Info */}
          <div>
            <div className="mb-8">
              <Badge className="mb-4 px-4 py-2 bg-blue-100 text-blue-700">Get in Touch</Badge>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Let's Discuss Your AR Needs</h1>
              <p className="text-xl text-gray-600">
                Ready to transform your accounts receivable process? Our team is here to help you get started.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-600">sales@kuhlekt.com</p>
                  <p className="text-gray-600">support@kuhlekt.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Monday - Friday, 9 AM - 6 PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                  <p className="text-gray-600">123 Business Ave</p>
                  <p className="text-gray-600">Suite 100</p>
                  <p className="text-gray-600">New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                  <p className="text-gray-600">We typically respond within 2 hours during business hours</p>
                </div>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Prefer a Quick Call?</h3>
                <p className="text-gray-600 mb-4">
                  Schedule a 15-minute call with our team to discuss your specific requirements and see if Kuhlekt is
                  the right fit for your business.
                </p>
                <Button className="w-full bg-transparent" variant="outline">
                  Schedule a Call
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {state.success ? (
                  <div className="text-center py-8">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 mb-4">{state.message}</p>
                    <p className="text-sm text-gray-500">We'll get back to you within 2 hours during business hours.</p>
                  </div>
                ) : (
                  <form action={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          className="mt-1"
                          placeholder="John"
                        />
                        {state.errors?.firstName && (
                          <p className="text-red-600 text-sm mt-1">{state.errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          className="mt-1"
                          placeholder="Smith"
                        />
                        {state.errors?.lastName && <p className="text-red-600 text-sm mt-1">{state.errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="mt-1"
                        placeholder="john.smith@company.com"
                      />
                      {state.errors?.email && <p className="text-red-600 text-sm mt-1">{state.errors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input id="company" name="company" type="text" className="mt-1" placeholder="Your Company Inc." />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" className="mt-1" placeholder="+1 (555) 123-4567" />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        className="mt-1"
                        placeholder="How can we help you?"
                      />
                      {state.errors?.subject && <p className="text-red-600 text-sm mt-1">{state.errors.subject}</p>}
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        className="mt-1"
                        rows={5}
                        placeholder="Tell us about your accounts receivable challenges or questions..."
                      />
                      {state.errors?.message && <p className="text-red-600 text-sm mt-1">{state.errors.message}</p>}
                    </div>

                    <ReCaptcha onVerify={setCaptchaToken} />

                    <Button
                      type="submit"
                      disabled={isPending || !captchaToken}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {isPending ? "Sending..." : "Send Message"}
                    </Button>

                    {state.message && !state.success && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <p className="text-red-600 text-sm">{state.message}</p>
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
