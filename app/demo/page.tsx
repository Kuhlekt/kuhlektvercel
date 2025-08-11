"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recaptcha } from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"
import { useActionState } from "react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function DemoPage() {
  const [state, formAction] = useActionState(submitDemoRequest, null)
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">Free Demo</Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">See Kuhlekt in Action</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule a personalized demo to see how Kuhlekt can transform your accounts receivable process and reduce
            DSO by up to 40%.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Demo Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Schedule a Demonstration</h2>
              <p className="text-lg text-gray-600 mb-8">
                See how Kuhlekt can transform your accounts receivable process with a personalized demo.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">See how to automate your collections process</h3>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Learn how to reduce DSO by 30%</h3>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Discover how to eliminate 80% of manual tasks</h3>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Get a personalized walkthrough of our platform</h3>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <p className="text-gray-600 font-medium">Join 500+ finance teams already using Kuhlekt</p>
            </div>
          </div>

          {/* Right Column - Demo Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Request Your Demo</CardTitle>
            </CardHeader>
            <CardContent>
              <form id="demo-form" action={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="email">Business Email *</Label>
                  <Input id="email" name="email" type="email" required className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input id="company" name="company" type="text" required className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" name="jobTitle" type="text" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select name="companySize">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
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
                  {isPending ? "Scheduling Demo..." : "Schedule My Demo"}
                </Button>

                {state?.success && <div className="text-green-600 text-center font-medium">{state.message}</div>}

                {state?.error && <div className="text-red-600 text-center">{state.message}</div>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
