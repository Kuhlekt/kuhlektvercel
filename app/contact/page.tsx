"use client"

import { useState, useRef } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import ReCAPTCHA from "@/components/recaptcha"
import { submitContactForm } from "./actions"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContactForm, initialState)
  const [isPending, setIsPending] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateInfo, setAffiliateInfo] = useState(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    formData.append("recaptchaToken", recaptchaToken)
    const result = await formAction(formData)

    // Clear form on success
    if (result?.success) {
      formRef.current?.reset()
      setRecaptchaToken("")
      setAffiliateCode("")
      setAffiliateInfo(null)
    }

    setIsPending(false)
  }

  const handleAffiliateChange = (value: string) => {
    setAffiliateCode(value)
    if (value.trim()) {
      const info = validateAffiliateCode(value.trim())
      setAffiliateInfo(info)
    } else {
      setAffiliateInfo(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Kuhlekt</h1>
          <p className="text-xl text-gray-600">
            Ready to transform your accounts receivable process? Get in touch with our AR automation experts.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Send us a message</CardTitle>
            <CardDescription className="text-center">
              We'll get back to you within 24 hours with a personalized response.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.message && (
              <Alert className={`mb-6 ${state.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}>
                <AlertDescription className={state.success ? "text-green-700" : "text-red-700"}>
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <form ref={formRef} action={handleSubmit} className="space-y-6">
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
                />
                {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className={state.errors?.company ? "border-red-500" : ""}
                />
                {state.errors?.company && <p className="text-red-500 text-sm mt-1">{state.errors.company}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" className={state.errors?.phone ? "border-red-500" : ""} />
                {state.errors?.phone && <p className="text-red-500 text-sm mt-1">{state.errors.phone}</p>}
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
                {state.errors?.subject && <p className="text-red-500 text-sm mt-1">{state.errors.subject}</p>}
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
                {state.errors?.message && <p className="text-red-500 text-sm mt-1">{state.errors.message}</p>}
              </div>

              <div>
                <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                <Input
                  id="affiliateCode"
                  name="affiliateCode"
                  type="text"
                  value={affiliateCode}
                  onChange={(e) => handleAffiliateChange(e.target.value)}
                  placeholder="Enter your affiliate code for special pricing"
                  className={state.errors?.affiliateCode ? "border-red-500" : ""}
                />
                {state.errors?.affiliateCode && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.affiliateCode}</p>
                )}
                {affiliateInfo && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Valid Code
                      </Badge>
                      <span className="text-sm font-medium text-green-800">
                        {affiliateInfo.discount}% discount applied
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Partner: {affiliateInfo.name} | Category: {affiliateInfo.category}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA onVerify={setRecaptchaToken} />
              </div>

              <Button
                type="submit"
                disabled={isPending || !recaptchaToken}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">Other ways to reach us:</p>
                <div className="space-y-1">
                  <p>📧 Email: contact@kuhlekt.com</p>
                  <p>📞 Phone: 1-800-KUHLEKT</p>
                  <p>🕒 Business Hours: Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
