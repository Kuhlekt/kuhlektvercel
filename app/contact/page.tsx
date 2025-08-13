"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitContactForm } from "./actions"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setMessage("")
    setError("")

    const formData = new FormData(event.currentTarget)

    try {
      const result = await submitContactForm(formData)

      if (result.success) {
        setMessage(result.message || "Message sent successfully!")
        // Clear form on success
        formRef.current?.reset()
      } else {
        setError(result.error || "Failed to send message")
      }
    } catch (error) {
      console.error("Contact form submission error:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your accounts receivable process? Contact our team to learn how Kuhlekt can help your
              business.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-gray-50 p-8 lg:p-12 rounded-lg">
              <div className="mb-8">
                <Image src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" width={120} height={40} className="mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Let's Start a Conversation</h2>
                <p className="text-gray-600 mb-8">
                  Our team of AR automation experts is here to help you streamline your collections process and improve
                  cash flow.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-500 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">info@kuhlekt.com</p>
                    <p className="text-gray-600">support@kuhlekt.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-cyan-500 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-cyan-500 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600">123 Business Ave</p>
                    <p className="text-gray-600">Suite 100</p>
                    <p className="text-gray-600">New York, NY 10001</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Why Choose Kuhlekt?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Reduce DSO by up to 30%</li>
                  <li>• Automate 80% of manual AR tasks</li>
                  <li>• Improve cash flow predictability</li>
                  <li>• 24/7 customer support</li>
                  <li>• Easy integration with existing systems</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white">
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                    <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone (Optional)
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      placeholder="How can we help you?"
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                      Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your needs..."
                      className="mt-1 min-h-[120px]"
                      rows={5}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="affiliateCode" className="text-sm font-medium text-gray-700">
                      Affiliate Code (Optional)
                    </Label>
                    <Input
                      id="affiliateCode"
                      name="affiliateCode"
                      type="text"
                      placeholder="Enter your affiliate code if you have one"
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3 text-lg font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>

                  <p className="text-sm text-gray-500 text-center">* Required fields. We'll respond within 24 hours.</p>
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
    </div>
  )
}
