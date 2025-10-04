"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, HelpCircle, TrendingUp, DollarSign, Users, Clock, AlertCircle } from "lucide-react"
import { ROICalculatorHelpModal } from "./roi-calculator-help-modal"
import { ROIReportPDF } from "./roi-report-pdf"

interface ROICalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

type CalculatorType = "simple" | "detailed"
type Step = "calculator-type" | "calculator-inputs" | "contact-form" | "verification" | "results"

interface SimpleInputs {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}

interface DetailedInputs {
  implementationCost: string
  monthlyCost: string
  perAnnumDirectLabourCosts: string
  interestType: "loan" | "deposit"
  interestRate: string
  averageBadDebt: string
  currentBadDebts: string
  labourSavings: string
  dsoImprovement: string
  currentDSODays: string
  debtorsBalance: string
  averagePaymentTerms: string
  numberOfDebtors: string
  numberOfCollectors: string
  projectedCustomerGrowth: string
}

interface ContactInfo {
  name: string
  email: string
  company: string
  phone: string
}

interface SimpleResults {
  currentDSO: number
  newDSO: number
  dsoImprovement: number
  currentCashTied: number
  cashReleased: number
  annualSavings: number
  costOfCapital: number
}

interface DetailedResults {
  currentDSO: number
  newDSO: number
  dsoReductionDays: number
  workingCapitalReleased: number
  interestSavings: number
  labourCostSavings: number
  badDebtReduction: number
  totalAnnualBenefit: number
  roi: number
  paybackMonths: number
  implementationCost: number
  annualCost: number
  totalFirstYearCost: number
  netBenefit: number
  threeYearValue: number
  currentCapacity: number
  additionalCapacity: number
  projectedGrowthValue: number
  paymentTermsAnalysis: Array<{
    term: string
    currentDSO: number
    improvedDSO: number
    benefit: number
  }>
}

export function ROICalculatorModal({ isOpen, onClose }: ROICalculatorModalProps) {
  const [step, setStep] = useState<Step>("calculator-type")
  const [calculatorType, setCalculatorType] = useState<CalculatorType | null>(null)
  const [showHelp, setShowHelp] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [simpleInputs, setSimpleInputs] = useState<SimpleInputs>({
    currentDSO: "",
    averageInvoiceValue: "",
    monthlyInvoices: "",
    simpleDSOImprovement: "25",
    simpleCostOfCapital: "8",
  })

  const [detailedInputs, setDetailedInputs] = useState<DetailedInputs>({
    implementationCost: "",
    monthlyCost: "",
    perAnnumDirectLabourCosts: "",
    interestType: "loan",
    interestRate: "",
    averageBadDebt: "",
    currentBadDebts: "",
    labourSavings: "30",
    dsoImprovement: "25",
    currentDSODays: "",
    debtorsBalance: "",
    averagePaymentTerms: "net30",
    numberOfDebtors: "",
    numberOfCollectors: "",
    projectedCustomerGrowth: "15",
  })

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: "",
    email: "",
    company: "",
    phone: "",
  })

  const [simpleResults, setSimpleResults] = useState<SimpleResults | null>(null)
  const [detailedResults, setDetailedResults] = useState<DetailedResults | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleReset = () => {
    setStep("calculator-type")
    setCalculatorType(null)
    setSimpleInputs({
      currentDSO: "",
      averageInvoiceValue: "",
      monthlyInvoices: "",
      simpleDSOImprovement: "25",
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
      dsoImprovement: "25",
      currentDSODays: "",
      debtorsBalance: "",
      averagePaymentTerms: "net30",
      numberOfDebtors: "",
      numberOfCollectors: "",
      projectedCustomerGrowth: "15",
    })
    setContactInfo({
      name: "",
      email: "",
      company: "",
      phone: "",
    })
    setSimpleResults(null)
    setDetailedResults(null)
    setValidationErrors({})
    setVerificationCode("")
    setVerificationError("")
  }

  const validateSimpleForm = () => {
    const errors: Record<string, string> = {}
    if (!simpleInputs.currentDSO || Number.parseFloat(simpleInputs.currentDSO) <= 0) {
      errors.currentDSO = "Current DSO is required and must be greater than 0"
    }
    if (!simpleInputs.averageInvoiceValue || Number.parseFloat(simpleInputs.averageInvoiceValue) <= 0) {
      errors.averageInvoiceValue = "Average invoice value is required and must be greater than 0"
    }
    if (!simpleInputs.monthlyInvoices || Number.parseFloat(simpleInputs.monthlyInvoices) <= 0) {
      errors.monthlyInvoices = "Monthly invoices is required and must be greater than 0"
    }
    if (!simpleInputs.simpleDSOImprovement || Number.parseFloat(simpleInputs.simpleDSOImprovement) <= 0) {
      errors.simpleDSOImprovement = "DSO improvement is required and must be greater than 0"
    }
    if (!simpleInputs.simpleCostOfCapital || Number.parseFloat(simpleInputs.simpleCostOfCapital) <= 0) {
      errors.simpleCostOfCapital = "Cost of capital is required and must be greater than 0"
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateDetailedForm = () => {
    const errors: Record<string, string> = {}

    if (!detailedInputs.implementationCost || Number.parseFloat(detailedInputs.implementationCost) < 0) {
      errors.implementationCost = "Implementation cost is required"
    }
    if (!detailedInputs.monthlyCost || Number.parseFloat(detailedInputs.monthlyCost) < 0) {
      errors.monthlyCost = "Monthly cost is required"
    }
    if (!detailedInputs.perAnnumDirectLabourCosts || Number.parseFloat(detailedInputs.perAnnumDirectLabourCosts) < 0) {
      errors.perAnnumDirectLabourCosts = "Direct labour costs are required"
    }
    if (!detailedInputs.interestRate || Number.parseFloat(detailedInputs.interestRate) < 0) {
      errors.interestRate = "Interest rate is required"
    }
    if (!detailedInputs.averageBadDebt || Number.parseFloat(detailedInputs.averageBadDebt) < 0) {
      errors.averageBadDebt = "Average bad debt is required"
    }
    if (!detailedInputs.currentBadDebts || Number.parseFloat(detailedInputs.currentBadDebts) < 0) {
      errors.currentBadDebts = "Current bad debts are required"
    }
    if (!detailedInputs.labourSavings || Number.parseFloat(detailedInputs.labourSavings) < 0) {
      errors.labourSavings = "Labour savings percentage is required"
    }
    if (!detailedInputs.dsoImprovement || Number.parseFloat(detailedInputs.dsoImprovement) < 0) {
      errors.dsoImprovement = "DSO improvement percentage is required"
    }
    if (!detailedInputs.currentDSODays || Number.parseFloat(detailedInputs.currentDSODays) < 0) {
      errors.currentDSODays = "Current DSO days are required"
    }
    if (!detailedInputs.debtorsBalance || Number.parseFloat(detailedInputs.debtorsBalance) < 0) {
      errors.debtorsBalance = "Debtors balance is required"
    }
    if (!detailedInputs.numberOfDebtors || Number.parseFloat(detailedInputs.numberOfDebtors) < 0) {
      errors.numberOfDebtors = "Number of debtors is required"
    }
    if (!detailedInputs.numberOfCollectors || Number.parseFloat(detailedInputs.numberOfCollectors) < 0) {
      errors.numberOfCollectors = "Number of collectors is required"
    }
    if (!detailedInputs.projectedCustomerGrowth || Number.parseFloat(detailedInputs.projectedCustomerGrowth) < 0) {
      errors.projectedCustomerGrowth = "Projected customer growth is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateContactForm = () => {
    const errors: Record<string, string> = {}
    if (!contactInfo.name.trim()) {
      errors.name = "Name is required"
    }
    if (!contactInfo.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!contactInfo.phone.trim()) {
      errors.phone = "Phone number is required"
    }
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const calculateSimpleROI = () => {
    const currentDSO = Number.parseFloat(simpleInputs.currentDSO)
    const avgInvoice = Number.parseFloat(simpleInputs.averageInvoiceValue)
    const monthlyInvoices = Number.parseFloat(simpleInputs.monthlyInvoices)
    const dsoImprovement = Number.parseFloat(simpleInputs.simpleDSOImprovement) / 100
    const costOfCapital = Number.parseFloat(simpleInputs.simpleCostOfCapital) / 100

    const annualRevenue = avgInvoice * monthlyInvoices * 12
    const dailyRevenue = annualRevenue / 365
    const currentCashTied = dailyRevenue * currentDSO
    const newDSO = currentDSO * (1 - dsoImprovement)
    const newCashTied = dailyRevenue * newDSO
    const cashReleased = currentCashTied - newCashTied
    const annualSavings = cashReleased * costOfCapital

    setSimpleResults({
      currentDSO,
      newDSO,
      dsoImprovement: dsoImprovement * 100,
      currentCashTied,
      cashReleased,
      annualSavings,
      costOfCapital: costOfCapital * 100,
    })
  }

  const calculateDetailedROI = () => {
    const implementationCost = Number.parseFloat(detailedInputs.implementationCost)
    const monthlyCost = Number.parseFloat(detailedInputs.monthlyCost)
    const labourCosts = Number.parseFloat(detailedInputs.perAnnumDirectLabourCosts)
    const interestRate = Number.parseFloat(detailedInputs.interestRate) / 100
    const currentBadDebts = Number.parseFloat(detailedInputs.currentBadDebts)
    const labourSavings = Number.parseFloat(detailedInputs.labourSavings) / 100
    const dsoImprovement = Number.parseFloat(detailedInputs.dsoImprovement) / 100
    const currentDSODays = Number.parseFloat(detailedInputs.currentDSODays)
    const debtorsBalance = Number.parseFloat(detailedInputs.debtorsBalance)
    const numberOfDebtors = Number.parseFloat(detailedInputs.numberOfDebtors)
    const numberOfCollectors = Number.parseFloat(detailedInputs.numberOfCollectors)
    const projectedGrowth = Number.parseFloat(detailedInputs.projectedCustomerGrowth) / 100

    const dsoReductionDays = currentDSODays * dsoImprovement
    const newDSO = currentDSODays - dsoReductionDays
    const dailyRevenue = debtorsBalance / currentDSODays
    const workingCapitalReleased = dailyRevenue * dsoReductionDays
    const interestSavings = workingCapitalReleased * interestRate
    const labourCostSavings = labourCosts * labourSavings
    const badDebtReduction = currentBadDebts * 0.5
    const totalAnnualBenefit = interestSavings + labourCostSavings + badDebtReduction
    const annualCost = monthlyCost * 12
    const totalFirstYearCost = implementationCost + annualCost
    const netBenefit = totalAnnualBenefit - annualCost
    const roi = (netBenefit / implementationCost) * 100
    const paybackMonths = implementationCost / (totalAnnualBenefit / 12)
    const threeYearValue = totalAnnualBenefit * 3 - implementationCost - annualCost * 3
    const currentCapacity = numberOfDebtors / numberOfCollectors
    const additionalCapacity = currentCapacity * 0.3
    const projectedGrowthValue = numberOfDebtors * projectedGrowth

    const paymentTermsAnalysis = [
      { term: "Net 0", currentDSO: currentDSODays * 0.5, improvedDSO: currentDSODays * 0.5 * (1 - dsoImprovement) },
      { term: "Net 30", currentDSO: currentDSODays, improvedDSO: newDSO },
      { term: "Net 60", currentDSO: currentDSODays * 1.5, improvedDSO: currentDSODays * 1.5 * (1 - dsoImprovement) },
      { term: "Net 90", currentDSO: currentDSODays * 2, improvedDSO: currentDSODays * 2 * (1 - dsoImprovement) },
    ].map((item) => ({
      ...item,
      benefit: ((item.currentDSO - item.improvedDSO) * dailyRevenue * interestRate) / 365,
    }))

    setDetailedResults({
      currentDSO: currentDSODays,
      newDSO,
      dsoReductionDays,
      workingCapitalReleased,
      interestSavings,
      labourCostSavings,
      badDebtReduction,
      totalAnnualBenefit,
      roi,
      paybackMonths,
      implementationCost,
      annualCost,
      totalFirstYearCost,
      netBenefit,
      threeYearValue,
      currentCapacity,
      additionalCapacity,
      projectedGrowthValue,
      paymentTermsAnalysis,
    })
  }

  const handleContinueFromInputs = async () => {
    const isValid = calculatorType === "simple" ? validateSimpleForm() : validateDetailedForm()
    if (!isValid) return

    if (calculatorType === "simple") {
      calculateSimpleROI()
    } else {
      calculateDetailedROI()
    }

    setStep("contact-form")
  }

  const handleSubmitContact = async () => {
    if (!validateContactForm()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/verification-code/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: contactInfo.email }),
      })

      if (!response.ok) {
        throw new Error("Failed to send verification code")
      }

      setStep("verification")
    } catch (error) {
      console.error("Error sending verification code:", error)
      setValidationErrors({
        email: "Failed to send verification code. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError("Please enter the verification code")
      return
    }

    setIsVerifying(true)
    setVerificationError("")

    try {
      const verifyResponse = await fetch("/api/verification-code/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: contactInfo.email,
          code: verificationCode,
        }),
      })

      if (!verifyResponse.ok) {
        throw new Error("Invalid verification code")
      }

      const emailData = {
        name: contactInfo.name,
        email: contactInfo.email,
        company: contactInfo.company,
        phone: contactInfo.phone,
        calculatorType,
        inputs: calculatorType === "simple" ? simpleInputs : detailedInputs,
        results: calculatorType === "simple" ? simpleResults : detailedResults,
      }

      const emailResponse = await fetch("/api/roi-calculator/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      })

      if (!emailResponse.ok) {
        throw new Error("Failed to send results")
      }

      setStep("results")
    } catch (error) {
      console.error("Verification error:", error)
      setVerificationError("Invalid verification code. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const renderCalculatorTypeStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Choose Your Calculator</h3>
        <p className="text-muted-foreground">Select the calculator that best fits your needs</p>
      </div>

      <div className="grid gap-4">
        <button
          onClick={() => {
            setCalculatorType("simple")
            setStep("calculator-inputs")
          }}
          className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-lg">Simple Calculator</h4>
              <p className="text-sm text-muted-foreground">
                Quick ROI estimate based on DSO improvement. Perfect for getting a ballpark figure in minutes.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Clock className="h-4 w-4" />
                <span>~2 minutes</span>
              </div>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            setCalculatorType("detailed")
            setStep("calculator-inputs")
          }}
          className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold text-lg">Detailed Calculator</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive analysis including labour savings, bad debt reduction, and complete ROI breakdown.
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Clock className="h-4 w-4" />
                <span>~5 minutes</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  )

  const renderSimpleCalculatorInputs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Simple ROI Calculator</h3>
          <p className="text-sm text-muted-foreground">Quick estimate of your potential savings</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowHelp(true)}>
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentDSO">Current DSO (Days) *</Label>
          <Input
            id="currentDSO"
            type="number"
            value={simpleInputs.currentDSO}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, currentDSO: e.target.value })}
            placeholder="e.g., 45"
          />
          {validationErrors.currentDSO && <p className="text-sm text-red-500">{validationErrors.currentDSO}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="averageInvoiceValue">Average Invoice Value ($) *</Label>
          <Input
            id="averageInvoiceValue"
            type="number"
            value={simpleInputs.averageInvoiceValue}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, averageInvoiceValue: e.target.value })}
            placeholder="e.g., 5000"
          />
          {validationErrors.averageInvoiceValue && (
            <p className="text-sm text-red-500">{validationErrors.averageInvoiceValue}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="monthlyInvoices">Number of Invoices per Month *</Label>
          <Input
            id="monthlyInvoices"
            type="number"
            value={simpleInputs.monthlyInvoices}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, monthlyInvoices: e.target.value })}
            placeholder="e.g., 100"
          />
          {validationErrors.monthlyInvoices && (
            <p className="text-sm text-red-500">{validationErrors.monthlyInvoices}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="simpleDSOImprovement">Expected DSO Improvement (%) *</Label>
          <Input
            id="simpleDSOImprovement"
            type="number"
            value={simpleInputs.simpleDSOImprovement}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, simpleDSOImprovement: e.target.value })}
            placeholder="e.g., 25"
          />
          {validationErrors.simpleDSOImprovement && (
            <p className="text-sm text-red-500">{validationErrors.simpleDSOImprovement}</p>
          )}
          <p className="text-xs text-muted-foreground">Typical improvement: 20-30%</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="simpleCostOfCapital">Cost of Capital (%) *</Label>
          <Input
            id="simpleCostOfCapital"
            type="number"
            value={simpleInputs.simpleCostOfCapital}
            onChange={(e) => setSimpleInputs({ ...simpleInputs, simpleCostOfCapital: e.target.value })}
            placeholder="e.g., 8"
          />
          {validationErrors.simpleCostOfCapital && (
            <p className="text-sm text-red-500">{validationErrors.simpleCostOfCapital}</p>
          )}
          <p className="text-xs text-muted-foreground">Your lending rate or opportunity cost</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep("calculator-type")} className="flex-1">
          Back
        </Button>
        <Button onClick={handleContinueFromInputs} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )

  const renderDetailedCalculatorInputs = () => (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 pb-4">
        <div>
          <h3 className="text-2xl font-bold">Detailed ROI Calculator</h3>
          <p className="text-sm text-muted-foreground">Comprehensive analysis of your potential ROI</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setShowHelp(true)}>
          <HelpCircle className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Cost Structure
          </h4>
          <div className="space-y-4 pl-7">
            <div className="space-y-2">
              <Label htmlFor="implementationCost">Implementation Cost ($) *</Label>
              <Input
                id="implementationCost"
                type="number"
                value={detailedInputs.implementationCost}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, implementationCost: e.target.value })}
                placeholder="e.g., 50000"
              />
              {validationErrors.implementationCost && (
                <p className="text-sm text-red-500">{validationErrors.implementationCost}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyCost">Monthly Subscription Cost ($) *</Label>
              <Input
                id="monthlyCost"
                type="number"
                value={detailedInputs.monthlyCost}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, monthlyCost: e.target.value })}
                placeholder="e.g., 2000"
              />
              {validationErrors.monthlyCost && <p className="text-sm text-red-500">{validationErrors.monthlyCost}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="perAnnumDirectLabourCosts">Annual Direct Labour Costs ($) *</Label>
              <Input
                id="perAnnumDirectLabourCosts"
                type="number"
                value={detailedInputs.perAnnumDirectLabourCosts}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, perAnnumDirectLabourCosts: e.target.value })}
                placeholder="e.g., 150000"
              />
              {validationErrors.perAnnumDirectLabourCosts && (
                <p className="text-sm text-red-500">{validationErrors.perAnnumDirectLabourCosts}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Financial Metrics
          </h4>
          <div className="space-y-4 pl-7">
            <div className="space-y-2">
              <Label htmlFor="interestType">Interest Type *</Label>
              <Select
                value={detailedInputs.interestType}
                onValueChange={(value: "loan" | "deposit") =>
                  setDetailedInputs({ ...detailedInputs, interestType: value })
                }
              >
                <SelectTrigger id="interestType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="loan">Loan Interest (Cost)</SelectItem>
                  <SelectItem value="deposit">Deposit Interest (Income)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate (%) *</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={detailedInputs.interestRate}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, interestRate: e.target.value })}
                placeholder="e.g., 7.5"
              />
              {validationErrors.interestRate && <p className="text-sm text-red-500">{validationErrors.interestRate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="averageBadDebt">Average Bad Debt Rate (%) *</Label>
              <Input
                id="averageBadDebt"
                type="number"
                step="0.1"
                value={detailedInputs.averageBadDebt}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, averageBadDebt: e.target.value })}
                placeholder="e.g., 2.5"
              />
              {validationErrors.averageBadDebt && (
                <p className="text-sm text-red-500">{validationErrors.averageBadDebt}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentBadDebts">Current Annual Bad Debts ($) *</Label>
              <Input
                id="currentBadDebts"
                type="number"
                value={detailedInputs.currentBadDebts}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, currentBadDebts: e.target.value })}
                placeholder="e.g., 50000"
              />
              {validationErrors.currentBadDebts && (
                <p className="text-sm text-red-500">{validationErrors.currentBadDebts}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Accounts Receivable Data
          </h4>
          <div className="space-y-4 pl-7">
            <div className="space-y-2">
              <Label htmlFor="currentDSODays">Current DSO (Days) *</Label>
              <Input
                id="currentDSODays"
                type="number"
                value={detailedInputs.currentDSODays}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, currentDSODays: e.target.value })}
                placeholder="e.g., 45"
              />
              {validationErrors.currentDSODays && (
                <p className="text-sm text-red-500">{validationErrors.currentDSODays}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="debtorsBalance">Total Debtors Balance ($) *</Label>
              <Input
                id="debtorsBalance"
                type="number"
                value={detailedInputs.debtorsBalance}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, debtorsBalance: e.target.value })}
                placeholder="e.g., 500000"
              />
              {validationErrors.debtorsBalance && (
                <p className="text-sm text-red-500">{validationErrors.debtorsBalance}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="averagePaymentTerms">Average Payment Terms *</Label>
              <Select
                value={detailedInputs.averagePaymentTerms}
                onValueChange={(value) => setDetailedInputs({ ...detailedInputs, averagePaymentTerms: value })}
              >
                <SelectTrigger id="averagePaymentTerms">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net0">Net 0 (Immediate)</SelectItem>
                  <SelectItem value="net30">Net 30</SelectItem>
                  <SelectItem value="net60">Net 60</SelectItem>
                  <SelectItem value="net90">Net 90</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfDebtors">Number of Debtors *</Label>
              <Input
                id="numberOfDebtors"
                type="number"
                value={detailedInputs.numberOfDebtors}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, numberOfDebtors: e.target.value })}
                placeholder="e.g., 500"
              />
              {validationErrors.numberOfDebtors && (
                <p className="text-sm text-red-500">{validationErrors.numberOfDebtors}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Team & Growth
          </h4>
          <div className="space-y-4 pl-7">
            <div className="space-y-2">
              <Label htmlFor="numberOfCollectors">Number of Collections Staff *</Label>
              <Input
                id="numberOfCollectors"
                type="number"
                value={detailedInputs.numberOfCollectors}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, numberOfCollectors: e.target.value })}
                placeholder="e.g., 3"
              />
              {validationErrors.numberOfCollectors && (
                <p className="text-sm text-red-500">{validationErrors.numberOfCollectors}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectedCustomerGrowth">Projected Customer Growth (%) *</Label>
              <Input
                id="projectedCustomerGrowth"
                type="number"
                value={detailedInputs.projectedCustomerGrowth}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, projectedCustomerGrowth: e.target.value })}
                placeholder="e.g., 15"
              />
              {validationErrors.projectedCustomerGrowth && (
                <p className="text-sm text-red-500">{validationErrors.projectedCustomerGrowth}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-lg">Improvement Targets</h4>
          <div className="space-y-4 pl-7">
            <div className="space-y-2">
              <Label htmlFor="labourSavings">Expected Labour Savings (%) *</Label>
              <Input
                id="labourSavings"
                type="number"
                value={detailedInputs.labourSavings}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, labourSavings: e.target.value })}
                placeholder="e.g., 30"
              />
              {validationErrors.labourSavings && (
                <p className="text-sm text-red-500">{validationErrors.labourSavings}</p>
              )}
              <p className="text-xs text-muted-foreground">Typical range: 25-40% through automation</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dsoImprovement">Expected DSO Improvement (%) *</Label>
              <Input
                id="dsoImprovement"
                type="number"
                value={detailedInputs.dsoImprovement}
                onChange={(e) => setDetailedInputs({ ...detailedInputs, dsoImprovement: e.target.value })}
                placeholder="e.g., 25"
              />
              {validationErrors.dsoImprovement && (
                <p className="text-sm text-red-500">{validationErrors.dsoImprovement}</p>
              )}
              <p className="text-xs text-muted-foreground">Typical range: 20-30%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 sticky bottom-0 bg-background pt-4">
        <Button variant="outline" onClick={() => setStep("calculator-type")} className="flex-1">
          Back
        </Button>
        <Button onClick={handleContinueFromInputs} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  )

  const renderContactForm = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Almost There!</h3>
        <p className="text-muted-foreground">Enter your details to receive your personalized ROI report</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={contactInfo.name}
            onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
            placeholder="John Smith"
          />
          {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
            placeholder="john@company.com"
          />
          {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company Name (Optional)</Label>
          <Input
            id="company"
            value={contactInfo.company}
            onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
            placeholder="Company Ltd"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={contactInfo.phone}
            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />
          {validationErrors.phone && <p className="text-sm text-red-500">{validationErrors.phone}</p>}
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4 text-sm">
        <p className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            We'll send a verification code to your email. Your information will be kept confidential and used only to
            provide your ROI report.
          </span>
        </p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep("calculator-inputs")} className="flex-1">
          Back
        </Button>
        <Button onClick={handleSubmitContact} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Sending Code..." : "Send Verification Code"}
        </Button>
      </div>
    </div>
  )

  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Verify Your Email</h3>
        <p className="text-muted-foreground">
          We've sent a 6-digit code to <strong>{contactInfo.email}</strong>
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verificationCode">Verification Code</Label>
          <Input
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
          />
          {verificationError && <p className="text-sm text-red-500">{verificationError}</p>}
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4 text-sm">
        <p>Didn't receive the code? Check your spam folder or click back to re-enter your email.</p>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep("contact-form")} className="flex-1">
          Back
        </Button>
        <Button onClick={handleVerifyCode} disabled={isVerifying} className="flex-1">
          {isVerifying ? "Verifying..." : "Verify & View Results"}
        </Button>
      </div>
    </div>
  )

  const renderSimpleResults = () => {
    if (!simpleResults) return null

    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-primary">Your ROI Results</h3>
          <p className="text-muted-foreground">Based on your inputs, here's what Kuhlekt could deliver</p>
        </div>

        <div className="grid gap-4">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center border-2 border-primary/20">
            <p className="text-sm font-medium text-muted-foreground mb-2">Estimated Annual Savings</p>
            <p className="text-4xl font-bold text-primary">
              ${simpleResults.annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {simpleResults.dsoImprovement.toFixed(0)}% DSO improvement
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">Current DSO</p>
              <p className="text-2xl font-bold">{simpleResults.currentDSO.toFixed(0)} days</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">Projected DSO</p>
              <p className="text-2xl font-bold text-primary">{simpleResults.newDSO.toFixed(0)} days</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">Current Cash Tied</p>
              <p className="text-2xl font-bold">
                ${simpleResults.currentCashTied.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground mb-1">Cash Released</p>
              <p className="text-2xl font-bold text-green-600">
                ${simpleResults.cashReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>

        <ROIReportPDF calculatorType="simple" results={simpleResults} inputs={simpleInputs} />

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="font-semibold">What's Next?</p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Check your email for the detailed report</li>
            <li>Schedule a demo to see Kuhlekt in action</li>
            <li>Speak with our team about your specific needs</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
            Calculate Again
          </Button>
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    )
  }

  const renderDetailedResults = () => {
    if (!detailedResults) return null

    return (
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="text-center space-y-2 sticky top-0 bg-background z-10 pb-4">
          <h3 className="text-2xl font-bold text-primary">Your Projected ROI</h3>
          <p className="text-sm text-muted-foreground">Comprehensive analysis of your potential return</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border-2 border-cyan-500 bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 text-center">
            <p className="text-sm font-medium text-cyan-700 mb-2">ROI</p>
            <p className="text-4xl font-bold text-cyan-600">{detailedResults.roi.toFixed(1)}%</p>
            <Button size="sm" className="mt-3 bg-cyan-600 hover:bg-cyan-700">
              Excellent
            </Button>
          </div>
          <div className="rounded-lg border-2 border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100 p-6 text-center">
            <p className="text-sm font-medium text-rose-700 mb-2 flex items-center justify-center gap-1">
              <Clock className="h-4 w-4" />
              Payback Period
            </p>
            <p className="text-4xl font-bold text-rose-600">{detailedResults.paybackMonths.toFixed(1)}</p>
            <p className="text-sm text-rose-700 mt-1">months</p>
          </div>
        </div>

        <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-white p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold">Cash Flow Boost Waiting</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            To calculate Monthly Cash Flow improvements, please include projected revenue growth and existing cash flow
            details.
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Current DSO</span>
              <span className="font-semibold">{detailedResults.currentDSO.toFixed(0)} days</span>
            </div>
            <div className="flex justify-between items-center text-blue-600">
              <span className="text-sm font-medium">Improved DSO</span>
              <span className="font-bold">{detailedResults.newDSO.toFixed(0)} days</span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Note: Actual DSO in typically 30-45 days. Values may vary based on payment terms and collection
              efficiency.
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Payment Terms Impact Analysis</h4>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-medium">Payment Terms</th>
                  <th className="text-right p-3 font-medium">Current DSO</th>
                  <th className="text-right p-3 font-medium">Improved DSO</th>
                  <th className="text-right p-3 font-medium">Estimated Benefit</th>
                </tr>
              </thead>
              <tbody>
                {detailedResults.paymentTermsAnalysis.map((term, idx) => (
                  <tr key={idx} className={idx === 1 ? "bg-blue-50" : ""}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {term.term}
                        {idx === 1 && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">Current</span>
                        )}
                      </div>
                    </td>
                    <td className="text-right p-3">{term.currentDSO.toFixed(0)} days</td>
                    <td className="text-right p-3 text-blue-600 font-medium">{term.improvedDSO.toFixed(0)} days</td>
                    <td className="text-right p-3 font-semibold">
                      ${term.benefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            Note: Actual DSO in typically 30-45 days. Days assumes 30-day payment terms.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Business Growth Without Additional Headcount</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border-2 border-rose-300 bg-rose-50 p-4 text-center">
              <p className="text-sm text-rose-700 mb-1">Current Capacity</p>
              <p className="text-3xl font-bold text-rose-600">
                {detailedResults.currentCapacity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-rose-700 mt-1">customers per collector</p>
            </div>
            <div className="rounded-lg border-2 border-cyan-500 bg-cyan-50 p-4 text-center">
              <p className="text-sm text-cyan-700 mb-1">Implementation Cost</p>
              <p className="text-3xl font-bold text-cyan-600">${detailedResults.implementationCost.toLocaleString()}</p>
            </div>
          </div>
          <div className="rounded-lg border bg-gradient-to-br from-cyan-50 to-white p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Additional Capacity (No New Hires)</span>
              <span className="text-xl font-bold text-cyan-600">
                +{detailedResults.additionalCapacity.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              With automation, your team can handle 30% more customers without additional headcount.
            </p>
          </div>
          <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-900">Growth Scenario: 80% Customer Increase</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Without automation</span>
                <span className="font-semibold">Additional headcount required</span>
              </div>
              <div className="flex justify-between text-green-700">
                <span className="text-sm font-medium">With automation</span>
                <span className="font-bold">$0 hiring costs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Financial Impact
          </h4>
          <div className="space-y-3">
            <div className="rounded-lg border bg-gradient-to-r from-green-50 to-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Recurring Savings</p>
                  <p className="text-xs text-muted-foreground mt-1">Interest + Labour + Bad Debt Reduction</p>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ${detailedResults.totalAnnualBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">One-Time Cash Flow Benefit</p>
                  <p className="text-xs text-muted-foreground mt-1">Working capital released</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  ${detailedResults.workingCapitalReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-white p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Operational Savings</p>
                  <p className="text-xs text-muted-foreground mt-1">Reduced labour costs</p>
                </div>
                <p className="text-2xl font-bold text-purple-600">
                  ${(detailedResults.labourCostSavings / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            <div className="rounded-lg border-2 border-rose-300 bg-rose-50 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-rose-900">Total First Year Investment</p>
                  <p className="text-xs text-muted-foreground mt-1">Implementation + Annual subscription</p>
                </div>
                <p className="text-2xl font-bold text-rose-600">
                  $
                  {detailedResults.totalFirstYearCost.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">DSO Improvement</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border-2 border-rose-300 bg-rose-50 p-4 text-center">
              <p className="text-xs text-rose-700 mb-1">Current DSO</p>
              <p className="text-3xl font-bold text-rose-600">{detailedResults.currentDSO.toFixed(0)}</p>
              <p className="text-xs text-rose-700 mt-1">days</p>
            </div>
            <div className="rounded-lg border-2 border-cyan-500 bg-cyan-50 p-4 text-center">
              <p className="text-xs text-cyan-700 mb-1">Improved DSO</p>
              <p className="text-3xl font-bold text-cyan-600">{detailedResults.newDSO.toFixed(0)}</p>
              <p className="text-xs text-cyan-700 mt-1">days</p>
            </div>
            <div className="rounded-lg border-2 border-green-500 bg-green-50 p-4 text-center">
              <p className="text-xs text-green-700 mb-1">Improvement</p>
              <p className="text-3xl font-bold text-green-600">{detailedResults.dsoReductionDays.toFixed(0)}</p>
              <p className="text-xs text-green-700 mt-1">days</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10 p-6">
          <h4 className="font-semibold text-lg mb-3">Summary</h4>
          <div className="space-y-3 text-sm">
            <p>
              By implementing the Kuhlekt invoice-to-cash platform,{" "}
              <strong>
                your organization could achieve an ROI of {detailedResults.roi.toFixed(0)}% with a payback period of
                just {detailedResults.paybackMonths.toFixed(1)} months
              </strong>
              . You'd save approximately{" "}
              <strong>
                ${detailedResults.totalAnnualBenefit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>{" "}
              annually through improved cash flow, reduced labour costs, and better debt management.
            </p>
            <p>
              The platform would reduce your DSO from <strong>{detailedResults.currentDSO.toFixed(0)} days</strong> to{" "}
              <strong>{detailedResults.newDSO.toFixed(0)} days</strong>, releasing{" "}
              <strong>
                ${detailedResults.workingCapitalReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </strong>{" "}
              in working capital. Additionally, your team could handle{" "}
              <strong>
                {detailedResults.additionalCapacity.toLocaleString(undefined, { maximumFractionDigits: 0 })} more
                customers
              </strong>{" "}
              without additional headcount.
            </p>
            <p className="text-primary font-medium">
              Ready to unlock these benefits? Schedule a demo to see how Kuhlekt can transform your invoice-to-cash
              process.
            </p>
          </div>
        </div>

        <ROIReportPDF calculatorType="detailed" results={detailedResults} inputs={detailedInputs} />

        <div className="rounded-lg bg-muted p-4 space-y-2">
          <p className="font-semibold">What's Next?</p>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>Check your email for the comprehensive report</li>
            <li>Schedule a personalized demo with our team</li>
            <li>Discuss implementation timelines and pricing</li>
            <li>Review case studies from similar organizations</li>
          </ul>
        </div>

        <div className="flex gap-2 sticky bottom-0 bg-background pt-4">
          <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
            Calculate Again
          </Button>
          <Button onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>ROI Calculator</DialogTitle>
            <DialogDescription>
              Calculate your potential return on investment with Kuhlekt's invoice-to-cash platform
            </DialogDescription>
          </DialogHeader>

          {step === "calculator-type" && renderCalculatorTypeStep()}
          {step === "calculator-inputs" &&
            (calculatorType === "simple" ? renderSimpleCalculatorInputs() : renderDetailedCalculatorInputs())}
          {step === "contact-form" && renderContactForm()}
          {step === "verification" && renderVerificationStep()}
          {step === "results" && (calculatorType === "simple" ? renderSimpleResults() : renderDetailedResults())}
        </DialogContent>
      </Dialog>

      <ROICalculatorHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  )
}
