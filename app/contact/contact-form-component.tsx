"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"
import { submitContactForm } from "./actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactFormComponent() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [captchaToken, setCaptchaToken] = useState<string>("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your accounts receivable process? Contact our team to learn how Kuhlekt can help your
              business reduce DSO and improve cash flow.
            </p>
          </div>

          {/* Contact Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="captchaToken" value={captchaToken} />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className={state.errors?.firstName ? "border-red-500" : ""}
                    />
                    {state.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className={state.errors?.lastName ? "border-red-500" : ""}
                    />
                    {state.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={state.errors?.email ? "border-red-500" : ""}
                  />
                  {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    className={state.errors?.companyName ? "border-red-500" : ""}
                  />
                  {state.errors?.companyName && <p className="text-sm text-red-600">{state.errors.companyName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    className={state.errors?.phoneNumber ? "border-red-500" : ""}
                  />
                  {state.errors?.phoneNumber && <p className="text-sm text-red-600">{state.errors.phoneNumber}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inquiryType">Inquiry Type</Label>
                  <Select name="inquiryType">
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demo">Request Demo</SelectItem>
                      <SelectItem value="pricing">Pricing Information</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about your accounts receivable challenges and how we can help..."
                    className={state.errors?.message ? "border-red-500" : ""}
                  />
                  {state.errors?.message && <p className="text-sm text-red-600">{state.errors.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                  <Input
                    id="affiliateCode"
                    name="affiliateCode"
                    type="text"
                    placeholder="Enter affiliate code if you have one"
                  />
                </div>

                <div className="space-y-4">
                  <ReCAPTCHA onVerify={setCaptchaToken} />

                  <Button type="submit" className="w-full" disabled={isPending || !captchaToken}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                </div>

                {state.message && (
                  <Alert className={state.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
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
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
