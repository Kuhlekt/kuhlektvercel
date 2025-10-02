"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calculator, TrendingUp, DollarSign, Clock, Users, HelpCircle, ArrowLeft, ArrowRight } from "lucide-react"
import { calculateSimpleROI, calculateDetailedROI, sendROIEmail } from "@/app/roi-calculator/actions"
import { ROIReportPDF } from "./roi-report-pdf"
import { ROICalculatorHelpModal } from "./roi-calculator-help-modal"

interface ROICalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ROICalculatorModal({ isOpen, onClose }: ROICalculatorModalProps) {
  const [step, setStep] = useState<
    "select" | "simple" | "detailed" | "contact" | "simple-results" | "detailed-results"
  >("select")
  const [isCalculating, setIsCalculating] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [calculatorType, setCalculatorType] = useState<"simple" | "detailed">("simple")

  // Simple calculator state
  const [simpleData, setSimpleData] = useState({
    currentDSO: "",
    averageInvoiceValue: "",
    monthlyInvoices: "",
    simpleDSOImprovement: "20",
    simpleCostOfCapital: "8",
  })
  const [simpleResults, setSimpleResults] = useState<any>(null)

  // Detailed calculator state
  const [detailedData, setDetailedData] = useState({
    implementationCost: "",
    monthlyCost: "",
    perAnnumDirectLabourCosts: "",
    interestType: "loan" as "loan" | "deposit",
    interestRate: "",
    averageBadDebt: "",
    currentBadDebts: "",
    labourSavings: "",
    dsoImprovement: "",
    currentDSODays: "",
    debtorsBalance: "",
    averagePaymentTerms: "net30" as "net30" | "net60" | "net90",
    numberOfDebtors: "",
    numberOfCollectors: "",
    projectedCustomerGrowth: "",
  })
  const [detailedResults, setDetailedResults] = useState<any>(null)

  // Contact info
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  })
  const [emailSent, setEmailSent] = useState(false)

  const resetAll = () => {
    setStep("select")
    setSimpleData({
      currentDSO: "",
      averageInvoiceValue: "",
      monthlyInvoices: "",
      simpleDSOImprovement: "20",
      simpleCostOfCapital: "8",
    })
    setDetailedData({
      implementationCost: "",
      monthlyCost: "",
      perAnnumDirectLabourCosts: "",
      interestType: "loan",
      interestRate: "",
      averageBadDebt: "",
      currentBadDebts: "",
      labourSavings: "",
      dsoImprovement: "",
      currentDSODays: "",
      debtorsBalance: "",
      averagePaymentTerms: "net30",
      numberOfDebtors: "",
      numberOfCollectors: "",
      projectedCustomerGrowth: "",
    })
    setSimpleResults(null)
    setDetailedResults(null)
    setContactData({ name: "", email: "", phone: "", company: "" })
    setEmailSent(false)
    setCalculatorType("simple")
  }

  const handleSimpleSubmit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    console.log("Simple form submitted!")
    console.log("Simple data:", simpleData)

    if (!simpleData.currentDSO || !simpleData.averageInvoiceValue || !simpleData.monthlyInvoices) {
      alert("Please fill in all required fields")
      return
    }

    setCalculatorType("simple")
    setStep("contact")
  }

  const handleDetailedSubmit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    console.log("Detailed form submitted!")
    console.log("Detailed data:", detailedData)

    // Check all required fields
    const requiredFields = [
      "implementationCost",
      "monthlyCost",
      "perAnnumDirectLabourCosts",
      "interestRate",
      "averageBadDebt",
      "currentBadDebts",
      "labourSavings",
      "dsoImprovement",
      "currentDSODays",
      "debtorsBalance",
      "numberOfDebtors",
      "numberOfCollectors",
      "projectedCustomerGrowth",
    ]

    const missingFields = requiredFields.filter((field) => !detailedData[field as keyof typeof detailedData])

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields. Missing: ${missingFields.join(", ")}`)
      return
    }

    setCalculatorType("detailed")
    setStep("contact")
  }

  const handleContactSubmit = async () => {
    if (!contactData.name || !contactData.email || !contactData.phone || !contactData.company) {
      alert("Please fill in all contact fields")
      return
    }

    setIsCalculating(true)

    try {
      let results
      if (calculatorType === "simple") {
        console.log("Calculating simple ROI with data:", simpleData)
        results = await calculateSimpleROI(simpleData)
        console.log("Simple results:", results)
        setSimpleResults(results)
        setStep("simple-results")
      } else {
        console.log("Calculating detailed ROI with data:", detailedData)
        results = await calculateDetailedROI(detailedData)
        console.log("Detailed results:", results)
        setDetailedResults(results)
        setStep("detailed-results")
      }

      // Send email with results
      await sendROIEmail({
        name: contactData.name,
        email: contactData.email,
        company: contactData.company,
        calculatorType,
        results,
        inputs: calculatorType === "simple" ? simpleData : detailedData,
      })

      setEmailSent(true)
    } catch (error) {
      console.error("Error:", error)
      alert("Error calculating ROI or sending email. Please try again.")
    } finally {
      setIsCalculating(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-cyan-600" />
                ROI Calculator
              </DialogTitle>
              {step !== "select" && (
                <Button variant="ghost" size="icon" onClick={() => setShowHelp(true)}>
                  <HelpCircle className="h-5 w-5" />
                </Button>
              )}
            </div>
            <DialogDescription>
              {step === "select" && "Choose the calculator that best fits your needs"}
              {step === "simple" && "Quick ROI calculation based on DSO improvement"}
              {step === "detailed" && "Comprehensive invoice-to-cash analysis"}
              {step === "contact" && "Your contact information to receive results"}
              {(step === "simple-results" || step === "detailed-results") && "Your ROI analysis results"}
            </DialogDescription>
          </DialogHeader>

          {/* Calculator Selection */}
          {step === "select" && (
            <div className="space-y-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start gap-3 hover:border-cyan-500 hover:bg-cyan-50 bg-transparent"
                  onClick={() => setStep("simple")}
                >
                  <div className="flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-cyan-600" />
                    <h3 className="font-semibold text-lg">Simple Calculator</h3>
                  </div>
                  <p className="text-sm text-gray-600 text-left">Quick ROI based on DSO and invoice data</p>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-start gap-3 hover:border-cyan-500 hover:bg-cyan-50 bg-transparent"
                  onClick={() => setStep("detailed")}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-6 w-6 text-cyan-600" />
                    <h3 className="font-semibold text-lg">Detailed Calculator</h3>
                  </div>
                  <p className="text-sm text-gray-600 text-left">Comprehensive invoice-to-cash ROI analysis</p>
                </Button>
              </div>
            </div>
          )}

          {/* Simple Calculator Form */}
          {step === "simple" && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Expected DSO Improvement (%)</Label>
                    <Input
                      type="number"
                      value={simpleData.simpleDSOImprovement}
                      onChange={(e) => setSimpleData({ ...simpleData, simpleDSOImprovement: e.target.value })}
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <Label>Cost of Capital (%)</Label>
                    <Input
                      type="number"
                      value={simpleData.simpleCostOfCapital}
                      onChange={(e) => setSimpleData({ ...simpleData, simpleCostOfCapital: e.target.value })}
                      placeholder="8"
                    />
                  </div>
                </div>

                <div>
                  <Label>Current DSO (Days) *</Label>
                  <Input
                    type="number"
                    value={simpleData.currentDSO}
                    onChange={(e) => setSimpleData({ ...simpleData, currentDSO: e.target.value })}
                    placeholder="45"
                    required
                  />
                </div>

                <div>
                  <Label>Average Invoice Value ($) *</Label>
                  <Input
                    type="number"
                    value={simpleData.averageInvoiceValue}
                    onChange={(e) => setSimpleData({ ...simpleData, averageInvoiceValue: e.target.value })}
                    placeholder="5000"
                    required
                  />
                </div>

                <div>
                  <Label>Monthly Invoices *</Label>
                  <Input
                    type="number"
                    value={simpleData.monthlyInvoices}
                    onChange={(e) => setSimpleData({ ...simpleData, monthlyInvoices: e.target.value })}
                    placeholder="100"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("select")} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSimpleSubmit}
                  disabled={isCalculating}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Detailed Calculator Form */}
          {step === "detailed" && (
            <div className="space-y-6 py-4">
              <Accordion type="multiple" defaultValue={["cost", "bank", "debt", "savings", "financial", "team"]}>
                <AccordionItem value="cost">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-cyan-600" />
                      Cost Structure
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Implementation Cost ($) *</Label>
                        <Input
                          type="number"
                          value={detailedData.implementationCost}
                          onChange={(e) => setDetailedData({ ...detailedData, implementationCost: e.target.value })}
                          placeholder="10000"
                        />
                      </div>
                      <div>
                        <Label>Monthly Cost ($) *</Label>
                        <Input
                          type="number"
                          value={detailedData.monthlyCost}
                          onChange={(e) => setDetailedData({ ...detailedData, monthlyCost: e.target.value })}
                          placeholder="500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Per Annum Direct Labour Costs ($) *</Label>
                      <Input
                        type="number"
                        value={detailedData.perAnnumDirectLabourCosts}
                        onChange={(e) =>
                          setDetailedData({ ...detailedData, perAnnumDirectLabourCosts: e.target.value })
                        }
                        placeholder="150000"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="bank">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      Bank Interest
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Interest Type</Label>
                        <Select
                          value={detailedData.interestType}
                          onValueChange={(value: "loan" | "deposit") =>
                            setDetailedData({ ...detailedData, interestType: value })
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
                        <Label>Interest Rate (%) *</Label>
                        <Input
                          type="number"
                          value={detailedData.interestRate}
                          onChange={(e) => setDetailedData({ ...detailedData, interestRate: e.target.value })}
                          placeholder="8.5"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="debt">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-cyan-600" />
                      Bad Debt
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Current Bad Debts ($) *</Label>
                        <Input
                          type="number"
                          value={detailedData.currentBadDebts}
                          onChange={(e) => setDetailedData({ ...detailedData, currentBadDebts: e.target.value })}
                          placeholder="50000"
                        />
                      </div>
                      <div>
                        <Label>Average Bad Debt (%) *</Label>
                        <Input
                          type="number"
                          value={detailedData.averageBadDebt}
                          onChange={(e) => setDetailedData({ ...detailedData, averageBadDebt: e.target.value })}
                          placeholder="2.5"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="savings">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      Expected Savings
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>DSO Improvement (%) *</Label>
                        <Input
                          type="number"
                          value={detailedData.dsoImprovement}
                          onChange={(e) => setDetailedData({ ...detailedData, dsoImprovement: e.target.value })}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label>Labour Savings (%) *</Label>
                        <Input
                          type="number"
                          value={detailedData.labourSavings}
                          onChange={(e) => setDetailedData({ ...detailedData, labourSavings: e.target.value })}
                          placeholder="30"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="financial">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-cyan-600" />
                      Financial Metrics
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Current DSO (Days) *</Label>
                        <Input
                          type="number"
                          value={detailedData.currentDSODays}
                          onChange={(e) => setDetailedData({ ...detailedData, currentDSODays: e.target.value })}
                          placeholder="45"
                        />
                      </div>
                      <div>
                        <Label>Debtors Balance ($) *</Label>
                        <Input
                          type="number"
                          value={detailedData.debtorsBalance}
                          onChange={(e) => setDetailedData({ ...detailedData, debtorsBalance: e.target.value })}
                          placeholder="500000"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Average Payment Terms</Label>
                      <Select
                        value={detailedData.averagePaymentTerms}
                        onValueChange={(value: "net30" | "net60" | "net90") =>
                          setDetailedData({ ...detailedData, averagePaymentTerms: value })
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

                <AccordionItem value="team">
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-600" />
                      Team Structure & Growth
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Number of Debtors *</Label>
                        <Input
                          type="number"
                          value={detailedData.numberOfDebtors}
                          onChange={(e) => setDetailedData({ ...detailedData, numberOfDebtors: e.target.value })}
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <Label>Number of Collectors *</Label>
                        <Input
                          type="number"
                          value={detailedData.numberOfCollectors}
                          onChange={(e) => setDetailedData({ ...detailedData, numberOfCollectors: e.target.value })}
                          placeholder="3"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Projected Customer Growth (%) *</Label>
                      <Input
                        type="number"
                        value={detailedData.projectedCustomerGrowth}
                        onChange={(e) => setDetailedData({ ...detailedData, projectedCustomerGrowth: e.target.value })}
                        placeholder="15"
                      />
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
                  onClick={handleDetailedSubmit}
                  disabled={isCalculating}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Contact Information Form */}
          {step === "contact" && (
            <div className="space-y-6 py-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-lg mb-2">Almost there!</h3>
                <p className="text-sm text-gray-700">
                  Please provide your contact information to see your personalized ROI results. We'll also email you a
                  detailed report.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Full Name *</Label>
                  <Input
                    type="text"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="john.smith@company.com"
                    required
                  />
                </div>

                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>

                <div>
                  <Label>Company Name *</Label>
                  <Input
                    type="text"
                    value={contactData.company}
                    onChange={(e) => setContactData({ ...contactData, company: e.target.value })}
                    placeholder="Acme Corporation"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(calculatorType === "simple" ? "simple" : "detailed")}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleContactSubmit}
                  disabled={isCalculating}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  {isCalculating ? "Calculating..." : "View Results"}
                  {!isCalculating && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Simple Results */}
          {step === "simple-results" && simpleResults && (
            <div className="space-y-6 py-4">
              {emailSent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-800">
                  ✓ Results sent to {contactData.email}
                </div>
              )}

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Estimated Annual Savings</h3>
                <div className="text-5xl font-bold text-cyan-600">
                  ${simpleResults.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Current Cash Tied Up</div>
                  <div className="text-2xl font-bold">
                    ${simpleResults.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Cash Released</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${simpleResults.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Current DSO</div>
                  <div className="text-2xl font-bold">{simpleData.currentDSO} days</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">New DSO</div>
                  <div className="text-2xl font-bold text-cyan-600">{simpleResults.newDSO?.toFixed(0)} days</div>
                </div>
              </div>

              <ROIReportPDF calculatorType="simple" results={simpleResults} inputs={simpleData} />

              <Button variant="outline" onClick={resetAll} className="w-full bg-transparent">
                Start New Calculation
              </Button>
            </div>
          )}

          {/* Detailed Results */}
          {step === "detailed-results" && detailedResults && (
            <div className="space-y-6 py-4">
              {emailSent && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-800">
                  ✓ Results sent to {contactData.email}
                </div>
              )}

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Total Annual Benefit</h3>
                <div className="text-5xl font-bold text-cyan-600">
                  ${detailedResults.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600 mt-2">
                  <span>ROI: {detailedResults.roi?.toFixed(0)}%</span>
                  <span>•</span>
                  <span>Payback: {detailedResults.paybackMonths?.toFixed(1)} months</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">DSO Improvement</div>
                  <div className="text-2xl font-bold">{detailedResults.dsoReductionDays?.toFixed(0)} days</div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Working Capital Released</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${detailedResults.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Interest Savings</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${detailedResults.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Labour Savings</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${detailedResults.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Bad Debt Reduction</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${detailedResults.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">ROI</div>
                  <div className="text-2xl font-bold text-cyan-600">{detailedResults.roi?.toFixed(0)}%</div>
                </div>
              </div>

              <ROIReportPDF calculatorType="detailed" results={detailedResults} inputs={detailedData} />

              <Button variant="outline" onClick={resetAll} className="w-full bg-transparent">
                Start New Calculation
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ROICalculatorHelpModal
        open={showHelp}
        onOpenChange={setShowHelp}
        calculatorType={calculatorType}
        currentStep={step}
      />
    </>
  )
}
