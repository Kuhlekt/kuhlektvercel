"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp, DollarSign, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { submitROICalculator } from "@/app/roi-calculator/actions"

interface ROICalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = "calculator-type" | "simple-inputs" | "detailed-inputs" | "contact" | "results"
type CalculatorType = "simple" | "detailed"

export function ROICalculatorModal({ isOpen, onClose }: ROICalculatorModalProps) {
  const [step, setStep] = useState<Step>("calculator-type")
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("simple")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simple calculator inputs
  const [currentDSO, setCurrentDSO] = useState("")
  const [averageInvoiceValue, setAverageInvoiceValue] = useState("")
  const [monthlyInvoices, setMonthlyInvoices] = useState("")

  // Detailed calculator inputs
  const [annualRevenue, setAnnualRevenue] = useState("")
  const [invoicesPerMonth, setInvoicesPerMonth] = useState("")
  const [averagePaymentDays, setAveragePaymentDays] = useState("")
  const [arTeamSize, setArTeamSize] = useState("")
  const [avgHourlyRate, setAvgHourlyRate] = useState("")
  const [hoursPerWeekOnAR, setHoursPerWeekOnAR] = useState("")
  const [badDebtPercentage, setBadDebtPercentage] = useState("")

  // Contact info
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Results
  const [results, setResults] = useState<any>(null)

  const resetForm = () => {
    setStep("calculator-type")
    setCalculatorType("simple")
    setCurrentDSO("")
    setAverageInvoiceValue("")
    setMonthlyInvoices("")
    setAnnualRevenue("")
    setInvoicesPerMonth("")
    setAveragePaymentDays("")
    setArTeamSize("")
    setAvgHourlyRate("")
    setHoursPerWeekOnAR("")
    setBadDebtPercentage("")
    setEmail("")
    setPhone("")
    setResults(null)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleCalculatorTypeSelect = (type: CalculatorType) => {
    setCalculatorType(type)
    setStep(type === "simple" ? "simple-inputs" : "detailed-inputs")
  }

  const handleInputsNext = () => {
    setStep("contact")
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^[\d\s\-+$$$$]+$/.test(phone) && phone.replace(/\D/g, "").length >= 10
  }

  const handleContactSubmit = async () => {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address")
      return
    }

    if (!validatePhone(phone)) {
      alert("Please enter a valid phone number")
      return
    }

    setIsSubmitting(true)

    const data =
      calculatorType === "simple"
        ? {
            currentDSO: Number.parseFloat(currentDSO),
            averageInvoiceValue: Number.parseFloat(averageInvoiceValue),
            monthlyInvoices: Number.parseFloat(monthlyInvoices),
            email,
            phone,
            calculatorType,
          }
        : {
            annualRevenue: Number.parseFloat(annualRevenue),
            invoicesPerMonth: Number.parseFloat(invoicesPerMonth),
            averagePaymentDays: Number.parseFloat(averagePaymentDays),
            arTeamSize: Number.parseFloat(arTeamSize),
            avgHourlyRate: Number.parseFloat(avgHourlyRate),
            hoursPerWeekOnAR: Number.parseFloat(hoursPerWeekOnAR),
            badDebtPercentage: Number.parseFloat(badDebtPercentage),
            email,
            phone,
            calculatorType,
          }

    const response = await submitROICalculator(data)

    setIsSubmitting(false)

    if (response.success && response.results) {
      setResults(response.results)
      setStep("results")
    } else {
      alert(response.error || "Something went wrong. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="h-6 w-6 text-cyan-600" />
            ROI Calculator
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Calculator Type Selection */}
        {step === "calculator-type" && (
          <div className="space-y-6 py-4">
            <p className="text-gray-600 text-center">Choose your calculator type:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => handleCalculatorTypeSelect("simple")}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-cyan-100 p-2 rounded-lg">
                    <Calculator className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Simple ROI</h3>
                </div>
                <p className="text-sm text-gray-600">Quick calculation based on DSO and invoice data</p>
              </button>

              <button
                onClick={() => handleCalculatorTypeSelect("detailed")}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-cyan-100 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Detailed Analysis</h3>
                </div>
                <p className="text-sm text-gray-600">Comprehensive analysis with team costs and efficiency metrics</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2a: Simple Calculator Inputs */}
        {step === "simple-inputs" && (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentDSO">Current DSO (Days Sales Outstanding)</Label>
                <Input
                  id="currentDSO"
                  type="number"
                  placeholder="e.g., 45"
                  value={currentDSO}
                  onChange={(e) => setCurrentDSO(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="averageInvoiceValue">Average Invoice Value ($)</Label>
                <Input
                  id="averageInvoiceValue"
                  type="number"
                  placeholder="e.g., 5000"
                  value={averageInvoiceValue}
                  onChange={(e) => setAverageInvoiceValue(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="monthlyInvoices">Monthly Invoices</Label>
                <Input
                  id="monthlyInvoices"
                  type="number"
                  placeholder="e.g., 100"
                  value={monthlyInvoices}
                  onChange={(e) => setMonthlyInvoices(e.target.value)}
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("calculator-type")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleInputsNext}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                disabled={!currentDSO || !averageInvoiceValue || !monthlyInvoices}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2b: Detailed Calculator Inputs */}
        {step === "detailed-inputs" && (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
                <Input
                  id="annualRevenue"
                  type="number"
                  placeholder="e.g., 10000000"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="invoicesPerMonth">Invoices Per Month</Label>
                <Input
                  id="invoicesPerMonth"
                  type="number"
                  placeholder="e.g., 500"
                  value={invoicesPerMonth}
                  onChange={(e) => setInvoicesPerMonth(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="averagePaymentDays">Average Payment Days (Current DSO)</Label>
                <Input
                  id="averagePaymentDays"
                  type="number"
                  placeholder="e.g., 45"
                  value={averagePaymentDays}
                  onChange={(e) => setAveragePaymentDays(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="arTeamSize">AR Team Size</Label>
                <Input
                  id="arTeamSize"
                  type="number"
                  placeholder="e.g., 5"
                  value={arTeamSize}
                  onChange={(e) => setArTeamSize(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="avgHourlyRate">Average Hourly Rate ($)</Label>
                <Input
                  id="avgHourlyRate"
                  type="number"
                  placeholder="e.g., 50"
                  value={avgHourlyRate}
                  onChange={(e) => setAvgHourlyRate(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="hoursPerWeekOnAR">Hours Per Week on AR Tasks</Label>
                <Input
                  id="hoursPerWeekOnAR"
                  type="number"
                  placeholder="e.g., 40"
                  value={hoursPerWeekOnAR}
                  onChange={(e) => setHoursPerWeekOnAR(e.target.value)}
                  min="0"
                />
              </div>

              <div>
                <Label htmlFor="badDebtPercentage">Bad Debt Percentage (%)</Label>
                <Input
                  id="badDebtPercentage"
                  type="number"
                  placeholder="e.g., 2"
                  value={badDebtPercentage}
                  onChange={(e) => setBadDebtPercentage(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("calculator-type")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleInputsNext}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                disabled={
                  !annualRevenue ||
                  !invoicesPerMonth ||
                  !averagePaymentDays ||
                  !arTeamSize ||
                  !avgHourlyRate ||
                  !hoursPerWeekOnAR ||
                  !badDebtPercentage
                }
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Contact Information */}
        {step === "contact" && (
          <div className="space-y-6 py-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">See Your Results</h3>
              <p className="text-gray-600">Enter your contact information to view your personalized ROI analysis</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(calculatorType === "simple" ? "simple-inputs" : "detailed-inputs")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleContactSubmit}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                disabled={isSubmitting || !email || !phone}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  "View Results"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === "results" && results && (
          <div className="space-y-6 py-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Your Personalized ROI Analysis</h3>
              <p className="text-gray-600">Here's what Kuhlekt can do for your business</p>
            </div>

            {calculatorType === "simple" ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg text-center border-2 border-cyan-200">
                  <p className="text-sm text-gray-600 mb-2">Estimated Annual Savings</p>
                  <p className="text-4xl font-bold text-cyan-600">
                    ${results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-cyan-600" />
                      <p className="font-semibold">Cash Released</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      <p className="font-semibold">New DSO</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{results.newDSO?.toFixed(0)} days</p>
                    <p className="text-sm text-green-600">30% improvement</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg text-center border-2 border-cyan-200">
                  <p className="text-sm text-gray-600 mb-2">Projected ROI</p>
                  <p className="text-5xl font-bold text-cyan-600">{results.roi?.toFixed(0)}%</p>
                  <p className="text-sm text-gray-600 mt-2">Payback in {results.paybackMonths?.toFixed(1)} months</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      <p className="font-semibold">DSO Reduction</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{results.dsoReductionDays?.toFixed(0)} days</p>
                    <p className="text-sm text-gray-600">{results.dsoReduction?.toFixed(0)}% improvement</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-cyan-600" />
                      <p className="font-semibold">Cash Flow Improvement</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${results.cashFlowImprovement?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-cyan-600" />
                      <p className="font-semibold">Time Savings</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {results.timeSavingsHours?.toLocaleString(undefined, { maximumFractionDigits: 0 })} hrs
                    </p>
                    <p className="text-sm text-gray-600">
                      ${results.timeSavingsDollars?.toLocaleString(undefined, { maximumFractionDigits: 0 })} saved
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                      <p className="font-semibold">Total Annual Benefit</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      ${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                Calculate Again
              </Button>
              <Button onClick={handleClose} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                Schedule a Demo
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
