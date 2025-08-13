"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { submitContactForm, type ContactFormState } from "./actions"
import Recaptcha from "@/components/recaptcha"

const initialState: ContactFormState = {
  success: false,
  message: "",
}

export default function ContactFormComponent() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")

  const handleSubmit = async (formData: FormData) => {
    formData.append("recaptcha-token", recaptchaToken)
    formAction(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Contact Us</CardTitle>
            <CardDescription className="text-center">
              Get in touch with our team. We'll respond within 24 hours.
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

            <form action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    disabled={isPending}
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
                    disabled={isPending}
                    className={state.errors?.lastName ? "border-red-500" : ""}
                  />
                  {state.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isPending}
                  className={state.errors?.email ? "border-red-500" : ""}
                />
                {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  disabled={isPending}
                  className={state.errors?.company ? "border-red-500" : ""}
                />
                {state.errors?.company && <p className="text-sm text-red-600">{state.errors.company}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  disabled={isPending}
                  className={state.errors?.message ? "border-red-500" : ""}
                />
                {state.errors?.message && <p className="text-sm text-red-600">{state.errors.message}</p>}
              </div>

              <Recaptcha onToken={setRecaptchaToken} onError={(error) => console.error("reCAPTCHA error:", error)} />

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
