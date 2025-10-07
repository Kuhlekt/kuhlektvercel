"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, TrendingUp, DollarSign, Calendar, FileText, Download } from "lucide-react"
import { calculateSimpleROI, calculateDetailedROI } from "@/app/roi-calculator/actions"
import { ROIReportPDF } from "./roi-report-pdf"
import { pdf } from "@react-pdf/renderer"

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
      let calculatedResults
      if (calculatorType === "simple") {
        calculatedResults = await calculateSimpleROI(simpleInputs)
      } else {
        calculatedResults = await calculateDetailedROI(detailedInputs)
      }
      setResults(calculatedResults)
      setStep("contact")
    } catch (error) {
      console.error("Error calculating ROI:", error)
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

  const handleDownloadPDF = async () => {
    try {
      const inputs = calculatorType === "simple" ? simpleInputs : detailedInputs
      const blob = await pdf(
        <ROIReportPDF contactInfo={contactInfo} calculatorType={calculatorType} inputs={inputs} results={results} />,
      ).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Kuhlekt-ROI-Report-${new Date().toISOString().split("T")[0]}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
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
    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
      <div className="text-center sticky top-0 bg-white pb-4 z-10">
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

      <div className="flex justify-between sticky bottom-0 bg-white pt-4">
        <Button variant="outline" onClick={() => setStep("type")}>
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

  const renderSimpleResults = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your ROI Results</h3>
        <p className="text-gray-600">Based on your inputs, here's what you could save</p>
      </div>

      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Estimated Annual Savings</p>
            <p className="text-4xl font-bold text-cyan-600">
              ${results?.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-cyan-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">DSO Improvement</p>
                <p className="text-2xl font-bold">
                  {results?.currentDSO?.toFixed(0)} → {results?.newDSO?.toFixed(0)} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Cash Released</p>
                <p className="text-2xl font-bold text-green-600">
                  ${results?.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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

      <div className="space-y-3">
        <div className="p-4 bg-cyan-50 rounded-lg border-2 border-cyan-200">
          <Button onClick={handleDownloadPDF} className="w-full bg-transparent" size="lg" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
        </div>

        <Button onClick={handleSendReport} disabled={isSendingReport} className="w-full" size="lg">
          {isSendingReport ? "Sending..." : "Email Me This Report"}
        </Button>
      </div>

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

  const renderDetailedResults = () => (
    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
      <div className="text-center sticky top-0 bg-white pb-4 z-10">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Comprehensive ROI Analysis</h3>
        <p className="text-gray-600">Detailed breakdown of your potential returns</p>
      </div>

      <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Total Annual Benefit</p>
            <p className="text-4xl font-bold text-cyan-600">
              ${results?.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cyan-200">
            <div className="text-center">
              <p className="text-sm text-gray-600">ROI</p>
              <p className="text-2xl font-bold text-green-600">{results?.roi?.toFixed(0)}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Payback Period</p>
              <p className="text-2xl font-bold">{results?.paybackMonths?.toFixed(1)} months</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Key Benefits</h4>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-cyan-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">DSO Improvement</p>
                <p className="text-xl font-bold">{results?.dsoReductionDays?.toFixed(0)} days reduction</p>
                <p className="text-sm text-gray-500">
                  From {results?.currentDSO?.toFixed(0)} to {results?.newDSO?.toFixed(0)} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-green-600 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">Working Capital Released</p>
                <p className="text-xl font-bold text-green-600">
                  ${results?.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Interest Savings</p>
              <p className="text-lg font-bold text-green-600">
                ${results?.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Labour Cost Savings</p>
              <p className="text-lg font-bold text-green-600">
                ${results?.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Bad Debt Reduction</p>
              <p className="text-lg font-bold text-green-600">
                ${results?.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Investment Required</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Implementation</p>
              <p className="text-lg font-bold">
                ${results?.implementationCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">Annual Cost</p>
              <p className="text-lg font-bold">
                ${results?.annualCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-1">First Year Total</p>
              <p className="text-lg font-bold">
                ${results?.totalFirstYearCost?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

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

      <div className="space-y-3 sticky bottom-0 bg-white pt-4">
        <div className="p-4 bg-cyan-50 rounded-lg border-2 border-cyan-200">
          <Button onClick={handleDownloadPDF} className="w-full bg-transparent" size="lg" variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download PDF Report
          </Button>
        </div>

        <Button onClick={handleSendReport} disabled={isSendingReport} className="w-full" size="lg">
          {isSendingReport ? "Sending..." : "Email Me This Report"}
        </Button>
      </div>

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

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetModal()
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>ROI Calculator</DialogTitle>
        </DialogHeader>

        {step === "type" && renderTypeSelection()}
        {step === "form" && (calculatorType === "simple" ? renderSimpleForm() : renderDetailedForm())}
        {step === "contact" && renderContactForm()}
        {step === "verify" && renderVerification()}
        {step === "results" && (calculatorType === "simple" ? renderSimpleResults() : renderDetailedResults())}
      </DialogContent>
    </Dialog>
  )
}
