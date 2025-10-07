"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, TrendingUp, Calendar, FileText } from "lucide-react"
import { calculateSimpleROI, calculateDetailedROI } from "@/app/roi-calculator/actions"
import { ROIReportPDF } from "./roi-report-pdf"

interface ROICalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

type CalculatorType = "simple" | "detailed"
type Step = "type" | "form" | "contact" | "verify" | "results"

export function ROICalculatorModal({ isOpen, onClose }: ROICalculatorModalProps) {
  const [step, setStep] = useState<Step>("type")
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("simple")
  const [isCalculating, setIsCalculating] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSendingReport, setIsSendingReport] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerified, setIsVerified] = useState(false)

  // Contact information
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
  })

  // Simple calculator inputs
  const [simpleInputs, setSimpleInputs] = useState({
    currentDSO: "",
    averageInvoiceValue: "",
    monthlyInvoices: "",
    simpleDSOImprovement: "15",
    simpleCostOfCapital: "8",
  })

  // Detailed calculator inputs
  const [detailedInputs, setDetailedInputs] = useState({
    implementationCost: "",
    monthlyCost: "",
    perAnnumDirectLabourCosts: "",
    interestType: "loan" as "loan" | "deposit",
    interestRate: "",
    averageBadDebt: "",
    currentBadDebts: "",
    labourSavings: "30",
    dsoImprovement: "20",
    currentDSODays: "",
    debtorsBalance: "",
    averagePaymentTerms: "net30" as "net30" | "net60" | "net90",
    numberOfDebtors: "",
    numberOfCollectors: "",
    projectedCustomerGrowth: "",
  })

  const [results, setResults] = useState<any>(null)

  const resetModal = () => {
    setStep("type")
    setCalculatorType("simple")
    setIsCalculating(false)
    setIsSendingCode(false)
    setIsVerifying(false)
    setIsSendingReport(false)
    setVerificationCode("")
    setIsVerified(false)
    setContactInfo({ name: "", email: "", company: "", phone: "" })
    setSimpleInputs({
      currentDSO: "",
      averageInvoiceValue: "",
      monthlyInvoices: "",
      simpleDSOImprovement: "15",
      simpleCostOfCapital: "8",
    })
    setDetailedInputs({
      implementationCost: "",
      monthlyCost: "",
      perAnnumDirectLabourCosts: "",
      interestType: "loan",
      interestRate: "",
      averageBadDebt: "",
      currentBadDebts: "",
      labourSavings: "30",
      dsoImprovement: "20",
      currentDSODays: "",
      debtorsBalance: "",
      averagePaymentTerms: "net30",
      numberOfDebtors: "",
      numberOfCollectors: "",
      projectedCustomerGrowth: "",
    })
    setResults(null)
  }

  const handleCalculate = async () => {
    setIsCalculating(true)
    try {
      console.log("[v0] Starting ROI calculation")
      console.log("[v0] Calculator type:", calculatorType)
      console.log("[v0] Inputs:", calculatorType === "simple" ? simpleInputs : detailedInputs)

      let calculatedResults
      if (calculatorType === "simple") {
        console.log("[v0] Calling calculateSimpleROI")
        calculatedResults = await calculateSimpleROI(simpleInputs)
      } else {
        console.log("[v0] Calling calculateDetailedROI")
        calculatedResults = await calculateDetailedROI(detailedInputs)
      }

      console.log("[v0] Calculation results:", calculatedResults)
      setResults(calculatedResults)
      setStep("contact")
    } catch (error) {
      console.error("[v0] Error calculating ROI:", error)
      console.error("[v0] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        calculatorType,
        inputs: calculatorType === "simple" ? simpleInputs : detailedInputs,
      })
      alert("Failed to calculate ROI. Please check your inputs and try again.")
    } finally {
      setIsCalculating(false)
    }
  }

  const handleSendVerificationCode = async () => {
    if (!contactInfo.email) {
      alert("Please enter your email address")
      return
    }

    setIsSendingCode(true)
    try {
      const response = await fetch("/api/verification-code/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contactInfo.email }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Verification code sent! Please check your email.")
        setStep("verify")
      } else {
        alert(data.error || "Failed to send verification code")
      }
    } catch (error) {
      console.error("Error sending verification code:", error)
      alert("Failed to send verification code. Please try again.")
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      alert("Please enter the 6-digit verification code")
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch("/api/verification-code/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contactInfo.email,
          code: verificationCode,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsVerified(true)
        setStep("results")
      } else {
        alert(data.error || "Invalid verification code")
      }
    } catch (error) {
      console.error("Error verifying code:", error)
      alert("Failed to verify code. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleSendReport = async () => {
    setIsSendingReport(true)
    try {
      console.log("=== Sending ROI Report ===")
      console.log("Contact Info:", contactInfo)
      console.log("Calculator Type:", calculatorType)
      console.log("Results:", results)

      const inputs = calculatorType === "simple" ? simpleInputs : detailedInputs

      const response = await fetch("/api/roi-calculator/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactInfo.name,
          email: contactInfo.email,
          company: contactInfo.company,
          phone: contactInfo.phone,
          calculatorType,
          inputs,
          results,
        }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (data.success) {
        alert("Report sent successfully! Check your email.")
      } else {
        alert(data.error || "Failed to send report")
      }
    } catch (error) {
      console.error("Error sending report:", error)
      alert("Failed to send report. Please try again.")
    } finally {
      setIsSendingReport(false)
    }
  }

  const renderTypeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Calculator</h3>
        <p className="text-gray-600">Select the calculator that best fits your needs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            calculatorType === "simple" ? "ring-2 ring-cyan-600" : ""
          }`}
          onClick={() => setCalculatorType("simple")}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Simple Calculator</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Quick estimate of potential savings based on DSO improvement
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 5 simple inputs</li>
                  <li>• Focus on cash flow</li>
                  <li>• 2-minute completion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-lg ${
            calculatorType === "detailed" ? "ring-2 ring-cyan-600" : ""
          }`}
          onClick={() => setCalculatorType("detailed")}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <FileText className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-2">Detailed Calculator</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive ROI analysis including implementation costs and multiple benefit streams
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Complete financial analysis</li>
                  <li>• ROI & payback period</li>
                  <li>• 5-minute completion</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setStep("form")} size="lg">
          Continue
        </Button>
      </div>
    </div>
  )

  const renderSimpleForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Simple ROI Calculator</h3>
        <p className="text-gray-600">Enter your current metrics to estimate potential savings</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="currentDSO">Current DSO (Days Sales Outstanding)</Label>
          <Input
            id="currentDSO"
            type="number"
            placeholder="e.g., 45"
            value={simpleInputs.currentDSO}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, currentDSO: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="averageInvoiceValue">Average Invoice Value ($)</Label>
          <Input
            id="averageInvoiceValue"
            type="number"
            placeholder="e.g., 5000"
            value={simpleInputs.averageInvoiceValue}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, averageInvoiceValue: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="monthlyInvoices">Number of Monthly Invoices</Label>
          <Input
            id="monthlyInvoices"
            type="number"
            placeholder="e.g., 100"
            value={simpleInputs.monthlyInvoices}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, monthlyInvoices: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="simpleDSOImprovement">Expected DSO Improvement (%)</Label>
          <Input
            id="simpleDSOImprovement"
            type="number"
            placeholder="e.g., 15"
            value={simpleInputs.simpleDSOImprovement}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, simpleDSOImprovement: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="simpleCostOfCapital">Cost of Capital (%)</Label>
          <Input
            id="simpleCostOfCapital"
            type="number"
            placeholder="e.g., 8"
            value={simpleInputs.simpleCostOfCapital}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, simpleCostOfCapital: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("type")}>
          Back
        </Button>
        <Button onClick={handleCalculate} disabled={isCalculating}>
          {isCalculating ? "Calculating..." : "Calculate ROI"}
        </Button>
      </div>
    </div>
  )

  const renderDetailedForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Detailed ROI Calculator</h3>
        <p className="text-gray-600">Complete analysis of your AR automation ROI</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Implementation Details</h4>
          <div>
            <Label htmlFor="implementationCost">Implementation Cost ($)</Label>
            <Input
              id="implementationCost"
              type="number"
              placeholder="e.g., 10000"
              value={detailedInputs.implementationCost}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, implementationCost: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="monthlyCost">Monthly Subscription Cost ($)</Label>
            <Input
              id="monthlyCost"
              type="number"
              placeholder="e.g., 500"
              value={detailedInputs.monthlyCost}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, monthlyCost: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Current Operations</h4>
          <div>
            <Label htmlFor="currentDSODays">Current DSO (Days)</Label>
            <Input
              id="currentDSODays"
              type="number"
              placeholder="e.g., 45"
              value={detailedInputs.currentDSODays}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, currentDSODays: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="debtorsBalance">Current Debtors Balance ($)</Label>
            <Input
              id="debtorsBalance"
              type="number"
              placeholder="e.g., 500000"
              value={detailedInputs.debtorsBalance}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, debtorsBalance: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="numberOfDebtors">Number of Debtors</Label>
            <Input
              id="numberOfDebtors"
              type="number"
              placeholder="e.g., 150"
              value={detailedInputs.numberOfDebtors}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, numberOfDebtors: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="numberOfCollectors">Number of Collectors</Label>
            <Input
              id="numberOfCollectors"
              type="number"
              placeholder="e.g., 3"
              value={detailedInputs.numberOfCollectors}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, numberOfCollectors: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="perAnnumDirectLabourCosts">Annual Direct Labour Costs ($)</Label>
            <Input
              id="perAnnumDirectLabourCosts"
              type="number"
              placeholder="e.g., 150000"
              value={detailedInputs.perAnnumDirectLabourCosts}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, perAnnumDirectLabourCosts: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Financial Details</h4>
          <div>
            <Label htmlFor="interestType">Interest Type</Label>
            <Select
              value={detailedInputs.interestType}
              onValueChange={(value: "loan" | "deposit") =>
                setDetailedInputs({ ...detailedInputs, interestType: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loan">Loan Interest</SelectItem>
                <SelectItem value="deposit">Deposit Interest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="interestRate">Interest Rate (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              placeholder="e.g., 6.5"
              value={detailedInputs.interestRate}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, interestRate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="currentBadDebts">Current Bad Debts (Annual $)</Label>
            <Input
              id="currentBadDebts"
              type="number"
              placeholder="e.g., 25000"
              value={detailedInputs.currentBadDebts}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, currentBadDebts: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="averageBadDebt">Average Bad Debt Rate (%)</Label>
            <Input
              id="averageBadDebt"
              type="number"
              step="0.1"
              placeholder="e.g., 2.5"
              value={detailedInputs.averageBadDebt}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, averageBadDebt: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Expected Improvements</h4>
          <div>
            <Label htmlFor="dsoImprovement">DSO Improvement (%)</Label>
            <Input
              id="dsoImprovement"
              type="number"
              placeholder="e.g., 20"
              value={detailedInputs.dsoImprovement}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, dsoImprovement: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="labourSavings">Labour Savings (%)</Label>
            <Input
              id="labourSavings"
              type="number"
              placeholder="e.g., 30"
              value={detailedInputs.labourSavings}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, labourSavings: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="projectedCustomerGrowth">Projected Customer Growth (%)</Label>
            <Input
              id="projectedCustomerGrowth"
              type="number"
              placeholder="e.g., 15"
              value={detailedInputs.projectedCustomerGrowth}
              onChange={(e) => setDetailedInputs({ ...detailedInputs, projectedCustomerGrowth: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="averagePaymentTerms">Average Payment Terms</Label>
            <Select
              value={detailedInputs.averagePaymentTerms}
              onValueChange={(value: "net30" | "net60" | "net90") =>
                setDetailedInputs({ ...detailedInputs, averagePaymentTerms: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="net30">Net 30</SelectItem>
                <SelectItem value="net60">Net 60</SelectItem>
                <SelectItem value="net90">Net 90</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep("form")}>
          Back
        </Button>
        <Button onClick={handleCalculate} disabled={isCalculating}>
          {isCalculating ? "Calculating..." : "Calculate ROI"}
        </Button>
      </div>
    </div>
  )

  const renderContactForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Your Results</h3>
        <p className="text-gray-600">Enter your details to receive your personalized ROI report</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Smith"
            value={contactInfo.name}
            onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@company.com"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            type="text"
            placeholder="Your Company Ltd"
            value={contactInfo.company}
            onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("form")}>
          Back
        </Button>
        <Button
          onClick={handleSendVerificationCode}
          disabled={isSendingCode || !contactInfo.name || !contactInfo.email}
        >
          {isSendingCode ? "Sending..." : "Continue"}
        </Button>
      </div>
    </div>
  )

  const renderVerification = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h3>
        <p className="text-gray-600">We've sent a 6-digit code to {contactInfo.email}</p>
      </div>

      <div>
        <Label htmlFor="verificationCode">Verification Code</Label>
        <Input
          id="verificationCode"
          type="text"
          placeholder="000000"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
          className="text-center text-2xl tracking-widest"
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep("contact")}>
          Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSendVerificationCode} disabled={isSendingCode}>
            {isSendingCode ? "Resending..." : "Resend Code"}
          </Button>
          <Button onClick={handleVerifyCode} disabled={isVerifying || verificationCode.length !== 6}>
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </div>
    </div>
  )

  const renderSimpleResults = () => {
    const currentDSO = Number.parseFloat(simpleInputs.currentDSO) || 45
    const averageInvoiceValue = Number.parseFloat(simpleInputs.averageInvoiceValue) || 5000
    const monthlyInvoices = Number.parseFloat(simpleInputs.monthlyInvoices) || 100
    const dsoImprovement = Number.parseFloat(simpleInputs.simpleDSOImprovement) || 15
    const costOfCapital = Number.parseFloat(simpleInputs.simpleCostOfCapital) || 8

    const annualRevenue = averageInvoiceValue * monthlyInvoices * 12
    const debtorsBalance = (annualRevenue / 365) * currentDSO
    const newDSO = currentDSO * (1 - dsoImprovement / 100)
    const dailyRevenue = annualRevenue / 365
    const workingCapitalReleased = (currentDSO - newDSO) * dailyRevenue
    const interestSavings = workingCapitalReleased * (costOfCapital / 100)

    // Estimate labour savings (30% of typical AR staff cost)
    const estimatedLabourCost = annualRevenue * 0.02 // 2% of revenue for AR operations
    const labourSavings = estimatedLabourCost * 0.3

    // Estimate bad debt reduction (50% reduction of typical 2% bad debt rate)
    const estimatedBadDebt = annualRevenue * 0.02
    const badDebtReduction = estimatedBadDebt * 0.5

    const totalAnnualBenefit = interestSavings + labourSavings + badDebtReduction
    const estimatedImplementationCost = 10000
    const estimatedMonthlyCost = 500
    const totalFirstYearInvestment = estimatedImplementationCost + estimatedMonthlyCost * 12
    const roi = ((totalAnnualBenefit - estimatedMonthlyCost * 12) / totalFirstYearInvestment) * 100
    const paybackMonths = totalFirstYearInvestment / (totalAnnualBenefit / 12)

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Projected ROI</h3>
          <p className="text-gray-600">Comprehensive breakdown of your investment returns</p>
        </div>

        {/* ROI and Payback Period */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">ROI</p>
                  <p className="text-3xl font-bold text-green-600">{roi.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500 mt-1">Return on Investment</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-red-600 mt-1" />
                <div>
                  <p className="text-sm text-gray-600">Payback Period</p>
                  <p className="text-3xl font-bold text-red-600">{paybackMonths.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">Months</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cash Flow Info */}
        <Card className="bg-cyan-50 border-cyan-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-cyan-900 mb-2">💰 Cash Flow Cost Savings</h4>
            <p className="text-sm text-cyan-800">
              Monthly Cash Flow improvements: ${Math.round(totalAnnualBenefit / 12).toLocaleString()} per month. This
              includes interest savings, labour cost reductions, and bad debt improvements.
            </p>
          </CardContent>
        </Card>

        {/* Current DSO Info */}
        <Card className="bg-cyan-50 border-cyan-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-semibold text-cyan-900 mb-2">📊 Current DSO</h4>
            <p className="text-sm text-cyan-800">
              Your current DSO of {currentDSO} days is the baseline metric. By improving DSO to {newDSO.toFixed(0)}{" "}
              days, you'll release ${workingCapitalReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })} in
              working capital.
            </p>
          </CardContent>
        </Card>

        {/* Payment Terms Impact Analysis */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-cyan-600">📋 Payment Terms Impact Analysis</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Payment Terms</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Current DSO</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Improved DSO</th>
                  <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Working Capital Released</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { term: "Net 30", multiplier: 1.0 },
                  { term: "Net 60", multiplier: 1.5 },
                  { term: "Net 90", multiplier: 2.0 },
                ].map((item, idx) => {
                  const termCurrentDSO = Math.round(currentDSO * item.multiplier)
                  const termImprovedDSO = Math.round(currentDSO * item.multiplier * (1 - dsoImprovement / 100))
                  const released = Math.round((termCurrentDSO - termImprovedDSO) * dailyRevenue)

                  return (
                    <tr key={idx} className={idx === 0 ? "bg-cyan-50" : ""}>
                      <td className="border border-gray-300 px-3 py-2 font-medium">
                        {item.term} {idx === 0 ? "(Typical)" : ""}
                      </td>
                      <td className="border border-gray-300 px-3 py-2">{termCurrentDSO} days</td>
                      <td className="border border-gray-300 px-3 py-2 text-green-600 font-semibold">
                        {termImprovedDSO} days
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-cyan-600 font-semibold">
                        ${released.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-2">
              Note: Actual DSO is typically 50% higher than normal payment terms. e.g., 30-day payment terms often
              results in 45-day DSO.
            </p>
          </div>
        </div>

        {/* Business Growth Without Additional Headcount */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-cyan-600">📈 Business Growth Without Additional Headcount</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Current Capacity</p>
                <p className="text-3xl font-bold text-gray-900">{monthlyInvoices}</p>
                <p className="text-xs text-gray-600 mt-1">invoices per month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-300">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">With Automation</p>
                <p className="text-3xl font-bold text-gray-900">{Math.round(monthlyInvoices * 1.3)}</p>
                <p className="text-xs text-gray-600 mt-1">invoices per month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Additional Capacity", value: `+${Math.round(monthlyInvoices * 0.3)}` },
              { label: "Growth Enabled", value: "30%" },
              { label: "Efficiency Gain", value: "30%" },
            ].map((metric, idx) => (
              <Card key={idx} className="bg-cyan-50 border-cyan-200">
                <CardContent className="p-3 text-center">
                  <p className="text-xs font-semibold text-cyan-900 uppercase mb-1">{metric.label}</p>
                  <p className="text-2xl font-bold text-cyan-600">{metric.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
            <CardContent className="p-4">
              <h5 className="text-sm font-semibold text-green-900 mb-3">✓ Growth Scenario: 50% Customer Increase</h5>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">New Invoices</p>
                  <p className="text-2xl font-bold text-green-600">{Math.round(monthlyInvoices * 0.5)}</p>
                </div>
                <div className="bg-white rounded p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Handled Without Hiring</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.min(Math.round(monthlyInvoices * 0.5), Math.round(monthlyInvoices * 0.3))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Assumptions */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-cyan-600">💡 Savings Assumptions</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">DSO Improvement</p>
                <p className="text-4xl font-bold text-gray-900">{dsoImprovement}%</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-300">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Bad Debt Reduction</p>
                <p className="text-4xl font-bold text-gray-900">50%</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Financial Impact */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-cyan-600">💰 Financial Impact</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-green-300">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-1">Annual Recurring Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalAnnualBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Interest + Labour + Bad Debt</p>
              </CardContent>
            </Card>
            <Card className="border-green-300">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-1">One-Time Cash Flow Boost</p>
                <p className="text-2xl font-bold text-green-600">
                  ${workingCapitalReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Working capital released</p>
              </CardContent>
            </Card>
            <Card className="border-green-300">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-1">Monthly Operational Savings</p>
                <p className="text-2xl font-bold text-green-600">
                  ${Math.round(totalAnnualBenefit / 12).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">Reduced labour costs</p>
              </CardContent>
            </Card>
            <Card className="border-red-300">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-1">Total First Year Investment</p>
                <p className="text-2xl font-bold text-red-600">-${totalFirstYearInvestment.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">Implementation + Annual cost</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* DSO Improvement */}
        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-cyan-600">📊 DSO Improvement</h4>
          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-300">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Current</p>
                <p className="text-3xl font-bold text-gray-900">{currentDSO}</p>
                <p className="text-xs text-gray-600 mt-1">days</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Improved</p>
                <p className="text-3xl font-bold text-gray-900">{newDSO.toFixed(0)}</p>
                <p className="text-xs text-gray-600 mt-1">days</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-300">
              <CardContent className="p-4 text-center">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Reduction</p>
                <p className="text-3xl font-bold text-gray-900">{(currentDSO - newDSO).toFixed(0)}</p>
                <p className="text-xs text-gray-600 mt-1">days faster</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary */}
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-300">
          <CardContent className="p-6">
            <h4 className="font-semibold text-lg text-cyan-900 mb-3">📝 Summary</h4>
            <div className="space-y-3 text-sm text-cyan-900">
              <p>
                By implementing the Kuhlekt invoice-to-cash platform with automated collection workflows and customer
                self-service, your organization can achieve a{" "}
                <strong className="text-cyan-600">{roi.toFixed(0)}% ROI</strong> within{" "}
                <strong className="text-cyan-600">{paybackMonths.toFixed(1)} months</strong>.
              </p>
              <p>
                You should expect to improve DSO by <strong className="text-cyan-600">{dsoImprovement}%</strong> (from{" "}
                {currentDSO} to {newDSO.toFixed(0)} days), freeing up{" "}
                <strong className="text-cyan-600">
                  ${workingCapitalReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </strong>{" "}
                in working capital without adding headcount.
              </p>
              <p>
                The total annual benefit of{" "}
                <strong className="text-cyan-600">
                  ${totalAnnualBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </strong>{" "}
                includes <strong>${interestSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> in
                interest savings,{" "}
                <strong>${labourSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> in labour cost
                reductions, and{" "}
                <strong>${badDebtReduction.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> in bad debt
                improvements.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900">
                <p className="font-semibold mb-1">Important Disclaimer</p>
                <p>
                  These calculations are estimates based on industry averages and the information you provided. Actual
                  results may vary depending on your specific business circumstances, implementation approach, and
                  market conditions. This calculator is for informational purposes only and should not be considered
                  financial advice. We recommend consulting with your financial advisor for detailed analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <div className="p-4 bg-cyan-50 rounded-lg border-2 border-cyan-200">
            <ROIReportPDF calculatorType={calculatorType} inputs={simpleInputs} results={results} />
          </div>

          <Button onClick={handleSendReport} disabled={isSendingReport} className="w-full" size="lg">
            {isSendingReport ? "Sending..." : "Email Me This Report"}
          </Button>
        </div>

        {/* What's Next */}
        <div className="text-center pt-4 border-t">
          <h4 className="font-semibold mb-2">What's Next?</h4>
          <p className="text-sm text-gray-600 mb-4">
            Ready to turn these projections into reality? Our team can show you exactly how Kuhlekt delivers these
            results.
          </p>
          <Button asChild variant="outline">
            <a href="/demo">Schedule a Demo</a>
          </Button>
        </div>
      </div>
    )
  }

  const renderDetailedResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Projected ROI</h3>
        <p className="text-gray-600">Comprehensive breakdown of your investment returns</p>
      </div>

      {/* ROI and Payback Period */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">ROI</p>
                <p className="text-3xl font-bold text-green-600">{results?.roi?.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Return on Investment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-red-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Payback Period</p>
                <p className="text-3xl font-bold text-red-600">{results?.paybackMonths?.toFixed(1)}</p>
                <p className="text-xs text-gray-500 mt-1">Months</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Info */}
      <Card className="bg-cyan-50 border-cyan-200">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-cyan-900 mb-2">💰 Cash Flow Cost Savings</h4>
          <p className="text-sm text-cyan-800">
            Monthly Cash Flow improvements: ${Math.round((results?.totalAnnualBenefit || 0) / 12).toLocaleString()} per
            month. This includes interest savings, labour cost reductions, and bad debt improvements.
          </p>
        </CardContent>
      </Card>

      {/* Current DSO Info */}
      <Card className="bg-cyan-50 border-cyan-200">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-cyan-900 mb-2">📊 Current DSO</h4>
          <p className="text-sm text-cyan-800">
            Your current DSO of {Number.parseFloat(detailedInputs.currentDSODays)} days is the baseline metric. By
            improving DSO to {results?.newDSO?.toFixed(0)} days, you'll release $
            {results?.workingCapitalReleased?.toLocaleString()} in working capital.
          </p>
        </CardContent>
      </Card>

      {/* Payment Terms Impact Analysis */}
      <div className="space-y-3">
        <h4 className="font-semibold text-lg text-cyan-600">📋 Payment Terms Impact Analysis</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Payment Terms</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Current DSO</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Improved DSO</th>
                <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Working Capital Released</th>
              </tr>
            </thead>
            <tbody>
              {[
                { term: "Net 30", multiplier: 1.0 },
                { term: "Net 60", multiplier: 1.5 },
                { term: "Net 90", multiplier: 2.0 },
              ].map((item, idx) => {
                const currentDSO = Number.parseFloat(detailedInputs.currentDSODays) || 45
                const dsoImprovement = Number.parseFloat(detailedInputs.dsoImprovement) || 20
                const debtorsBalance = Number.parseFloat(detailedInputs.debtorsBalance) || 0
                const dailyRevenue = debtorsBalance / currentDSO
                const termCurrentDSO = Math.round(currentDSO * item.multiplier)
                const termImprovedDSO = Math.round(currentDSO * item.multiplier * (1 - dsoImprovement / 100))
                const released = Math.round((termCurrentDSO - termImprovedDSO) * dailyRevenue)

                return (
                  <tr key={idx} className={idx === 0 ? "bg-cyan-50" : ""}>
                    <td className="border border-gray-300 px-3 py-2 font-medium">
                      {item.term} {idx === 0 ? "(Current)" : ""}
                    </td>
                    <td className="border border-gray-300 px-3 py-2">{termCurrentDSO} days</td>
                    <td className="border border-gray-300 px-3 py-2 text-green-600 font-semibold">
                      {termImprovedDSO} days
                    </td>
                    <td className="border border-gray-300 px-3 py-2 text-cyan-600 font-semibold">
                      ${released.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">
            Note: Actual DSO is typically 50% higher than normal payment terms. e.g., 30-day payment terms often results
            in 45-day DSO.
          </p>
        </div>
      </div>

      {/* Business Growth Without Additional Headcount */}
      <div className="space-y-3">
        <h4 className="font-semibold text-lg text-cyan-600">📈 Business Growth Without Additional Headcount</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Current Capacity</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(
                  (Number.parseFloat(detailedInputs.numberOfDebtors) || 0) /
                    (Number.parseFloat(detailedInputs.numberOfCollectors) || 1),
                )}
              </p>
              <p className="text-xs text-gray-600 mt-1">customers per collector</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-300">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">With Implementation</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(
                  ((Number.parseFloat(detailedInputs.numberOfDebtors) || 0) /
                    (Number.parseFloat(detailedInputs.numberOfCollectors) || 1)) *
                    (1 + (Number.parseFloat(detailedInputs.labourSavings) || 30) / 100),
                )}
              </p>
              <p className="text-xs text-gray-600 mt-1">customers per collector</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Additional Capacity (No New Hires)",
              value: Math.round(
                ((Number.parseFloat(detailedInputs.numberOfDebtors) || 0) /
                  (Number.parseFloat(detailedInputs.numberOfCollectors) || 1)) *
                  ((Number.parseFloat(detailedInputs.labourSavings) || 30) / 100),
              ),
            },
            { label: "Growth Enabled", value: `${Number.parseFloat(detailedInputs.labourSavings) || 30}%` },
            { label: "Efficiency Gain", value: `${Number.parseFloat(detailedInputs.labourSavings) || 30}%` },
          ].map((metric, idx) => (
            <Card key={idx} className="bg-cyan-50 border-cyan-200">
              <CardContent className="p-3 text-center">
                <p className="text-xs font-semibold text-cyan-900 uppercase mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {typeof metric.value === "number" ? `+${metric.value}` : metric.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
          <CardContent className="p-4">
            <h5 className="text-sm font-semibold text-green-900 mb-3">✓ Growth Scenario: 50% Customer Increase</h5>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">New Customers</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((Number.parseFloat(detailedInputs.numberOfDebtors) || 0) * 0.5)}
                </p>
              </div>
              <div className="bg-white rounded p-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Handled Without Hiring</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.min(
                    Math.round((Number.parseFloat(detailedInputs.numberOfDebtors) || 0) * 0.5),
                    Math.round(
                      ((Number.parseFloat(detailedInputs.numberOfDebtors) || 0) /
                        (Number.parseFloat(detailedInputs.numberOfCollectors) || 1)) *
                        ((Number.parseFloat(detailedInputs.labourSavings) || 30) / 100),
                    ),
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Assumptions */}
      <div className="space-y-3">
        <h4 className="font-semibold text-lg text-cyan-600">💡 Savings Assumptions</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">DSO Improvement</p>
              <p className="text-4xl font-bold text-gray-900">
                {Number.parseFloat(detailedInputs.dsoImprovement) || 20}%
              </p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-300">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Bad Debt Reduction</p>
              <p className="text-4xl font-bold text-gray-900">50%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Financial Impact */}
      <div className="space-y-3">
        <h4 className="font-semibold text-lg text-cyan-600">💰 Financial Impact</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-green-300">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Annual Recurring Savings</p>
              <p className="text-2xl font-bold text-green-600">${results?.totalAnnualBenefit?.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Interest + Labour + Bad Debt</p>
            </CardContent>
          </Card>
          <Card className="border-green-300">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">One-Time Cash Flow Boost</p>
              <p className="text-2xl font-bold text-green-600">${results?.workingCapitalReleased?.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Working capital released</p>
            </CardContent>
          </Card>
          <Card className="border-green-300">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Monthly Operational Savings</p>
              <p className="text-2xl font-bold text-green-600">
                ${Math.round((results?.totalAnnualBenefit || 0) / 12).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">Reduced labour costs</p>
            </CardContent>
          </Card>
          <Card className="border-red-300">
            <CardContent className="p-4">
              <p className="text-xs text-gray-600 mb-1">Total First Year Investment</p>
              <p className="text-2xl font-bold text-red-600">-${results?.totalFirstYearInvestment?.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Implementation + Annual cost</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DSO Improvement */}
      <div className="space-y-3">
        <h4 className="font-semibold text-lg text-cyan-600">📊 DSO Improvement</h4>
        <div className="grid grid-cols-3 gap-3">
          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-300">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Current</p>
              <p className="text-3xl font-bold text-gray-900">{results?.currentDSO?.toFixed(0)}</p>
              <p className="text-xs text-gray-600 mt-1">days</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-300">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Improved</p>
              <p className="text-3xl font-bold text-gray-900">{results?.newDSO?.toFixed(0)}</p>
              <p className="text-xs text-gray-600 mt-1">days</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-300">
            <CardContent className="p-4 text-center">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Reduction</p>
              <p className="text-3xl font-bold text-gray-900">{results?.dsoReductionDays?.toFixed(0)}</p>
              <p className="text-xs text-gray-600 mt-1">days faster</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-300">
        <CardContent className="p-6">
          <h4 className="font-semibold text-lg text-cyan-900 mb-3">📝 Summary</h4>
          <div className="space-y-3 text-sm text-cyan-900">
            <p>
              By implementing the Kuhlekt invoice-to-cash platform with automated collection workflows and customer
              self-service, your organization can achieve a{" "}
              <strong className="text-cyan-600">{results?.roi?.toFixed(0)}% ROI</strong> within{" "}
              <strong className="text-cyan-600">{results?.paybackMonths?.toFixed(1)} months</strong>.
            </p>
            <p>
              You should expect to improve DSO by{" "}
              <strong className="text-cyan-600">{Number.parseFloat(detailedInputs.dsoImprovement)}%</strong> (from{" "}
              {results?.currentDSO?.toFixed(0)} to {results?.newDSO?.toFixed(0)} days), freeing up{" "}
              <strong className="text-cyan-600">${results?.workingCapitalReleased?.toLocaleString()}</strong> in working
              capital without adding headcount.
            </p>
            <p>
              The total annual benefit of{" "}
              <strong className="text-cyan-600">${results?.totalAnnualBenefit?.toLocaleString()}</strong> includes{" "}
              <strong>${results?.interestSavings?.toLocaleString()}</strong> in interest savings,{" "}
              <strong>${results?.labourCostSavings?.toLocaleString()}</strong> in labour cost reductions, and{" "}
              <strong>${results?.badDebtReduction?.toLocaleString()}</strong> in bad debt improvements.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Important Disclaimer</p>
              <p>
                These calculations are estimates based on industry averages and the information you provided. Actual
                results may vary depending on your specific business circumstances, implementation approach, and market
                conditions. This calculator is for informational purposes only and should not be considered financial
                advice. We recommend consulting with your financial advisor for detailed analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="p-4 bg-cyan-50 rounded-lg border-2 border-cyan-200">
          <ROIReportPDF calculatorType={calculatorType} inputs={detailedInputs} results={results} />
        </div>

        <Button onClick={handleSendReport} disabled={isSendingReport} className="w-full" size="lg">
          {isSendingReport ? "Sending..." : "Email Me This Report"}
        </Button>
      </div>

      {/* What's Next */}
      <div className="text-center pt-4 border-t">
        <h4 className="font-semibold mb-2">What's Next?</h4>
        <p className="text-sm text-gray-600 mb-4">
          Ready to turn these projections into reality? Our team can show you exactly how Kuhlekt delivers these
          results.
        </p>
        <Button asChild variant="outline">
          <a href="/demo">Schedule a Demo</a>
        </Button>
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">ROI Calculator</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                resetModal()
                onClose()
              }}
            >
              ✕
            </Button>
          </div>

          {step === "type" && renderTypeSelection()}
          {step === "form" && (calculatorType === "simple" ? renderSimpleForm() : renderDetailedForm())}
          {step === "contact" && renderContactForm()}
          {step === "verify" && renderVerification()}
          {step === "results" && (calculatorType === "simple" ? renderSimpleResults() : renderDetailedResults())}
        </div>
      </div>
    </div>
  )
}
