"use client"

import { useActionState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, AlertCircle } from "lucide-react"
import { submitDemoRequest } from "./actions"
import Image from "next/image"

export default function DemoPage() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, null)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Demo Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Schedule a Demonstration</h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  See how Kuhlekt can transform your accounts receivable process with a personalized demo.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">See how to automate your collections process</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">Learn how to reduce DSO by 30%</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">Discover how to eliminate 80% of manual tasks</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-cyan-500 flex-shrink-0 mt-1" />
                  <p className="text-lg text-gray-700">Get a personalized walkthrough of our platform</p>
                </div>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              {/* Kuhlekt Logo */}
              <div className="mb-8 text-center">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20400%20Pxls%20-%20Copy-NQUjz8mdwGIo3E40fzD7DhXQzE0leS.png"
                  alt="Kuhlekt Logo"
                  width={150}
                  height={50}
                  className="h-10 w-auto mx-auto mb-6"
                  loading="lazy"
                />
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Your Demo</h2>
                <p className="text-gray-600">
                  Fill out the form below and we'll contact you to schedule a personalized demo.
                </p>
              </div>

              {/* Success/Error Message */}
              {state && (
                <div
                  className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                    state.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  {state.success ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm ${state.success ? "text-green-700" : "text-red-700"}`}>{state.message}</p>
                </div>
              )}

              <form action={formAction} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-900">
                      First name *
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      required
                      className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                      disabled={isPending}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-900">
                      Last name *
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      required
                      className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                      disabled={isPending}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@company.com"
                    required
                    className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    disabled={isPending}
                  />
                </div>

                {/* Company */}
                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-gray-900">
                    Company *
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Acme Inc."
                    required
                    className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    disabled={isPending}
                  />
                </div>

                {/* Role */}
                <div>
                  <Label htmlFor="role" className="text-sm font-medium text-gray-900">
                    Role
                  </Label>
                  <Input
                    id="role"
                    name="role"
                    placeholder="Finance Manager"
                    className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    disabled={isPending}
                  />
                </div>

                {/* Challenges */}
                <div>
                  <Label htmlFor="challenges" className="text-sm font-medium text-gray-900">
                    What are your biggest AR challenges?
                  </Label>
                  <Textarea
                    id="challenges"
                    name="challenges"
                    placeholder="Tell us about your current process and challenges..."
                    rows={4}
                    className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 resize-none"
                    disabled={isPending}
                  />
                </div>

                {/* Add after the challenges field */}
                <div className="space-y-2">
                  <Label htmlFor="affiliate" className="text-sm font-medium text-gray-900">
                    Affiliate Code
                  </Label>
                  <Input
                    id="affiliate"
                    name="affiliate"
                    placeholder="Enter affiliate code (optional)"
                    className="mt-1 border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    disabled={isPending}
                    maxLength={20}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Submitting..." : "Request Demo"}
                </Button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                * Required fields. We'll contact you within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
