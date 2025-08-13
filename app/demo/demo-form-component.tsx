"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle } from "lucide-react"
import { ReCaptcha } from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export function DemoFormComponent() {
  const [state, formAction, isPending] = useActionState(submitDemoRequest, initialState)
  const [recaptchaToken, setRecaptchaToken] = useState<string>("")

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Request a Demo</CardTitle>
              <CardDescription className="text-center">
                See how Kuhlekt can transform your accounts receivable process
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state?.success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{state.message}</AlertDescription>
                </Alert>
              )}

              {state?.message && !state?.success && (
                <Alert className="mb-6 border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{state.message}</AlertDescription>
                </Alert>
              )}

              <form action={formAction} className="space-y-6">
                <input type="hidden" name="recaptchaToken" value={recaptchaToken} />

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className={state?.errors?.firstName ? "border-red-500" : ""}
                    />
                    {state?.errors?.firstName && <p className="text-sm text-red-600 mt-1">{state.errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className={state?.errors?.lastName ? "border-red-500" : ""}
                    />
                    {state?.errors?.lastName && <p className="text-sm text-red-600 mt-1">{state.errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={state?.errors?.email ? "border-red-500" : ""}
                  />
                  {state?.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" className={state?.errors?.phone ? "border-red-500" : ""} />
                  {state?.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className={state?.errors?.company ? "border-red-500" : ""}
                  />
                  {state?.errors?.company && <p className="text-sm text-red-600 mt-1">{state.errors.company}</p>}
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    type="text"
                    required
                    className={state?.errors?.jobTitle ? "border-red-500" : ""}
                  />
                  {state?.errors?.jobTitle && <p className="text-sm text-red-600 mt-1">{state.errors.jobTitle}</p>}
                </div>

                <div>
                  <Label htmlFor="companySize">Company Size *</Label>
                  <Select name="companySize" required>
                    <SelectTrigger className={state?.errors?.companySize ? "border-red-500" : ""}>
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
                  {state?.errors?.companySize && (
                    <p className="text-sm text-red-600 mt-1">{state.errors.companySize}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="currentSolution">Current AR Solution</Label>
                  <Input
                    id="currentSolution"
                    name="currentSolution"
                    type="text"
                    placeholder="e.g., Excel, QuickBooks, SAP, etc."
                    className={state?.errors?.currentSolution ? "border-red-500" : ""}
                  />
                  {state?.errors?.currentSolution && (
                    <p className="text-sm text-red-600 mt-1">{state.errors.currentSolution}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="timeline">Implementation Timeline</Label>
                  <Select name="timeline">
                    <SelectTrigger className={state?.errors?.timeline ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (within 1 month)</SelectItem>
                      <SelectItem value="1-3months">1-3 months</SelectItem>
                      <SelectItem value="3-6months">3-6 months</SelectItem>
                      <SelectItem value="6months+">6+ months</SelectItem>
                      <SelectItem value="exploring">Just exploring</SelectItem>
                    </SelectContent>
                  </Select>
                  {state?.errors?.timeline && <p className="text-sm text-red-600 mt-1">{state.errors.timeline}</p>}
                </div>

                <div>
                  <Label htmlFor="challenges">Current AR Challenges</Label>
                  <Textarea
                    id="challenges"
                    name="challenges"
                    placeholder="Tell us about your current accounts receivable challenges..."
                    rows={4}
                    className={state?.errors?.challenges ? "border-red-500" : ""}
                  />
                  {state?.errors?.challenges && <p className="text-sm text-red-600 mt-1">{state.errors.challenges}</p>}
                </div>

                <div>
                  <Label htmlFor="affiliateCode">Affiliate Code (Optional)</Label>
                  <Input
                    id="affiliateCode"
                    name="affiliateCode"
                    type="text"
                    placeholder="Enter affiliate code if you have one"
                    className={state?.errors?.affiliateCode ? "border-red-500" : ""}
                  />
                  {state?.errors?.affiliateCode && (
                    <p className="text-sm text-red-600 mt-1">{state.errors.affiliateCode}</p>
                  )}
                </div>

                <ReCaptcha onVerify={setRecaptchaToken} />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Submitting..." : "Request Demo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
