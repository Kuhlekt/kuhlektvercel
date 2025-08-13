"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitContactForm } from "./actions"
import ReCAPTCHA from "@/components/recaptcha"

export default function ContactFormComponent() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null)
  const [captchaToken, setCaptchaToken] = useState("")

  const handleSubmit = async (formData: FormData) => {
    // Execute invisible reCAPTCHA before form submission
    const recaptchaElement = document.querySelector(".invisible-recaptcha") as any
    if (recaptchaElement && recaptchaElement.execute) {
      recaptchaElement.execute()
      // Wait a moment for the token to be generated
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    formData.append("captchaToken", captchaToken)
    formAction(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to transform your accounts receivable process? Get in touch with our team to learn how Kuhlekt can
            help your business get paid faster.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Get Started Today</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" type="text" required className="w-full" disabled={isPending} />
                  {state?.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" type="text" required className="w-full" disabled={isPending} />
                  {state?.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" name="email" type="email" required className="w-full" disabled={isPending} />
                {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  required
                  className="w-full"
                  disabled={isPending}
                />
                {state?.errors?.companyName && <p className="text-sm text-red-600">{state.errors.companyName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  className="w-full"
                  disabled={isPending}
                />
                {state?.errors?.phoneNumber && <p className="text-sm text-red-600">{state.errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="inquiryType">Inquiry Type</Label>
                <Select name="inquiryType" disabled={isPending}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="demo">Request Demo</SelectItem>
                    <SelectItem value="pricing">Pricing Information</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                    <SelectItem value="general">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full"
                  placeholder="Tell us about your accounts receivable challenges or any specific questions you have..."
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                <Input
                  id="affiliateCode"
                  name="affiliateCode"
                  type="text"
                  className="w-full"
                  placeholder="Enter affiliate code if you have one"
                  disabled={isPending}
                />
              </div>

              <ReCAPTCHA onVerify={setCaptchaToken} />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={isPending}
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>

              {state?.message && (
                <div
                  className={`p-4 rounded-md ${
                    state.success
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {state.message}
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
