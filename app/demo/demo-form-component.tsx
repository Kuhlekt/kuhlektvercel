"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReCAPTCHA } from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export function DemoFormComponent() {
  const [state, formAction] = useFormState(submitDemoRequest, initialState)
  const [isPending, setIsPending] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const handleSubmit = async (formData: FormData) => {
    if (!captchaToken) {
      return
    }

    setIsPending(true)
    formData.append("captchaToken", captchaToken)

    try {
      await formAction(formData)
    } finally {
      setIsPending(false)
      setCaptchaToken(null)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule Your Demo</CardTitle>
        <CardDescription>Fill out the form below and we'll contact you within 24 hours.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                required
                className={state.errors?.firstName ? "border-red-500" : ""}
              />
              {state.errors?.firstName && <p className="text-sm text-red-500">{state.errors.firstName}</p>}
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
              {state.errors?.lastName && <p className="text-sm text-red-500">{state.errors.lastName}</p>}
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
            {state.errors?.email && <p className="text-sm text-red-500">{state.errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              name="company"
              type="text"
              required
              className={state.errors?.company ? "border-red-500" : ""}
            />
            {state.errors?.company && <p className="text-sm text-red-500">{state.errors.company}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              className={state.errors?.phone ? "border-red-500" : ""}
            />
            {state.errors?.phone && <p className="text-sm text-red-500">{state.errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <ReCAPTCHA onVerify={setCaptchaToken} />
            {state.errors?.captcha && <p className="text-sm text-red-500">{state.errors.captcha}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isPending || !captchaToken}>
            {isPending ? "Scheduling Demo..." : "Schedule Demo"}
          </Button>

          {state.message && (
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
  )
}
