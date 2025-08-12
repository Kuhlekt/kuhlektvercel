"use client"

import { useState, useRef } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ReCAPTCHA from "@/components/recaptcha"
import { submitContactForm } from "./actions"

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    formData.append("recaptchaToken", recaptchaToken)
    formData.append("affiliateCode", affiliateCode)

    const result = await formAction(formData)

    if (result?.success) {
      // Reset form and state
      formRef.current?.reset()
      setRecaptchaToken("")
      setAffiliateCode("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Contact Us</CardTitle>
            <CardDescription className="text-lg">
              Get in touch with our team. We'd love to hear from you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" name="name" type="text" required placeholder="Your full name" disabled={isPending} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="your.email@company.com"
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  placeholder="Your company name"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your accounts receivable challenges..."
                  className="min-h-[120px]"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                <Input
                  id="affiliateCode"
                  type="text"
                  placeholder="Enter your affiliate code"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value)}
                  disabled={isPending}
                />
              </div>

              <ReCAPTCHA onVerify={setRecaptchaToken} />

              {state && (
                <Alert className={state.success ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}>
                  <AlertDescription className={state.success ? "text-green-700" : "text-red-700"}>
                    {state.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                disabled={isPending || !recaptchaToken}
              >
                {isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
