"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BookOpen, Calculator, FileInput, TrendingUp, Users, DollarSign, Clock, CheckCircle2 } from "lucide-react"

interface ROICalculatorHelpModalProps {
  isOpen: boolean
  onClose: () => void
  calculatorType: "simple" | "detailed"
}

type Tab = "overview" | "inputs" | "calculations"

export function ROICalculatorHelpModal({ isOpen, onClose, calculatorType }: ROICalculatorHelpModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6 text-cyan-600" />
            ROI Calculator Help Guide
          </DialogTitle>
          <p className="text-gray-600 text-sm">
            Comprehensive guide to understanding and using the {calculatorType === "simple" ? "Simple" : "Detailed"} ROI
            calculator
          </p>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "overview"
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("inputs")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "inputs" ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab("calculations")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "calculations"
                ? "text-cyan-600 border-b-2 border-cyan-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Calculations
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-cyan-100 p-2 rounded-lg">
                    <Calculator className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="text-xl font-semibold">What This Calculator Does</h3>
                </div>

                <div className="space-y-4 text-gray-700">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-cyan-600 rounded-full mt-2" />
                    <div>
                      <p className="font-semibold mb-1">Cash Flow Improvement:</p>
                      <p className="text-sm">
                        Faster payment collection reduces Days Sales Outstanding (DSO), unlocking working capital that
                        would otherwise be tied up in receivables
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-cyan-600 rounded-full mt-2" />
                    <div>
                      <p className="font-semibold mb-1">Labour Savings:</p>
                      <p className="text-sm">
                        Automation reduces manual collection efforts, phone calls, and email follow-ups, freeing your
                        team to focus on strategic work
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-cyan-600 rounded-full mt-2" />
                    <div>
                      <p className="font-semibold mb-1">Interest Impact:</p>
                      <p className="text-sm">
                        Better cash flow reduces loan interest costs or increases deposit earnings, improving your
                        bottom line and financial flexibility
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-cyan-600 rounded-full mt-2" />
                    <div>
                      <p className="font-semibold mb-1">Bad Debt Reduction:</p>
                      <p className="text-sm">
                        Proactive collections and automated reminders reduce write-offs and improve payment rates before
                        accounts become uncollectible
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-cyan-600 rounded-full mt-2" />
                    <div>
                      <p className="font-semibold mb-1">Scalability:</p>
                      <p className="text-sm">
                        Handle more customers and invoices without proportional staff increases, supporting business
                        growth without overhead expansion
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-cyan-600 rounded-full mt-2" />
                    <div>
                      <p className="font-semibold mb-1">Payment Terms Analysis:</p>
                      <p className="text-sm">
                        See how different customer payment terms affect your cash flow and make data-driven decisions
                        about credit policies
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> This calculator provides estimates based on industry benchmarks and your input
                  data. Actual results may vary based on your specific business context, customer behavior, and
                  implementation approach.
                </p>
              </div>
            </div>
          )}

          {/* Inputs Tab */}
          {activeTab === "inputs" && (
            <div className="space-y-6">
              {calculatorType === "simple" ? (
                <>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-cyan-100 p-2 rounded-lg">
                        <FileInput className="h-6 w-6 text-cyan-600" />
                      </div>
                      <h3 className="text-xl font-semibold">Simple Calculator Inputs</h3>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-cyan-600" />
                          Expected DSO Improvement (%)
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          The percentage reduction in Days Sales Outstanding you expect to achieve
                        </p>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <p className="font-medium mb-1">Typical Range: 20-40%</p>
                          <p className="text-gray-600">
                            Most businesses see 25-35% improvement with automated collections and follow-up
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-cyan-600" />
                          Cost of Capital (%)
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Your annual interest rate for loans or opportunity cost of capital
                        </p>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <p className="font-medium mb-1">Common Values: 5-12%</p>
                          <p className="text-gray-600">
                            Use your actual borrowing rate or weighted average cost of capital (WACC)
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4 text-cyan-600" />
                          Current DSO (Days)
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Current average time to collect payment after invoicing
                        </p>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <p className="font-medium mb-1">Calculation:</p>
                          <p className="text-gray-600">
                            DSO = (Accounts Receivable / Total Credit Sales) × Number of Days
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-cyan-600" />
                          Average Invoice Value ($)
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">The typical value of a single invoice</p>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <p className="text-gray-600">Total annual revenue ÷ number of invoices issued</p>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-cyan-600" />
                          Monthly Invoices
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">Number of invoices issued per month</p>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          <p className="text-gray-600">Count all customer invoices, including recurring and one-time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-cyan-100 p-2 rounded-lg">
                        <FileInput className="h-6 w-6 text-cyan-600" />
                      </div>
                      <h3 className="text-xl font-semibold">Detailed Calculator Inputs</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3 text-cyan-600">Cost Structure</h4>
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Implementation Cost</p>
                            <p className="text-sm text-gray-700">
                              One-time setup and onboarding costs including data migration, training, and configuration
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Monthly Cost</p>
                            <p className="text-sm text-gray-700">
                              Recurring subscription or license fees for the accounts receivable automation platform
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Per Annum Direct Labour Costs</p>
                            <p className="text-sm text-gray-700">
                              Total annual salary and benefits for staff currently handling collections and AR
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 text-cyan-600">Financial Metrics</h4>
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Interest Rate</p>
                            <p className="text-sm text-gray-700">
                              Your loan interest rate (cost) or deposit rate (income) for released working capital
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Days Sales / Current DSO</p>
                            <p className="text-sm text-gray-700">
                              Annual period (typically 365) and current average collection time in days
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Debtors Balance</p>
                            <p className="text-sm text-gray-700">
                              Total current accounts receivable balance (amount owed by customers)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 text-cyan-600">Expected Improvements</h4>
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Labour Savings (%)</p>
                            <p className="text-sm text-gray-700">
                              Percentage of AR staff time freed up through automation (typically 30-50%)
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">DSO Improvement (%)</p>
                            <p className="text-sm text-gray-700">
                              Expected reduction in collection time (typically 20-40%)
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Bad Debt Metrics</p>
                            <p className="text-sm text-gray-700">
                              Current bad debt rate and total write-offs for proactive collection impact analysis
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 text-cyan-600">Team & Growth</h4>
                        <div className="space-y-3">
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Number of Debtors / Collectors</p>
                            <p className="text-sm text-gray-700">
                              Current customer count and AR team size for capacity analysis
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg border">
                            <p className="font-medium mb-1">Projected Customer Growth</p>
                            <p className="text-sm text-gray-700">
                              Expected increase in customer base to model scalability benefits
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Calculations Tab */}
          {activeTab === "calculations" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-cyan-100 p-2 rounded-lg">
                    <Calculator className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="text-xl font-semibold">How We Calculate Your ROI</h3>
                </div>

                <div className="space-y-6">
                  {calculatorType === "simple" ? (
                    <>
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                          1. Calculate Annual Revenue
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                          <p>Annual Revenue = Average Invoice Value × Monthly Invoices × 12</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          This gives us your total yearly revenue from invoiced sales
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                          2. Determine New DSO
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                          <p>New DSO = Current DSO × (1 - DSO Improvement %)</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">Example: 45 days × (1 - 30%) = 31.5 days</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                          3. Calculate Cash Released
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                          <p className="mb-1">Daily Revenue = Annual Revenue ÷ 365</p>
                          <p>Cash Released = (Current DSO - New DSO) × Daily Revenue</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          This is the working capital freed up by collecting payments faster
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                          4. Compute Annual Savings
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                          <p>Annual Savings = Cash Released × Cost of Capital %</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          The interest saved (or earned) on the released working capital
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                          1. DSO Improvement & Working Capital
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono space-y-1">
                          <p>Daily Sales = Debtors Balance ÷ Current DSO</p>
                          <p>New DSO = Current DSO × (1 - DSO Improvement %)</p>
                          <p>Working Capital Released = (Current DSO - New DSO) × Daily Sales</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">Measures cash unlocked by faster collections</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                          2. Interest Impact
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                          <p>Interest Savings = Working Capital Released × Interest Rate %</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          Annual interest saved on loans or earned on deposits
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                          3. Labour Cost Savings
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                          <p>Labour Savings = Direct Labour Costs × Labour Savings %</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">Staff time and costs saved through automation</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                          4. Bad Debt Reduction
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                          <p>Bad Debt Reduction = Current Bad Debts × Improvement Rate</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          Estimated reduction in write-offs through proactive collections
                        </p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-cyan-600" />
                          5. Total Annual Benefit & ROI
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono space-y-1">
                          <p>Total Annual Benefit = Interest Savings + Labour Savings + Bad Debt Reduction</p>
                          <p>Total Investment = Implementation Cost + (Monthly Cost × 12)</p>
                          <p>ROI % = (Total Annual Benefit ÷ Total Investment) × 100</p>
                          <p>Payback Period = Total Investment ÷ (Total Annual Benefit ÷ 12) months</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">Complete financial return and payback timeline</p>
                      </div>

                      <div className="bg-white p-4 rounded-lg border">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-5 w-5 text-cyan-600" />
                          6. Scalability Analysis
                        </h4>
                        <div className="bg-gray-50 p-3 rounded text-sm font-mono space-y-1">
                          <p>Current Capacity = Number of Debtors ÷ Number of Collectors</p>
                          <p>Future Debtors = Current Debtors × (1 + Growth %)</p>
                          <p>Additional Capacity = Future Debtors - Current Debtors</p>
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          How automation enables growth without proportional headcount increases
                        </p>
                      </div>
                    </>
                  )}

                  <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                    <p className="text-sm text-gray-700">
                      <strong>Industry Benchmarks:</strong> Our calculations are based on real-world data from thousands
                      of implementations across various industries. Typical DSO improvements range from 25-35%, labour
                      savings from 30-50%, and bad debt reductions of 20-40%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
