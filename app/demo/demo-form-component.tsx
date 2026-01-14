"use client"

import type React from "react"
import { useState, useTransition, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Users, TrendingUp, Shield, Clock, Gift } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"

interface DemoFormState {
  success: boolean
  message: string
  shouldClearForm?: boolean
  errors: {
    firstName?: string
    lastName?: string
    email?: string
    company?: string
    phone?: string
    promoCode?: string
    recaptcha?: string
  }
}

const initialState: DemoFormState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoFormComponent() {
  const [state, setState] = useState<DemoFormState>(initialState)
  const [isPending, startTransition] = useTransition()
  const firstNameRef = useRef<HTMLInputElement>(null)
  const lastNameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const companyRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.errors) {
      if (state.errors.firstName && firstNameRef.current) {
        firstNameRef.current.focus()
      } else if (state.errors.lastName && lastNameRef.current) {
        lastNameRef.current.focus()
      } else if (state.errors.email && emailRef.current) {
        emailRef.current.focus()
      } else if (state.errors.company && companyRef.current) {
        companyRef.current.focus()
      } else if (state.errors.phone && phoneRef.current) {
        phoneRef.current.focus()
      }
    }
  }, [state.errors])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(() => {
      setState({ ...initialState, message: "Submitting..." })
    })

    try {
      const response = await fetch("/api/demo", {
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
      })

      // Clear form if successful
      if (result.success && result.shouldClearForm && formRef.current) {
        formRef.current.reset()
      }
    } catch (error) {
      startTransition(() => {
        setState({
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "There was an error submitting your demo request. Please try again.",
          errors: {},
          shouldClearForm: false,
        })
      })
    }
  }

  const hasError = (field: keyof DemoFormState["errors"]) => !!state.errors?.[field]
  const getErrorId = (field: string) => `${field}-error`

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Request a Demo</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how Kuhlekt can transform your accounts receivable process. Schedule a personalized demo with our team
              and discover how to reduce DSO by up to 35%.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Demo Form */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl">Schedule Your Demo</CardTitle>
                <CardDescription>Fill out the form below and we'll contact you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(state.errors || {}).length > 0 && (
                  <div role="alert" aria-live="polite" className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800 font-medium">Please correct the following errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 mt-1">
                      {state.errors?.firstName && <li>{state.errors.firstName}</li>}
                      {state.errors?.lastName && <li>{state.errors.lastName}</li>}
                      {state.errors?.email && <li>{state.errors.email}</li>}
                      {state.errors?.company && <li>{state.errors.company}</li>}
                      {state.errors?.phone && <li>{state.errors.phone}</li>}
                      {state.errors?.promoCode && <li>{state.errors.promoCode}</li>}
                    </ul>
                  </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                    <Label htmlFor="email">Business Email *</Label>
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
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      ref={companyRef}
                      id="company"
                      name="company"
                      type="text"
                      required
                      aria-invalid={hasError("company")}
                      aria-describedby={hasError("company") ? getErrorId("company") : undefined}
                      className={hasError("company") ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    {state.errors?.company && (
                      <p id={getErrorId("company")} className="text-sm text-red-600" role="alert">
                        {state.errors.company}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      ref={phoneRef}
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      aria-invalid={hasError("phone")}
                      aria-describedby={hasError("phone") ? `${getErrorId("phone")} phone-hint` : "phone-hint"}
                      className={hasError("phone") ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    <p id="phone-hint" className="text-xs text-gray-500">
                      Format: +1-555-123-4567
                    </p>
                    {state.errors?.phone && (
                      <p id={getErrorId("phone")} className="text-sm text-red-600" role="alert">
                        {state.errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promoCode" className="flex items-center">
                      <Gift className="mr-2 h-4 w-4 text-yellow-600" aria-hidden="true" />
                      Promo Code (Optional)
                    </Label>
                    <Input
                      id="promoCode"
                      name="promoCode"
                      type="text"
                      placeholder="Enter promo code if you have one"
                      aria-invalid={hasError("promoCode")}
                      aria-describedby={hasError("promoCode") ? getErrorId("promoCode") : undefined}
                      className={hasError("promoCode") ? "border-red-500" : ""}
                      disabled={isPending}
                    />
                    {state.errors?.promoCode && (
                      <p id={getErrorId("promoCode")} className="text-sm text-red-600" role="alert">
                        {state.errors.promoCode}
                      </p>
                    )}
                  </div>

                  <ReCAPTCHA />
                  {state.errors?.recaptcha && (
                    <p className="text-sm text-red-600" role="alert">
                      {state.errors.recaptcha}
                    </p>
                  )}

                  <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Scheduling Demo...</span>
                      </>
                    ) : (
                      "Schedule Demo"
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

            {/* Demo Benefits */}
            <div className="space-y-8">
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">What You'll See in Your Demo</CardTitle>
                  <CardDescription>Discover how Kuhlekt can transform your AR process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <TrendingUp className="h-6 w-6 text-blue-600 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Real-time Dashboard</h3>
                      <p className="text-gray-600">See live AR metrics, aging reports, and cash flow projections</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Users className="h-6 w-6 text-blue-600 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Customer Portal</h3>
                      <p className="text-gray-600">Self-service portal for customers to view and pay invoices</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Shield className="h-6 w-6 text-blue-600 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Automated Collections</h3>
                      <p className="text-gray-600">Smart workflows that reduce manual work by 80%</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-blue-600 mt-1" aria-hidden="true" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Quick Implementation</h3>
                      <p className="text-gray-600">Go live in as little as 1 week with our proven process</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Proven Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">30%</div>
                    <div className="text-sm text-gray-600">Average DSO Reduction</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">60%</div>
                      <div className="text-xs text-gray-600">Less Manual Work</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">1 Week</div>
                      <div className="text-xs text-gray-600">Implementation</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl">Demo Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Personalized Demo</h4>
                      <p className="text-sm text-gray-600">1 hour demo tailored to your business</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Implementation Plan</h4>
                      <p className="text-sm text-gray-600">Custom roadmap for your success</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
