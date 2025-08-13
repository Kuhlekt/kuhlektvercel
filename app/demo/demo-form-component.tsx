"use client"

import { useState, useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { submitDemoRequest } from "./actions"
import { ReCaptcha } from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState)
  const [captchaToken, setCaptchaToken] = useState<string>("")

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token || "")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Request a Demo</CardTitle>
            <CardDescription className="text-lg text-gray-600">
              See how Kuhlekt can transform your accounts receivable process
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state?.success ? (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{state.message}</AlertDescription>
              </Alert>
            ) : state?.message ? (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{state.message}</AlertDescription>
              </Alert>
            ) : null}

            <form action={formAction} className="space-y-6">
              <input type="hidden" name="captchaToken" value={captchaToken} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" type="text" required className="w-full" disabled={isPending} />
                  {state?.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" type="text" required className="w-full" disabled={isPending} />
                  {state?.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Business Email *</Label>
                <Input id="email" name="email" type="email" required className="w-full" disabled={isPending} />
                {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input id="company" name="company" type="text" required className="w-full" disabled={isPending} />
                {state?.errors?.company && <p className="text-sm text-red-600">{state.errors.company}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input id="jobTitle" name="jobTitle" type="text" required className="w-full" disabled={isPending} />
                {state?.errors?.jobTitle && <p className="text-sm text-red-600">{state.errors.jobTitle}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size *</Label>
                <Select name="companySize" required disabled={isPending}>
                  <SelectTrigger className="w-full">
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
                {state?.errors?.companySize && <p className="text-sm text-red-600">{state.errors.companySize}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSolution">Current AR Solution</Label>
                <Input
                  id="currentSolution"
                  name="currentSolution"
                  type="text"
                  placeholder="e.g., Excel, QuickBooks, SAP, etc."
                  className="w-full"
                  disabled={isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Implementation Timeline</Label>
                <Select name="timeline" disabled={isPending}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (within 1 month)</SelectItem>
                    <SelectItem value="1-3months">1-3 months</SelectItem>
                    <SelectItem value="3-6months">3-6 months</SelectItem>
                    <SelectItem value="6-12months">6-12 months</SelectItem>
                    <SelectItem value="exploring">Just exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Current AR Challenges</Label>
                <Textarea
                  id="challenges"
                  name="challenges"
                  placeholder="Tell us about your current accounts receivable challenges..."
                  className="w-full min-h-[100px]"
                  disabled={isPending}
                />
              </div>

              <div className="flex justify-center">
                <ReCaptcha onChange={handleCaptchaChange} />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Request Demo"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
