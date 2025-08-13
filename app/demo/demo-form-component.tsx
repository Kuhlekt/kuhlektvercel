"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, ArrowRight } from "lucide-react"
import { submitDemoRequest } from "./actions"
import ReCAPTCHA from "@/components/recaptcha"

export function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, null)
  const [captchaToken, setCaptchaToken] = useState<string>("")

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Request a Demo</h1>
            <p className="text-xl text-gray-600">See how Kuhlekt can transform your accounts receivable process</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Demo Request Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" type="text" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" type="text" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="businessEmail">Business Email *</Label>
                  <Input id="businessEmail" name="businessEmail" type="email" required />
                </div>

                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input id="companyName" name="companyName" type="text" required />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input id="phoneNumber" name="phoneNumber" type="tel" required />
                </div>

                <div>
                  <Label htmlFor="arChallenges">Current AR Challenges (Optional)</Label>
                  <Textarea id="arChallenges" name="arChallenges" rows={4} />
                </div>

                <div>
                  <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                  <Input id="affiliateCode" name="affiliateCode" type="text" />
                </div>

                <ReCAPTCHA onVerify={setCaptchaToken} />

                {state?.success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{state.message}</AlertDescription>
                  </Alert>
                )}

                {state?.success === false && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{state.message}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={isPending || !captchaToken} className="w-full">
                  {isPending ? (
                    "Submitting..."
                  ) : (
                    <>
                      Request Demo <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <input type="hidden" name="captchaToken" value={captchaToken} />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
