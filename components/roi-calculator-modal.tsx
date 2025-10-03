"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
} from "lucide-react"
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
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    setErrors({})
  }

  const validateSimpleForm = () => {
    const newErrors: Record<string, string> = {}

    if (!simpleData.currentDSO || Number.parseFloat(simpleData.currentDSO) <= 0) {
      newErrors.currentDSO = "Please enter a valid DSO"
    }
    if (!simpleData.averageInvoiceValue || Number.parseFloat(simpleData.averageInvoiceValue) <= 0) {
      newErrors.averageInvoiceValue = "Please enter a valid invoice value"
    }
    if (!simpleData.monthlyInvoices || Number.parseFloat(simpleData.monthlyInvoices) <= 0) {
      newErrors.monthlyInvoices = "Please enter valid monthly invoices"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateDetailedForm = () => {
    const newErrors: Record<string, string> = {}

    const requiredFields: (keyof typeof detailedData)[] = [
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

    requiredFields.forEach((field) => {
      const value = detailedData[field]
      if (!value || (typeof value === "string" && Number.parseFloat(value) < 0)) {
        newErrors[field] = "Required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateContactForm = () => {
    const newErrors: Record<string, string> = {}

    if (!contactData.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!contactData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) {
      newErrors.email = "Valid email is required"
    }
    if (!contactData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }
    if (!contactData.company.trim()) {
      newErrors.company = "Company is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSimpleSubmit = () => {
    if (!validateSimpleForm()) {
      return
    }
    setCalculatorType("simple")
    setStep("contact")
  }

  const handleDetailedSubmit = () => {
    if (!validateDetailedForm()) {
      return
    }
    setCalculatorType("detailed")
    setStep("contact")
  }

  const handleContactSubmit = async () => {
    if (!validateContactForm()) {
      return
    }

    setIsCalculating(true)

    try {
      let results
      if (calculatorType === "simple") {
        results = await calculateSimpleROI(simpleData)
        setSimpleResults(results)
        setStep("simple-results")
      } else {
        results = await calculateDetailedROI(detailedData)
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
      setErrors({ submit: "Error calculating ROI. Please try again." })
    } finally {
      setIsCalculating(false)
    }
  }

  const handleClose = () => {
    resetAll()
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
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

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

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
                      onChange={(e) => {
                        setSimpleData({ ...simpleData, simpleDSOImprovement: e.target.value })
                        setErrors({ ...errors, simpleDSOImprovement: "" })
                      }}
                      placeholder="20"
                    />
                  </div>
                  <div>
                    <Label>Cost of Capital (%)</Label>
                    <Input
                      type="number"
                      value={simpleData.simpleCostOfCapital}
                      onChange={(e) => {
                        setSimpleData({ ...simpleData, simpleCostOfCapital: e.target.value })
                        setErrors({ ...errors, simpleCostOfCapital: "" })
                      }}
                      placeholder="8"
                    />
                  </div>
                </div>

                <div>
                  <Label>Current DSO (Days) *</Label>
                  <Input
                    type="number"
                    value={simpleData.currentDSO}
                    onChange={(e) => {
                      setSimpleData({ ...simpleData, currentDSO: e.target.value })
                      setErrors({ ...errors, currentDSO: "" })
                    }}
                    placeholder="45"
                    className={errors.currentDSO ? "border-red-500" : ""}
                  />
                  {errors.currentDSO && <p className="text-sm text-red-600 mt-1">{errors.currentDSO}</p>}
                </div>

                <div>
                  <Label>Average Invoice Value ($) *</Label>
                  <Input
                    type="number"
                    value={simpleData.averageInvoiceValue}
                    onChange={(e) => {
                      setSimpleData({ ...simpleData, averageInvoiceValue: e.target.value })
                      setErrors({ ...errors, averageInvoiceValue: "" })
                    }}
                    placeholder="5000"
                    className={errors.averageInvoiceValue ? "border-red-500" : ""}
                  />
                  {errors.averageInvoiceValue && (
                    <p className="text-sm text-red-600 mt-1">{errors.averageInvoiceValue}</p>
                  )}
                </div>

                <div>
                  <Label>Monthly Invoices *</Label>
                  <Input
                    type="number"
                    value={simpleData.monthlyInvoices}
                    onChange={(e) => {
                      setSimpleData({ ...simpleData, monthlyInvoices: e.target.value })
                      setErrors({ ...errors, monthlyInvoices: "" })
                    }}
                    placeholder="100"
                    className={errors.monthlyInvoices ? "border-red-500" : ""}
                  />
                  {errors.monthlyInvoices && <p className="text-sm text-red-600 mt-1">{errors.monthlyInvoices}</p>}
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
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, implementationCost: e.target.value })
                            setErrors({ ...errors, implementationCost: "" })
                          }}
                          placeholder="10000"
                          className={errors.implementationCost ? "border-red-500" : ""}
                        />
                        {errors.implementationCost && (
                          <p className="text-sm text-red-600 mt-1">{errors.implementationCost}</p>
                        )}
                      </div>
                      <div>
                        <Label>Monthly Cost ($) *</Label>
                        <Input
                          type="number"
                          value={detailedData.monthlyCost}
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, monthlyCost: e.target.value })
                            setErrors({ ...errors, monthlyCost: "" })
                          }}
                          placeholder="500"
                          className={errors.monthlyCost ? "border-red-500" : ""}
                        />
                        {errors.monthlyCost && <p className="text-sm text-red-600 mt-1">{errors.monthlyCost}</p>}
                      </div>
                    </div>
                    <div>
                      <Label>Per Annum Direct Labour Costs ($) *</Label>
                      <Input
                        type="number"
                        value={detailedData.perAnnumDirectLabourCosts}
                        onChange={(e) => {
                          setDetailedData({ ...detailedData, perAnnumDirectLabourCosts: e.target.value })
                          setErrors({ ...errors, perAnnumDirectLabourCosts: "" })
                        }}
                        placeholder="150000"
                        className={errors.perAnnumDirectLabourCosts ? "border-red-500" : ""}
                      />
                      {errors.perAnnumDirectLabourCosts && (
                        <p className="text-sm text-red-600 mt-1">{errors.perAnnumDirectLabourCosts}</p>
                      )}
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
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, interestRate: e.target.value })
                            setErrors({ ...errors, interestRate: "" })
                          }}
                          placeholder="8.5"
                          className={errors.interestRate ? "border-red-500" : ""}
                        />
                        {errors.interestRate && <p className="text-sm text-red-600 mt-1">{errors.interestRate}</p>}
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
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, currentBadDebts: e.target.value })
                            setErrors({ ...errors, currentBadDebts: "" })
                          }}
                          placeholder="50000"
                          className={errors.currentBadDebts ? "border-red-500" : ""}
                        />
                        {errors.currentBadDebts && (
                          <p className="text-sm text-red-600 mt-1">{errors.currentBadDebts}</p>
                        )}
                      </div>
                      <div>
                        <Label>Average Bad Debt (%) *</Label>
                        <Input
                          type="number"
                          value={detailedData.averageBadDebt}
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, averageBadDebt: e.target.value })
                            setErrors({ ...errors, averageBadDebt: "" })
                          }}
                          placeholder="2.5"
                          className={errors.averageBadDebt ? "border-red-500" : ""}
                        />
                        {errors.averageBadDebt && <p className="text-sm text-red-600 mt-1">{errors.averageBadDebt}</p>}
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
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, dsoImprovement: e.target.value })
                            setErrors({ ...errors, dsoImprovement: "" })
                          }}
                          placeholder="25"
                          className={errors.dsoImprovement ? "border-red-500" : ""}
                        />
                        {errors.dsoImprovement && <p className="text-sm text-red-600 mt-1">{errors.dsoImprovement}</p>}
                      </div>
                      <div>
                        <Label>Labour Savings (%) *</Label>
                        <Input
                          type="number"
                          value={detailedData.labourSavings}
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, labourSavings: e.target.value })
                            setErrors({ ...errors, labourSavings: "" })
                          }}
                          placeholder="30"
                          className={errors.labourSavings ? "border-red-500" : ""}
                        />
                        {errors.labourSavings && <p className="text-sm text-red-600 mt-1">{errors.labourSavings}</p>}
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
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, currentDSODays: e.target.value })
                            setErrors({ ...errors, currentDSODays: "" })
                          }}
                          placeholder="45"
                          className={errors.currentDSODays ? "border-red-500" : ""}
                        />
                        {errors.currentDSODays && <p className="text-sm text-red-600 mt-1">{errors.currentDSODays}</p>}
                      </div>
                      <div>
                        <Label>Debtors Balance ($) *</Label>
                        <Input
                          type="number"
                          value={detailedData.debtorsBalance}
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, debtorsBalance: e.target.value })
                            setErrors({ ...errors, debtorsBalance: "" })
                          }}
                          placeholder="500000"
                          className={errors.debtorsBalance ? "border-red-500" : ""}
                        />
                        {errors.debtorsBalance && <p className="text-sm text-red-600 mt-1">{errors.debtorsBalance}</p>}
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
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, numberOfDebtors: e.target.value })
                            setErrors({ ...errors, numberOfDebtors: "" })
                          }}
                          placeholder="500"
                          className={errors.numberOfDebtors ? "border-red-500" : ""}
                        />
                        {errors.numberOfDebtors && (
                          <p className="text-sm text-red-600 mt-1">{errors.numberOfDebtors}</p>
                        )}
                      </div>
                      <div>
                        <Label>Number of Collectors *</Label>
                        <Input
                          type="number"
                          value={detailedData.numberOfCollectors}
                          onChange={(e) => {
                            setDetailedData({ ...detailedData, numberOfCollectors: e.target.value })
                            setErrors({ ...errors, numberOfCollectors: "" })
                          }}
                          placeholder="3"
                          className={errors.numberOfCollectors ? "border-red-500" : ""}
                        />
                        {errors.numberOfCollectors && (
                          <p className="text-sm text-red-600 mt-1">{errors.numberOfCollectors}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Projected Customer Growth (%) *</Label>
                      <Input
                        type="number"
                        value={detailedData.projectedCustomerGrowth}
                        onChange={(e) => {
                          setDetailedData({ ...detailedData, projectedCustomerGrowth: e.target.value })
                          setErrors({ ...errors, projectedCustomerGrowth: "" })
                        }}
                        placeholder="15"
                        className={errors.projectedCustomerGrowth ? "border-red-500" : ""}
                      />
                      {errors.projectedCustomerGrowth && (
                        <p className="text-sm text-red-600 mt-1">{errors.projectedCustomerGrowth}</p>
                      )}
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
                    onChange={(e) => {
                      setContactData({ ...contactData, name: e.target.value })
                      setErrors({ ...errors, name: "" })
                    }}
                    placeholder="John Smith"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    value={contactData.email}
                    onChange={(e) => {
                      setContactData({ ...contactData, email: e.target.value })
                      setErrors({ ...errors, email: "" })
                    }}
                    placeholder="john.smith@company.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    type="tel"
                    value={contactData.phone}
                    onChange={(e) => {
                      setContactData({ ...contactData, phone: e.target.value })
                      setErrors({ ...errors, phone: "" })
                    }}
                    placeholder="+1 (555) 123-4567"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label>Company Name *</Label>
                  <Input
                    type="text"
                    value={contactData.company}
                    onChange={(e) => {
                      setContactData({ ...contactData, company: e.target.value })
                      setErrors({ ...errors, company: "" })
                    }}
                    placeholder="Acme Corporation"
                    className={errors.company ? "border-red-500" : ""}
                  />
                  {errors.company && <p className="text-sm text-red-600 mt-1">{errors.company}</p>}
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
