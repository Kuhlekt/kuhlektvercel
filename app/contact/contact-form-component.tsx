"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"

interface ContactFormState {
  success: boolean
  message: string
  shouldClearForm?: boolean
  errors: {
    firstName?: string
    lastName?: string
    email?: string
    message?: string
    recaptcha?: string
  }
}

const initialState: ContactFormState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactFormComponent() {
  const [state, setState] = useState<ContactFormState>(initialState)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(() => {
      setState({ ...initialState, message: "Sending..." })
    })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      startTransition(() => {
        setState(result)

        if (result.success && result.shouldClearForm) {
          const form = document.querySelector("form") as HTMLFormElement
          if (form) {
            form.reset()
          }
        }
      })
    } catch (error) {
      console.error("Form submission error:", error)
      startTransition(() => {
        setState({
          success: false,
          message: "There was an error sending your message. Please try again.",
          errors: {},
        })
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about Kuhlekt? We're here to help. Reach out to our team and we'll get back to you within
              24 hours.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleSubmit(formData)
                  }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        className={state.errors?.firstName ? "border-red-500" : ""}
                        disabled={isPending}
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
                        disabled={isPending}
                      />
                      {state.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={state.errors?.email ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" name="company" type="text" disabled={isPending} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" disabled={isPending} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      className={state.errors?.message ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    {state.errors?.message && <p className="text-sm text-red-600">{state.errors.message}</p>}
                  </div>

                  <ReCAPTCHA />

                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>

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
    </div>
  )
}
