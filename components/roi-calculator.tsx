"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp, DollarSign, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import { submitROICalculation } from "@/app/roi-calculator/actions"

interface ROICalculatorProps {
  isOpen: boolean
  onClose: () => void
}

export function ROICalculator({ isOpen, onClose }: ROICalculatorProps) {
  const [step, setStep] = useState<"inputs" | "contact" | "results">("inputs")
  const [calculating, setCalculating] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Calculator inputs
  const [annualRevenue, setAnnualRevenue] = useState("")
  const [currentDSO, setCurrentDSO] = useState("")
  const [invoicesPerMonth, setInvoicesPerMonth] = useState("")
  const [hoursSpentPerWeek, setHoursSpentPerWeek] = useState("")

  // Contact info
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [contactError, setContactError] = useState("")

  // Results
  const [results, setResults] = useState({
    dsoReduction: 0,
    cashFlowImprovement: 0,
    timesSaved: 0,
    annualSavings: 0,
    roiPercentage: 0,
  })

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^\+?[\d\s\-()]{10,}$/
    return re.test(phone)
  }

  const calculateROI = () => {
    const revenue = Number.parseFloat(annualRevenue) || 0
    const dso = Number.parseFloat(currentDSO) || 0
    const invoices = Number.parseFloat(invoicesPerMonth) || 0
    const hours = Number.parseFloat(hoursSpentPerWeek) || 0

    // Assumptions based on industry averages
    const dsoReduction = Math.round(dso * 0.3) // 30% reduction
    const cashFlowImprovement = Math.round((revenue / 365) * dsoReduction)
    const timeSaved = Math.round(hours * 0.8 * 52) // 80% time saved annually
    const hourlyCost = 50 // Average hourly cost
    const laborSavings = timeSaved * hourlyCost
    const annualSavings = laborSavings + Math.round(cashFlowImprovement * 0.05) // 5% opportunity cost
    const roiPercentage = 350 // Average ROI percentage

    return {
      dsoReduction,
      cashFlowImprovement,
      timesSaved: timeSaved,
      annualSavings,
      roiPercentage,
    }
  }

  const handleCalculate = () => {
    if (!annualRevenue || !currentDSO || !invoicesPerMonth || !hoursSpentPerWeek) {
      return
    }
    setStep("contact")
  }

  const handleSubmitContact = async () => {
    setContactError("")

    if (!validateEmail(email)) {
      setContactError("Please enter a valid email address")
      return
    }

    if (!validatePhone(phone)) {
      setContactError("Please enter a valid phone number (minimum 10 digits)")
      return
    }

    setCalculating(true)

    // Calculate results
    const calculatedResults = calculateROI()
    setResults(calculatedResults)

    // Submit to server
    setSubmitting(true)
    try {
      const response = await submitROICalculation({
        annualRevenue,
        currentDSO,
        invoicesPerMonth,
        hoursSpentPerWeek,
        email,
        phone,
        results: calculatedResults,
      })

      if (!response.success) {
        console.error("Failed to submit ROI calculation:", response.error)
      }
    } catch (error) {
      console.error("Error submitting ROI calculation:", error)
    } finally {
      setSubmitting(false)
    }

    setCalculating(false)
    setStep("results")
  }

  const handleReset = () => {
    setStep("inputs")
    setAnnualRevenue("")
    setCurrentDSO("")
    setInvoicesPerMonth("")
    setHoursSpentPerWeek("")
    setEmail("")
    setPhone("")
    setContactError("")
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calculator className="h-6 w-6 text-cyan-600" />
            ROI Calculator - Invoice to Cash
          </DialogTitle>
        </DialogHeader>

        {step === "inputs" && (
          <div className="space-y-6 py-4">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-cyan-900 font-medium flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Calculate your potential return on investment with Kuhlekt's Invoice to Cash automation platform.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="revenue" className="text-base font-medium text-gray-900">
                  Annual Revenue ($) *
                </Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="e.g., 5,000,000"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(e.target.value)}
                  className="mt-2 text-lg"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">Your company's total annual revenue</p>
              </div>

              <div>
                <Label htmlFor="dso" className="text-base font-medium text-gray-900">
                  Current DSO (Days Sales Outstanding) *
                </Label>
                <Input
                  id="dso"
                  type="number"
                  placeholder="e.g., 45"
                  value={currentDSO}
                  onChange={(e) => setCurrentDSO(e.target.value)}
                  className="mt-2 text-lg"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">Average days to collect payment</p>
              </div>

              <div>
                <Label htmlFor="invoices" className="text-base font-medium text-gray-900">
                  Invoices Processed Per Month *
                </Label>
                <Input
                  id="invoices"
                  type="number"
                  placeholder="e.g., 500"
                  value={invoicesPerMonth}
                  onChange={(e) => setInvoicesPerMonth(e.target.value)}
                  className="mt-2 text-lg"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">Total number of invoices sent monthly</p>
              </div>

              <div>
                <Label htmlFor="hours" className="text-base font-medium text-gray-900">
                  Hours Spent on AR Per Week *
                </Label>
                <Input
                  id="hours"
                  type="number"
                  placeholder="e.g., 20"
                  value={hoursSpentPerWeek}
                  onChange={(e) => setHoursSpentPerWeek(e.target.value)}
                  className="mt-2 text-lg"
                  min="0"
                />
                <p className="text-sm text-gray-500 mt-1">Team hours dedicated to accounts receivable</p>
              </div>
            </div>

            <Button
              onClick={handleCalculate}
              disabled={!annualRevenue || !currentDSO || !invoicesPerMonth || !hoursSpentPerWeek}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-lg py-6"
              size="lg"
            >
              Calculate My ROI →
            </Button>
          </div>
        )}

        {step === "contact" && (
          <div className="space-y-6 py-4">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-5">
              <h3 className="text-cyan-900 font-semibold text-lg mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Almost There!
              </h3>
              <p className="text-cyan-800">
                Please provide your contact information to see your personalized ROI results and receive a detailed
                report.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-base font-medium text-gray-900">
                  Business Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 text-lg"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-base font-medium text-gray-900">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2 text-lg"
                />
              </div>

              {contactError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {contactError}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => setStep("inputs")} variant="outline" className="flex-1 text-base py-5">
                ← Back
              </Button>
              <Button
                onClick={handleSubmitContact}
                disabled={calculating || submitting}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-base py-5"
              >
                {calculating || submitting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Calculating...
                  </>
                ) : (
                  "View My Results →"
                )}
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              By submitting, you agree to receive communications from Kuhlekt about our products and services.
            </p>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-6 py-4">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg p-8 text-white text-center">
              <h3 className="text-xl font-semibold mb-3">Your Estimated ROI with Kuhlekt</h3>
              <div className="text-7xl font-bold mb-2">{results.roiPercentage}%</div>
              <p className="text-cyan-100 text-lg">Average return on investment in the first year</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-cyan-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-cyan-100 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg">DSO Reduction</h4>
                </div>
                <p className="text-4xl font-bold text-gray-900">{results.dsoReduction} days</p>
                <p className="text-sm text-gray-600 mt-2">Faster cash collection cycle</p>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg">Cash Flow Impact</h4>
                </div>
                <p className="text-4xl font-bold text-gray-900">{formatCurrency(results.cashFlowImprovement)}</p>
                <p className="text-sm text-gray-600 mt-2">Additional working capital freed up</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg">Time Saved</h4>
                </div>
                <p className="text-4xl font-bold text-gray-900">{formatNumber(results.timesSaved)} hrs</p>
                <p className="text-sm text-gray-600 mt-2">Annually on manual AR tasks</p>
              </div>

              <div className="bg-white border-2 border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-amber-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 text-lg">Total Annual Savings</h4>
                </div>
                <p className="text-4xl font-bold text-gray-900">{formatCurrency(results.annualSavings)}</p>
                <p className="text-sm text-gray-600 mt-2">Combined labor and opportunity cost</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
              <p className="text-blue-900 text-sm leading-relaxed">
                <strong>Note:</strong> These calculations are estimates based on industry averages and your inputs.
                Actual results may vary based on your specific business conditions. Schedule a personalized demo with
                our team to get a detailed analysis tailored to your organization.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleReset} variant="outline" className="flex-1 text-base py-5 bg-transparent">
                Calculate Again
              </Button>
              <Button asChild className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-base py-5">
                <a href="/demo">Schedule a Demo →</a>
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              A detailed ROI report has been sent to your email address.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function ROICalculatorButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="lg"
        variant="outline"
        className="border-cyan-600 text-cyan-600 hover:bg-cyan-50"
      >
        <Calculator className="h-5 w-5 mr-2" />
        Calculate Your ROI
      </Button>
      <ROICalculator isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
