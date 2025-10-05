"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, TrendingUp, Clock, DollarSign, CheckCircle, ArrowRight, Mail, Phone, Building } from "lucide-react"
import { ROICalculatorHelpModal } from "@/components/roi-calculator-help-modal"

interface ROICalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ROIResults {
  annualSavings: number
  timeRecovered: number
  dsoReduction: number
  cashFlowImprovement: number
  roi: number
  paybackPeriod: number
}

export function ROICalculatorModal({ isOpen, onClose }: ROICalculatorModalProps) {
  const [step, setStep] = useState(1)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

  // Calculator inputs
  const [annualRevenue, setAnnualRevenue] = useState("")
  const [currentDSO, setCurrentDSO] = useState("")
  const [monthlyInvoices, setMonthlyInvoices] = useState("")
  const [arTeamSize, setArTeamSize] = useState("")
  const [avgHourlyRate, setAvgHourlyRate] = useState("")

  // Contact form inputs
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [company, setCompany] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [generatedCode, setGeneratedCode] = useState("")

  // Results
  const [results, setResults] = useState<ROIResults | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setAnnualRevenue("")
      setCurrentDSO("")
      setMonthlyInvoices("")
      setArTeamSize("")
      setAvgHourlyRate("")
      setFirstName("")
      setLastName("")
      setEmail("")
      setPhone("")
      setCompany("")
      setVerificationCode("")
      setGeneratedCode("")
      setResults(null)
      setError("")
    }
  }, [isOpen])

  const calculateROI = () => {
    const revenue = Number.parseFloat(annualRevenue)
    const dso = Number.parseFloat(currentDSO)
    const invoices = Number.parseFloat(monthlyInvoices)
    const teamSize = Number.parseFloat(arTeamSize)
    const hourlyRate = Number.parseFloat(avgHourlyRate)

    // Calculate time savings (80% reduction in manual tasks)
    const hoursPerInvoice = 0.5 // Estimated hours per invoice manually
    const currentMonthlyHours = invoices * hoursPerInvoice
    const timeSaved = currentMonthlyHours * 0.8
    const annualTimeSaved = timeSaved * 12
    const laborSavings = annualTimeSaved * hourlyRate

    // Calculate DSO improvement (30% reduction)
    const dsoImprovement = dso * 0.3
    const dailyRevenue = revenue / 365
    const cashFlowImprovement = dailyRevenue * dsoImprovement

    // Total annual savings
    const annualSavings = laborSavings + cashFlowImprovement

    // ROI calculation (assuming $30k annual software cost)
    const softwareCost = 30000
    const roi = ((annualSavings - softwareCost) / softwareCost) * 100
    const paybackPeriod = softwareCost / (annualSavings / 12)

    setResults({
      annualSavings: Math.round(annualSavings),
      timeRecovered: Math.round(annualTimeSaved),
      dsoReduction: Math.round(dsoImprovement),
      cashFlowImprovement: Math.round(cashFlowImprovement),
      roi: Math.round(roi),
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    })

    setStep(2)
  }

  const handleContactSubmit = async () => {
    setError("")
    setIsSubmitting(true)

    try {
      // Generate verification code
      const codeResponse = await fetch("/api/verification-code/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!codeResponse.ok) {
        throw new Error("Failed to generate verification code")
      }

      const { code } = await codeResponse.json()
      setGeneratedCode(code)
      setStep(3)
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerificationSubmit = async () => {
    setError("")
    setIsSubmitting(true)

    try {
      // Verify code
      const verifyResponse = await fetch("/api/verification-code/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: verificationCode }),
      })

      if (!verifyResponse.ok) {
        throw new Error("Invalid verification code")
      }

      // Send ROI report email
      const emailResponse = await fetch("/api/roi-calculator/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          company,
          results,
          inputs: {
            annualRevenue,
            currentDSO,
            monthlyInvoices,
            arTeamSize,
            avgHourlyRate,
          },
        }),
      })

      if (!emailResponse.ok) {
        throw new Error("Failed to send ROI report")
      }

      setStep(4)
    } catch (err) {
      setError("Invalid verification code. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isCalculatorFormValid = () => {
    return annualRevenue && currentDSO && monthlyInvoices && arTeamSize && avgHourlyRate
  }

  const isContactFormValid = () => {
    return firstName && lastName && email && phone && company
  }

  const renderCalculatorForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="annualRevenue" className="text-base font-semibold">
            Annual Revenue ($)
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="ml-2 text-cyan-500 hover:text-cyan-600 text-sm font-normal"
            >
              Need help?
            </button>
          </Label>
          <Input
            id="annualRevenue"
            type="number"
            placeholder="e.g., 5000000"
            value={annualRevenue}
            onChange={(e) => setAnnualRevenue(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="currentDSO" className="text-base font-semibold">
            Current Days Sales Outstanding (DSO)
          </Label>
          <Input
            id="currentDSO"
            type="number"
            placeholder="e.g., 45"
            value={currentDSO}
            onChange={(e) => setCurrentDSO(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="monthlyInvoices" className="text-base font-semibold">
            Monthly Invoices Processed
          </Label>
          <Input
            id="monthlyInvoices"
            type="number"
            placeholder="e.g., 500"
            value={monthlyInvoices}
            onChange={(e) => setMonthlyInvoices(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="arTeamSize" className="text-base font-semibold">
            AR Team Size
          </Label>
          <Input
            id="arTeamSize"
            type="number"
            placeholder="e.g., 3"
            value={arTeamSize}
            onChange={(e) => setArTeamSize(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="avgHourlyRate" className="text-base font-semibold">
            Average Hourly Rate ($)
          </Label>
          <Input
            id="avgHourlyRate"
            type="number"
            placeholder="e.g., 45"
            value={avgHourlyRate}
            onChange={(e) => setAvgHourlyRate(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <Button
        onClick={calculateROI}
        disabled={!isCalculatorFormValid()}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
        size="lg"
      >
        Calculate My ROI
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )

  const renderResults = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-cyan-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-8 h-8 text-cyan-500" />
              <h3 className="text-sm font-medium text-gray-600">Annual Savings</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">${results?.annualSavings.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <h3 className="text-sm font-medium text-gray-600">ROI</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{results?.roi}%</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-8 h-8 text-blue-500" />
              <h3 className="text-sm font-medium text-gray-600">Time Recovered</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{results?.timeRecovered.toLocaleString()} hrs/year</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="w-8 h-8 text-purple-500" />
              <h3 className="text-sm font-medium text-gray-600">Payback Period</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{results?.paybackPeriod} months</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Benefits</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
              <p className="text-gray-700">
                <span className="font-semibold">{results?.dsoReduction} days</span> reduction in DSO
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
              <p className="text-gray-700">
                <span className="font-semibold">${results?.cashFlowImprovement.toLocaleString()}</span> cash flow
                improvement
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
              <p className="text-gray-700">
                <span className="font-semibold">80%</span> reduction in manual collection tasks
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
          Recalculate
        </Button>
        <Button onClick={() => setStep(2.5)} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
          Get Detailed Report
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )

  const renderContactForm = () => (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-shrink-0 mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Almost there!</h3>
        <p className="text-gray-600 mt-1">Enter your details to receive your detailed ROI report</p>
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        <div className="space-y-4 pb-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@company.com"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="company" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Company Name *
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Corporation"
              className="mt-1"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-shrink-0 pt-4 space-y-3">
        <Button
          onClick={handleContactSubmit}
          disabled={!isContactFormValid() || isSubmitting}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          size="lg"
        >
          {isSubmitting ? "Sending..." : "Continue"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button onClick={() => setStep(2)} variant="outline" className="w-full">
          Back to Results
        </Button>
      </div>
    </div>
  )

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Mail className="w-16 h-16 text-cyan-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h3>
        <p className="text-gray-600">
          We've sent a verification code to <span className="font-semibold">{email}</span>
        </p>
      </div>

      <div>
        <Label htmlFor="verificationCode">Enter Verification Code</Label>
        <Input
          id="verificationCode"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter 6-digit code"
          className="mt-2 text-center text-2xl tracking-widest"
          maxLength={6}
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleVerificationSubmit}
          disabled={verificationCode.length !== 6 || isSubmitting}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
          size="lg"
        >
          {isSubmitting ? "Verifying..." : "Verify & Get Report"}
        </Button>
        <Button onClick={() => setStep(2.5)} variant="outline" className="w-full">
          Back
        </Button>
      </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="space-y-6 text-center py-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-500" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
        <p className="text-gray-600">
          Your detailed ROI report has been sent to <span className="font-semibold">{email}</span>
        </p>
      </div>

      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200">
        <CardContent className="p-6 text-left">
          <h4 className="font-semibold text-gray-900 mb-3">What's Next?</h4>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">Check your email for the detailed ROI analysis</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">Our team will reach out to discuss your results</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">Schedule a personalized demo to see Kuhlekt in action</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={onClose} className="w-full bg-cyan-500 hover:bg-cyan-600 text-white" size="lg">
        Close
      </Button>
    </div>
  )

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-6 h-6 text-cyan-500" />
              ROI Calculator
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            {step === 1 && renderCalculatorForm()}
            {step === 2 && renderResults()}
            {step === 2.5 && renderContactForm()}
            {step === 3 && renderVerification()}
            {step === 4 && renderSuccess()}
          </div>
        </DialogContent>
      </Dialog>

      <ROICalculatorHelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </>
  )
}
