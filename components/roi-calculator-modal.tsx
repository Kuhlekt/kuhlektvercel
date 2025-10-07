"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, DollarSign, Clock, Users, Target, CheckCircle2, AlertCircle } from "lucide-react"
import { ROICalculatorHelpModal } from "./roi-calculator-help-modal"
import { ROIReportPDF } from "./roi-report-pdf"

interface ROICalculatorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface SimpleInputs {
  currentDSO: string
  averageInvoiceValue: string
  monthlyInvoices: string
  simpleDSOImprovement: string
  simpleCostOfCapital: string
}

interface DetailedInputs {
  numberOfDebtors: string
  numberOfCollectors: string
  averageCollectorSalary: string
  currentDSODays: string
  debtorsBalance: string
  costOfCapital: string
  currentBadDebtRate: string
  dsoImprovement: string
  labourSavings: string
  implementationCost: string
  monthlyCost: string
}

interface SimpleResults {
  currentDSO: number
  newDSO: number
  dsoImprovement: number
  currentCashTied: number
  cashReleased: number
  annualSavings: number
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
  implementationCost: number
  roi: number
  paybackMonths: number
}

export function ROICalculatorModal({ open, onOpenChange }: ROICalculatorModalProps) {
  const [activeTab, setActiveTab] = useState<"simple" | "detailed">("simple")

  // Simple calculator state
  const [simpleInputs, setSimpleInputs] = useState<SimpleInputs>({
    currentDSO: "45",
    averageInvoiceValue: "5000",
    monthlyInvoices: "100",
    simpleDSOImprovement: "25",
    simpleCostOfCapital: "8",
  })
  const [simpleResults, setSimpleResults] = useState<SimpleResults | null>(null)

  // Detailed calculator state
  const [detailedInputs, setDetailedInputs] = useState<DetailedInputs>({
    numberOfDebtors: "500",
    numberOfCollectors: "3",
    averageCollectorSalary: "50000",
    currentDSODays: "45",
    debtorsBalance: "2000000",
    costOfCapital: "8",
    currentBadDebtRate: "2",
    dsoImprovement: "25",
    labourSavings: "30",
    implementationCost: "25000",
    monthlyCost: "2000",
  })
  const [detailedResults, setDetailedResults] = useState<DetailedResults | null>(null)

  const calculateSimpleROI = () => {
    const currentDSO = Number.parseFloat(simpleInputs.currentDSO) || 0
    const avgInvoice = Number.parseFloat(simpleInputs.averageInvoiceValue) || 0
    const monthlyInvoices = Number.parseFloat(simpleInputs.monthlyInvoices) || 0
    const dsoImprovement = Number.parseFloat(simpleInputs.simpleDSOImprovement) || 25
    const costOfCapital = Number.parseFloat(simpleInputs.simpleCostOfCapital) || 8

    // Calculate annual revenue
    const annualRevenue = avgInvoice * monthlyInvoices * 12
    const dailyRevenue = annualRevenue / 365

    // Calculate new DSO
    const dsoImprovementPercent = dsoImprovement / 100
    const newDSO = currentDSO * (1 - dsoImprovementPercent)

    // Calculate cash tied up
    const currentCashTied = dailyRevenue * currentDSO
    const newCashTied = dailyRevenue * newDSO
    const cashReleased = currentCashTied - newCashTied

    // Calculate annual savings (interest on released working capital)
    const annualSavings = cashReleased * (costOfCapital / 100)

    setSimpleResults({
      currentDSO,
      newDSO,
      dsoImprovement,
      currentCashTied,
      cashReleased,
      annualSavings,
    })
  }

  const calculateDetailedROI = () => {
    const numberOfDebtors = Number.parseFloat(detailedInputs.numberOfDebtors) || 0
    const numberOfCollectors = Number.parseFloat(detailedInputs.numberOfCollectors) || 1
    const averageCollectorSalary = Number.parseFloat(detailedInputs.averageCollectorSalary) || 0
    const currentDSODays = Number.parseFloat(detailedInputs.currentDSODays) || 0
    const debtorsBalance = Number.parseFloat(detailedInputs.debtorsBalance) || 0
    const costOfCapital = Number.parseFloat(detailedInputs.costOfCapital) || 0
    const currentBadDebtRate = Number.parseFloat(detailedInputs.currentBadDebtRate) || 0
    const dsoImprovement = Number.parseFloat(detailedInputs.dsoImprovement) || 0
    const labourSavings = Number.parseFloat(detailedInputs.labourSavings) || 0
    const implementationCost = Number.parseFloat(detailedInputs.implementationCost) || 0
    const monthlyCost = Number.parseFloat(detailedInputs.monthlyCost) || 0

    // DSO calculations
    const dsoImprovementPercent = dsoImprovement / 100
    const newDSO = currentDSODays * (1 - dsoImprovementPercent)
    const dsoReductionDays = currentDSODays - newDSO

    // Working capital calculations
    const dailyRevenue = debtorsBalance / currentDSODays
    const workingCapitalReleased = dsoReductionDays * dailyRevenue

    // Interest savings
    const interestSavings = workingCapitalReleased * (costOfCapital / 100)

    // Labour cost savings
    const totalLabourCost = averageCollectorSalary * numberOfCollectors
    const labourCostSavings = totalLabourCost * (labourSavings / 100)

    // Bad debt reduction (50% improvement)
    const currentBadDebt = debtorsBalance * (currentBadDebtRate / 100)
    const badDebtReduction = currentBadDebt * 0.5

    // Total annual benefit
    const totalAnnualBenefit = interestSavings + labourCostSavings + badDebtReduction

    // ROI calculation
    const annualCost = monthlyCost * 12
    const totalFirstYearCost = implementationCost + annualCost
    const roi = (totalAnnualBenefit / totalFirstYearCost) * 100

    // Payback period
    const monthlyBenefit = totalAnnualBenefit / 12
    const paybackMonths = totalFirstYearCost / monthlyBenefit

    setDetailedResults({
      currentDSO: currentDSODays,
      newDSO,
      dsoReductionDays,
      workingCapitalReleased,
      interestSavings,
      labourCostSavings,
      badDebtReduction,
      totalAnnualBenefit,
      implementationCost: totalFirstYearCost,
      roi,
      paybackMonths,
    })
  }

  // Auto-calculate when inputs change
  useEffect(() => {
    if (activeTab === "simple") {
      calculateSimpleROI()
    }
  }, [simpleInputs, activeTab])

  useEffect(() => {
    if (activeTab === "detailed") {
      calculateDetailedROI()
    }
  }, [detailedInputs, activeTab])

  const handleSimpleInputChange = (field: keyof SimpleInputs, value: string) => {
    setSimpleInputs((prev) => ({ ...prev, [field]: value }))
  }

  const handleDetailedInputChange = (field: keyof DetailedInputs, value: string) => {
    setDetailedInputs((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Calculator className="h-6 w-6 text-primary" />
              ROI Calculator
            </DialogTitle>
            <ROICalculatorHelpModal />
          </div>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "simple" | "detailed")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">Simple Calculator</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Calculator</TabsTrigger>
          </TabsList>

          {/* Simple Calculator Tab */}
          <TabsContent value="simple" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Information</CardTitle>
                  <CardDescription>Enter your current business metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentDSO">Current DSO (Days)</Label>
                    <Input
                      id="currentDSO"
                      type="number"
                      value={simpleInputs.currentDSO}
                      onChange={(e) => handleSimpleInputChange("currentDSO", e.target.value)}
                      placeholder="45"
                    />
                    <p className="text-xs text-muted-foreground">Your current Days Sales Outstanding</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="averageInvoiceValue">Average Invoice Value ($)</Label>
                    <Input
                      id="averageInvoiceValue"
                      type="number"
                      value={simpleInputs.averageInvoiceValue}
                      onChange={(e) => handleSimpleInputChange("averageInvoiceValue", e.target.value)}
                      placeholder="5000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="monthlyInvoices">Monthly Invoices</Label>
                    <Input
                      id="monthlyInvoices"
                      type="number"
                      value={simpleInputs.monthlyInvoices}
                      onChange={(e) => handleSimpleInputChange("monthlyInvoices", e.target.value)}
                      placeholder="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="simpleDSOImprovement">Expected DSO Improvement (%)</Label>
                    <Input
                      id="simpleDSOImprovement"
                      type="number"
                      value={simpleInputs.simpleDSOImprovement}
                      onChange={(e) => handleSimpleInputChange("simpleDSOImprovement", e.target.value)}
                      placeholder="25"
                    />
                    <p className="text-xs text-muted-foreground">Industry average: 15-30%</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="simpleCostOfCapital">Cost of Capital (%)</Label>
                    <Input
                      id="simpleCostOfCapital"
                      type="number"
                      value={simpleInputs.simpleCostOfCapital}
                      onChange={(e) => handleSimpleInputChange("simpleCostOfCapital", e.target.value)}
                      placeholder="8"
                    />
                    <p className="text-xs text-muted-foreground">Your borrowing rate or expected return</p>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Estimated Results</CardTitle>
                  <CardDescription>Your potential savings and improvements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {simpleResults && (
                    <>
                      <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Current DSO</span>
                          <span className="text-2xl font-bold">{simpleResults.currentDSO} days</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Improved DSO</span>
                          <span className="text-2xl font-bold text-green-600">
                            {simpleResults.newDSO.toFixed(0)} days
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Cash Released</p>
                            <p className="text-lg font-bold">
                              ${simpleResults.cashReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Annual Savings</p>
                            <p className="text-lg font-bold text-green-600">
                              ${simpleResults.annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                          <Clock className="h-5 w-5 text-purple-600" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">DSO Improvement</p>
                            <p className="text-lg font-bold text-purple-600">{simpleResults.dsoImprovement}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t space-y-3">
                        <h4 className="font-semibold text-sm">Understanding Your Results</h4>
                        <p className="text-xs text-muted-foreground">
                          By improving your DSO by {simpleResults.dsoImprovement}%, you can release $
                          {simpleResults.cashReleased.toLocaleString(undefined, { maximumFractionDigits: 0 })} in
                          working capital. This translates to $
                          {simpleResults.annualSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })} in
                          annual savings based on your {simpleInputs.simpleCostOfCapital}% cost of capital.
                        </p>
                      </div>

                      {/* Disclaimer */}
                      <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-3 md:p-4 space-y-2">
                        <p className="text-xs md:text-sm font-semibold text-amber-900 flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          Important Disclaimer
                        </p>
                        <p className="text-xs text-amber-800 leading-relaxed">
                          The results shown are estimates based on the information you provided and industry averages.
                          Actual results may vary significantly depending on your specific business circumstances,
                          industry conditions, implementation quality, and various other factors. These calculations are
                          intended for informational purposes only and should not be considered as guaranteed outcomes
                          or financial advice. We recommend consulting with your financial advisors and conducting a
                          thorough analysis before making any business decisions.
                        </p>
                      </div>

                      {/* PDF Download - More Prominent */}
                      <div className="pt-4 border-2 border-primary bg-primary/5 rounded-lg p-4">
                        <ROIReportPDF calculatorType="simple" results={simpleResults} inputs={simpleInputs} />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Detailed Calculator Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Inputs */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfDebtors">Number of Debtors</Label>
                      <Input
                        id="numberOfDebtors"
                        type="number"
                        value={detailedInputs.numberOfDebtors}
                        onChange={(e) => handleDetailedInputChange("numberOfDebtors", e.target.value)}
                        placeholder="500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numberOfCollectors">Number of Collectors</Label>
                      <Input
                        id="numberOfCollectors"
                        type="number"
                        value={detailedInputs.numberOfCollectors}
                        onChange={(e) => handleDetailedInputChange("numberOfCollectors", e.target.value)}
                        placeholder="3"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="averageCollectorSalary">Average Collector Salary ($)</Label>
                      <Input
                        id="averageCollectorSalary"
                        type="number"
                        value={detailedInputs.averageCollectorSalary}
                        onChange={(e) => handleDetailedInputChange("averageCollectorSalary", e.target.value)}
                        placeholder="50000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentDSODays">Current DSO (Days)</Label>
                      <Input
                        id="currentDSODays"
                        type="number"
                        value={detailedInputs.currentDSODays}
                        onChange={(e) => handleDetailedInputChange("currentDSODays", e.target.value)}
                        placeholder="45"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="debtorsBalance">Total Debtors Balance ($)</Label>
                      <Input
                        id="debtorsBalance"
                        type="number"
                        value={detailedInputs.debtorsBalance}
                        onChange={(e) => handleDetailedInputChange("debtorsBalance", e.target.value)}
                        placeholder="2000000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="costOfCapital">Cost of Capital (%)</Label>
                      <Input
                        id="costOfCapital"
                        type="number"
                        value={detailedInputs.costOfCapital}
                        onChange={(e) => handleDetailedInputChange("costOfCapital", e.target.value)}
                        placeholder="8"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentBadDebtRate">Current Bad Debt Rate (%)</Label>
                      <Input
                        id="currentBadDebtRate"
                        type="number"
                        value={detailedInputs.currentBadDebtRate}
                        onChange={(e) => handleDetailedInputChange("currentBadDebtRate", e.target.value)}
                        placeholder="2"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expected Improvements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dsoImprovement">DSO Improvement (%)</Label>
                      <Input
                        id="dsoImprovement"
                        type="number"
                        value={detailedInputs.dsoImprovement}
                        onChange={(e) => handleDetailedInputChange("dsoImprovement", e.target.value)}
                        placeholder="25"
                      />
                      <p className="text-xs text-muted-foreground">Industry average: 15-30%</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="labourSavings">Labour Savings (%)</Label>
                      <Input
                        id="labourSavings"
                        type="number"
                        value={detailedInputs.labourSavings}
                        onChange={(e) => handleDetailedInputChange("labourSavings", e.target.value)}
                        placeholder="30"
                      />
                      <p className="text-xs text-muted-foreground">Typical range: 20-40%</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Implementation Costs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="implementationCost">One-time Implementation ($)</Label>
                      <Input
                        id="implementationCost"
                        type="number"
                        value={detailedInputs.implementationCost}
                        onChange={(e) => handleDetailedInputChange("implementationCost", e.target.value)}
                        placeholder="25000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyCost">Monthly Subscription ($)</Label>
                      <Input
                        id="monthlyCost"
                        type="number"
                        value={detailedInputs.monthlyCost}
                        onChange={(e) => handleDetailedInputChange("monthlyCost", e.target.value)}
                        placeholder="2000"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {detailedResults && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-green-50 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">ROI</p>
                            <p className="text-3xl font-bold text-green-600">{detailedResults.roi.toFixed(0)}%</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg text-center">
                            <p className="text-xs text-muted-foreground mb-1">Payback Period</p>
                            <p className="text-3xl font-bold text-blue-600">
                              {detailedResults.paybackMonths.toFixed(1)}
                            </p>
                            <p className="text-xs text-muted-foreground">months</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                            <span className="text-sm">DSO Improvement</span>
                            <span className="font-bold">
                              {detailedResults.currentDSO} → {detailedResults.newDSO.toFixed(0)} days
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                            <span className="text-sm">Working Capital Released</span>
                            <span className="font-bold text-green-600">
                              ${detailedResults.workingCapitalReleased.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                            <span className="text-sm">Annual Benefit</span>
                            <span className="font-bold text-green-600">
                              ${detailedResults.totalAnnualBenefit.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Benefit Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {detailedResults && (
                      <>
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <DollarSign className="h-5 w-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Interest Savings</p>
                            <p className="font-bold">${detailedResults.interestSavings.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <Users className="h-5 w-5 text-green-600" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Labour Cost Savings</p>
                            <p className="font-bold">${detailedResults.labourCostSavings.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-purple-600" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">Bad Debt Reduction</p>
                            <p className="font-bold">${detailedResults.badDebtReduction.toLocaleString()}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What This Means</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Faster Cash Collection</p>
                          <p className="text-xs text-muted-foreground">
                            Reduce DSO by {detailedInputs.dsoImprovement}% and improve cash flow
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Operational Efficiency</p>
                          <p className="text-xs text-muted-foreground">
                            Save {detailedInputs.labourSavings}% on labour costs through automation
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Reduced Risk</p>
                          <p className="text-xs text-muted-foreground">
                            Lower bad debt through better collection processes
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What's Next?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Target className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm">
                          Schedule a personalized demo to see how Kuhlekt can transform your AR process
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disclaimer */}
                {detailedResults && (
                  <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-3 md:p-4 space-y-2">
                    <p className="text-xs md:text-sm font-semibold text-amber-900 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      Important Disclaimer
                    </p>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      The results shown are estimates based on the information you provided and industry averages.
                      Actual results may vary significantly depending on your specific business circumstances, industry
                      conditions, implementation quality, and various other factors. These calculations are intended for
                      informational purposes only and should not be considered as guaranteed outcomes or financial
                      advice. We recommend consulting with your financial advisors and conducting a thorough analysis
                      before making any business decisions.
                    </p>
                  </div>
                )}

                {/* PDF Download - More Prominent */}
                {detailedResults && (
                  <div className="border-2 border-primary bg-primary/5 rounded-lg p-4">
                    <ROIReportPDF calculatorType="detailed" results={detailedResults} inputs={detailedInputs} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Close
              </Button>
              <Button onClick={() => (window.location.href = "/demo")}>Schedule a Demo</Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
