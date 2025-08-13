"use client"

import type React from "react"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { ReCaptcha } from "@/components/recaptcha"
import { submitContactForm } from "./actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export function ContactFormComponent() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append("recaptchaToken", recaptchaToken)
    formAction(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Contact Us</CardTitle>
        <CardDescription>Get in touch with our team. We'll respond within 24 hours.</CardDescription>
      </CardHeader>
      <CardContent>
        {state?.success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{state.message}</AlertDescription>
          </Alert>
        )}

        {state?.message && !state?.success && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{state.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                className={state?.errors?.firstName ? "border-red-500" : ""}
              />
              {state?.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                required
                className={state?.errors?.lastName ? "border-red-500" : ""}
              />
              {state?.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className={state?.errors?.email ? "border-red-500" : ""}
            />
            {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" type="text" className={state?.errors?.company ? "border-red-500" : ""} />
            {state?.errors?.company && <p className="text-sm text-red-600">{state.errors.company}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" className={state?.errors?.phone ? "border-red-500" : ""} />
            {state?.errors?.phone && <p className="text-sm text-red-600">{state.errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Tell us how we can help you..."
              className={state?.errors?.message ? "border-red-500" : ""}
            />
            {state?.errors?.message && <p className="text-sm text-red-600">{state.errors.message}</p>}
          </div>

          <ReCaptcha onVerify={setRecaptchaToken} />

          <Button type="submit" className="w-full" disabled={isPending || !recaptchaToken}>
            {isPending ? "Sending..." : "Send Message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
