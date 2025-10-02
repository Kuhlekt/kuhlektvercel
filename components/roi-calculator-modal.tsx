"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, ArrowRight, Calculator, HelpCircle, TrendingUp, DollarSign, Clock, Users } from "lucide-react"
import { calculateSimpleROI, calculateDetailedROI, sendROIEmail } from "@/app/roi-calculator/actions"
import { ROIReportPDF } from "./roi-report-pdf"
import { ROICalculatorHelpModal } from "./roi-calculator-help-modal"

interface ROICalculatorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultCalculator?: "simple" | "detailed"
}

export function ROICalculatorModal({ open, onOpenChange, defaultCalculator = "simple" }: ROICalculatorModalProps) {
  const [step, setStep] = useState<"select" | "simple-input" | "simple-result" | "detailed-input" | "detailed-result">(
    "select",
  )
  const [calculatorType, setCalculatorType] = useState<"simple" | "detailed">(defaultCalculator)
  const [helpOpen, setHelpOpen] = useState(false)

  // Simple Calculator State
  const [simpleInputs, setSimpleInputs] = useState({
    currentDSO: "",
    averageInvoiceValue: "",
    monthlyInvoices: "",
    simpleDSOImprovement: "20",
    simpleCostOfCapital: "8",
  })
  const [simpleResults, setSimpleResults] = useState<any>(null)

  // Detailed Calculator State
  const [detailedInputs, setDetailedInputs] = useState({
    implementationCost: "",
    monthlyCost: "",
    currentDSODays: "",
    debtorsBalance: "",
    interestType: "loan" as "loan" | "deposit",
    interestRate: "",
    perAnnumDirectLabourCosts: "",
    currentBadDebts: "",
    averageBadDebt: "",
    dsoImprovement: "",
    labourSavings: "",
    numberOfDebtors: "",
    numberOfCollectors: "",
    projectedCustomerGrowth: "",
    averagePaymentTerms: "net30" as "net30" | "net60" | "net90",
  })
  const [detailedResults, setDetailedResults] = useState<any>(null)

  // Email state
  const [emailInput, setEmailInput] = useState({
    name: "",
    email: "",
    company: "",
  })
  const [emailSent, setEmailSent] = useState(false)

  const resetCalculator = () => {
    setStep("select")
    setSimpleResults(null)
    setDetailedResults(null)
    setEmailSent(false)
    setEmailInput({ name: "", email: "", company: "" })
  }

  const handleCalculatorSelect = (type: "simple" | "detailed") => {
    setCalculatorType(type)
    setStep(type === "simple" ? "simple-input" : "detailed-input")
  }

  // Simple Calculator Logic
  const isSimpleFormValid = () => {
    return (
      simpleInputs.currentDSO &&
      simpleInputs.averageInvoiceValue &&
      simpleInputs.monthlyInvoices &&
      simpleInputs.simpleDSOImprovement &&
      simpleInputs.simpleCostOfCapital &&
      Number.parseFloat(simpleInputs.currentDSO) > 0 &&
      Number.parseFloat(simpleInputs.averageInvoiceValue) > 0 &&
      Number.parseFloat(simpleInputs.monthlyInvoices) > 0 &&
      Number.parseFloat(simpleInputs.simpleDSOImprovement) > 0 &&
      Number.parseFloat(simpleInputs.simpleCostOfCapital) > 0
    )
  }

  const handleSimpleCalculate = async () => {
    const results = await calculateSimpleROI(simpleInputs)
    setSimpleResults(results)
    setStep("simple-result")
  }

  // Detailed Calculator Logic
  const isDetailedFormValid = () => {
    return (
      detailedInputs.implementationCost &&
      detailedInputs.monthlyCost &&
      detailedInputs.currentDSODays &&
      detailedInputs.debtorsBalance &&
      detailedInputs.interestRate &&
      detailedInputs.perAnnumDirectLabourCosts &&
      detailedInputs.currentBadDebts &&
      detailedInputs.averageBadDebt &&
      detailedInputs.dsoImprovement &&
      detailedInputs.labourSavings &&
      detailedInputs.numberOfDebtors &&
      detailedInputs.numberOfCollectors &&
      detailedInputs.projectedCustomerGrowth &&
      Number.parseFloat(detailedInputs.implementationCost) >= 0 &&
      Number.parseFloat(detailedInputs.monthlyCost) > 0 &&
      Number.parseFloat(detailedInputs.currentDSODays) > 0 &&
      Number.parseFloat(detailedInputs.debtorsBalance) > 0 &&
      Number.parseFloat(detailedInputs.interestRate) > 0 &&
      Number.parseFloat(detailedInputs.perAnnumDirectLabourCosts) > 0 &&
      Number.parseFloat(detailedInputs.currentBadDebts) >= 0 &&
      Number.parseFloat(detailedInputs.averageBadDebt) >= 0 &&
      Number.parseFloat(detailedInputs.dsoImprovement) > 0 &&
      Number.parseFloat(detailedInputs.labourSavings) >= 0 &&
      Number.parseFloat(detailedInputs.numberOfDebtors) > 0 &&
      Number.parseFloat(detailedInputs.numberOfCollectors) > 0 &&
      Number.parseFloat(detailedInputs.projectedCustomerGrowth) >= 0
    )
  }

  const handleDetailedCalculate = async () => {
    const results = await calculateDetailedROI(detailedInputs)
    setDetailedResults(results)
    setStep("detailed-result")
  }

  // Email Logic
  const handleSendEmail = async () => {
    const isSimple = step === "simple-result"
    const results = isSimple ? simpleResults : detailedResults
    const inputs = isSimple ? simpleInputs : detailedInputs

    await sendROIEmail({
      ...emailInput,
      calculatorType: isSimple ? "simple" : "detailed",
      results,
      inputs,
    })

    setEmailSent(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-cyan-600" />
                ROI Calculator
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHelpOpen(true)}
                className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
            <DialogDescription>
              {step === "select" && "Choose the calculator that best fits your needs"}
              {step === "simple-input" && "Quick ROI calculation based on DSO improvement"}
              {step === "simple-result" && "Your estimated ROI results"}
              {step === "detailed-input" && "Comprehensive invoice-to-cash analysis"}
              {step === "detailed-result" && "Your detailed ROI analysis"}
            </DialogDescription>
          </DialogHeader>

          {/* Calculator Selection */}
          {step === "select" && (
            <div className="grid md:grid-cols-2 gap-6 py-6">
              <div
                onClick={() => handleCalculatorSelect("simple")}
                className="cursor-pointer border-2 border-gray-200 rounded-lg p-6 hover:border-cyan-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calculator className="h-8 w-8 text-cyan-600" />
                  <h3 className="text-xl font-semibold">Simple Calculator</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Quick estimate based on DSO improvement and working capital savings. Perfect for initial assessments.
                </p>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-600" />5 simple inputs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                    Instant results
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                    Focus on working capital
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700">Get Started</Button>
              </div>

              <div
                onClick={() => handleCalculatorSelect("detailed")}
                className="cursor-pointer border-2 border-gray-200 rounded-lg p-6 hover:border-cyan-500 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-cyan-600" />
                  <h3 className="text-xl font-semibold">Detailed Calculator</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Comprehensive analysis including labour savings, bad debt reduction, and full ROI breakdown.
                </p>
                <ul className="text-sm space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                    Complete financial picture
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                    Multi-factor analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-600" />
                    Payback period & ROI
                  </li>
                </ul>
                <Button className="w-full mt-6 bg-cyan-600 hover:bg-cyan-700">Get Started</Button>
              </div>
            </div>
          )}

          {/* Simple Calculator Input */}
          {step === "simple-input" && (
            <div className="space-y-6 py-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-cyan-900">
                  <strong>Quick Tip:</strong> Enter your current DSO and invoice data to see how much working capital
                  you could release with Kuhlekt.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="simpleDSOImprovement" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-600" />
                    Expected DSO Improvement (%)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="simpleDSOImprovement"
                    type="number"
                    placeholder="20"
                    value={simpleInputs.simpleDSOImprovement}
                    onChange={(e) => setSimpleInputs({ ...simpleInputs, simpleDSOImprovement: e.target.value })}
                    className={!simpleInputs.simpleDSOImprovement ? "border-red-300" : ""}
                  />
                  <p className="text-xs text-gray-500">Typical range: 15-30%</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="simpleCostOfCapital" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-cyan-600" />
                    Cost of Capital (%)
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="simpleCostOfCapital"
                    type="number"
                    placeholder="8"
                    value={simpleInputs.simpleCostOfCapital}
                    onChange={(e) => setSimpleInputs({ ...simpleInputs, simpleCostOfCapital: e.target.value })}
                    className={!simpleInputs.simpleCostOfCapital ? "border-red-300" : ""}
                  />
                  <p className="text-xs text-gray-500">Your borrowing rate or opportunity cost</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-cyan-600" />
                  Current Business Metrics
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentDSO" className={!simpleInputs.currentDSO ? "text-red-500" : ""}>
                      Current DSO (Days) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="currentDSO"
                      type="number"
                      placeholder="45"
                      value={simpleInputs.currentDSO}
                      onChange={(e) => setSimpleInputs({ ...simpleInputs, currentDSO: e.target.value })}
                      className={!simpleInputs.currentDSO ? "border-red-300" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="averageInvoiceValue"
                      className={!simpleInputs.averageInvoiceValue ? "text-red-500" : ""}
                    >
                      Average Invoice Value ($) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="averageInvoiceValue"
                      type="number"
                      placeholder="5000"
                      value={simpleInputs.averageInvoiceValue}
                      onChange={(e) => setSimpleInputs({ ...simpleInputs, averageInvoiceValue: e.target.value })}
                      className={!simpleInputs.averageInvoiceValue ? "border-red-300" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyInvoices" className={!simpleInputs.monthlyInvoices ? "text-red-500" : ""}>
                      Monthly Invoices <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="monthlyInvoices"
                      type="number"
                      placeholder="100"
                      value={simpleInputs.monthlyInvoices}
                      onChange={(e) => setSimpleInputs({ ...simpleInputs, monthlyInvoices: e.target.value })}
                      className={!simpleInputs.monthlyInvoices ? "border-red-300" : ""}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSimpleCalculate}
                  disabled={!isSimpleFormValid()}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  Calculate ROI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Simple Calculator Results */}
          {step === "simple-result" && simpleResults && (
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Estimated Annual Savings</h3>
                <div className="text-5xl font-bold text-cyan-600 mb-2">
                  ${simpleResults.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <p className="text-sm text-gray-600">Based on {simpleResults.dsoImprovementPercent}% DSO improvement</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Clock className="h-4 w-4" />
                    Current Cash Tied Up
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${simpleResults.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <DollarSign className="h-4 w-4" />
                    Cash Released
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${simpleResults.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">From faster collections</div>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <TrendingUp className="h-4 w-4" />
                    Current DSO
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{simpleInputs.currentDSO} days</div>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <TrendingUp className="h-4 w-4" />
                    New DSO (Projected)
                  </div>
                  <div className="text-2xl font-bold text-cyan-600">{simpleResults.newDSO?.toFixed(0)} days</div>
                  <div className="text-xs text-green-600 mt-1">{simpleResults.dsoImprovementPercent}% improvement</div>
                </div>
              </div>

              <div className="border-t pt-6">
                <ROIReportPDF calculatorType="simple" results={simpleResults} inputs={simpleInputs} />
              </div>

              {!emailSent ? (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h4 className="font-semibold">Get Detailed Results via Email</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      value={emailInput.name}
                      onChange={(e) => setEmailInput({ ...emailInput, name: e.target.value })}
                    />
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={emailInput.email}
                      onChange={(e) => setEmailInput({ ...emailInput, email: e.target.value })}
                    />
                    <Input
                      placeholder="Company Name"
                      value={emailInput.company}
                      onChange={(e) => setEmailInput({ ...emailInput, company: e.target.value })}
                      className="md:col-span-2"
                    />
                  </div>
                  <Button
                    onClick={handleSendEmail}
                    disabled={!emailInput.name || !emailInput.email || !emailInput.company}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    Send Results to Email
                  </Button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-800">
                  ✓ Results sent successfully! Check your email for the detailed report.
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={resetCalculator} className="flex-1 bg-transparent">
                  Start New Calculation
                </Button>
              </div>
            </div>
          )}

          {/* Detailed Calculator Input */}
          {step === "detailed-input" && (
            <div className="space-y-6 py-4">
              <Accordion
                type="multiple"
                defaultValue={["cost", "bank", "bad-debt", "savings", "financial", "payment", "team"]}
                className="w-full"
              >
                {/* Cost Structure */}
                <AccordionItem value="cost">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-cyan-600" />
                      <span>Cost Structure</span>
                      {(!detailedInputs.implementationCost || !detailedInputs.monthlyCost) && (
                        <span className="text-xs text-red-500 font-normal ml-2">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="implementationCost"
                          className={!detailedInputs.implementationCost ? "text-red-500" : ""}
                        >
                          Implementation Cost ($) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="implementationCost"
                          type="number"
                          placeholder="10000"
                          value={detailedInputs.implementationCost}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, implementationCost: e.target.value })}
                          className={!detailedInputs.implementationCost ? "border-red-300" : ""}
                        />
                        <p className="text-xs text-gray-500">One-time setup and implementation fee</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="monthlyCost" className={!detailedInputs.monthlyCost ? "text-red-500" : ""}>
                          Monthly Subscription Cost ($) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="monthlyCost"
                          type="number"
                          placeholder="500"
                          value={detailedInputs.monthlyCost}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, monthlyCost: e.target.value })}
                          className={!detailedInputs.monthlyCost ? "border-red-300" : ""}
                        />
                        <p className="text-xs text-gray-500">Recurring monthly platform fee</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Bank Interest */}
                <AccordionItem value="bank">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      <span>Bank Interest</span>
                      {!detailedInputs.interestRate && (
                        <span className="text-xs text-red-500 font-normal ml-2">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
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
                            <SelectItem value="loan">Loan (Cost of Borrowing)</SelectItem>
                            <SelectItem value="deposit">Deposit (Income from Savings)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interestRate" className={!detailedInputs.interestRate ? "text-red-500" : ""}>
                          Interest Rate (%) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="interestRate"
                          type="number"
                          step="0.1"
                          placeholder="8.5"
                          value={detailedInputs.interestRate}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, interestRate: e.target.value })}
                          className={!detailedInputs.interestRate ? "border-red-300" : ""}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Bad Debt */}
                <AccordionItem value="bad-debt">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-cyan-600" />
                      <span>Bad Debt</span>
                      {(!detailedInputs.currentBadDebts || !detailedInputs.averageBadDebt) && (
                        <span className="text-xs text-red-500 font-normal ml-2">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="currentBadDebts"
                          className={!detailedInputs.currentBadDebts ? "text-red-500" : ""}
                        >
                          Current Bad Debts ($ per annum) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="currentBadDebts"
                          type="number"
                          placeholder="50000"
                          value={detailedInputs.currentBadDebts}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, currentBadDebts: e.target.value })}
                          className={!detailedInputs.currentBadDebts ? "border-red-300" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="averageBadDebt"
                          className={!detailedInputs.averageBadDebt ? "text-red-500" : ""}
                        >
                          Average Bad Debt (% of sales) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="averageBadDebt"
                          type="number"
                          step="0.1"
                          placeholder="2.5"
                          value={detailedInputs.averageBadDebt}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, averageBadDebt: e.target.value })}
                          className={!detailedInputs.averageBadDebt ? "border-red-300" : ""}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Expected Savings */}
                <AccordionItem value="savings">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      <span>Expected Savings</span>
                      {(!detailedInputs.dsoImprovement || !detailedInputs.labourSavings) && (
                        <span className="text-xs text-red-500 font-normal ml-2">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="dsoImprovement"
                          className={!detailedInputs.dsoImprovement ? "text-red-500" : ""}
                        >
                          DSO Improvement (%) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="dsoImprovement"
                          type="number"
                          placeholder="25"
                          value={detailedInputs.dsoImprovement}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, dsoImprovement: e.target.value })}
                          className={!detailedInputs.dsoImprovement ? "border-red-300" : ""}
                        />
                        <p className="text-xs text-gray-500">Expected reduction in collection time</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="labourSavings" className={!detailedInputs.labourSavings ? "text-red-500" : ""}>
                          Labour Savings (%) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="labourSavings"
                          type="number"
                          placeholder="30"
                          value={detailedInputs.labourSavings}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, labourSavings: e.target.value })}
                          className={!detailedInputs.labourSavings ? "border-red-300" : ""}
                        />
                        <p className="text-xs text-gray-500">Automation efficiency gains</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Financial Metrics */}
                <AccordionItem value="financial">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-cyan-600" />
                      <span>Financial Metrics</span>
                      {(!detailedInputs.currentDSODays ||
                        !detailedInputs.debtorsBalance ||
                        !detailedInputs.perAnnumDirectLabourCosts) && (
                        <span className="text-xs text-red-500 font-normal ml-2">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="currentDSODays"
                          className={!detailedInputs.currentDSODays ? "text-red-500" : ""}
                        >
                          Current DSO (Days) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="currentDSODays"
                          type="number"
                          placeholder="45"
                          value={detailedInputs.currentDSODays}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, currentDSODays: e.target.value })}
                          className={!detailedInputs.currentDSODays ? "border-red-300" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="debtorsBalance"
                          className={!detailedInputs.debtorsBalance ? "text-red-500" : ""}
                        >
                          Debtors Balance ($) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="debtorsBalance"
                          type="number"
                          placeholder="500000"
                          value={detailedInputs.debtorsBalance}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, debtorsBalance: e.target.value })}
                          className={!detailedInputs.debtorsBalance ? "border-red-300" : ""}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label
                          htmlFor="perAnnumDirectLabourCosts"
                          className={!detailedInputs.perAnnumDirectLabourCosts ? "text-red-500" : ""}
                        >
                          Per Annum Direct Labour Costs ($) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="perAnnumDirectLabourCosts"
                          type="number"
                          placeholder="150000"
                          value={detailedInputs.perAnnumDirectLabourCosts}
                          onChange={(e) =>
                            setDetailedInputs({ ...detailedInputs, perAnnumDirectLabourCosts: e.target.value })
                          }
                          className={!detailedInputs.perAnnumDirectLabourCosts ? "border-red-300" : ""}
                        />
                        <p className="text-xs text-gray-500">Total annual cost for collections team</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Payment Terms */}
                <AccordionItem value="payment">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-cyan-600" />
                      <span>Payment Terms</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="space-y-2">
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
                  </AccordionContent>
                </AccordionItem>

                {/* Team Structure & Growth */}
                <AccordionItem value="team">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-600" />
                      <span>Team Structure & Growth</span>
                      {(!detailedInputs.numberOfDebtors ||
                        !detailedInputs.numberOfCollectors ||
                        !detailedInputs.projectedCustomerGrowth) && (
                        <span className="text-xs text-red-500 font-normal ml-2">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="numberOfDebtors"
                          className={!detailedInputs.numberOfDebtors ? "text-red-500" : ""}
                        >
                          Number of Debtors <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="numberOfDebtors"
                          type="number"
                          placeholder="500"
                          value={detailedInputs.numberOfDebtors}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, numberOfDebtors: e.target.value })}
                          className={!detailedInputs.numberOfDebtors ? "border-red-300" : ""}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="numberOfCollectors"
                          className={!detailedInputs.numberOfCollectors ? "text-red-500" : ""}
                        >
                          Number of Collectors <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="numberOfCollectors"
                          type="number"
                          placeholder="3"
                          value={detailedInputs.numberOfCollectors}
                          onChange={(e) => setDetailedInputs({ ...detailedInputs, numberOfCollectors: e.target.value })}
                          className={!detailedInputs.numberOfCollectors ? "border-red-300" : ""}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label
                          htmlFor="projectedCustomerGrowth"
                          className={!detailedInputs.projectedCustomerGrowth ? "text-red-500" : ""}
                        >
                          Projected Customer Growth (%) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="projectedCustomerGrowth"
                          type="number"
                          placeholder="15"
                          value={detailedInputs.projectedCustomerGrowth}
                          onChange={(e) =>
                            setDetailedInputs({ ...detailedInputs, projectedCustomerGrowth: e.target.value })
                          }
                          className={!detailedInputs.projectedCustomerGrowth ? "border-red-300" : ""}
                        />
                        <p className="text-xs text-gray-500">Expected annual customer base growth</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleDetailedCalculate}
                  disabled={!isDetailedFormValid()}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  Calculate ROI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Detailed Calculator Results */}
          {step === "detailed-result" && detailedResults && (
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Annual Benefit</h3>
                <div className="text-5xl font-bold text-cyan-600 mb-2">
                  ${detailedResults.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <span>ROI: {detailedResults.roi?.toFixed(0)}%</span>
                  <span>•</span>
                  <span>Payback: {detailedResults.paybackMonths?.toFixed(1)} months</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <TrendingUp className="h-4 w-4" />
                    DSO Improvement
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {detailedResults.dsoReductionDays?.toFixed(0)} days
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    From {detailedResults.currentDSO} to {detailedResults.newDSO?.toFixed(0)} days
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <DollarSign className="h-4 w-4" />
                    Working Capital Released
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${detailedResults.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <DollarSign className="h-4 w-4" />
                    Interest Savings
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${detailedResults.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Annual</div>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Users className="h-4 w-4" />
                    Labour Cost Savings
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${detailedResults.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Through automation</div>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <Clock className="h-4 w-4" />
                    Bad Debt Reduction
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    ${detailedResults.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">40% improvement</div>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                    <TrendingUp className="h-4 w-4" />
                    Return on Investment
                  </div>
                  <div className="text-2xl font-bold text-cyan-600">{detailedResults.roi?.toFixed(0)}%</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Payback: {detailedResults.paybackMonths?.toFixed(1)} months
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <ROIReportPDF calculatorType="detailed" results={detailedResults} inputs={detailedInputs} />
              </div>

              {!emailSent ? (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h4 className="font-semibold">Get Detailed Results via Email</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      value={emailInput.name}
                      onChange={(e) => setEmailInput({ ...emailInput, name: e.target.value })}
                    />
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={emailInput.email}
                      onChange={(e) => setEmailInput({ ...emailInput, email: e.target.value })}
                    />
                    <Input
                      placeholder="Company Name"
                      value={emailInput.company}
                      onChange={(e) => setEmailInput({ ...emailInput, company: e.target.value })}
                      className="md:col-span-2"
                    />
                  </div>
                  <Button
                    onClick={handleSendEmail}
                    disabled={!emailInput.name || !emailInput.email || !emailInput.company}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    Send Results to Email
                  </Button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-800">
                  ✓ Results sent successfully! Check your email for the detailed report.
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={resetCalculator} className="flex-1 bg-transparent">
                  Start New Calculation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ROICalculatorHelpModal
        open={helpOpen}
        onOpenChange={setHelpOpen}
        calculatorType={calculatorType}
        currentStep={step}
      />
    </>
  )
}
