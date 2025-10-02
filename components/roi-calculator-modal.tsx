"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, TrendingUp, DollarSign, Clock, CheckCircle2, Loader2, AlertCircle, HelpCircle } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { submitROICalculator } from "@/app/roi-calculator/actions"
import { ROICalculatorHelpModal } from "./roi-calculator-help-modal"
import { ROIReportPDF } from "./roi-report-pdf"

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
  const [errorMessage, setErrorMessage] = useState("")
  const [showHelp, setShowHelp] = useState(false)

  // Simple calculator inputs
  const [simpleDSOImprovement, setSimpleDSOImprovement] = useState("30")
  const [simpleCostOfCapital, setSimpleCostOfCapital] = useState("5")
  const [currentDSO, setCurrentDSO] = useState("")
  const [averageInvoiceValue, setAverageInvoiceValue] = useState("")
  const [monthlyInvoices, setMonthlyInvoices] = useState("")

  // Detailed calculator inputs
  const [implementationCost, setImplementationCost] = useState("")
  const [monthlyCost, setMonthlyCost] = useState("")
  const [perAnnumDirectLabourCosts, setPerAnnumDirectLabourCosts] = useState("")
  const [interestType, setInterestType] = useState("loan")
  const [interestRate, setInterestRate] = useState("")
  const [averageBadDebt, setAverageBadDebt] = useState("")
  const [currentBadDebts, setCurrentBadDebts] = useState("")
  const [labourSavings, setLabourSavings] = useState("")
  const [dsoImprovement, setDsoImprovement] = useState("")
  const [daysSales, setDaysSales] = useState("")
  const [currentDSODays, setCurrentDSODays] = useState("")
  const [debtorsBalance, setDebtorsBalance] = useState("")
  const [averagePaymentTerms, setAveragePaymentTerms] = useState("net30")
  const [numberOfDebtors, setNumberOfDebtors] = useState("")
  const [numberOfCollectors, setNumberOfCollectors] = useState("")
  const [projectedCustomerGrowth, setProjectedCustomerGrowth] = useState("")

  // Contact info
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Results
  const [results, setResults] = useState<any>(null)

  const resetForm = () => {
    setStep("calculator-type")
    setCalculatorType("simple")
    setSimpleDSOImprovement("30")
    setSimpleCostOfCapital("5")
    setCurrentDSO("")
    setAverageInvoiceValue("")
    setMonthlyInvoices("")
    setImplementationCost("")
    setMonthlyCost("")
    setPerAnnumDirectLabourCosts("")
    setInterestType("loan")
    setInterestRate("")
    setAverageBadDebt("")
    setCurrentBadDebts("")
    setLabourSavings("")
    setDsoImprovement("")
    setDaysSales("")
    setCurrentDSODays("")
    setDebtorsBalance("")
    setAveragePaymentTerms("net30")
    setNumberOfDebtors("")
    setNumberOfCollectors("")
    setProjectedCustomerGrowth("")
    setEmail("")
    setPhone("")
    setResults(null)
    setIsSubmitting(false)
    setErrorMessage("")
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
    setErrorMessage("")
    setStep("contact")
  }

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validatePhone = (phone: string) => {
    return /^[\d\s\-+()]+$/.test(phone) && phone.replace(/\D/g, "").length >= 10
  }

  const isDetailedFormValid = () => {
    return (
      implementationCost &&
      monthlyCost &&
      perAnnumDirectLabourCosts &&
      interestRate &&
      averageBadDebt &&
      currentBadDebts &&
      labourSavings &&
      dsoImprovement &&
      daysSales &&
      currentDSODays &&
      debtorsBalance &&
      numberOfDebtors &&
      numberOfCollectors &&
      projectedCustomerGrowth
    )
  }

  const getMissingFields = () => {
    const missing: string[] = []
    if (!implementationCost) missing.push("Implementation Cost")
    if (!monthlyCost) missing.push("Monthly Cost")
    if (!perAnnumDirectLabourCosts) missing.push("Per Annum Direct Labour Costs")
    if (!interestRate) missing.push("Interest Rate")
    if (!averageBadDebt) missing.push("Average Bad Debt")
    if (!currentBadDebts) missing.push("Current Bad Debts")
    if (!labourSavings) missing.push("Labour Savings")
    if (!dsoImprovement) missing.push("DSO Improvement")
    if (!daysSales) missing.push("Days Sales")
    if (!currentDSODays) missing.push("Current DSO")
    if (!debtorsBalance) missing.push("Debtors Balance")
    if (!numberOfDebtors) missing.push("Number of Debtors")
    if (!numberOfCollectors) missing.push("Number of Collectors")
    if (!projectedCustomerGrowth) missing.push("Projected Customer Growth")
    return missing
  }

  const getInputs = () => {
    if (calculatorType === "simple") {
      return {
        simpleDSOImprovement,
        simpleCostOfCapital,
        currentDSO,
        averageInvoiceValue,
        monthlyInvoices,
      }
    } else {
      return {
        implementationCost,
        monthlyCost,
        perAnnumDirectLabourCosts,
        interestType,
        interestRate,
        averageBadDebt,
        currentBadDebts,
        labourSavings,
        dsoImprovement,
        daysSales,
        currentDSODays,
        debtorsBalance,
        averagePaymentTerms,
        numberOfDebtors,
        numberOfCollectors,
        projectedCustomerGrowth,
      }
    }
  }

  const handleContactSubmit = async () => {
    setErrorMessage("")

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email address")
      return
    }

    if (!validatePhone(phone)) {
      setErrorMessage("Please enter a valid phone number (at least 10 digits)")
      return
    }

    setIsSubmitting(true)

    const data =
      calculatorType === "simple"
        ? {
            simpleDSOImprovement: Number.parseFloat(simpleDSOImprovement),
            simpleCostOfCapital: Number.parseFloat(simpleCostOfCapital),
            currentDSO: Number.parseFloat(currentDSO),
            averageInvoiceValue: Number.parseFloat(averageInvoiceValue),
            monthlyInvoices: Number.parseFloat(monthlyInvoices),
            email,
            phone,
            calculatorType,
          }
        : {
            implementationCost: Number.parseFloat(implementationCost),
            monthlyCost: Number.parseFloat(monthlyCost),
            perAnnumDirectLabourCosts: Number.parseFloat(perAnnumDirectLabourCosts),
            interestType,
            interestRate: Number.parseFloat(interestRate),
            averageBadDebt: Number.parseFloat(averageBadDebt),
            currentBadDebts: Number.parseFloat(currentBadDebts),
            labourSavings: Number.parseFloat(labourSavings),
            dsoImprovement: Number.parseFloat(dsoImprovement),
            daysSales: Number.parseFloat(daysSales),
            currentDSODays: Number.parseFloat(currentDSODays),
            debtorsBalance: Number.parseFloat(debtorsBalance),
            averagePaymentTerms,
            numberOfDebtors: Number.parseFloat(numberOfDebtors),
            numberOfCollectors: Number.parseFloat(numberOfCollectors),
            projectedCustomerGrowth: Number.parseFloat(projectedCustomerGrowth),
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
      setErrorMessage(response.error || "Failed to calculate ROI. Please try again.")
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Calculator className="h-6 w-6 text-cyan-600" />
                ROI Calculator
              </DialogTitle>
              {step !== "calculator-type" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHelp(true)}
                  className="text-gray-600 hover:text-cyan-600"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Help</span>
                </Button>
              )}
            </div>
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
                  <p className="text-sm text-gray-600">Comprehensive invoice-to-cash ROI analysis</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2a: Simple Calculator Inputs */}
          {step === "simple-inputs" && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="simpleDSOImprovement">Expected DSO Improvement (%)</Label>
                    <Input
                      id="simpleDSOImprovement"
                      type="number"
                      placeholder="30"
                      value={simpleDSOImprovement}
                      onChange={(e) => setSimpleDSOImprovement(e.target.value)}
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical improvement: 20-40%</p>
                  </div>
                  <div>
                    <Label htmlFor="simpleCostOfCapital">Cost of Capital (%)</Label>
                    <Input
                      id="simpleCostOfCapital"
                      type="number"
                      placeholder="5"
                      value={simpleCostOfCapital}
                      onChange={(e) => setSimpleCostOfCapital(e.target.value)}
                      min="0"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your annual interest rate</p>
                  </div>
                </div>

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
                  disabled={
                    !simpleDSOImprovement ||
                    !simpleCostOfCapital ||
                    !currentDSO ||
                    !averageInvoiceValue ||
                    !monthlyInvoices
                  }
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2b: Detailed Calculator Inputs */}
          {step === "detailed-inputs" && (
            <div className="space-y-6 py-4">
              {!isDetailedFormValid() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Please fill in all required fields:</p>
                    <ul className="text-xs text-yellow-700 mt-2 space-y-1">
                      {getMissingFields().map((field) => (
                        <li key={field}>• {field}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <Accordion
                type="multiple"
                defaultValue={["costs", "interest", "debt", "savings", "metrics", "terms", "team"]}
                className="space-y-2"
              >
                {/* Cost Structure */}
                <AccordionItem value="costs" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-lg text-cyan-600">Cost Structure</span>
                      {(!implementationCost || !monthlyCost || !perAnnumDirectLabourCosts) && (
                        <span className="ml-2 text-xs text-red-600">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="implementationCost" className={!implementationCost ? "text-red-600" : ""}>
                            Implementation Cost ($) {!implementationCost && "*"}
                          </Label>
                          <Input
                            id="implementationCost"
                            type="number"
                            placeholder="50000"
                            value={implementationCost}
                            onChange={(e) => setImplementationCost(e.target.value)}
                            min="0"
                            className={!implementationCost ? "border-red-300" : ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="monthlyCost" className={!monthlyCost ? "text-red-600" : ""}>
                            Monthly Cost ($) {!monthlyCost && "*"}
                          </Label>
                          <Input
                            id="monthlyCost"
                            type="number"
                            placeholder="8500"
                            value={monthlyCost}
                            onChange={(e) => setMonthlyCost(e.target.value)}
                            min="0"
                            className={!monthlyCost ? "border-red-300" : ""}
                          />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="perAnnumDirectLabourCosts"
                          className={!perAnnumDirectLabourCosts ? "text-red-600" : ""}
                        >
                          Per Annum Direct Labour Costs ($) {!perAnnumDirectLabourCosts && "*"}
                        </Label>
                        <Input
                          id="perAnnumDirectLabourCosts"
                          type="number"
                          placeholder="500000"
                          value={perAnnumDirectLabourCosts}
                          onChange={(e) => setPerAnnumDirectLabourCosts(e.target.value)}
                          min="0"
                          className={!perAnnumDirectLabourCosts ? "border-red-300" : ""}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Bank Interest */}
                <AccordionItem value="interest" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-lg text-cyan-600">Bank Interest</span>
                      {!interestRate && <span className="ml-2 text-xs text-red-600">*Required</span>}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="interestType">Interest Type</Label>
                        <Select value={interestType} onValueChange={setInterestType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loan">Loan Interest (Cost)</SelectItem>
                            <SelectItem value="deposit">Deposit Interest (Income)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="interestRate" className={!interestRate ? "text-red-600" : ""}>
                          Interest Rate (%) {!interestRate && "*"}
                        </Label>
                        <Input
                          id="interestRate"
                          type="number"
                          placeholder="5"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          min="0"
                          step="0.01"
                          className={!interestRate ? "border-red-300" : ""}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Bad Debt */}
                <AccordionItem value="debt" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-lg text-cyan-600">Bad Debt</span>
                      {(!averageBadDebt || !currentBadDebts) && (
                        <span className="ml-2 text-xs text-red-600">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="averageBadDebt" className={!averageBadDebt ? "text-red-600" : ""}>
                          Average Bad Debt (%) {!averageBadDebt && "*"}
                        </Label>
                        <Input
                          id="averageBadDebt"
                          type="number"
                          placeholder="0.0355"
                          value={averageBadDebt}
                          onChange={(e) => setAverageBadDebt(e.target.value)}
                          min="0"
                          step="0.0001"
                          className={!averageBadDebt ? "border-red-300" : ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor="currentBadDebts" className={!currentBadDebts ? "text-red-600" : ""}>
                          Current Bad Debts ($) {!currentBadDebts && "*"}
                        </Label>
                        <Input
                          id="currentBadDebts"
                          type="number"
                          placeholder="20000"
                          value={currentBadDebts}
                          onChange={(e) => setCurrentBadDebts(e.target.value)}
                          min="0"
                          className={!currentBadDebts ? "border-red-300" : ""}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Expected Savings */}
                <AccordionItem value="savings" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-lg text-cyan-600">Expected Savings</span>
                      {(!labourSavings || !dsoImprovement) && (
                        <span className="ml-2 text-xs text-red-600">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="labourSavings" className={!labourSavings ? "text-red-600" : ""}>
                          Labour Savings (%) {!labourSavings && "*"}
                        </Label>
                        <Input
                          id="labourSavings"
                          type="number"
                          placeholder="40"
                          value={labourSavings}
                          onChange={(e) => setLabourSavings(e.target.value)}
                          min="0"
                          max="100"
                          className={!labourSavings ? "border-red-300" : ""}
                        />
                      </div>
                      <div>
                        <Label htmlFor="dsoImprovement" className={!dsoImprovement ? "text-red-600" : ""}>
                          DSO Improvement (%) {!dsoImprovement && "*"}
                        </Label>
                        <Input
                          id="dsoImprovement"
                          type="number"
                          placeholder="30"
                          value={dsoImprovement}
                          onChange={(e) => setDsoImprovement(e.target.value)}
                          min="0"
                          max="100"
                          className={!dsoImprovement ? "border-red-300" : ""}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Financial Metrics */}
                <AccordionItem value="metrics" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-lg text-cyan-600">Financial Metrics</span>
                      {(!daysSales || !currentDSODays || !debtorsBalance) && (
                        <span className="ml-2 text-xs text-red-600">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="daysSales" className={!daysSales ? "text-red-600" : ""}>
                            Days Sales {!daysSales && "*"}
                          </Label>
                          <Input
                            id="daysSales"
                            type="number"
                            placeholder="365"
                            value={daysSales}
                            onChange={(e) => setDaysSales(e.target.value)}
                            min="0"
                            className={!daysSales ? "border-red-300" : ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="currentDSODays" className={!currentDSODays ? "text-red-600" : ""}>
                            Current DSO (Days) {!currentDSODays && "*"}
                          </Label>
                          <Input
                            id="currentDSODays"
                            type="number"
                            placeholder="45"
                            value={currentDSODays}
                            onChange={(e) => setCurrentDSODays(e.target.value)}
                            min="0"
                            className={!currentDSODays ? "border-red-300" : ""}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="debtorsBalance" className={!debtorsBalance ? "text-red-600" : ""}>
                          Debtors Balance ($) {!debtorsBalance && "*"}
                        </Label>
                        <Input
                          id="debtorsBalance"
                          type="number"
                          placeholder="1000000"
                          value={debtorsBalance}
                          onChange={(e) => setDebtorsBalance(e.target.value)}
                          min="0"
                          className={!debtorsBalance ? "border-red-300" : ""}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Payment Terms */}
                <AccordionItem value="terms" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-lg text-cyan-600">Payment Terms</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div>
                      <Label htmlFor="averagePaymentTerms">Average Payment Terms (Days)</Label>
                      <Select value={averagePaymentTerms} onValueChange={setAveragePaymentTerms}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net7">Net 7</SelectItem>
                          <SelectItem value="net15">Net 15</SelectItem>
                          <SelectItem value="net30">Net 30</SelectItem>
                          <SelectItem value="net45">Net 45</SelectItem>
                          <SelectItem value="net60">Net 60</SelectItem>
                          <SelectItem value="net90">Net 90</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Team Structure & Growth */}
                <AccordionItem value="team" className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold text-lg text-cyan-600">Team Structure & Growth</span>
                      {(!numberOfDebtors || !numberOfCollectors || !projectedCustomerGrowth) && (
                        <span className="ml-2 text-xs text-red-600">*Required</span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="numberOfDebtors" className={!numberOfDebtors ? "text-red-600" : ""}>
                            Number of Debtors {!numberOfDebtors && "*"}
                          </Label>
                          <Input
                            id="numberOfDebtors"
                            type="number"
                            placeholder="500"
                            value={numberOfDebtors}
                            onChange={(e) => setNumberOfDebtors(e.target.value)}
                            min="0"
                            className={!numberOfDebtors ? "border-red-300" : ""}
                          />
                        </div>
                        <div>
                          <Label htmlFor="numberOfCollectors" className={!numberOfCollectors ? "text-red-600" : ""}>
                            Number of Collectors {!numberOfCollectors && "*"}
                          </Label>
                          <Input
                            id="numberOfCollectors"
                            type="number"
                            placeholder="5"
                            value={numberOfCollectors}
                            onChange={(e) => setNumberOfCollectors(e.target.value)}
                            min="0"
                            className={!numberOfCollectors ? "border-red-300" : ""}
                          />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="projectedCustomerGrowth"
                          className={!projectedCustomerGrowth ? "text-red-600" : ""}
                        >
                          Projected Customer Growth (%) {!projectedCustomerGrowth && "*"}
                        </Label>
                        <Input
                          id="projectedCustomerGrowth"
                          type="number"
                          placeholder="50"
                          value={projectedCustomerGrowth}
                          onChange={(e) => setProjectedCustomerGrowth(e.target.value)}
                          min="0"
                          className={!projectedCustomerGrowth ? "border-red-300" : ""}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("calculator-type")} className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleInputsNext}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                  disabled={!isDetailedFormValid()}
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

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}

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
                      <p className="text-sm text-green-600">{results.dsoImprovementPercent}% improvement</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg text-center border-2 border-cyan-200">
                    <p className="text-sm text-gray-600 mb-2">Total Annual Benefit</p>
                    <p className="text-5xl font-bold text-cyan-600">
                      ${results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      ROI: {results.roi?.toFixed(0)}% | Payback: {results.paybackMonths?.toFixed(1)} months
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-cyan-600" />
                        <p className="font-semibold">DSO Improvement</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{results.dsoReductionDays?.toFixed(0)} days</p>
                      <p className="text-sm text-gray-600">
                        From {results.currentDSO} to {results.newDSO?.toFixed(0)} days
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-cyan-600" />
                        <p className="font-semibold">Working Capital Released</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-cyan-600" />
                        <p className="font-semibold">Labour Cost Savings</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                        <p className="font-semibold">Bad Debt Reduction</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Download Button */}
              <div className="pt-4">
                <ROIReportPDF calculatorType={calculatorType} results={results} inputs={getInputs()} />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                  Calculate Again
                </Button>
                <Button onClick={handleClose} className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Help Modal */}
      <ROICalculatorHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} calculatorType={calculatorType} />
    </>
  )
}
