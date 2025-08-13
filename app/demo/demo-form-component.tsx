"use client"

import { useState, useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { submitDemoRequest } from "./actions"
import { ReCaptcha } from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")

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

            <form action={formAction} className="space-y-6">
              <input type="hidden" name="recaptcha-token" value={recaptchaToken} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className={state.errors?.firstName ? "border-red-500" : ""}
                  />
                  {state.errors?.firstName && <p className="text-red-500 text-sm mt-1">{state.errors.firstName}</p>}
                </div>

                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className={state.errors?.lastName ? "border-red-500" : ""}
                  />
                  {state.errors?.lastName && <p className="text-red-500 text-sm mt-1">{state.errors.lastName}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Business Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={state.errors?.email ? "border-red-500" : ""}
                />
                {state.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  className={state.errors?.company ? "border-red-500" : ""}
                />
                {state.errors?.company && <p className="text-red-500 text-sm mt-1">{state.errors.company}</p>}
              </div>

              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  type="text"
                  required
                  className={state.errors?.jobTitle ? "border-red-500" : ""}
                />
                {state.errors?.jobTitle && <p className="text-red-500 text-sm mt-1">{state.errors.jobTitle}</p>}
              </div>

              <div>
                <Label htmlFor="companySize">Company Size *</Label>
                <Select name="companySize" required>
                  <SelectTrigger className={state.errors?.companySize ? "border-red-500" : ""}>
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
                {state.errors?.companySize && <p className="text-red-500 text-sm mt-1">{state.errors.companySize}</p>}
              </div>

              <div>
                <Label htmlFor="currentSolution">Current AR Solution</Label>
                <Select name="currentSolution">
                  <SelectTrigger>
                    <SelectValue placeholder="Select current solution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spreadsheets">Spreadsheets</SelectItem>
                    <SelectItem value="quickbooks">QuickBooks</SelectItem>
                    <SelectItem value="sap">SAP</SelectItem>
                    <SelectItem value="oracle">Oracle</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="none">No current solution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="timeline">Implementation Timeline</Label>
                <Select name="timeline">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate (within 1 month)</SelectItem>
                    <SelectItem value="quarter">This quarter (1-3 months)</SelectItem>
                    <SelectItem value="half-year">Next 6 months</SelectItem>
                    <SelectItem value="year">Within a year</SelectItem>
                    <SelectItem value="exploring">Just exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="challenges">Current AR Challenges (Optional)</Label>
                <Input
                  id="challenges"
                  name="challenges"
                  type="text"
                  placeholder="e.g., Late payments, manual processes, lack of visibility"
                />
              </div>

              <ReCaptcha onVerify={setRecaptchaToken} />

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Request Demo"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
