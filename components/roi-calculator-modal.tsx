"use client"

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

type Step = "calculator-type" | "simple-inputs" | "detailed-inputs" | "contact" | "results"
type CalculatorType = "simple" | "detailed"

export function ROICalculatorModal({ isOpen, onClose }: ROICalculatorModalProps) {
  const [step, setStep] = useState<Step>("calculator-type")
  const [calculatorType, setCalculatorType] = useState<CalculatorType>("simple")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  // Simple calculator inputs
  const [simpleDSOImprovement, setSimpleDSOImprovement] = useState("20")
  const [simpleCostOfCapital, setSimpleCostOfCapital] = useState("8")
  const [currentDSO, setCurrentDSO] = useState("")
  const [averageInvoiceValue, setAverageInvoiceValue] = useState("")
  const [monthlyInvoices, setMonthlyInvoices] = useState("")

  // Detailed calculator inputs
  const [implementationCost, setImplementationCost] = useState("")
  const [monthlyCost, setMonthlyCost] = useState("")
  const [perAnnumDirectLabourCosts, setPerAnnumDirectLabourCosts] = useState("")
  const [interestType, setInterestType] = useState<"loan" | "deposit">("loan")
  const [interestRate, setInterestRate] = useState("")
  const [averageBadDebt, setAverageBadDebt] = useState("")
  const [currentBadDebts, setCurrentBadDebts] = useState("")
  const [labourSavings, setLabourSavings] = useState("")
  const [dsoImprovement, setDsoImprovement] = useState("")
  const [currentDSODays, setCurrentDSODays] = useState("")
  const [debtorsBalance, setDebtorsBalance] = useState("")
  const [averagePaymentTerms, setAveragePaymentTerms] = useState<"net30" | "net60" | "net90">("net30")
  const [numberOfDebtors, setNumberOfDebtors] = useState("")
  const [numberOfCollectors, setNumberOfCollectors] = useState("")
  const [projectedCustomerGrowth, setProjectedCustomerGrowth] = useState("")

  // Contact info
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")

  // Results
  const [results, setResults] = useState<any>(null)
  const [emailSent, setEmailSent] = useState(false)

  const resetForm = () => {
    setStep("calculator-type")
    setCalculatorType("simple")
    setSimpleDSOImprovement("20")
    setSimpleCostOfCapital("8")
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
    setCurrentDSODays("")
    setDebtorsBalance("")
    setAveragePaymentTerms("net30")
    setNumberOfDebtors("")
    setNumberOfCollectors("")
    setProjectedCustomerGrowth("")
    setName("")
    setEmail("")
    setCompany("")
    setResults(null)
    setEmailSent(false)
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

  const isSimpleFormValid = () => {
    const valid =
      currentDSO &&
      averageInvoiceValue &&
      monthlyInvoices &&
      simpleDSOImprovement &&
      simpleCostOfCapital &&
      Number.parseFloat(currentDSO) > 0 &&
      Number.parseFloat(averageInvoiceValue) > 0 &&
      Number.parseFloat(monthlyInvoices) > 0

    console.log("Simple form validation:", {
      currentDSO,
      averageInvoiceValue,
      monthlyInvoices,
      simpleDSOImprovement,
      simpleCostOfCapital,
      valid,
    })

    return valid
  }

  const isDetailedFormValid = () => {
    const valid =
      implementationCost &&
      monthlyCost &&
      perAnnumDirectLabourCosts &&
      interestRate &&
      averageBadDebt &&
      currentBadDebts &&
      labourSavings &&
      dsoImprovement &&
      currentDSODays &&
      debtorsBalance &&
      numberOfDebtors &&
      numberOfCollectors &&
      projectedCustomerGrowth &&
      Number.parseFloat(implementationCost) >= 0 &&
      Number.parseFloat(monthlyCost) > 0 &&
      Number.parseFloat(perAnnumDirectLabourCosts) > 0 &&
      Number.parseFloat(interestRate) > 0 &&
      Number.parseFloat(averageBadDebt) >= 0 &&
      Number.parseFloat(currentBadDebts) >= 0 &&
      Number.parseFloat(labourSavings) >= 0 &&
      Number.parseFloat(dsoImprovement) > 0 &&
      Number.parseFloat(currentDSODays) > 0 &&
      Number.parseFloat(debtorsBalance) > 0 &&
      Number.parseFloat(numberOfDebtors) > 0 &&
      Number.parseFloat(numberOfCollectors) > 0 &&
      Number.parseFloat(projectedCustomerGrowth) >= 0

    console.log("Detailed form validation:", {
      implementationCost,
      monthlyCost,
      perAnnumDirectLabourCosts,
      interestRate,
      averageBadDebt,
      currentBadDebts,
      labourSavings,
      dsoImprovement,
      currentDSODays,
      debtorsBalance,
      numberOfDebtors,
      numberOfCollectors,
      projectedCustomerGrowth,
      valid,
    })

    return valid
  }

  const handleSimpleCalculate = async () => {
    console.log("Simple calculate clicked")
    setIsSubmitting(true)
    try {
      const simpleInputs = {
        currentDSO,
        averageInvoiceValue,
        monthlyInvoices,
        simpleDSOImprovement,
        simpleCostOfCapital,
      }
      console.log("Calculating with inputs:", simpleInputs)
      const calculatedResults = await calculateSimpleROI(simpleInputs)
      console.log("Calculation results:", calculatedResults)
      setResults(calculatedResults)
      setStep("results")
    } catch (error) {
      console.error("Error calculating simple ROI:", error)
      alert("Error calculating ROI. Please check your inputs and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDetailedCalculate = async () => {
    console.log("Detailed calculate clicked")
    setIsSubmitting(true)
    try {
      const detailedInputs = {
        implementationCost,
        monthlyCost,
        currentDSODays,
        debtorsBalance,
        interestType,
        interestRate,
        perAnnumDirectLabourCosts,
        currentBadDebts,
        averageBadDebt,
        dsoImprovement,
        labourSavings,
        numberOfDebtors,
        numberOfCollectors,
        projectedCustomerGrowth,
        averagePaymentTerms,
      }
      console.log("Calculating with inputs:", detailedInputs)
      const calculatedResults = await calculateDetailedROI(detailedInputs)
      console.log("Calculation results:", calculatedResults)
      setResults(calculatedResults)
      setStep("results")
    } catch (error) {
      console.error("Error calculating detailed ROI:", error)
      alert("Error calculating ROI. Please check your inputs and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSendEmail = async () => {
    if (!name || !email || !company) return

    setIsSubmitting(true)
    try {
      const inputs =
        calculatorType === "simple"
          ? {
              currentDSO,
              averageInvoiceValue,
              monthlyInvoices,
              simpleDSOImprovement,
              simpleCostOfCapital,
            }
          : {
              implementationCost,
              monthlyCost,
              currentDSODays,
              debtorsBalance,
              interestType,
              interestRate,
              perAnnumDirectLabourCosts,
              currentBadDebts,
              averageBadDebt,
              dsoImprovement,
              labourSavings,
              numberOfDebtors,
              numberOfCollectors,
              projectedCustomerGrowth,
              averagePaymentTerms,
            }

      await sendROIEmail({
        name,
        email,
        company,
        calculatorType,
        results,
        inputs,
      })

      setEmailSent(true)
    } catch (error) {
      console.error("Error sending email:", error)
      alert("Error sending email. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                </Button>
              )}
            </div>
            <DialogDescription>
              {step === "calculator-type" && "Choose the calculator that best fits your needs"}
              {step === "simple-inputs" && "Quick ROI calculation based on DSO improvement"}
              {step === "detailed-inputs" && "Comprehensive invoice-to-cash analysis"}
              {step === "results" && "Your ROI analysis results"}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Calculator Type Selection */}
          {step === "calculator-type" && (
            <div className="space-y-6 py-4">
              <div className="grid md:grid-cols-2 gap-6">
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
                      placeholder="20"
                      value={simpleDSOImprovement}
                      onChange={(e) => setSimpleDSOImprovement(e.target.value)}
                      min="0"
                      max="100"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typical improvement: 15-30%</p>
                  </div>
                  <div>
                    <Label htmlFor="simpleCostOfCapital">Cost of Capital (%)</Label>
                    <Input
                      id="simpleCostOfCapital"
                      type="number"
                      placeholder="8"
                      value={simpleCostOfCapital}
                      onChange={(e) => setSimpleCostOfCapital(e.target.value)}
                      min="0"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your annual interest rate</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="currentDSO">Current DSO (Days Sales Outstanding) *</Label>
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
                  <Label htmlFor="averageInvoiceValue">Average Invoice Value ($) *</Label>
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
                  <Label htmlFor="monthlyInvoices">Monthly Invoices *</Label>
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
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSimpleCalculate}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                  disabled={!isSimpleFormValid() || isSubmitting}
                  type="button"
                >
                  {isSubmitting ? (
                    "Calculating..."
                  ) : (
                    <>
                      Calculate ROI
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2b: Detailed Calculator Inputs */}
          {step === "detailed-inputs" && (
            <div className="space-y-6 py-4">
              <Accordion
                type="multiple"
                defaultValue={["cost", "bank", "debt", "savings", "financial", "team"]}
                className="w-full"
              >
                {/* Cost Structure */}
                <AccordionItem value="cost" className="border rounded-lg px-4 mb-2">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold">Cost Structure</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="implementationCost">Implementation Cost ($) *</Label>
                          <Input
                            id="implementationCost"
                            type="number"
                            placeholder="10000"
                            value={implementationCost}
                            onChange={(e) => setImplementationCost(e.target.value)}
                            min="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="monthlyCost">Monthly Cost ($) *</Label>
                          <Input
                            id="monthlyCost"
                            type="number"
                            placeholder="500"
                            value={monthlyCost}
                            onChange={(e) => setMonthlyCost(e.target.value)}
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="perAnnumDirectLabourCosts">Per Annum Direct Labour Costs ($) *</Label>
                        <Input
                          id="perAnnumDirectLabourCosts"
                          type="number"
                          placeholder="150000"
                          value={perAnnumDirectLabourCosts}
                          onChange={(e) => setPerAnnumDirectLabourCosts(e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Bank Interest */}
                <AccordionItem value="bank" className="border rounded-lg px-4 mb-2">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold">Bank Interest</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="interestType">Interest Type</Label>
                        <Select
                          value={interestType}
                          onValueChange={(value: "loan" | "deposit") => setInterestType(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="loan">Loan Interest (Cost)</SelectItem>
                            <SelectItem value="deposit">Deposit Interest (Income)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="interestRate">Interest Rate (%) *</Label>
                        <Input
                          id="interestRate"
                          type="number"
                          placeholder="8.5"
                          value={interestRate}
                          onChange={(e) => setInterestRate(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Bad Debt */}
                <AccordionItem value="debt" className="border rounded-lg px-4 mb-2">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold">Bad Debt</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="currentBadDebts">Current Bad Debts ($) *</Label>
                        <Input
                          id="currentBadDebts"
                          type="number"
                          placeholder="50000"
                          value={currentBadDebts}
                          onChange={(e) => setCurrentBadDebts(e.target.value)}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="averageBadDebt">Average Bad Debt (%) *</Label>
                        <Input
                          id="averageBadDebt"
                          type="number"
                          placeholder="2.5"
                          value={averageBadDebt}
                          onChange={(e) => setAverageBadDebt(e.target.value)}
                          min="0"
                          step="0.1"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Expected Savings */}
                <AccordionItem value="savings" className="border rounded-lg px-4 mb-2">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold">Expected Savings</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dsoImprovement">DSO Improvement (%) *</Label>
                        <Input
                          id="dsoImprovement"
                          type="number"
                          placeholder="25"
                          value={dsoImprovement}
                          onChange={(e) => setDsoImprovement(e.target.value)}
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <Label htmlFor="labourSavings">Labour Savings (%) *</Label>
                        <Input
                          id="labourSavings"
                          type="number"
                          placeholder="30"
                          value={labourSavings}
                          onChange={(e) => setLabourSavings(e.target.value)}
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Financial Metrics */}
                <AccordionItem value="financial" className="border rounded-lg px-4 mb-2">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold">Financial Metrics</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="currentDSODays">Current DSO (Days) *</Label>
                          <Input
                            id="currentDSODays"
                            type="number"
                            placeholder="45"
                            value={currentDSODays}
                            onChange={(e) => setCurrentDSODays(e.target.value)}
                            min="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="debtorsBalance">Debtors Balance ($) *</Label>
                          <Input
                            id="debtorsBalance"
                            type="number"
                            placeholder="500000"
                            value={debtorsBalance}
                            onChange={(e) => setDebtorsBalance(e.target.value)}
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="averagePaymentTerms">Average Payment Terms</Label>
                        <Select
                          value={averagePaymentTerms}
                          onValueChange={(value: "net30" | "net60" | "net90") => setAveragePaymentTerms(value)}
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
                  </AccordionContent>
                </AccordionItem>

                {/* Team Structure & Growth */}
                <AccordionItem value="team" className="border rounded-lg px-4 mb-2">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-600" />
                      <span className="font-semibold">Team Structure & Growth</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="numberOfDebtors">Number of Debtors *</Label>
                          <Input
                            id="numberOfDebtors"
                            type="number"
                            placeholder="500"
                            value={numberOfDebtors}
                            onChange={(e) => setNumberOfDebtors(e.target.value)}
                            min="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="numberOfCollectors">Number of Collectors *</Label>
                          <Input
                            id="numberOfCollectors"
                            type="number"
                            placeholder="3"
                            value={numberOfCollectors}
                            onChange={(e) => setNumberOfCollectors(e.target.value)}
                            min="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="projectedCustomerGrowth">Projected Customer Growth (%) *</Label>
                        <Input
                          id="projectedCustomerGrowth"
                          type="number"
                          placeholder="15"
                          value={projectedCustomerGrowth}
                          onChange={(e) => setProjectedCustomerGrowth(e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep("calculator-type")} className="flex-1">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleDetailedCalculate}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                  disabled={!isDetailedFormValid() || isSubmitting}
                  type="button"
                >
                  {isSubmitting ? (
                    "Calculating..."
                  ) : (
                    <>
                      Calculate ROI
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === "results" && results && (
            <div className="space-y-6 py-4">
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6 text-center">
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {calculatorType === "simple" ? "Estimated Annual Savings" : "Total Annual Benefit"}
                </h3>
                <div className="text-5xl font-bold text-cyan-600 mb-2">
                  $
                  {calculatorType === "simple"
                    ? results.annualSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })
                    : results.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                {calculatorType === "detailed" && (
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <span>ROI: {results.roi?.toFixed(0)}%</span>
                    <span>•</span>
                    <span>Payback: {results.paybackMonths?.toFixed(1)} months</span>
                  </div>
                )}
              </div>

              {calculatorType === "simple" ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <Clock className="h-4 w-4" />
                      Current Cash Tied Up
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${results.currentCashTied?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <DollarSign className="h-4 w-4" />
                      Cash Released
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${results.cashReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <TrendingUp className="h-4 w-4" />
                      Current DSO
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{currentDSO} days</div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <TrendingUp className="h-4 w-4" />
                      New DSO (Projected)
                    </div>
                    <div className="text-2xl font-bold text-cyan-600">{results.newDSO?.toFixed(0)} days</div>
                    <div className="text-xs text-green-600 mt-1">{results.dsoImprovementPercent}% improvement</div>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <TrendingUp className="h-4 w-4" />
                      DSO Improvement
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{results.dsoReductionDays?.toFixed(0)} days</div>
                    <div className="text-xs text-gray-500 mt-1">
                      From {results.currentDSO} to {results.newDSO?.toFixed(0)} days
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <DollarSign className="h-4 w-4" />
                      Working Capital Released
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${results.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <DollarSign className="h-4 w-4" />
                      Interest Savings
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${results.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <Users className="h-4 w-4" />
                      Labour Cost Savings
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${results.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <Clock className="h-4 w-4" />
                      Bad Debt Reduction
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${results.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                      <TrendingUp className="h-4 w-4" />
                      Return on Investment
                    </div>
                    <div className="text-2xl font-bold text-cyan-600">{results.roi?.toFixed(0)}%</div>
                  </div>
                </div>
              )}

              <div className="border-t pt-6">
                <ROIReportPDF
                  calculatorType={calculatorType}
                  results={results}
                  inputs={
                    calculatorType === "simple"
                      ? {
                          currentDSO,
                          averageInvoiceValue,
                          monthlyInvoices,
                          simpleDSOImprovement,
                          simpleCostOfCapital,
                        }
                      : {
                          implementationCost,
                          monthlyCost,
                          currentDSODays,
                          debtorsBalance,
                          interestType,
                          interestRate,
                          perAnnumDirectLabourCosts,
                          currentBadDebts,
                          averageBadDebt,
                          dsoImprovement,
                          labourSavings,
                          numberOfDebtors,
                          numberOfCollectors,
                          projectedCustomerGrowth,
                          averagePaymentTerms,
                        }
                  }
                />
              </div>

              {!emailSent ? (
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <h4 className="font-semibold">Get Detailed Results via Email</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Input
                      placeholder="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                      placeholder="Company Name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="md:col-span-2"
                    />
                  </div>
                  <Button
                    onClick={handleSendEmail}
                    disabled={!name || !email || !company || isSubmitting}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    {isSubmitting ? "Sending..." : "Send Results to Email"}
                  </Button>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-800">
                  ✓ Results sent successfully! Check your email for the detailed report.
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                  Start New Calculation
                </Button>
              </div>
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
