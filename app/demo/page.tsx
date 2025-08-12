"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitDemoRequest } from "./actions"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [role, setRole] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage("")
    setError("")

    // Add role to form data
    if (role) {
      formData.set("role", role)
    }

    try {
      const result = await submitDemoRequest(formData)

      if (result.success) {
        setMessage(result.message || "Demo request submitted successfully!")
        // Clear form on success
        formRef.current?.reset()
        setRole("")
      } else {
        setError(result.error || "Failed to submit demo request")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Information */}
          <div className="bg-gray-50 p-8 lg:p-12 rounded-lg">
            <div className="max-w-lg">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Schedule a Demonstration</h1>

              <p className="text-lg text-gray-600 mb-8">
                See how Kuhlekt can transform your accounts receivable process with a personalized demo.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">See how to automate your collections process</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Learn how to reduce DSO by 30%</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Discover how to eliminate 80% of manual tasks</span>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Get a personalized walkthrough of our platform</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                </div>
                <span className="text-gray-600">Join 500+ finance teams already using Kuhlekt</span>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-8 lg:p-12">
            <div className="max-w-md mx-auto w-full">
              <div className="text-center mb-8">
                <Image src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" width={120} height={40} className="mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Demo</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll contact you to schedule a personalized demo.
                </p>
              </div>

              <form ref={formRef} action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      First name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      placeholder="John"
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Last name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      placeholder="Doe"
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="john.doe@company.com"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                    Company *
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    required
                    placeholder="Acme Inc."
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                    Role
                  </Label>
                  <Select value={role} onValueChange={setRole} disabled={isSubmitting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Finance Manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cfo">CFO</SelectItem>
                      <SelectItem value="finance-manager">Finance Manager</SelectItem>
                      <SelectItem value="controller">Controller</SelectItem>
                      <SelectItem value="ar-manager">AR Manager</SelectItem>
                      <SelectItem value="accounting-manager">Accounting Manager</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="affiliateCode" className="text-sm font-medium text-gray-700">
                    Affiliate Code (Optional)
                  </Label>
                  <Input
                    id="affiliateCode"
                    name="affiliateCode"
                    type="text"
                    placeholder="Enter your affiliate code"
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="challenges" className="text-sm font-medium text-gray-700">
                    What are your biggest AR challenges?
                  </Label>
                  <Textarea
                    id="challenges"
                    name="challenges"
                    required
                    placeholder="Tell us about your current process and challenges..."
                    className="mt-1 min-h-[100px]"
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Request Demo"}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  * Required fields. We'll contact you within 24 hours.
                </p>
              </form>

              {message && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{message}</p>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
