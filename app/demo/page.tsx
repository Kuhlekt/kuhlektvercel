"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom"
import { submitDemoForm } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recaptcha } from "@/components/recaptcha"
import { VisitorTracker } from "@/components/visitor-tracker"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoPage() {
  const [state, formAction] = useFormState(submitDemoForm, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")
  const [isPending, setIsPending] = useState(false)

  // Reset form on successful submission
  useEffect(() => {
    if (state?.success) {
      const form = document.getElementById("demo-form") as HTMLFormElement
      if (form) {
        form.reset()
        setRecaptchaToken("")
        // Reset recaptcha
        if (typeof window !== "undefined" && window.grecaptcha) {
          window.grecaptcha.reset()
        }
      }
    }
  }, [state?.success])

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    if (recaptchaToken) {
      formData.append("recaptchaToken", recaptchaToken)
    }

    // Add visitor tracking data if available
    if (typeof window !== "undefined") {
      try {
        const visitorDataStr = localStorage.getItem("kuhlekt_visitor_data")
        if (visitorDataStr) {
          const visitorData = JSON.parse(visitorDataStr)
          formData.append("referrer", visitorData.referrer || "")
          formData.append("utmSource", visitorData.utmSource || "")
          formData.append("utmCampaign", visitorData.utmCampaign || "")
          formData.append("pageViews", visitorData.pageViews?.toString() || "")
        }
      } catch (error) {
        console.error("Error adding visitor data to form:", error)
      }
    }

    formAction(formData)
    setIsPending(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VisitorTracker />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">Request Demo</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">See Kuhlekt in Action</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schedule a personalized demo to see how Kuhlekt can transform your accounts receivable process.
          </p>
        </div>

        <Card className="shadow-xl max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Request Your Demo</CardTitle>
          </CardHeader>
          <CardContent>
            <form id="demo-form" action={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" type="text" required className="mt-1" disabled={isPending} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" type="text" required className="mt-1" disabled={isPending} />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Work Email *</Label>
                <Input id="email" name="email" type="email" required className="mt-1" disabled={isPending} />
              </div>

              <div>
                <Label htmlFor="company">Company *</Label>
                <Input id="company" name="company" type="text" required className="mt-1" disabled={isPending} />
              </div>

              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input id="jobTitle" name="jobTitle" type="text" required className="mt-1" disabled={isPending} />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" className="mt-1" disabled={isPending} />
              </div>

              <div>
                <Label htmlFor="companySize">Company Size *</Label>
                <Select name="companySize" disabled={isPending}>
                  <SelectTrigger className="mt-1">
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

              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select name="industry" required disabled={isPending}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="financial-services">Financial Services</SelectItem>
                    <SelectItem value="professional-services">Professional Services</SelectItem>
                    <SelectItem value="construction">Construction</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currentArVolume">Current Monthly AR Volume</Label>
                <Select name="currentArVolume" disabled={isPending}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select monthly AR volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-100k">Under $100K</SelectItem>
                    <SelectItem value="100k-500k">$100K - $500K</SelectItem>
                    <SelectItem value="500k-1m">$500K - $1M</SelectItem>
                    <SelectItem value="1m-5m">$1M - $5M</SelectItem>
                    <SelectItem value="5m-10m">$5M - $10M</SelectItem>
                    <SelectItem value="over-10m">Over $10M</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="currentChallenges">Current AR Challenges (Optional)</Label>
                <Textarea
                  id="currentChallenges"
                  name="currentChallenges"
                  rows={3}
                  placeholder="Tell us about your current accounts receivable challenges..."
                  className="mt-1"
                  disabled={isPending}
                />
              </div>

              <div>
                <Label htmlFor="timeframe">Implementation Timeframe</Label>
                <Select name="timeframe" disabled={isPending}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="When are you looking to implement?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (within 30 days)</SelectItem>
                    <SelectItem value="1-3-months">1-3 months</SelectItem>
                    <SelectItem value="3-6-months">3-6 months</SelectItem>
                    <SelectItem value="6-12-months">6-12 months</SelectItem>
                    <SelectItem value="exploring">Just exploring options</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Recaptcha
                onVerify={setRecaptchaToken}
                onExpire={() => setRecaptchaToken("")}
                onError={() => setRecaptchaToken("")}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {isPending ? "Scheduling..." : "Schedule Demo"}
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
