"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recaptcha } from "@/components/recaptcha"
import { submitContactForm } from "./actions"
import { useActionState } from "react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function ContactPage() {
  const [state, action, isPending] = useActionState(submitContactForm, null)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")

  // Reset form on successful submission
  useEffect(() => {
    if (state?.success) {
      const form = document.getElementById("contact-form") as HTMLFormElement
      if (form) {
        form.reset()
        setRecaptchaToken("")
        // Reset recaptcha
        if (window.grecaptcha) {
          window.grecaptcha.reset()
        }
      }
    }
  }, [state?.success])

  const handleSubmit = async (formData: FormData) => {
    if (recaptchaToken) {
      formData.append("recaptchaToken", recaptchaToken)
    }
    action(formData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VisitorTracker />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">Contact Us</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about Kuhlekt? Want to learn more about our AR automation platform? We're here to help.
          </p>
        </div>

        <Card className="shadow-xl max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Send us a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="contact-form" action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" type="text" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" type="text" required className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required className="mt-1" />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" type="text" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="affiliate">Affiliate Code (Optional)</Label>
                <Input
                  id="affiliate"
                  name="affiliate"
                  type="text"
                  placeholder="Enter affiliate code if you have one"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Tell us how we can help you..."
                  className="mt-1"
                />
              </div>

              <Recaptcha
                onVerify={setRecaptchaToken}
                onExpire={() => setRecaptchaToken("")}
                onError={() => setRecaptchaToken("")}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3"
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>

              {state?.success && <div className="text-green-600 text-center font-medium">{state.message}</div>}

              {state?.error && <div className="text-red-600 text-center">{state.message}</div>}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
