"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReCAPTCHA from "@/components/recaptcha"
import { submitDemoRequest } from "./actions"
import { validateAffiliateCode, formatDiscountText } from "@/lib/affiliate-validation"
import { CheckCircle, XCircle, Users, Building, Star, Gift, Crown, Calendar, Clock, Zap } from "lucide-react"

const initialState = {
  success: false,
  message: "",
  errors: {},
}

export default function DemoPage() {
  const [state, formAction] = useFormState(submitDemoRequest, initialState)
  const [isPending, setIsPending] = useState(false)
  const [recaptchaToken, setRecaptchaToken] = useState("")
  const [affiliateCode, setAffiliateCode] = useState("")
  const [affiliateValidation, setAffiliateValidation] = useState<{
    isValid: boolean
    discount: number
    category?: string
    description?: string
  } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true)
    formData.append("recaptchaToken", recaptchaToken)
    await formAction(formData)
    setIsPending(false)
  }

  const handleAffiliateChange = (value: string) => {
    setAffiliateCode(value)
    if (value.trim()) {
      const validation = validateAffiliateCode(value)
      if (validation) {
        setAffiliateValidation({
          isValid: true,
          discount: validation.discount,
          category: validation.category,
          description: validation.description,
        })
      } else {
        setAffiliateValidation({
          isValid: false,
          discount: 0,
        })
      }
    } else {
      setAffiliateValidation(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "startup":
        return <Users className="w-4 h-4" />
      case "industry":
        return <Building className="w-4 h-4" />
      case "partner":
        return <Star className="w-4 h-4" />
      case "promotional":
        return <Gift className="w-4 h-4" />
      case "vip":
        return <Crown className="w-4 h-4" />
      default:
        return null
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "startup":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "industry":
        return "bg-green-100 text-green-800 border-green-200"
      case "partner":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "promotional":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "vip":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Demo Request Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Request a Demo
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  See how Kuhlekt can transform your accounts receivable process in just 30 minutes.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {state.success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{state.message}</AlertDescription>
                  </Alert>
                )}

                {state.message && !state.success && (
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{state.message}</AlertDescription>
                  </Alert>
                )}

                <form action={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="John"
                      />
                      {state.errors?.firstName && <p className="text-sm text-red-600">{state.errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Doe"
                      />
                      {state.errors?.lastName && <p className="text-sm text-red-600">{state.errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Business Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="john@company.com"
                    />
                    {state.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                        Company Name *
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        required
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Acme Corp"
                      />
                      {state.errors?.company && <p className="text-sm text-red-600">{state.errors.company}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="+1 (555) 123-4567"
                      />
                      {state.errors?.phone && <p className="text-sm text-red-600">{state.errors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                      Job Title *
                    </Label>
                    <Input
                      id="jobTitle"
                      name="jobTitle"
                      required
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      placeholder="CFO, Finance Manager, etc."
                    />
                    {state.errors?.jobTitle && <p className="text-sm text-red-600">{state.errors.jobTitle}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companySize" className="text-sm font-medium text-gray-700">
                        Company Size *
                      </Label>
                      <Select name="companySize" required>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                          <SelectItem value="1000+">1,000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                      {state.errors?.companySize && <p className="text-sm text-red-600">{state.errors.companySize}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
                        Industry *
                      </Label>
                      <Select name="industry" required>
                        <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {state.errors?.industry && <p className="text-sm text-red-600">{state.errors.industry}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentArVolume" className="text-sm font-medium text-gray-700">
                      Monthly AR Volume *
                    </Label>
                    <Select name="currentArVolume" required>
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
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
                    {state.errors?.currentArVolume && (
                      <p className="text-sm text-red-600">{state.errors.currentArVolume}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="preferredTime" className="text-sm font-medium text-gray-700">
                      Preferred Demo Time
                    </Label>
                    <Select name="preferredTime">
                      <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM EST)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 5 PM EST)</SelectItem>
                        <SelectItem value="evening">Evening (5 PM - 7 PM EST)</SelectItem>
                        <SelectItem value="flexible">I'm flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="affiliateCode" className="text-sm font-medium text-gray-700">
                      Affiliate/Promo Code
                    </Label>
                    <div className="relative">
                      <Input
                        id="affiliateCode"
                        name="affiliateCode"
                        value={affiliateCode}
                        onChange={(e) => handleAffiliateChange(e.target.value)}
                        className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                        placeholder="Enter code for special pricing"
                      />
                      {affiliateValidation && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {affiliateValidation.isValid ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {affiliateValidation && (
                      <div className="mt-2">
                        {affiliateValidation.isValid ? (
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${getCategoryColor(affiliateValidation.category || "")} flex items-center gap-1`}
                            >
                              {getCategoryIcon(affiliateValidation.category || "")}
                              {formatDiscountText(affiliateValidation.discount)}
                            </Badge>
                            <span className="text-sm text-green-600">{affiliateValidation.description}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-red-600">Invalid affiliate code</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specificInterests" className="text-sm font-medium text-gray-700">
                      Specific Areas of Interest
                    </Label>
                    <Textarea
                      id="specificInterests"
                      name="specificInterests"
                      rows={3}
                      className="border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      placeholder="What specific AR challenges would you like to see addressed in the demo? (e.g., automated dunning, cash application, customer portal, etc.)"
                    />
                  </div>

                  <div className="space-y-4">
                    <ReCAPTCHA onVerify={setRecaptchaToken} />
                    {state.errors?.recaptcha && <p className="text-sm text-red-600">{state.errors.recaptcha}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending || !recaptchaToken}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isPending ? "Scheduling Demo..." : "Schedule My Demo"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Demo Information */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-700">30-Minute Session</h4>
                    <p className="text-sm text-gray-600">Focused demo tailored to your specific needs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-700">Live Platform Tour</h4>
                    <p className="text-sm text-gray-600">See real automation workflows in action</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-700">ROI Analysis</h4>
                    <p className="text-sm text-gray-600">Custom ROI calculation for your business</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-700">Q&A Session</h4>
                    <p className="text-sm text-gray-600">Get answers to your specific questions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Demo Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-700">Automated Dunning</h4>
                    <p className="text-sm text-gray-600">See intelligent collection workflows</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-700">Cash Application</h4>
                    <p className="text-sm text-gray-600">AI-powered payment matching</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-700">Customer Portal</h4>
                    <p className="text-sm text-gray-600">Self-service payment options</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-700">Real-time Analytics</h4>
                    <p className="text-sm text-gray-600">DSO tracking and insights</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Affiliate Code Categories */}
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800">Special Demo Offers</CardTitle>
                <CardDescription>Have a promo code? Enter it above for exclusive pricing!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Startup Discounts</span>
                  <Badge variant="outline" className="text-xs">
                    10-15% off
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Industry Rates</span>
                  <Badge variant="outline" className="text-xs">
                    15-25% off
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Partner Pricing</span>
                  <Badge variant="outline" className="text-xs">
                    20-30% off
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Promotional Offers</span>
                  <Badge variant="outline" className="text-xs">
                    15-35% off
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">VIP Rates</span>
                  <Badge variant="outline" className="text-xs">
                    30-50% off
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
