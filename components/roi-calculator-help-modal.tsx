"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, BookOpen, FileInput, CalculatorIcon } from "lucide-react"

interface ROICalculatorHelpModalProps {
  isOpen: boolean
  onClose: () => void
  calculatorType: "simple" | "detailed"
}

type HelpTab = "overview" | "inputs" | "calculations"

export function ROICalculatorHelpModal({ isOpen, onClose, calculatorType }: ROICalculatorHelpModalProps) {
  const [activeTab, setActiveTab] = useState<HelpTab>("overview")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-cyan-600" />
              ROI Calculator Help Guide
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-gray-600 text-sm mt-2">Comprehensive guide to understanding and using the calculator</p>
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
              <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 mb-4">
                  <CalculatorIcon className="h-6 w-6 text-cyan-600" />
                  <h3 className="text-xl font-semibold text-gray-900">What This Calculator Does</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  The Kuhlekt ROI Calculator helps you understand the financial impact of automating your
                  invoice-to-cash process. It calculates potential savings across multiple areas of your business.
                </p>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-cyan-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">💰 Cash Flow Improvement</h4>
                  <p className="text-gray-700 text-sm">
                    Faster payment collection reduces Days Sales Outstanding (DSO), releasing working capital that can
                    be used for growth, debt reduction, or earning interest.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">⚙️ Labour Savings</h4>
                  <p className="text-gray-700 text-sm">
                    Automation reduces manual collection efforts, freeing up your team to focus on high-value activities
                    like customer relationships and strategic planning.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📈 Interest Impact</h4>
                  <p className="text-gray-700 text-sm">
                    Better cash flow reduces loan interest costs or increases deposit earnings, directly improving your
                    bottom line.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">🛡️ Bad Debt Reduction</h4>
                  <p className="text-gray-700 text-sm">
                    Proactive collections and automated reminders catch issues early, reducing write-offs and improving
                    your collection rate.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📊 Scalability</h4>
                  <p className="text-gray-700 text-sm">
                    Handle more customers and invoices without proportional staff increases, supporting business growth
                    efficiently.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-500 pl-4">
                  <h4 className="font-semibold text-gray-900 mb-2">📋 Payment Terms Analysis</h4>
                  <p className="text-gray-700 text-sm">
                    See how different customer payment terms affect your cash flow, helping you make informed decisions
                    about credit policies.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Inputs Tab */}
          {activeTab === "inputs" && (
            <div className="space-y-6">
              <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 mb-4">
                  <FileInput className="h-6 w-6 text-cyan-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Understanding Your Inputs</h3>
                </div>
                <p className="text-gray-700">
                  Each input helps build an accurate picture of your potential ROI. Here's what each field means and how
                  to find the right values.
                </p>
              </div>

              {calculatorType === "simple" ? (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Expected DSO Improvement (%)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      The percentage reduction in Days Sales Outstanding you expect with automation.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Typical range: 20-40%</li>
                      <li>• Conservative: 20-25%</li>
                      <li>• Aggressive: 35-40%</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Cost of Capital (%)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Your annual interest rate on borrowing or what you could earn by investing freed cash.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Business loan rate: 5-12%</li>
                      <li>• Line of credit: 4-8%</li>
                      <li>• Investment return: 3-7%</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Current DSO (Days)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Average number of days it takes to collect payment after invoicing.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Formula: (Accounts Receivable / Annual Revenue) × 365</li>
                      <li>• Industry average: 30-60 days</li>
                      <li>• Find this in your accounting reports</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Average Invoice Value ($)</h4>
                    <p className="text-sm text-gray-700 mb-2">Typical dollar amount of a single invoice.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Calculate: Total revenue / Number of invoices</li>
                      <li>• Use annual or monthly data</li>
                      <li>• Exclude outliers for accuracy</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Monthly Invoices</h4>
                    <p className="text-sm text-gray-700 mb-2">Number of invoices you send each month on average.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Count unique invoices, not line items</li>
                      <li>• Average over 3-6 months for accuracy</li>
                      <li>• Available in accounting software reports</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="font-semibold text-lg text-cyan-600">Cost Structure</h4>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Implementation Cost ($)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      One-time setup and implementation costs for the Kuhlekt system.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Includes setup, training, and integration</li>
                      <li>• Typical range: $25,000 - $100,000</li>
                      <li>• Depends on company size and complexity</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Monthly Cost ($)</h4>
                    <p className="text-sm text-gray-700 mb-2">Recurring monthly subscription cost for the platform.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Includes software, support, and updates</li>
                      <li>• Scales with usage and features</li>
                      <li>• Contact sales for accurate pricing</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Per Annum Direct Labour Costs ($)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Total annual cost of staff working on AR and collections.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Include salary, benefits, and overhead</li>
                      <li>• Only count time spent on collections</li>
                      <li>• Example: 2 FTEs × $70k = $140k</li>
                    </ul>
                  </div>

                  <h4 className="font-semibold text-lg text-cyan-600 mt-6">Financial Metrics</h4>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Interest Rate (%)</h4>
                    <p className="text-sm text-gray-700 mb-2">Your borrowing rate or potential investment return.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Use weighted average if multiple loans</li>
                      <li>• Consider opportunity cost</li>
                      <li>• Typical range: 4-10%</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Current DSO (Days)</h4>
                    <p className="text-sm text-gray-700 mb-2">Current Days Sales Outstanding from your AR reports.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Calculate: (AR Balance / Annual Revenue) × 365</li>
                      <li>• Use trailing 12-month average</li>
                      <li>• Industry benchmark: 30-45 days</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Debtors Balance ($)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Total accounts receivable balance (outstanding invoices).
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Found on your balance sheet</li>
                      <li>• Use current month-end figure</li>
                      <li>• Exclude credits and bad debt</li>
                    </ul>
                  </div>

                  <h4 className="font-semibold text-lg text-cyan-600 mt-6">Bad Debt</h4>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Average Bad Debt (%)</h4>
                    <p className="text-sm text-gray-700 mb-2">Percentage of revenue written off as uncollectable.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Calculate: (Bad Debt / Revenue) × 100</li>
                      <li>• Industry average: 1-3%</li>
                      <li>• Use annual figures for accuracy</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Current Bad Debts ($)</h4>
                    <p className="text-sm text-gray-700 mb-2">Annual amount written off as bad debt.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• From your P&L statement</li>
                      <li>• Include write-offs and allowances</li>
                      <li>• Use trailing 12 months</li>
                    </ul>
                  </div>

                  <h4 className="font-semibold text-lg text-cyan-600 mt-6">Expected Improvements</h4>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Labour Savings (%)</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Expected reduction in manual AR work through automation.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Typical automation: 30-50%</li>
                      <li>• Conservative estimate: 30%</li>
                      <li>• Full automation: 50-60%</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">DSO Improvement (%)</h4>
                    <p className="text-sm text-gray-700 mb-2">Expected reduction in collection time.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Industry average: 20-35%</li>
                      <li>• With full automation: 30-40%</li>
                      <li>• Depends on current processes</li>
                    </ul>
                  </div>

                  <h4 className="font-semibold text-lg text-cyan-600 mt-6">Team & Growth</h4>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Number of Debtors</h4>
                    <p className="text-sm text-gray-700 mb-2">Total number of customers with credit accounts.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Count active credit customers</li>
                      <li>• Include both current and past due</li>
                      <li>• Available in AR aging reports</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Number of Collectors</h4>
                    <p className="text-sm text-gray-700 mb-2">FTE count of staff doing AR collections work.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Count full-time equivalents</li>
                      <li>• Include partial allocations</li>
                      <li>• Example: 2 full-time + 1 part-time = 2.5</li>
                    </ul>
                  </div>

                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">Projected Customer Growth (%)</h4>
                    <p className="text-sm text-gray-700 mb-2">Expected annual growth in customer base.</p>
                    <ul className="text-sm text-gray-600 space-y-1 ml-4">
                      <li>• Based on business plan</li>
                      <li>• Consider market conditions</li>
                      <li>• Typical: 10-30% annually</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Calculations Tab */}
          {activeTab === "calculations" && (
            <div className="space-y-6">
              <div className="bg-cyan-50 p-6 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-2 mb-4">
                  <CalculatorIcon className="h-6 w-6 text-cyan-600" />
                  <h3 className="text-xl font-semibold text-gray-900">How We Calculate Your ROI</h3>
                </div>
                <p className="text-gray-700">
                  Understanding the formulas behind your results helps validate the potential value of automation.
                </p>
              </div>

              {calculatorType === "simple" ? (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 1: Calculate Annual Revenue</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      Annual Revenue = Average Invoice Value × Monthly Invoices × 12
                    </div>
                    <p className="text-sm text-gray-600">
                      This establishes your total yearly revenue from invoiced sales.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 2: Calculate DSO Improvement</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      DSO Reduction (days) = Current DSO × (DSO Improvement % / 100)
                      <br />
                      New DSO = Current DSO - DSO Reduction
                    </div>
                    <p className="text-sm text-gray-600">
                      Example: If current DSO is 45 days and you improve by 30%, your new DSO would be 31.5 days (a 13.5
                      day improvement).
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 3: Calculate Cash Released</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      Daily Revenue = Annual Revenue / 365
                      <br />
                      Cash Released = Daily Revenue × DSO Reduction (days)
                    </div>
                    <p className="text-sm text-gray-600">
                      This shows how much working capital becomes available from faster collections.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 4: Calculate Annual Savings</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      Monthly Interest Savings = Cash Released × (Cost of Capital % / 100) / 12
                      <br />
                      Annual Savings = Monthly Interest Savings × 12
                    </div>
                    <p className="text-sm text-gray-600">
                      The freed cash either reduces interest paid on loans or can be invested to earn returns.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">💡 Example Calculation</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>• Average Invoice: $5,000</p>
                      <p>• Monthly Invoices: 100</p>
                      <p>• Current DSO: 45 days</p>
                      <p>• DSO Improvement: 30%</p>
                      <p>• Cost of Capital: 5%</p>
                      <p className="pt-2 font-semibold">Result: ~$27,397 annual savings</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 1: DSO Improvement & Cash Flow</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      Annual Revenue = (Debtors Balance / Current DSO) × Days Sales
                      <br />
                      DSO Reduction (days) = Current DSO × (DSO Improvement % / 100)
                      <br />
                      New DSO = Current DSO - DSO Reduction
                      <br />
                      Working Capital Released = (Annual Revenue / Days Sales) × DSO Reduction
                    </div>
                    <p className="text-sm text-gray-600">
                      Faster collections free up cash tied in receivables, improving liquidity.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 2: Interest Savings</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      Interest Savings = Working Capital Released × (Interest Rate % / 100)
                    </div>
                    <p className="text-sm text-gray-600">
                      Freed capital reduces borrowing costs or generates investment returns, depending on your interest
                      type selection.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 3: Labour Cost Savings</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      Labour Savings = Per Annum Labour Costs × (Labour Savings % / 100)
                    </div>
                    <p className="text-sm text-gray-600">
                      Automation handles routine tasks, allowing staff to focus on exceptions and high-value work.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 4: Bad Debt Reduction</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      Bad Debt Reduction = Current Bad Debts × 0.40
                    </div>
                    <p className="text-sm text-gray-600">
                      Proactive collections and automated follow-ups typically reduce bad debt by 40% through earlier
                      intervention.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 5: Total Annual Benefit</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      Total Benefit = Interest Savings + Labour Savings + Bad Debt Reduction
                    </div>
                    <p className="text-sm text-gray-600">Sum of all benefits provides the total annual value.</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-l-4 border-l-cyan-500">
                    <h4 className="font-semibold text-gray-900 mb-3">Step 6: ROI & Payback</h4>
                    <div className="bg-gray-50 p-3 rounded font-mono text-sm mb-2">
                      Annual Cost = Monthly Cost × 12
                      <br />
                      Total Investment = Implementation Cost + Annual Cost
                      <br />
                      Net Annual Benefit = Total Benefit - Annual Cost
                      <br />
                      ROI % = (Net Annual Benefit / Total Investment) × 100
                      <br />
                      Payback Months = (Total Investment / Total Benefit) × 12
                    </div>
                    <p className="text-sm text-gray-600">
                      ROI shows return on investment, while payback period indicates how quickly you recover costs.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-lg border border-cyan-200 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Industry Benchmarks</h4>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>• Typical DSO Improvement: 25-35%</p>
                      <p>• Labour Efficiency Gain: 30-50%</p>
                      <p>• Bad Debt Reduction: 30-50%</p>
                      <p>• Average ROI: 250-450%</p>
                      <p>• Typical Payback: 6-18 months</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-6">
                    <h4 className="font-semibold text-gray-900 mb-2">⚠️ Important Notes</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>• Results are estimates based on industry averages and your inputs</p>
                      <p>• Actual results vary by industry, company size, and current processes</p>
                      <p>• Implementation timeline affects when benefits are realized</p>
                      <p>• Conservative estimates recommended for financial planning</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-6 border-t">
          <Button onClick={onClose} className="bg-cyan-600 hover:bg-cyan-700">
            Got It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
