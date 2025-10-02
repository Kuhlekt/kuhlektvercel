"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react"

interface ROICalculatorProps {
  isOpen: boolean
  onClose: () => void
}

export function ROICalculator({ isOpen, onClose }: ROICalculatorProps) {
  const [step, setStep] = useState<"inputs" | "contact" | "results">("inputs")
  const [calculating, setCalculating] = useState(false)

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
    const re = /^\+?[\d\s-()]{10,}$/
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
    const annualSavings = laborSavings + cashFlowImprovement * 0.05 // 5% opportunity cost
    const roiPercentage = 350 // Average ROI percentage

    setResults({
      dsoReduction,
      cashFlowImprovement,
      timesSaved: timeSaved,
      annualSavings,
      roiPercentage,
    })
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
      setContactError("Please enter a valid phone number")
      return
    }

    setCalculating(true)

    // Simulate API call to save contact info
    await new Promise((resolve) => setTimeout(resolve, 1000))

    calculateROI()
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
            <p className="text-gray-600">
              Calculate your potential return on investment with Kuhlekt's Invoice to Cash automation platform.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="revenue" className="text-base font-medium">
                  Annual Revenue ($)
                </Label>
                <Input
                  id="revenue"
                  type="number"
                  placeholder="e.g., 5000000"
                  value={annualRevenue}
                  onChange={(e) => setAnnualRevenue(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="dso" className="text-base font-medium">
                  Current DSO (Days Sales Outstanding)
                </Label>
                <Input
                  id="dso"
                  type="number"
                  placeholder="e.g., 45"
                  value={currentDSO}
                  onChange={(e) => setCurrentDSO(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="invoices" className="text-base font-medium">
                  Invoices Processed Per Month
                </Label>
                <Input
                  id="invoices"
                  type="number"
                  placeholder="e.g., 500"
                  value={invoicesPerMonth}
                  onChange={(e) => setInvoicesPerMonth(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="hours" className="text-base font-medium">
                  Hours Spent on AR Per Week
                </Label>
                <Input
                  id="hours"
                  type="number"
                  placeholder="e.g., 20"
                  value={hoursSpentPerWeek}
                  onChange={(e) => setHoursSpentPerWeek(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <Button
              onClick={handleCalculate}
              disabled={!annualRevenue || !currentDSO || !invoicesPerMonth || !hoursSpentPerWeek}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              size="lg"
            >
              Calculate ROI
            </Button>
          </div>
        )}

        {step === "contact" && (
          <div className="space-y-6 py-4">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-cyan-900 font-medium">
                Please provide your contact information to see your personalized ROI results.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-base font-medium">
                  Business Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-base font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2"
                />
              </div>

              {contactError && <p className="text-red-600 text-sm">{contactError}</p>}
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep("inputs")} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmitContact}
                disabled={calculating}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {calculating ? "Calculating..." : "View Results"}
              </Button>
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="space-y-6 py-4">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-6 border border-cyan-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Potential ROI</h3>
              <div className="text-5xl font-bold text-cyan-600">{results.roiPercentage}%</div>
              <p className="text-gray-600 mt-2">Average return on investment in the first year</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-cyan-100 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-cyan-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">DSO Reduction</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">{results.dsoReduction} days</p>
                <p className="text-sm text-gray-600 mt-1">Faster cash collection</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Cash Flow Impact</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(results.cashFlowImprovement)}</p>
                <p className="text-sm text-gray-600 mt-1">Additional working capital</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Time Saved</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">{results.timesSaved} hrs</p>
                <p className="text-sm text-gray-600 mt-1">Per year on manual tasks</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-amber-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Annual Savings</h4>
                </div>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(results.annualSavings)}</p>
                <p className="text-sm text-gray-600 mt-1">Combined cost reduction</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-900 text-sm">
                <strong>Note:</strong> These calculations are estimates based on industry averages and your inputs.
                Actual results may vary. Schedule a demo to get a personalized analysis from our team.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                Calculate Again
              </Button>
              <Button asChild className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white">
                <a href="/demo">Schedule a Demo</a>
              </Button>
            </div>
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
