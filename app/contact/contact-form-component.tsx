"use client"

import { useState, useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Have questions about Kuhlekt? We're here to help.</p>
        </div>

        {/* Contact Form */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Send us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you soon.</CardDescription>
          </CardHeader>
          <CardContent>
            {state.success ? (
              <div className="text-center py-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                <p className="text-gray-600">{state.message}</p>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                <input type="hidden" name="captchaToken" value={captchaToken} />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" type="text" required className="mt-1" disabled={isPending} />
                    {state.errors?.firstName && <p className="text-red-600 text-sm mt-1">{state.errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" type="text" required className="mt-1" disabled={isPending} />
                    {state.errors?.lastName && <p className="text-red-600 text-sm mt-1">{state.errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required className="mt-1" disabled={isPending} />
                  {state.errors?.email && <p className="text-red-600 text-sm mt-1">{state.errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" name="company" type="text" className="mt-1" disabled={isPending} />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" className="mt-1" disabled={isPending} />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="mt-1"
                    placeholder="Tell us how we can help you..."
                    disabled={isPending}
                  />
                  {state.errors?.message && <p className="text-red-600 text-sm mt-1">{state.errors.message}</p>}
                </div>

                <ReCaptcha onVerify={setCaptchaToken} />

                <Button type="submit" className="w-full" disabled={isPending}>
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
  )
}
