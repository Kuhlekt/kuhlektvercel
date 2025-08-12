"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Check } from "lucide-react"
import { submitDemoRequest } from "./actions"
import { useActionState } from "react"
import Image from "next/image"
import ReCAPTCHA from "@/components/recaptcha"

export default function DemoPage() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Column - Information */}
        <div className="bg-gray-100 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Schedule a Demonstration
            </h1>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              See how Kuhlekt can transform your accounts receivable process with a personalized demo.
            </p>

            <div className="space-y-4 mb-12">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700">See how to automate your collections process</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700">Learn how to reduce DSO by 30%</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700">Discover how to eliminate 80% of manual tasks</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <p className="text-gray-700">Get a personalized walkthrough of our platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex gap-2">
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
              <p className="text-gray-600">Join 500+ finance teams already using Kuhlekt</p>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <Image
                src="/images/kuhlekt-logo.jpg"
                alt="Kuhlekt Logo"
                width={120}
                height={40}
                className="mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Demo</h2>
              <p className="text-gray-600">
                Fill out the form below and we'll contact you to schedule a personalized demo.
              </p>
            </div>

            <form action={formAction} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="firstName" name="firstName" type="text" required placeholder="John" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last name <span className="text-red-500">*</span>
                  </Label>
                  <Input id="lastName" name="lastName" type="text" required placeholder="Doe" className="mt-1" />
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
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

              {/* Company */}
              <div>
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Company <span className="text-red-500">*</span>
                </Label>
                <Input id="company" name="company" type="text" required placeholder="Acme Inc." className="mt-1" />
              </div>

              {/* Role */}
              <div>
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </Label>
                <Input id="role" name="role" type="text" placeholder="Finance Manager" className="mt-1" />
              </div>

              {/* Affiliate Code */}
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

              {/* AR Challenges */}
              <div>
                <Label htmlFor="challenges" className="text-sm font-medium text-gray-700">
                  What are your biggest AR challenges?
                </Label>
                <Textarea
                  id="challenges"
                  name="challenges"
                  placeholder="Tell us about your current process and challenges..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              {/* reCAPTCHA */}
              <ReCAPTCHA onVerify={setCaptchaToken} />
              <input type="hidden" name="captchaToken" value={captchaToken || ""} />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending || !captchaToken}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-lg font-semibold"
              >
                {isPending ? "Submitting..." : "Request Demo"}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                <span className="text-red-500">*</span> Required fields. We'll contact you within 24 hours.
              </p>

              {/* Status Messages */}
              {state?.success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 text-sm">{state.message}</p>
                </div>
              )}

              {state?.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{state.message}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
