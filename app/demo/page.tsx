"use client"

import type React from "react"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { submitDemoRequest } from "./actions"
import Image from "next/image"

interface FormErrors {
  [key: string]: string
}

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setSubmitMessage("")

    const formData = new FormData(event.currentTarget)
    const result = await submitDemoRequest(formData)

    if (result.success) {
      setSubmitMessage(result.message || "Demo request submitted successfully!")
      // Reset form
      event.currentTarget.reset()
    } else {
      if (result.errors) {
        const errorMap: FormErrors = {}
        result.errors.forEach((error) => {
          errorMap[error.field] = error.message
        })
        setErrors(errorMap)
      }
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Information */}
        <div className="bg-gray-50 p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Schedule a Demonstration
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              See how Kuhlekt can transform your accounts receivable process with a personalized demo.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">See how to automate your collections process</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Learn how to reduce DSO by 30%</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Discover how to eliminate 80% of manual tasks</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Get a personalized walkthrough of our platform</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  1
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                  2
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                  3
                </div>
              </div>
              <span className="text-gray-600">Join 500+ finance teams already using Kuhlekt</span>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <Image src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" width={120} height={40} className="mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Demo</h2>
              <p className="text-gray-600">
                Fill out the form below and we'll contact you to schedule a personalized demo.
              </p>
            </div>

            {submitMessage && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{submitMessage}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    First name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">
                    Last name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="company">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Acme Inc."
                  className={errors.company ? "border-red-500" : ""}
                />
                {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Finance Manager"
                  className={errors.role ? "border-red-500" : ""}
                />
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
              </div>

              <div>
                <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                <Input
                  id="affiliateCode"
                  name="affiliateCode"
                  placeholder="Enter your affiliate code"
                  className={errors.affiliateCode ? "border-red-500" : ""}
                />
                {errors.affiliateCode && <p className="text-red-500 text-sm mt-1">{errors.affiliateCode}</p>}
              </div>

              <div>
                <Label htmlFor="challenges">What are your biggest AR challenges?</Label>
                <Textarea
                  id="challenges"
                  name="challenges"
                  placeholder="Tell us about your current process and challenges..."
                  rows={4}
                  className={errors.challenges ? "border-red-500" : ""}
                />
                {errors.challenges && <p className="text-red-500 text-sm mt-1">{errors.challenges}</p>}
              </div>

              {errors.general && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Request Demo"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields. We'll contact you within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
