"use client"

import { useState, useRef } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { submitContactForm } from "./actions"
import { ReCaptcha } from "@/components/recaptcha"

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null)
  const [affiliateCode, setAffiliateCode] = useState("")
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  // Reset form on successful submission
  if (state?.success && formRef.current) {
    formRef.current.reset()
    setAffiliateCode("")
    setRecaptchaToken("")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Get in touch with our team to learn how Kuhlekt can transform your accounts receivable process.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            {state?.success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{state.message}</AlertDescription>
              </Alert>
            )}

            {state?.success === false && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{state.message}</AlertDescription>
              </Alert>
            )}

            <form ref={formRef} action={formAction} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className={state?.errors?.firstName ? "border-red-500" : ""}
                  />
                  {state?.errors?.firstName && <p className="text-sm text-red-600 mt-1">{state.errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className={state?.errors?.lastName ? "border-red-500" : ""}
                  />
                  {state?.errors?.lastName && <p className="text-sm text-red-600 mt-1">{state.errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={state?.errors?.email ? "border-red-500" : ""}
                />
                {state?.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className={state?.errors?.company ? "border-red-500" : ""}
                />
                {state?.errors?.company && <p className="text-sm text-red-600 mt-1">{state.errors.company}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" className={state?.errors?.phone ? "border-red-500" : ""} />
                {state?.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us about your current accounts receivable challenges..."
                  className={state?.errors?.message ? "border-red-500" : ""}
                />
                {state?.errors?.message && <p className="text-sm text-red-600 mt-1">{state.errors.message}</p>}
              </div>

              <div>
                <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                <Input
                  id="affiliateCode"
                  name="affiliateCode"
                  type="text"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value)}
                  placeholder="Enter your affiliate code if you have one"
                  className={state?.errors?.affiliateCode ? "border-red-500" : ""}
                />
                {state?.errors?.affiliateCode && (
                  <p className="text-sm text-red-600 mt-1">{state.errors.affiliateCode}</p>
                )}
              </div>

              <ReCaptcha onVerify={setRecaptchaToken} error={state?.errors?.recaptcha} />

              <input type="hidden" name="recaptchaToken" value={recaptchaToken} />

              <Button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-700"
                disabled={isPending || !recaptchaToken}
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
