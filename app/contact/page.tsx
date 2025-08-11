"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { submitContactForm } from "./actions"
import { Recaptcha } from "@/components/recaptcha"

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null)
  const [companySize, setCompanySize] = useState("")
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")
  const [recaptchaError, setRecaptchaError] = useState<string>("")

  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
    setRecaptchaError("")
  }

  const handleRecaptchaExpire = () => {
    setRecaptchaToken("")
    setRecaptchaError("reCAPTCHA expired. Please verify again.")
  }

  const handleRecaptchaError = () => {
    setRecaptchaToken("")
    setRecaptchaError("reCAPTCHA error. Please try again.")
  }

  const handleSubmit = (formData: FormData) => {
    if (!recaptchaToken) {
      setRecaptchaError("Please complete the reCAPTCHA verification.")
      return
    }

    // Add recaptcha token to form data
    formData.append("recaptchaToken", recaptchaToken)
    formAction(formData)
  }

  // Track affiliate when form is successfully submitted
  useEffect(() => {
    if (state?.success && state?.affiliate) {
      const sessionId = sessionStorage.getItem("kuhlekt_session_id")
      if (sessionId) {
        fetch("/api/update-affiliate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            affiliate: state.affiliate,
            source: "contact",
          }),
        }).catch(() => {
          // Silently handle errors
        })
      }
    }
  }, [state])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/images/kuhlekt-logo.png" alt="Kuhlekt" className="h-8" />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-blue-600">
                Home
              </a>
              <a href="/product" className="text-gray-600 hover:text-blue-600">
                Product
              </a>
              <a href="/solutions" className="text-gray-600 hover:text-blue-600">
                Solutions
              </a>
              <a href="/pricing" className="text-gray-600 hover:text-blue-600">
                Pricing
              </a>
              <a href="/about" className="text-gray-600 hover:text-blue-600">
                About
              </a>
              <a href="/contact" className="text-blue-600 font-medium">
                Contact
              </a>
            </nav>
            <Button asChild>
              <a href="/demo">Request Demo</a>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ready to transform your accounts receivable process? Contact our team to learn how Kuhlekt can help your
            business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Our Offices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">United States Office</h3>
                  <p className="text-gray-600">
                    Houston, TX 77002
                    <br />
                    United States
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Australia Office</h3>
                  <p className="text-gray-600">
                    Hope Island, QLD
                    <br />
                    Australia
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-600" />
                  Phone Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-gray-900">US: +1 832 888 8575</p>
                  <p className="text-sm text-gray-600">Monday - Friday, 8:00 AM - 6:00 PM CST</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">AU: +61 452 155 532</p>
                  <p className="text-sm text-gray-600">Monday - Friday, 9:00 AM - 5:00 PM AEST</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900 font-medium">enquiries@kuhlekt.com</p>
                <p className="text-sm text-gray-600 mt-1">We typically respond within 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="font-medium text-gray-900">United States (CST)</p>
                  <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Australia (AEST)</p>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 5:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSubmit(new FormData(e.target))
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" type="text" required placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" type="text" required placeholder="Smith" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required placeholder="john.smith@company.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input id="company" name="company" type="text" required placeholder="Your Company" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role</Label>
                    <Input id="role" name="role" type="text" placeholder="CFO, Finance Manager, etc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select name="companySize" value={companySize} onValueChange={setCompanySize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="affiliate">Affiliate</Label>
                  <Input id="affiliate" name="affiliate" type="text" placeholder="Affiliate code" maxLength={10} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Tell us about your accounts receivable challenges and how we can help..."
                    rows={5}
                  />
                </div>

                {/* reCAPTCHA */}
                <div className="space-y-2">
                  <Recaptcha
                    onVerify={handleRecaptchaVerify}
                    onExpire={handleRecaptchaExpire}
                    onError={handleRecaptchaError}
                  />
                  {recaptchaError && <p className="text-red-600 text-sm text-center">{recaptchaError}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={isPending || !recaptchaToken}>
                  {isPending ? "Sending..." : "Send Message"}
                </Button>

                {state && (
                  <div
                    className={`text-center p-4 rounded-md ${
                      state.success
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {state.message}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-blue-400 mb-4">Kuhlekt</div>
              <p className="text-gray-300 mb-4">
                Transforming accounts receivable management with intelligent automation and data-driven insights.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/product" className="text-gray-300 hover:text-white">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/solutions" className="text-gray-300 hover:text-white">
                    Solutions
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-gray-300 hover:text-white">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/demo" className="text-gray-300 hover:text-white">
                    Request Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-300 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-300 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; 2024 Kuhlekt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
