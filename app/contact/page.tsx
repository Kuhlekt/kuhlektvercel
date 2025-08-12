"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import ReCAPTCHA from "@/components/recaptcha"
import { submitContactForm } from "./actions"
import { validateAffiliateCode } from "@/lib/affiliate-validation"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContactForm, initialState)
  const [isPending, setIsPending] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateInfo, setAffiliateInfo] = useState<any>(null)
  const [affiliateValidation, setAffiliateValidation] = useState<{
    isValid: boolean
    message: string
  } | null>(null)

  // Handle form submission with pending state
  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    formData.append("recaptchaToken", recaptchaToken)
    formData.append("affiliateCode", affiliateCode)

    try {
      await formAction(formData)
    } finally {
      setIsPending(false)
      setRecaptchaToken("")
    }
  }

  // Validate affiliate code in real-time
  useEffect(() => {
    if (affiliateCode.trim()) {
      const info = validateAffiliateCode(affiliateCode)
      if (info) {
        setAffiliateInfo(info)
        setAffiliateValidation({
          isValid: true,
          message: `Valid partner: ${info.name} (${info.commission}% commission)`,
        })
      } else {
        setAffiliateInfo(null)
        setAffiliateValidation({
          isValid: false,
          message: "Invalid affiliate code",
        })
      }
    } else {
      setAffiliateInfo(null)
      setAffiliateValidation(null)
    }
  }, [affiliateCode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">
            Get in touch with our team to learn more about Kuhlekt's AR automation solutions
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you within 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            {state.success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{state.message}</AlertDescription>
              </Alert>
            )}

            {state.message && !state.success && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{state.message}</AlertDescription>
              </Alert>
            )}

            <form action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" type="text" required className="mt-1" placeholder="John" />
                  {state.errors?.firstName && <p className="text-red-600 text-sm mt-1">{state.errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" type="text" required className="mt-1" placeholder="Doe" />
                  {state.errors?.lastName && <p className="text-red-600 text-sm mt-1">{state.errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1"
                  placeholder="john.doe@company.com"
                />
                {state.errors?.email && <p className="text-red-600 text-sm mt-1">{state.errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className="mt-1"
                  placeholder="Your Company Inc."
                />
                {state.errors?.company && <p className="text-red-600 text-sm mt-1">{state.errors.company}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" className="mt-1" placeholder="+1 (555) 123-4567" />
                {state.errors?.phone && <p className="text-red-600 text-sm mt-1">{state.errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="affiliateCode">Affiliate/Partner Code</Label>
                <Input
                  id="affiliateCode"
                  name="affiliateCode"
                  type="text"
                  className="mt-1"
                  placeholder="PARTNER001"
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                />
                {affiliateValidation && (
                  <div className="mt-2">
                    <Badge variant={affiliateValidation.isValid ? "default" : "destructive"} className="text-xs">
                      {affiliateValidation.message}
                    </Badge>
                  </div>
                )}
                {state.errors?.affiliateCode && (
                  <p className="text-red-600 text-sm mt-1">{state.errors.affiliateCode}</p>
                )}
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  className="mt-1"
                  placeholder="Inquiry about AR automation solutions"
                />
                {state.errors?.subject && <p className="text-red-600 text-sm mt-1">{state.errors.subject}</p>}
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  className="mt-1"
                  placeholder="Tell us about your accounts receivable challenges and how we can help..."
                />
                {state.errors?.message && <p className="text-red-600 text-sm mt-1">{state.errors.message}</p>}
              </div>

              <div className="flex justify-center">
                <ReCAPTCHA onVerify={setRecaptchaToken} />
              </div>

              <Button
                type="submit"
                disabled={isPending || !recaptchaToken}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                By submitting this form, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Sales Inquiries</h3>
              <p className="text-gray-600 mb-2">sales@kuhlekt.com</p>
              <p className="text-gray-600">+1 (555) 123-4567</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">Technical Support</h3>
              <p className="text-gray-600 mb-2">support@kuhlekt.com</p>
              <p className="text-gray-600">+1 (555) 123-4568</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">General Info</h3>
              <p className="text-gray-600 mb-2">info@kuhlekt.com</p>
              <p className="text-gray-600">+1 (555) 123-4569</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
