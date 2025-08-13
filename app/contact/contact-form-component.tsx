"use client"

import { useActionState, useState } from "react"
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Contact Us</CardTitle>
              <CardDescription className="text-center">Get in touch with our team</CardDescription>
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

              <form action={formAction} className="space-y-6">
                <input type="hidden" name="recaptchaToken" value={recaptchaToken} />

                <div className="grid md:grid-cols-2 gap-4">
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
                  <Label htmlFor="email">Email *</Label>
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" className={state?.errors?.phone ? "border-red-500" : ""} />
                  {state?.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    className={state?.errors?.company ? "border-red-500" : ""}
                  />
                  {state?.errors?.company && <p className="text-sm text-red-600 mt-1">{state.errors.company}</p>}
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="How can we help you?"
                    rows={5}
                    required
                    className={state?.errors?.message ? "border-red-500" : ""}
                  />
                  {state?.errors?.message && <p className="text-sm text-red-600 mt-1">{state.errors.message}</p>}
                </div>

                <ReCaptcha onVerify={setRecaptchaToken} />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
