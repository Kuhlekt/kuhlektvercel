"use client"

import { useState, useTransition, useRef, useEffect } from "react"
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
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.errors) {
      if (state.errors.firstName && firstNameRef.current) {
        firstNameRef.current.focus()
      } else if (state.errors.lastName && lastNameRef.current) {
        lastNameRef.current.focus()
      } else if (state.errors.email && emailRef.current) {
        emailRef.current.focus()
      } else if (state.errors.message && messageRef.current) {
        messageRef.current.focus()
      }
    }
  }, [state.errors])

  const handleSubmit = async (formData: FormData) => {
    startTransition(() => {
      setState({ ...initialState, message: "Sending..." })
    })

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: formData,
      }).catch((fetchError) => {
        throw new Error("Network error occurred")
      })

      if (!response) {
        throw new Error("No response received")
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json().catch((jsonError) => {
        throw new Error("Invalid response format")
      })

      if (!result) {
        throw new Error("Empty response received")
      }

      startTransition(() => {
        setState(result)

        if (result.success && result.shouldClearForm) {
          if (formRef.current) {
            formRef.current.reset()
          }
        }
      })
    } catch (error) {
      startTransition(() => {
        setState({
          success: false,
          message:
            error instanceof Error ? error.message : "There was an error sending your message. Please try again.",
          errors: {},
        })
      })
    }
  }

  const hasError = (field: keyof ContactFormState["errors"]) => !!state.errors?.[field]
  const getErrorId = (field: string) => `${field}-error`

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
                {Object.keys(state.errors || {}).length > 0 && (
                  <div role="alert" aria-live="polite" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800 font-medium">Please correct the following errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                      {state.errors?.firstName && <li>{state.errors.firstName}</li>}
                      {state.errors?.lastName && <li>{state.errors.lastName}</li>}
                      {state.errors?.email && <li>{state.errors.email}</li>}
                      {state.errors?.message && <li>{state.errors.message}</li>}
                    </ul>
                  </div>
                )}

                <form
                  ref={formRef}
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    handleSubmit(formData)
                  }}
                  className="space-y-6"
                  noValidate
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        ref={firstNameRef}
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        aria-invalid={hasError("firstName")}
                        aria-describedby={hasError("firstName") ? getErrorId("firstName") : undefined}
                        className={hasError("firstName") ? "border-red-500" : ""}
                        disabled={isPending}
                      />
                      {state.errors?.firstName && (
                        <p id={getErrorId("firstName")} className="text-sm text-red-600" role="alert">
                          {state.errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        ref={lastNameRef}
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        aria-invalid={hasError("lastName")}
                        aria-describedby={hasError("lastName") ? getErrorId("lastName") : undefined}
                        className={hasError("lastName") ? "border-red-500" : ""}
                        disabled={isPending}
                      />
                      {state.errors?.lastName && (
                        <p id={getErrorId("lastName")} className="text-sm text-red-600" role="alert">
                          {state.errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      ref={emailRef}
                      id="email"
                      name="email"
                      type="email"
                      required
                      aria-invalid={hasError("email")}
                      aria-describedby={hasError("email") ? getErrorId("email") : undefined}
                      className={hasError("email") ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    {state.errors?.email && (
                      <p id={getErrorId("email")} className="text-sm text-red-600" role="alert">
                        {state.errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" name="company" type="text" disabled={isPending} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" disabled={isPending} aria-describedby="phone-hint" />
                    <p id="phone-hint" className="text-xs text-gray-500">
                      Optional. Format: +1-555-123-4567
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      ref={messageRef}
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      aria-invalid={hasError("message")}
                      aria-describedby={hasError("message") ? getErrorId("message") : undefined}
                      className={hasError("message") ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    {state.errors?.message && (
                      <p id={getErrorId("message")} className="text-sm text-red-600" role="alert">
                        {state.errors.message}
                      </p>
                    )}
                  </div>

                  <ReCAPTCHA />

                  <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </Button>

                  {state.message && (
                    <Alert
                      className={state.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}
                      role="status"
                      aria-live="polite"
                    >
                      {state.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" aria-hidden="true" />
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
