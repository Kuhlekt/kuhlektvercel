"use client"

import { useFormState } from "react-dom"
import { submitDemoRequest } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Calendar, Clock, Users } from "lucide-react"
import { ReCaptcha } from "@/components/recaptcha"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoPage() {
  const [state, formAction, isPending] = useFormState(submitDemoRequest, initialState)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Request a Demo</h1>
          <p className="text-lg text-gray-600">
            See Kuhlekt's AR automation platform in action with a personalized demo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Benefits */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">30-Minute Session</h3>
                    <p className="text-sm text-gray-600">Focused demo tailored to your specific AR challenges</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Expert Guidance</h3>
                    <p className="text-sm text-gray-600">Led by our AR automation specialists</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Automated invoice processing
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Real-time payment tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Customer portal features
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Analytics and reporting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    Integration capabilities
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Demo Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule Your Demo</CardTitle>
              <CardDescription>
                Fill out the form below and we'll contact you to schedule your personalized demo
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" name="firstName" type="text" required className="mt-1" disabled={isPending} />
                    {state.errors?.firstName && <p className="text-sm text-red-600 mt-1">{state.errors.firstName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" name="lastName" type="text" required className="mt-1" disabled={isPending} />
                    {state.errors?.lastName && <p className="text-sm text-red-600 mt-1">{state.errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" name="email" type="email" required className="mt-1" disabled={isPending} />
                  {state.errors?.email && <p className="text-sm text-red-600 mt-1">{state.errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input id="company" name="company" type="text" required className="mt-1" disabled={isPending} />
                  {state.errors?.company && <p className="text-sm text-red-600 mt-1">{state.errors.company}</p>}
                </div>

                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input id="jobTitle" name="jobTitle" type="text" required className="mt-1" disabled={isPending} />
                  {state.errors?.jobTitle && <p className="text-sm text-red-600 mt-1">{state.errors.jobTitle}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" className="mt-1" disabled={isPending} />
                  {state.errors?.phone && <p className="text-sm text-red-600 mt-1">{state.errors.phone}</p>}
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
                  {state.errors?.companySize && <p className="text-sm text-red-600 mt-1">{state.errors.companySize}</p>}
                </div>

                <div>
                  <Label htmlFor="currentArSolution">Current AR Solution</Label>
                  <Select name="currentArSolution" disabled={isPending}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="What do you currently use?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual-process">Manual processes</SelectItem>
                      <SelectItem value="spreadsheets">Spreadsheets</SelectItem>
                      <SelectItem value="basic-accounting">Basic accounting software</SelectItem>
                      <SelectItem value="erp-system">ERP system</SelectItem>
                      <SelectItem value="other-ar-software">Other AR software</SelectItem>
                      <SelectItem value="none">No current solution</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timeframe">Implementation Timeframe</Label>
                  <Select name="timeframe" disabled={isPending}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="When are you looking to implement?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate (within 1 month)</SelectItem>
                      <SelectItem value="short-term">Short-term (1-3 months)</SelectItem>
                      <SelectItem value="medium-term">Medium-term (3-6 months)</SelectItem>
                      <SelectItem value="long-term">Long-term (6+ months)</SelectItem>
                      <SelectItem value="exploring">Just exploring options</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="specificInterests">Specific Areas of Interest</Label>
                  <Textarea
                    id="specificInterests"
                    name="specificInterests"
                    rows={3}
                    className="mt-1"
                    placeholder="Tell us about your specific AR challenges or areas you'd like to focus on during the demo..."
                    disabled={isPending}
                  />
                </div>

                <ReCaptcha />

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Request...
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
    </div>
  )
}
