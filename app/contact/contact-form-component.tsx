"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { submitContactForm } from "./actions"
import { ReCaptcha } from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactFormComponent() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [captchaToken, setCaptchaToken] = useState<string>("")

  const handleSubmit = async (formData: FormData) => {
    // Add captcha token to form data
    formData.set("captchaToken", captchaToken)
    formAction(formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Ready to transform your accounts receivable process? Get in touch with our team.
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you within 24 hours.</CardDescription>
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

            <form action={handleSubmit} className="space-y-6">
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
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" type="text" className="mt-1" disabled={isPending} />
                {state.errors?.company && <p className="text-sm text-red-600 mt-1">{state.errors.company}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" className="mt-1" disabled={isPending} />
                {state.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" name="subject" type="text" required className="mt-1" disabled={isPending} />
                {state.errors?.subject && <p className="text-sm text-red-600 mt-1">{state.errors.subject}</p>}
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="mt-1"
                  placeholder="Tell us about your accounts receivable challenges and how we can help..."
                  disabled={isPending}
                />
                {state.errors?.message && <p className="text-sm text-red-600 mt-1">{state.errors.message}</p>}
              </div>

              <ReCaptcha onVerify={setCaptchaToken} />

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600"
                disabled={isPending || !captchaToken}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Message...
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
