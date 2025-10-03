"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
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
  Mail,
  Shield,
  X,
  RotateCcw,
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
    "select" | "simple" | "detailed" | "contact" | "verify-email" | "simple-results" | "detailed-results"
  >("select")
  const [isCalculating, setIsCalculating] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [calculatorType, setCalculatorType] = useState<"simple" | "detailed">("simple")

  // Verification state
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [isSendingCode, setIsSendingCode] = useState(false)

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

  const dsoImprovementInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (step === "simple" && dsoImprovementInputRef.current) {
      // Small delay to ensure the dialog animation completes
      setTimeout(() => {
        dsoImprovementInputRef.current?.focus()
      }, 100)
    }
  }, [step])

  useEffect(() => {
    setVerificationError("")
  }, [step])

  useEffect(() => {
    if (isOpen) {
      setVerificationError("")
    }
  }, [isOpen])

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
    setVerificationCode("")
    setVerificationError("")
  }

  const handlePDFDownloadComplete = () => {
    resetAll()
    onClose()
  }

  const clearSimpleCalculator = () => {
    setSimpleData({
      currentDSO: "",
      averageInvoiceValue: "",
      monthlyInvoices: "",
      simpleDSOImprovement: "20",
      simpleCostOfCapital: "8",
    })
  }

  const clearDetailedCalculator = () => {
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
    if (!contactData.name || !contactData.email || !contactData.phone) {
      alert("Please fill in all contact fields")
      return
    }

    setIsSendingCode(true)
    setVerificationError("")

    try {
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactData.name,
          email: contactData.email,
          company: contactData.company,
          phone: contactData.phone,
          calculatorType,
          inputs: calculatorType === "simple" ? simpleData : detailedData,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Non-JSON response received:", response.status, response.statusText)
        const text = await response.text()
        console.error("[v0] Response text:", text)
        alert("Server error occurred. Please try again or contact support.")
        return
      }

      const result = await response.json()

      if (result.success) {
        setStep("verify-email")
      } else {
        alert(result.error || "Failed to send verification code. Please try again.")
      }
    } catch (error) {
      console.error("Error sending verification code:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setVerificationError("Please enter a valid 6-digit code")
      return
    }

    setIsVerifying(true)
    setVerificationError("")
    console.log("[v0] Starting verification process...")

    try {
      console.log("[v0] Calling verify-code API...")
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: contactData.email,
          code: verificationCode,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Non-JSON response received:", response.status, response.statusText)
        const text = await response.text()
        console.error("[v0] Response text:", text)
        setVerificationError("Server error occurred. Please try again.")
        setIsVerifying(false)
        return
      }

      const result = await response.json()
      console.log("[v0] Verification API result:", result)

      if (result.success) {
        console.log("[v0] Verification successful, starting ROI calculation...")
        // Email verified successfully, now calculate ROI and send results
        setIsCalculating(true)

        let results
        try {
          if (calculatorType === "simple") {
            console.log("[v0] Calculating simple ROI with data:", simpleData)
            try {
              results = await calculateSimpleROI(simpleData)
              console.log("[v0] Simple results:", results)
            } catch (simpleError) {
              console.error("[v0] Error in calculateSimpleROI:", simpleError)
              console.error("[v0] Error name:", simpleError instanceof Error ? simpleError.name : typeof simpleError)
              console.error(
                "[v0] Error message:",
                simpleError instanceof Error ? simpleError.message : String(simpleError),
              )
              console.error("[v0] Error stack:", simpleError instanceof Error ? simpleError.stack : "No stack trace")
              throw simpleError
            }
            setSimpleResults(results)
          } else {
            console.log("[v0] Calculating detailed ROI with data:", detailedData)
            try {
              results = await calculateDetailedROI(detailedData)
              console.log("[v0] Detailed results:", results)
            } catch (detailedError) {
              console.error("[v0] Error in calculateDetailedROI:", detailedError)
              console.error(
                "[v0] Error name:",
                detailedError instanceof Error ? detailedError.name : typeof detailedError,
              )
              console.error(
                "[v0] Error message:",
                detailedError instanceof Error ? detailedError.message : String(detailedError),
              )
              console.error(
                "[v0] Error stack:",
                detailedError instanceof Error ? detailedError.stack : "No stack trace",
              )
              throw detailedError
            }
            setDetailedResults(results)
          }

          console.log("[v0] ROI calculation complete, sending email to admin...")
          try {
            const emailResult = await sendROIEmail({
              name: contactData.name,
              email: contactData.email,
              company: contactData.company || "",
              calculatorType,
              results,
              inputs: calculatorType === "simple" ? simpleData : detailedData,
            })

            console.log("[v0] Email result:", emailResult)

            if (emailResult.success) {
              setEmailSent(true)
              console.log("[v0] Email sent successfully to admin")
            } else {
              console.error("[v0] Failed to send email:", emailResult.error)
              // Don't block the user from seeing results if email fails
              setEmailSent(false)
            }
          } catch (emailError) {
            console.error("[v0] Error in sendROIEmail:", emailError)
            console.error("[v0] Email error name:", emailError instanceof Error ? emailError.name : typeof emailError)
            console.error(
              "[v0] Email error message:",
              emailError instanceof Error ? emailError.message : String(emailError),
            )
            console.error("[v0] Email error stack:", emailError instanceof Error ? emailError.stack : "No stack trace")
            // Don't throw - allow user to see results even if email fails
            setEmailSent(false)
          }

          console.log("[v0] Setting step to results...")
          setStep(calculatorType === "simple" ? "simple-results" : "detailed-results")
          console.log("[v0] Verification process complete!")
        } catch (calcError) {
          console.error("[v0] Error during calculation or email:", calcError)
          console.error("[v0] Error type:", typeof calcError)
          console.error("[v0] Error instanceof Error:", calcError instanceof Error)
          if (calcError instanceof Error) {
            console.error("[v0] Error name:", calcError.name)
            console.error("[v0] Error message:", calcError.message)
            console.error("[v0] Error stack:", calcError.stack)
          } else {
            console.error("[v0] Error value:", String(calcError))
          }
          console.error("[v0] Calculator type:", calculatorType)
          console.error("[v0] Input data:", calculatorType === "simple" ? simpleData : detailedData)
          setVerificationError("Failed to calculate results. Please try again.")
          setIsCalculating(false)
          setIsVerifying(false)
          return
        }

        setIsCalculating(false)
      } else {
        console.log("[v0] Verification failed:", result.error)
        setVerificationError(result.error || "Invalid verification code")
      }
    } catch (error) {
      console.error("[v0] Error verifying code:", error)
      console.error("[v0] Verification error type:", typeof error)
      if (error instanceof Error) {
        console.error("[v0] Verification error name:", error.name)
        console.error("[v0] Verification error message:", error.message)
        console.error("[v0] Verification error stack:", error.stack)
      }
      setVerificationError("An error occurred. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendCode = async () => {
    setIsSendingCode(true)
    setVerificationError("")
    setVerificationCode("")

    try {
      const response = await fetch("/api/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: contactData.name,
          email: contactData.email,
          company: contactData.company,
          phone: contactData.phone,
          calculatorType,
          inputs: calculatorType === "simple" ? simpleData : detailedData,
        }),
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("[v0] Non-JSON response received:", response.status, response.statusText)
        const text = await response.text()
        console.error("[v0] Response text:", text)
        setVerificationError("Server error occurred. Please try again.")
        return
      }

      const result = await response.json()

      if (result.success) {
        alert("A new verification code has been sent to your email")
      } else {
        setVerificationError(result.error || "Failed to resend code")
      }
    } catch (error) {
      console.error("Error resending code:", error)
      setVerificationError("An error occurred. Please try again.")
    } finally {
      setIsSendingCode(false)
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
              <div className="flex items-center gap-2">
                {step !== "select" && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowHelp(true)}
                    className="bg-cyan-50 hover:bg-cyan-100 border-2 border-cyan-300 hover:border-cyan-400 transition-all"
                  >
                    <HelpCircle className="h-7 w-7 text-cyan-600 mr-2" />
                    <span className="font-semibold text-cyan-700">Help</span>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-red-50 hover:text-red-600"
                  title="Close calculator"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <DialogDescription>
              {step === "select" && "Choose the calculator that best fits your needs"}
              {step === "simple" && "Quick ROI calculation based on DSO improvement"}
              {step === "detailed" && "Comprehensive invoice-to-cash analysis"}
              {step === "contact" && "Your contact information to receive results"}
              {step === "verify-email" && "Verify your email address to view results"}
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
                      ref={dsoImprovementInputRef}
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
                  variant="outline"
                  onClick={clearSimpleCalculator}
                  className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300 bg-transparent"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear
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
                          placeholder="1500"
                        />
                      </div>
                      <div>
                        <Label>Monthly Cost ($) *</Label>
                        <Input
                          type="number"
                          value={detailedData.monthlyCost}
                          onChange={(e) => setDetailedData({ ...detailedData, monthlyCost: e.target.value })}
                          placeholder="2000"
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
                          placeholder="4.5"
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
                  variant="outline"
                  onClick={clearDetailedCalculator}
                  className="flex-1 hover:bg-red-50 hover:text-red-600 hover:border-red-300 bg-transparent"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Clear
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
                  Please provide your contact information. We'll send you a verification code to confirm your email
                  address before showing your personalized ROI results.
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
                  <Label>Company Name</Label>
                  <Input
                    type="text"
                    value={contactData.company}
                    onChange={(e) => setContactData({ ...contactData, company: e.target.value })}
                    placeholder="Acme Corporation"
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
                  disabled={isSendingCode}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  {isSendingCode ? "Sending Code..." : "Send Verification Code"}
                  {!isSendingCode && <Mail className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {step === "verify-email" && (
            <div className="space-y-6 py-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 mb-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-cyan-100 rounded-full p-4">
                    <Shield className="h-8 w-8 text-cyan-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">Check Your Email</h3>
                <p className="text-sm text-gray-700">
                  We've sent a 6-digit verification code to <strong>{contactData.email}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-2">The code will expire in 10 minutes</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Verification Code *</Label>
                  <Input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                      setVerificationCode(value)
                      setVerificationError("")
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono"
                    required
                  />
                  {verificationError && <p className="text-sm text-red-600 mt-2">{verificationError}</p>}
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isSendingCode}
                    className="text-sm text-cyan-600 hover:text-cyan-700 underline disabled:opacity-50"
                  >
                    {isSendingCode ? "Sending..." : "Resend Code"}
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("contact")} className="flex-1" disabled={isVerifying}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={isVerifying || isCalculating || verificationCode.length !== 6}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700"
                >
                  {isVerifying || isCalculating ? "Verifying..." : "Verify & View Results"}
                  {!isVerifying && !isCalculating && <ArrowRight className="ml-2 h-4 w-4" />}
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

              <ROIReportPDF
                calculatorType="simple"
                results={simpleResults}
                inputs={simpleData}
                onDownloadComplete={handlePDFDownloadComplete}
              />

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

              {/* Your Projected ROI Header */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-cyan-600 mb-6 flex items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  Your Projected ROI
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white border border-cyan-200 rounded-lg p-6 text-center">
                    <div className="text-sm text-gray-600 mb-2">ROI</div>
                    <div className="text-4xl font-bold text-cyan-600 mb-2">
                      {detailedResults.roi != null ? detailedResults.roi.toFixed(1) : "0.0"}%
                    </div>
                    <div className="text-xs text-gray-500">Return on Investment</div>
                  </div>

                  <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
                    <div className="text-sm text-gray-600 mb-2">Payback Period</div>
                    <div className="text-4xl font-bold text-red-500 mb-2">
                      {detailedResults.paybackMonths != null ? detailedResults.paybackMonths.toFixed(1) : "0.0"}
                    </div>
                    <div className="text-xs text-gray-500">Months</div>
                  </div>
                </div>
              </div>

              {/* Financial Benefits Breakdown */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-cyan-600" />
                  Financial Benefits Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">Working Capital Released</span>
                    <span className="font-semibold text-cyan-600">
                      ${detailedResults.workingCapitalReleased?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">Interest Savings</span>
                    <span className="font-semibold text-cyan-600">
                      ${detailedResults.interestSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">Labour Cost Savings</span>
                    <span className="font-semibold text-cyan-600">
                      ${detailedResults.labourCostSavings?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">Bad Debt Reduction</span>
                    <span className="font-semibold text-cyan-600">
                      ${detailedResults.badDebtReduction?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-green-50 -mx-6 px-6 py-3 rounded-b-lg">
                    <span className="font-bold text-gray-900">Total Annual Benefit</span>
                    <span className="font-bold text-green-600 text-xl">
                      ${detailedResults.totalAnnualBenefit?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* DSO Improvement */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cyan-600" />
                  DSO Improvement
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Current DSO</div>
                    <div className="text-2xl font-bold">{detailedResults.currentDSO} days</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">New DSO</div>
                    <div className="text-2xl font-bold text-cyan-600">{detailedResults.newDSO?.toFixed(0)} days</div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Days Reduced</div>
                    <div className="text-2xl font-bold text-green-600">
                      {detailedResults.dsoReductionDays?.toFixed(0)} days
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">DSO Improvement</div>
                    <div className="text-2xl font-bold text-cyan-600">{detailedData.dsoImprovement}%</div>
                  </div>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-600" />
                  Cost Analysis
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">Implementation Cost</span>
                    <span className="font-semibold">
                      ${Number.parseFloat(detailedData.implementationCost).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-700">Annual Cost</span>
                    <span className="font-semibold">
                      ${(Number.parseFloat(detailedData.monthlyCost) * 12).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-gray-50 -mx-6 px-6 py-3 rounded-b-lg">
                    <span className="font-bold text-gray-900">Total Cost (Year 1)</span>
                    <span className="font-bold text-gray-900 text-xl">
                      $
                      {detailedResults.totalImplementationAndAnnualCost?.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <ROIReportPDF
                calculatorType="detailed"
                results={detailedResults}
                inputs={detailedData}
                onDownloadComplete={handlePDFDownloadComplete}
              />

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
