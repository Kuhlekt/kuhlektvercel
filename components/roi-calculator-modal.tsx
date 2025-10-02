"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ROICalculatorModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ROIResults {
  annualSavings: number
  dsoReduction: number
  timesSaved: number
  cashFlowImprovement: number
}

export function ROICalculatorModal({ isOpen, onClose }: ROICalculatorModalProps) {
  const [step, setStep] = useState<"input" | "contact" | "results">("input")
  const [formData, setFormData] = useState({
    // ROI Calculator inputs
    currentDSO: "",
    averageInvoiceValue: "",
    monthlyInvoices: "",
    // Contact information
    email: "",
    phone: "",
    fullName: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [roiResults, setROIResults] = useState<ROIResults | null>(null)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\-+$$$$]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const calculateROI = () => {
    const currentDSO = Number.parseFloat(formData.currentDSO)
    const avgInvoiceValue = Number.parseFloat(formData.averageInvoiceValue)
    const monthlyInvoices = Number.parseFloat(formData.monthlyInvoices)

    // Validate inputs
    const newErrors: Record<string, string> = {}
    if (!currentDSO || currentDSO <= 0) newErrors.currentDSO = "Please enter a valid DSO"
    if (!avgInvoiceValue || avgInvoiceValue <= 0) newErrors.averageInvoiceValue = "Please enter a valid invoice value"
    if (!monthlyInvoices || monthlyInvoices <= 0) newErrors.monthlyInvoices = "Please enter valid number of invoices"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Calculate ROI metrics
    const dsoReduction = currentDSO * 0.35 // 35% average reduction
    const newDSO = currentDSO - dsoReduction
    const annualRevenue = avgInvoiceValue * monthlyInvoices * 12
    const cashFlowImprovement = (annualRevenue / 365) * dsoReduction
    const annualSavings = cashFlowImprovement + monthlyInvoices * 12 * 25 // $25 per invoice in manual processing costs
    const timesSaved = monthlyInvoices * 2 * 12 // 2 hours saved per invoice monthly

    setROIResults({
      annualSavings: Math.round(annualSavings),
      dsoReduction: Math.round(dsoReduction),
      timesSaved: Math.round(timesSaved),
      cashFlowImprovement: Math.round(cashFlowImprovement),
    })

    setStep("contact")
  }

  const handleContactSubmit = async () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Name is required"
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = "Please enter a valid email address"
    if (!formData.phone || !validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (at least 10 digits)"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Submit to your backend API
      const response = await fetch("/api/roi-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          roiResults,
          timestamp: new Date().toISOString(),
        }),
      })

      if (!response.ok) throw new Error("Failed to submit")

      setStep("results")
    } catch (error) {
      console.error("Submission error:", error)
      setErrors({ submit: "Failed to submit. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep("input")
    setFormData({
      currentDSO: "",
      averageInvoiceValue: "",
      monthlyInvoices: "",
      email: "",
      phone: "",
      fullName: "",
    })
    setErrors({})
    setROIResults(null)
    onClose()
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
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="h-6 w-6 text-cyan-600" />
            ROI Calculator
          </DialogTitle>
          <DialogDescription>
            {step === "input" && "Calculate your potential savings with Kuhlekt"}
            {step === "contact" && "Get your detailed ROI report"}
            {step === "results" && "Your Potential ROI with Kuhlekt"}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: ROI Input */}
        {step === "input" && (
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentDSO">Current Days Sales Outstanding (DSO)</Label>
                <Input
                  id="currentDSO"
                  type="number"
                  placeholder="e.g., 45"
                  value={formData.currentDSO}
                  onChange={(e) => handleInputChange("currentDSO", e.target.value)}
                  className={errors.currentDSO ? "border-red-500" : ""}
                />
                {errors.currentDSO && <p className="text-sm text-red-500 mt-1">{errors.currentDSO}</p>}
              </div>

              <div>
                <Label htmlFor="averageInvoiceValue">Average Invoice Value ($)</Label>
                <Input
                  id="averageInvoiceValue"
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.averageInvoiceValue}
                  onChange={(e) => handleInputChange("averageInvoiceValue", e.target.value)}
                  className={errors.averageInvoiceValue ? "border-red-500" : ""}
                />
                {errors.averageInvoiceValue && (
                  <p className="text-sm text-red-500 mt-1">{errors.averageInvoiceValue}</p>
                )}
              </div>

              <div>
                <Label htmlFor="monthlyInvoices">Monthly Invoices Sent</Label>
                <Input
                  id="monthlyInvoices"
                  type="number"
                  placeholder="e.g., 200"
                  value={formData.monthlyInvoices}
                  onChange={(e) => handleInputChange("monthlyInvoices", e.target.value)}
                  className={errors.monthlyInvoices ? "border-red-500" : ""}
                />
                {errors.monthlyInvoices && <p className="text-sm text-red-500 mt-1">{errors.monthlyInvoices}</p>}
              </div>
            </div>

            <Button onClick={calculateROI} className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" size="lg">
              Calculate ROI
            </Button>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {step === "contact" && roiResults && (
          <div className="space-y-6 py-4">
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <h3 className="font-semibold text-cyan-900 mb-2">Your Estimated Savings Preview</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Annual Savings</p>
                  <p className="text-xl font-bold text-cyan-600">{formatCurrency(roiResults.annualSavings)}</p>
                </div>
                <div>
                  <p className="text-gray-600">DSO Reduction</p>
                  <p className="text-xl font-bold text-cyan-600">{roiResults.dsoReduction} days</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">Enter your contact information to receive a detailed ROI report</p>

              <div>
                <Label htmlFor="fullName">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <Label htmlFor="email">
                  Business Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("input")} className="flex-1" disabled={isSubmitting}>
                Back
              </Button>
              <Button
                onClick={handleContactSubmit}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Get ROI Report"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Results Display */}
        {step === "results" && roiResults && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-cyan-200 bg-cyan-50">
                <CardContent className="p-6">
                  <DollarSign className="h-8 w-8 text-cyan-600 mb-2" />
                  <h3 className="text-sm text-gray-600 mb-1">Annual Savings</h3>
                  <p className="text-3xl font-bold text-cyan-600">{formatCurrency(roiResults.annualSavings)}</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                  <h3 className="text-sm text-gray-600 mb-1">DSO Reduction</h3>
                  <p className="text-3xl font-bold text-green-600">{roiResults.dsoReduction} days</p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <Clock className="h-8 w-8 text-blue-600 mb-2" />
                  <h3 className="text-sm text-gray-600 mb-1">Hours Saved Annually</h3>
                  <p className="text-3xl font-bold text-blue-600">{roiResults.timesSaved.toLocaleString()}</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-6">
                  <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
                  <h3 className="text-sm text-gray-600 mb-1">Cash Flow Improvement</h3>
                  <p className="text-3xl font-bold text-purple-600">{formatCurrency(roiResults.cashFlowImprovement)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
              <p className="text-sm text-gray-600 mb-4">
                We've sent a detailed ROI report to {formData.email}. Our team will reach out within 24 hours to discuss
                how Kuhlekt can help you achieve these results.
              </p>
              <Button asChild className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                <a href="/demo">Schedule a Demo</a>
              </Button>
            </div>

            <Button variant="outline" onClick={handleClose} className="w-full bg-transparent">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
