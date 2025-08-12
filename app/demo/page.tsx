"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check, Loader2 } from "lucide-react"
import { submitDemoRequest } from "./actions"
import Image from "next/image"

export default function DemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await submitDemoRequest(formData)

      if (result.success) {
        setMessage({ type: "success", text: result.message || "Demo request submitted successfully!" })
        // Reset form
        const form = document.getElementById("demo-form") as HTMLFormElement
        form?.reset()
      } else {
        setMessage({ type: "error", text: result.error || "Failed to submit demo request" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred. Please try again." })
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
                  <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">See how to automate your collections process</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">Learn how to reduce DSO by 30%</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700">Discover how to eliminate 80% of manual tasks</span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
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
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Image src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" width={40} height={40} className="rounded" />
                    <span className="text-2xl font-bold text-gray-900">Kuhlekt</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Demo</h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll contact you to schedule a personalized demo.
                  </p>
                </div>

                {message && (
                  <Alert
                    className={`mb-6 ${message.type === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
                  >
                    <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
                      {message.text}
                    </AlertDescription>
                  </Alert>
                )}

                <form id="demo-form" action={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First name *
                      </Label>
                      <Input id="firstName" name="firstName" type="text" required placeholder="John" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last name *
                      </Label>
                      <Input id="lastName" name="lastName" type="text" required placeholder="Doe" className="mt-1" />
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
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                      Company *
                    </Label>
                    <Input id="company" name="company" type="text" required placeholder="Acme Inc." className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                      Role
                    </Label>
                    <Input id="role" name="role" type="text" placeholder="Finance Manager" className="mt-1" />
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
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Request Demo"
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">
                    * Required fields. We'll contact you within 24 hours.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
