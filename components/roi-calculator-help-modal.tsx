"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  HelpCircle,
  Lightbulb,
  Target,
  BarChart3,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ROICalculatorHelpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  calculatorType: "simple" | "detailed"
  currentStep?: string
}

export function ROICalculatorHelpModal({
  open,
  onOpenChange,
  calculatorType,
  currentStep,
}: ROICalculatorHelpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <HelpCircle className="h-7 w-7 text-cyan-600" />
            {calculatorType === "simple" ? "Simple Calculator Guide" : "Detailed Calculator Guide"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {calculatorType === "simple"
              ? "Quick ROI estimation for fast decision-making"
              : "Comprehensive financial analysis for strategic planning"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <Accordion type="multiple" defaultValue={["overview", "inputs", "calculations", "tips"]} className="w-full">
            {/* Overview */}
            <AccordionItem value="overview">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-cyan-600" />
                  <span>What This Calculator Does</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {calculatorType === "simple" ? (
                  <>
                    <p className="text-gray-700 leading-relaxed">
                      The <strong>Simple ROI Calculator</strong> is designed for businesses that want a quick,
                      straightforward estimate of potential savings from automating their accounts receivable process.
                      It focuses on the single most impactful benefit:{" "}
                      <strong className="text-cyan-600">working capital improvement through faster collections</strong>.
                    </p>

                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg p-5">
                      <h4 className="font-bold text-cyan-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Perfect For:
                      </h4>
                      <ul className="space-y-2 text-sm text-cyan-900">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1 font-bold">✓</span>
                          <span>
                            <strong>Small to mid-sized businesses</strong> looking for quick insights
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1 font-bold">✓</span>
                          <span>
                            <strong>Initial feasibility assessment</strong> before deeper analysis
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1 font-bold">✓</span>
                          <span>
                            <strong>Businesses with straightforward</strong> invoicing and collections
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1 font-bold">✓</span>
                          <span>
                            <strong>Quick executive presentations</strong> and board discussions
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-cyan-600" />
                        Key Metrics You'll See:
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-semibold text-gray-900 mb-1">💰 Current Cash Tied Up</p>
                          <p className="text-xs text-gray-600">
                            How much working capital is locked in outstanding invoices right now
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-semibold text-gray-900 mb-1">🚀 Cash Released</p>
                          <p className="text-xs text-gray-600">
                            One-time working capital improvement from faster collections
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-semibold text-gray-900 mb-1">📊 DSO Improvement</p>
                          <p className="text-xs text-gray-600">Your current vs. projected Days Sales Outstanding</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="font-semibold text-gray-900 mb-1">💵 Annual Savings</p>
                          <p className="text-xs text-gray-600">
                            Recurring yearly benefit based on your cost of capital
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">⚡ Time to Complete: 2-3 minutes</h4>
                      <p className="text-sm text-yellow-800">
                        You only need 5 basic inputs that most finance teams have readily available. No complex data
                        gathering required.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 leading-relaxed">
                      The <strong>Detailed ROI Calculator</strong> provides an enterprise-grade financial analysis that
                      examines <strong className="text-cyan-600">every aspect of your invoice-to-cash process</strong>.
                      This comprehensive tool is designed for CFOs, finance directors, and business leaders who need
                      detailed justification for automation investments.
                    </p>

                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg p-5">
                      <h4 className="font-bold text-cyan-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="h-5 w-5" />
                        Perfect For:
                      </h4>
                      <ul className="space-y-2 text-sm text-cyan-900">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1 font-bold">✓</span>
                          <span>
                            <strong>Enterprise organizations</strong> requiring detailed business cases
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1 font-bold">✓</span>
                          <span>
                            <strong>CFOs and finance teams</strong> building investment proposals
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1 font-bold">✓</span>
                          <span>
                            <strong>Companies with complex</strong> collections operations and multiple teams
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1 font-bold">✓</span>
                          <span>
                            <strong>Strategic planning</strong> for 3-5 year automation roadmaps
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1 font-bold">✓</span>
                          <span>
                            <strong>Board presentations</strong> requiring comprehensive financial modeling
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-lg p-5">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-cyan-600" />
                        Comprehensive Analysis Includes:
                      </h4>
                      <div className="space-y-3">
                        <div className="border-l-4 border-cyan-500 pl-4 py-2">
                          <p className="font-semibold text-gray-900">1. Working Capital Analysis</p>
                          <p className="text-sm text-gray-600">
                            Cash flow improvement, DSO reduction, and liquidity enhancement
                          </p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-4 py-2">
                          <p className="font-semibold text-gray-900">2. Interest & Financing Impact</p>
                          <p className="text-sm text-gray-600">
                            Loan interest savings or investment income opportunities
                          </p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4 py-2">
                          <p className="font-semibold text-gray-900">3. Labour Cost Optimization</p>
                          <p className="text-sm text-gray-600">Automation efficiency gains and resource reallocation</p>
                        </div>
                        <div className="border-l-4 border-red-500 pl-4 py-2">
                          <p className="font-semibold text-gray-900">4. Bad Debt Reduction</p>
                          <p className="text-sm text-gray-600">Credit risk mitigation through proactive collections</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4 py-2">
                          <p className="font-semibold text-gray-900">5. ROI & Payback Metrics</p>
                          <p className="text-sm text-gray-600">
                            Return on investment, payback period, and NPV analysis
                          </p>
                        </div>
                        <div className="border-l-4 border-orange-500 pl-4 py-2">
                          <p className="font-semibold text-gray-900">6. Scalability & Growth Analysis</p>
                          <p className="text-sm text-gray-600">Capacity planning and headcount avoidance modeling</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-3">📊 Advanced Visualizations Include:</h4>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>Payment Terms Impact Analysis:</strong> Compare DSO across Net 30, 60, and 90 day
                            terms
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>Growth Capacity Modeling:</strong> Visualize customer growth without additional
                            headcount
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>Investment vs Savings Charts:</strong> Bar charts comparing costs to benefits
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>3-Year Cumulative Savings:</strong> Line chart showing long-term financial impact
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>DSO Comparison Graphs:</strong> Before and after visualization
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 mb-2">⏱️ Time to Complete: 8-12 minutes</h4>
                      <p className="text-sm text-yellow-800">
                        Requires detailed financial data across 6 categories. We recommend having your financial
                        statements, aged debtors report, and HR data ready before starting.
                      </p>
                    </div>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Input Fields */}
            <AccordionItem value="inputs">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-cyan-600" />
                  <span>Complete Input Field Guide</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                {calculatorType === "simple" ? (
                  <>
                    {/* Simple Calculator Inputs */}
                    <div className="space-y-6">
                      {/* DSO Improvement */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-cyan-600" />
                          Expected DSO Improvement (%)
                        </h4>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          This represents the percentage reduction in your Days Sales Outstanding that you can
                          realistically achieve with Kuhlekt's automation platform.
                        </p>

                        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3">📊 Industry Benchmarks:</h5>
                          <div className="grid md:grid-cols-3 gap-3">
                            <div className="bg-green-50 border border-green-200 rounded p-3">
                              <p className="text-xs text-green-700 font-semibold mb-1">Conservative</p>
                              <p className="text-2xl font-bold text-green-600">15-20%</p>
                              <p className="text-xs text-green-700 mt-1">Minimal process changes</p>
                            </div>
                            <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                              <p className="text-xs text-cyan-700 font-semibold mb-1">Typical</p>
                              <p className="text-2xl font-bold text-cyan-600">20-30%</p>
                              <p className="text-xs text-cyan-700 mt-1">Standard implementation</p>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="text-xs text-blue-700 font-semibold mb-1">Aggressive</p>
                              <p className="text-2xl font-bold text-blue-600">30-40%</p>
                              <p className="text-xs text-blue-700 mt-1">Full automation adoption</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-2">💡 Real-World Example:</h5>
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Company:</strong> Mid-sized manufacturing firm with $10M annual revenue
                          </p>
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Before Kuhlekt:</strong> 52 days DSO (manual follow-ups, spreadsheet tracking)
                          </p>
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>After Kuhlekt:</strong> 38 days DSO (automated reminders, payment portal)
                          </p>
                          <p className="text-sm font-semibold text-cyan-600">
                            Result: 27% improvement (14 days faster collections)
                          </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                          <p className="text-xs text-blue-800">
                            <strong>💡 Pro Tip:</strong> Start with 20% for your first calculation. This is achievable
                            for most businesses and provides a conservative baseline for decision-making.
                          </p>
                        </div>
                      </div>

                      {/* Cost of Capital */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-cyan-600" />
                          Cost of Capital (%)
                        </h4>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          Your cost of capital represents the annual interest rate you pay to borrow money OR the return
                          you could earn by investing freed-up cash. This is crucial for calculating the financial value
                          of faster collections.
                        </p>

                        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3">🏦 Common Sources:</h5>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                                <span className="text-red-600 font-bold text-sm">1</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Business Line of Credit</p>
                                <p className="text-sm text-gray-600">Typical range: 7-12% APR</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                                <span className="text-red-600 font-bold text-sm">2</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Term Loan Interest Rate</p>
                                <p className="text-sm text-gray-600">Typical range: 5-10% APR</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-red-100 rounded-full p-2 flex-shrink-0">
                                <span className="text-red-600 font-bold text-sm">3</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Invoice Factoring Cost</p>
                                <p className="text-sm text-gray-600">Typical range: 15-30% APR</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                                <span className="text-green-600 font-bold text-sm">4</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">Investment Return Rate</p>
                                <p className="text-sm text-gray-600">Typical range: 4-8% annual return</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-2">📈 How to Calculate:</h5>
                          <div className="space-y-2 text-sm text-gray-700">
                            <p>
                              <strong>If you borrow money:</strong> Use your weighted average interest rate across all
                              debt
                            </p>
                            <p>
                              <strong>If you have excess cash:</strong> Use your expected investment return rate
                            </p>
                            <p>
                              <strong>If you're unsure:</strong> Use 8% as a reasonable middle-ground estimate
                            </p>
                          </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                          <p className="text-xs text-yellow-800">
                            <strong>⚠️ Important:</strong> This percentage directly impacts your annual savings
                            calculation. A higher cost of capital means greater savings from faster collections.
                          </p>
                        </div>
                      </div>

                      {/* Current DSO */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                          <Clock className="h-5 w-5 text-cyan-600" />
                          Current DSO (Days)
                        </h4>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          Days Sales Outstanding (DSO) measures how long it takes, on average, to collect payment after
                          a sale. This is THE most important metric in accounts receivable management.
                        </p>

                        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3">🧮 Calculation Formula:</h5>
                          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm mb-3">
                            DSO = (Accounts Receivable / Total Credit Sales) × Number of Days
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-sm text-blue-900 mb-2">
                              <strong>Step-by-Step Example:</strong>
                            </p>
                            <p className="text-xs text-blue-800">1. Accounts Receivable Balance: $250,000</p>
                            <p className="text-xs text-blue-800">2. Annual Credit Sales: $2,000,000</p>
                            <p className="text-xs text-blue-800">
                              3. Calculation: ($250,000 / $2,000,000) × 365 = 45.6 days
                            </p>
                            <p className="text-xs font-semibold text-blue-900 mt-2">Your DSO = 46 days (rounded)</p>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3">📊 Industry Benchmarks by Sector:</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">Manufacturing</span>
                              <span className="font-semibold text-cyan-600">40-50 days</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">Wholesale/Distribution</span>
                              <span className="font-semibold text-cyan-600">35-45 days</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">Professional Services</span>
                              <span className="font-semibold text-cyan-600">45-60 days</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">Technology/SaaS</span>
                              <span className="font-semibold text-cyan-600">30-40 days</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">Construction</span>
                              <span className="font-semibold text-cyan-600">60-75 days</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <p className="text-xs text-red-800">
                            <strong>🎯 Target:</strong> Best-in-class companies maintain DSO below 30 days. Every day
                            you reduce DSO frees up working capital for growth and operations.
                          </p>
                        </div>
                      </div>

                      {/* Average Invoice Value */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-cyan-600" />
                          Average Invoice Value ($)
                        </h4>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          The typical dollar amount of your invoices. This helps calculate your total receivables and
                          potential cash flow improvement.
                        </p>

                        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3">🧮 How to Calculate:</h5>
                          <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm mb-3">
                            Average Invoice Value = Total Invoice Value / Number of Invoices
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-sm text-blue-900 mb-2">
                              <strong>Example Calculation:</strong>
                            </p>
                            <p className="text-xs text-blue-800">• Last 3 months total invoiced: $1,500,000</p>
                            <p className="text-xs text-blue-800">• Number of invoices issued: 300</p>
                            <p className="text-xs font-semibold text-blue-900 mt-2">
                              Average Invoice Value = $1,500,000 / 300 = $5,000
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-2">💡 Best Practices:</h5>
                          <ul className="space-y-2 text-sm text-gray-700">
                            <li className="flex items-start gap-2">
                              <span className="text-cyan-600 mt-1">•</span>
                              <span>Use data from the last 3-6 months for accuracy</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-cyan-600 mt-1">•</span>
                              <span>Exclude any unusually large or small one-off invoices</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-cyan-600 mt-1">•</span>
                              <span>For seasonal businesses, calculate across a full year</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-cyan-600 mt-1">•</span>
                              <span>Only include credit invoices (exclude cash/immediate payments)</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      {/* Monthly Invoices */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center gap-2">
                          <Users className="h-5 w-5 text-cyan-600" />
                          Monthly Invoices
                        </h4>
                        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                          The average number of invoices you issue per month. This helps determine your transaction
                          volume and the scale of automation benefits.
                        </p>

                        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3">📊 Volume Ranges:</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">Small Business</span>
                              <span className="font-semibold text-cyan-600">10-50 invoices/month</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">Mid-Market</span>
                              <span className="font-semibold text-cyan-600">50-500 invoices/month</span>
                            </div>
                            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span className="text-gray-700">Enterprise</span>
                              <span className="font-semibold text-cyan-600">500+ invoices/month</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-2">🎯 What to Include:</h5>
                          <div className="grid md:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="font-semibold text-green-600 mb-1">✓ Include:</p>
                              <ul className="space-y-1 text-gray-700">
                                <li>• All credit invoices</li>
                                <li>• Recurring invoices</li>
                                <li>• Project-based invoices</li>
                                <li>• Service invoices</li>
                              </ul>
                            </div>
                            <div>
                              <p className="font-semibold text-red-600 mb-1">✗ Exclude:</p>
                              <ul className="space-y-1 text-gray-700">
                                <li>• Cash sales</li>
                                <li>• Immediate payments</li>
                                <li>• Internal transfers</li>
                                <li>• Credit notes</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                          <p className="text-xs text-blue-800">
                            <strong>💡 Pro Tip:</strong> Higher invoice volumes see greater ROI from automation. Even
                            small time savings per invoice multiply significantly at scale.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Detailed Calculator Inputs - Much more comprehensive */}
                    <div className="space-y-6">
                      {/* Cost Structure Section */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                          <DollarSign className="h-6 w-6 text-cyan-600" />
                          Section 1: Cost Structure
                        </h4>

                        {/* Implementation Cost */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Implementation Cost ($)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            One-time setup investment covering system configuration, data migration, integration with
                            existing systems, and team training.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">💰 Typical Cost Breakdown:</h6>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">Small Business (1-50 users)</span>
                                <span className="font-semibold text-cyan-600">$5,000 - $15,000</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">Mid-Market (50-200 users)</span>
                                <span className="font-semibold text-cyan-600">$15,000 - $50,000</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">Enterprise (200+ users)</span>
                                <span className="font-semibold text-cyan-600">$50,000 - $150,000+</span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-xs text-blue-800">
                              <strong>Includes:</strong> Software setup, ERP integration, custom workflows, data
                              migration, user training, and go-live support
                            </p>
                          </div>
                        </div>

                        {/* Monthly Cost */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Monthly Subscription Cost ($)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            Recurring platform fee based on transaction volume, number of users, and feature tier. This
                            covers software licensing, hosting, support, and updates.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">📊 Pricing Tiers:</h6>
                            <div className="space-y-3">
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-semibold text-green-900">Starter</span>
                                  <span className="text-xl font-bold text-green-600">$500-$1,500/mo</span>
                                </div>
                                <p className="text-xs text-green-800">
                                  Up to 500 invoices/month, basic automation, email support
                                </p>
                              </div>
                              <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-semibold text-cyan-900">Professional</span>
                                  <span className="text-xl font-bold text-cyan-600">$1,500-$5,000/mo</span>
                                </div>
                                <p className="text-xs text-cyan-800">
                                  Up to 2,000 invoices/month, advanced workflows, priority support
                                </p>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-semibold text-blue-900">Enterprise</span>
                                  <span className="text-xl font-bold text-blue-600">$5,000+/mo</span>
                                </div>
                                <p className="text-xs text-blue-800">
                                  Unlimited invoices, custom integrations, dedicated account manager
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Labour Costs */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Annual Direct Labour Costs ($)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            Total annual cost of your collections team including salaries, benefits, payroll taxes, and
                            overhead. This is used to calculate automation savings.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">🧮 Calculation Guide:</h6>
                            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs mb-3">
                              Total Labour Cost = (Base Salary + Benefits + Taxes + Overhead) × Number of Staff
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="text-sm text-blue-900 mb-2">
                                <strong>Example for 3 Collections Staff:</strong>
                              </p>
                              <p className="text-xs text-blue-800">• Average Salary: $50,000 each = $150,000</p>
                              <p className="text-xs text-blue-800">• Benefits (25%): $37,500</p>
                              <p className="text-xs text-blue-800">• Payroll Taxes (10%): $15,000</p>
                              <p className="text-xs text-blue-800">• Overhead (15%): $22,500</p>
                              <p className="text-xs font-semibold text-blue-900 mt-2 pt-2 border-t border-blue-200">
                                Total Annual Labour Cost = $225,000
                              </p>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                            <p className="text-xs text-yellow-800">
                              <strong>💡 Important:</strong> Include only staff directly involved in collections, credit
                              management, and AR administration. Don't include accounting or finance leadership unless
                              they spend &gt;50% time on collections.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bank Interest */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                          <TrendingUp className="h-6 w-6 text-cyan-600" />
                          Section 2: Bank Interest & Financing
                        </h4>

                        {/* Interest Type */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Interest Type</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            Select whether you are primarily borrowing money to fund operations or earning interest on
                            excess cash. This determines whether to input a borrowing cost or an investment return rate.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">Choose One:</h6>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  id="interest-type-loan"
                                  name="interestType"
                                  value="loan"
                                  className="form-radio text-cyan-600"
                                />
                                <label htmlFor="interest-type-loan" className="text-sm text-gray-800 font-medium">
                                  Loan / Borrowing Cost
                                </label>
                              </div>
                              <div className="flex items-center gap-3">
                                <input
                                  type="radio"
                                  id="interest-type-deposit"
                                  name="interestType"
                                  value="deposit"
                                  className="form-radio text-cyan-600"
                                />
                                <label htmlFor="interest-type-deposit" className="text-sm text-gray-800 font-medium">
                                  Deposit / Investment Return
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-xs text-blue-800">
                              <strong>💡 Tip:</strong> Most businesses leverage their line of credit or loans, so "Loan
                              / Borrowing Cost" is often the correct choice.
                            </p>
                          </div>
                        </div>

                        {/* Interest Rate */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Interest Rate (%)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            Enter the annual interest rate associated with your chosen interest type. This is the cost
                            of financing or the return on investment.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">💰 Typical Ranges:</h6>
                            <div className="grid md:grid-cols-3 gap-3">
                              <div className="bg-red-50 border border-red-200 rounded p-3">
                                <p className="text-xs text-red-700 font-semibold mb-1">
                                  High-Cost Loans (e.g., Factoring)
                                </p>
                                <p className="text-2xl font-bold text-red-600">15-30%</p>
                              </div>
                              <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                                <p className="text-xs text-cyan-700 font-semibold mb-1">Standard Loans / LOC</p>
                                <p className="text-2xl font-bold text-cyan-600">7-12%</p>
                              </div>
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <p className="text-xs text-green-700 font-semibold mb-1">Investment Returns</p>
                                <p className="text-2xl font-bold text-green-600">3-5%</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                            <p className="text-xs text-yellow-800">
                              <strong>⚠️ Caution:</strong> Using an unrealistic interest rate will skew your savings. Use
                              your actual current borrowing cost or projected investment return.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bad Debt */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                          <Clock className="h-6 w-6 text-cyan-600" />
                          Section 3: Bad Debt
                        </h4>

                        {/* Current Bad Debts */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Current Bad Debts (Annual, $)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            The total amount written off as uncollectable from your accounts receivable over the last 12
                            months. This is a direct loss to your business.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">🔍 Where to Find This Data:</h6>
                            <ul className="space-y-2 text-sm text-gray-700">
                              <li>
                                • Your company's Profit & Loss (P&L) statement (look for "Bad Debt Expense" or "Accounts
                                Receivable Write-offs")
                              </li>
                              <li>• Aged Debtors report (sum of all invoices currently classified as uncollectable)</li>
                              <li>• Accounting system general ledger entries for write-offs</li>
                            </ul>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded p-3">
                            <p className="text-xs text-gray-800">
                              <strong>Example:</strong> If your P&L shows $50,000 in bad debt write-offs last year,
                              enter $50,000.
                            </p>
                          </div>
                        </div>

                        {/* Average Bad Debt % */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Average Bad Debt (%)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            Your total annual bad debts expressed as a percentage of your total annual credit sales.
                            This normalizes bad debt across different revenue levels.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">🧮 Calculation Formula:</h6>
                            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs mb-3">
                              Average Bad Debt % = (Annual Bad Debts / Total Annual Credit Sales) × 100
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="text-sm text-blue-900 mb-2">
                                <strong>Example Calculation:</strong>
                              </p>
                              <p className="text-xs text-blue-800">• Annual Bad Debts: $50,000</p>
                              <p className="text-xs text-blue-800">• Annual Credit Sales: $2,000,000</p>
                              <p className="text-xs font-semibold text-blue-900 mt-2">
                                Average Bad Debt % = ($50,000 / $2,000,000) × 100 = 2.5%
                              </p>
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">📊 Industry Benchmarks:</h6>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">B2B Manufacturing/Wholesale</span>
                                <span className="font-semibold text-cyan-600">1-3%</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">Service Industries</span>
                                <span className="font-semibold text-cyan-600">2-5%</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-gray-700">SaaS/Tech</span>
                                <span className="font-semibold text-cyan-600">0.5-2%</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                            <p className="text-xs text-yellow-800">
                              <strong>🎯 Goal:</strong> Automation helps reduce bad debt by improving collection rates
                              and enabling better credit risk assessment. Aiming for below industry average is a key
                              benefit.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Expected Savings */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                          <TrendingUp className="h-6 w-6 text-cyan-600" />
                          Section 4: Expected Savings
                        </h4>

                        {/* DSO Improvement */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">DSO Improvement (%)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            The projected percentage reduction in your Days Sales Outstanding (DSO) due to implementing
                            automation. This directly impacts the amount of working capital you can free up.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">📊 Industry Benchmarks & Projections:</h6>
                            <div className="grid md:grid-cols-3 gap-3">
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <p className="text-xs text-green-700 font-semibold mb-1">Conservative Estimate</p>
                                <p className="text-2xl font-bold text-green-600">15-20%</p>
                                <p className="text-xs text-green-700 mt-1">Achievable with standard adoption</p>
                              </div>
                              <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                                <p className="text-xs text-cyan-700 font-semibold mb-1">Typical Expectation</p>
                                <p className="text-2xl font-bold text-cyan-600">25-35%</p>
                                <p className="text-xs text-cyan-700 mt-1">Standard implementation & user engagement</p>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-xs text-blue-700 font-semibold mb-1">Aggressive Goal</p>
                                <p className="text-2xl font-bold text-blue-600">40%+</p>
                                <p className="text-xs text-blue-700 mt-1">
                                  Requires full process overhaul & high adoption
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-xs text-blue-800">
                              <strong>💡 Pro Tip:</strong> For initial ROI calculations, using a 20-25% improvement is a
                              good starting point, balancing realism with demonstrating significant potential.
                            </p>
                          </div>
                        </div>

                        {/* Labour Savings */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Labour Savings (%)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            The estimated percentage reduction in labour hours required for collections and AR
                            management due to automation efficiency gains.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">📊 Efficiency Gains:</h6>
                            <div className="grid md:grid-cols-3 gap-3">
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <p className="text-xs text-green-700 font-semibold mb-1">Conservative</p>
                                <p className="text-2xl font-bold text-green-600">20-30%</p>
                                <p className="text-xs text-green-700 mt-1">Basic task automation</p>
                              </div>
                              <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                                <p className="text-xs text-cyan-700 font-semibold mb-1">Typical</p>
                                <p className="text-2xl font-bold text-cyan-600">35-45%</p>
                                <p className="text-xs text-cyan-700 mt-1">Streamlined workflows</p>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-xs text-blue-700 font-semibold mb-1">Aggressive</p>
                                <p className="text-2xl font-bold text-blue-600">50%+ </p>
                                <p className="text-xs text-blue-700 mt-1">Full process automation & AI integration</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded p-3">
                            <p className="text-xs text-gray-800">
                              <strong>Calculation Basis:</strong> This percentage is applied to your 'Annual Direct
                              Labour Costs' to determine the monetary savings.
                            </p>
                          </div>
                        </div>

                        {/* Bad Debt Reduction */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Bad Debt Reduction (%)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            The projected percentage reduction in bad debt write-offs thanks to improved credit
                            management, proactive collections, and fewer overdue accounts.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">🎯 Targeted Reduction:</h6>
                            <p className="text-sm text-gray-700 mb-2">
                              A <strong>40% reduction</strong> is a commonly cited benefit due to automation's impact
                              on:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600">
                              <li>• Faster identification of at-risk accounts</li>
                              <li>• Consistent follow-up on all invoices</li>
                              <li>• Better credit vetting for new customers</li>
                              <li>• Reduced likelihood of accounts becoming uncollectable</li>
                            </ul>
                          </div>
                          <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                            <p className="text-xs text-cyan-800">
                              <strong>Note:</strong> This percentage is applied to your 'Current Bad Debts (Annual)' to
                              estimate savings.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Financial Metrics */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                          <Calculator className="h-6 w-6 text-cyan-600" />
                          Section 5: Financial Metrics
                        </h4>

                        {/* Current DSO */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Current DSO (Days)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            Your current average number of days to collect payment after an invoice is issued. This is a
                            critical input for calculating working capital released and interest savings.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">🧮 How to Calculate:</h6>
                            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs mb-3">
                              DSO = (Accounts Receivable / Total Credit Sales) × Number of Days
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="text-sm text-blue-900 mb-2">
                                <strong>Example:</strong>
                              </p>
                              <p className="text-xs text-blue-800">• AR Balance: $200,000</p>
                              <p className="text-xs text-blue-800">• Annual Credit Sales: $1,600,000</p>
                              <p className="text-xs font-semibold text-blue-900 mt-2">
                                DSO = ($200,000 / $1,600,000) × 365 = 45.6 days (round to 46)
                              </p>
                            </div>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded p-3">
                            <p className="text-xs text-gray-800">
                              <strong>Accuracy Check:</strong> Ensure your Accounts Receivable and Credit Sales figures
                              are consistent and from the same period (e.g., monthly or quarterly).
                            </p>
                          </div>
                        </div>

                        {/* Debtors Balance */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Debtors Balance ($)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            The total value of all outstanding accounts receivable on your balance sheet at a given
                            point in time. This represents the capital currently tied up in invoices.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">Where to Find:</h6>
                            <p className="text-sm text-gray-700">
                              This figure is readily available on your company's most recent{" "}
                              <strong className="font-semibold">Balance Sheet</strong> under 'Current Assets' as
                              'Accounts Receivable'.
                            </p>
                          </div>
                          <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                            <p className="text-xs text-cyan-800">
                              <strong>Impact:</strong> A higher debtors balance means more working capital is tied up,
                              leading to potentially larger savings when DSO is reduced.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Team Structure */}
                      <div className="border-2 border-cyan-200 rounded-lg p-5 bg-gradient-to-br from-white to-cyan-50">
                        <h4 className="font-bold text-gray-900 mb-4 text-xl flex items-center gap-2">
                          <Users className="h-6 w-6 text-cyan-600" />
                          Section 6: Team Structure & Growth
                        </h4>

                        {/* Number of Debtors */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Number of Debtors</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            The total count of distinct customers with outstanding invoices. This metric helps gauge the
                            volume of relationships managed and the potential for automation to scale efforts.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">Example Ranges:</h6>
                            <div className="grid md:grid-cols-3 gap-3">
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <p className="text-xs text-green-700 font-semibold mb-1">Small Business</p>
                                <p className="text-2xl font-bold text-green-600">50-200</p>
                              </div>
                              <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                                <p className="text-xs text-cyan-700 font-semibold mb-1">Mid-Market</p>
                                <p className="text-2xl font-bold text-cyan-600">200-1,000</p>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-xs text-blue-700 font-semibold mb-1">Enterprise</p>
                                <p className="text-2xl font-bold text-blue-600">1,000+</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-blue-50 border border-blue-200 rounded p-3">
                            <p className="text-xs text-blue-800">
                              <strong>Relevance:</strong> A higher number of debtors means more individual interactions
                              and follow-ups, where automation can provide substantial time savings.
                            </p>
                          </div>
                        </div>

                        {/* Number of Collectors */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Number of Collectors (FTE)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            The full-time equivalent (FTE) number of staff dedicated to collections and accounts
                            receivable management. This input is crucial for calculating labour savings.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">Example Counts:</h6>
                            <div className="space-y-2 text-sm">
                              <p>
                                <strong>1-2 FTE:</strong> Typically for small businesses managing up to ~100 debtors
                              </p>
                              <p>
                                <strong>3-5 FTE:</strong> Common for mid-market companies handling ~100-500 debtors
                              </p>
                              <p>
                                <strong>6+ FTE:</strong> Often seen in larger enterprises with thousands of debtors
                              </p>
                            </div>
                          </div>
                          <div className="bg-gray-50 border border-gray-200 rounded p-3">
                            <p className="text-xs text-gray-800">
                              <strong>Full-Time Equivalent (FTE):</strong> Calculate this by summing the hours of all
                              staff involved in collections and dividing by the standard full-time work hours (e.g., 40
                              hours/week). Part-time staff should be calculated proportionally.
                            </p>
                          </div>
                        </div>

                        {/* Projected Customer Growth */}
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-3 text-lg">Projected Customer Growth (%)</h5>
                          <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                            Your expected annual growth rate in the number of customers. This helps model how automation
                            allows your AR team to scale without needing to hire additional staff as the business
                            expands.
                          </p>

                          <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                            <h6 className="font-semibold text-gray-900 mb-3">Typical Growth Rates:</h6>
                            <div className="grid md:grid-cols-3 gap-3">
                              <div className="bg-green-50 border border-green-200 rounded p-3">
                                <p className="text-xs text-green-700 font-semibold mb-1">Stable Business</p>
                                <p className="text-2xl font-bold text-green-600">2-5%</p>
                              </div>
                              <div className="bg-cyan-50 border border-cyan-200 rounded p-3">
                                <p className="text-xs text-cyan-700 font-semibold mb-1">Moderate Growth</p>
                                <p className="text-2xl font-bold text-cyan-600">5-15%</p>
                              </div>
                              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <p className="text-xs text-blue-700 font-semibold mb-1">High Growth</p>
                                <p className="text-2xl font-bold text-blue-600">15%+ </p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                            <p className="text-xs text-yellow-800">
                              <strong>Scalability Benefit:</strong> This metric highlights how automation can support
                              your business expansion goals without proportionally increasing operational costs for AR.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Calculations */}
            <AccordionItem value="calculations">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-cyan-600" />
                  <span>How We Calculate Your ROI</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                {calculatorType === "simple" ? (
                  <>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Step 1: Current Cash Tied Up</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Calculate how much working capital is currently locked in receivables:
                        </p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Current Cash Tied Up = (Current DSO / 30) × Average Invoice Value × Monthly Invoices
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          <strong>Example:</strong> (45 days / 30) × $5,000 × 100 = $750,000
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Step 2: New DSO After Improvement</h4>
                        <p className="text-sm text-gray-700 mb-2">Calculate your projected DSO with Kuhlekt:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          New DSO = Current DSO × (1 - DSO Improvement %)
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          <strong>Example:</strong> 45 days × (1 - 0.20) = 36 days
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Step 3: Cash Released</h4>
                        <p className="text-sm text-gray-700 mb-2">Calculate working capital improvement:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Current Cash Tied Up = (Current DSO / 30) × Average Invoice Value × Monthly Invoices
                          <br />
                          New Cash Tied Up = (New DSO / 30) × Average Invoice Value × Monthly Invoices
                          <br />
                          Cash Released = Current Cash Tied Up - New Cash Tied Up
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          <strong>Example:</strong> $750,000 - $600,000 = $150,000
                        </p>
                      </div>

                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <h4 className="font-semibold text-cyan-900 mb-3">Step 4: Annual Savings</h4>
                        <p className="text-sm text-cyan-800 mb-2">Calculate your total annual benefit:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Annual Savings = Cash Released × 12 × Cost of Capital %
                        </div>
                        <p className="text-xs text-cyan-700 mt-2">
                          <strong>Example:</strong> $150,000 × 12 × 8% = $144,000 per year
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">1. Working Capital Released</h4>
                        <p className="text-sm text-gray-700 mb-2">Cash freed up from faster collections:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Annual Revenue = (Debtors Balance / Current DSO) × 365
                          <br />
                          Daily Revenue = Annual Revenue / 365
                          <br />
                          Days Reduced = Current DSO × DSO Improvement %<br />
                          Working Capital Released = Daily Revenue × Days Reduced
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">2. Interest Savings</h4>
                        <p className="text-sm text-gray-700 mb-2">Annual savings from released capital:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Interest Savings = Working Capital Released × Interest Rate %
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">3. Labour Cost Savings</h4>
                        <p className="text-sm text-gray-700 mb-2">Savings from automation efficiency:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Labour Savings = Annual Labour Costs × Labour Savings %
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">4. Bad Debt Reduction</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Reduction through better credit management (using 40% improvement factor):
                        </p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Bad Debt Reduction = Current Bad Debts × 0.40
                        </div>
                      </div>

                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <h4 className="font-semibold text-cyan-900 mb-3">5. Total Annual Benefit</h4>
                        <p className="text-sm text-cyan-800 mb-2">Sum of all direct financial benefits:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Total Annual Benefit = Interest Savings + Labour Savings + Bad Debt Reduction
                        </div>
                      </div>

                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <h4 className="font-semibold text-cyan-900 mb-3">6. ROI & Payback Period</h4>
                        <p className="text-sm text-cyan-800 mb-2">
                          Return on investment and cost recovery calculation:
                        </p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Total Cost = Implementation Cost + (Monthly Subscription Cost × 12)
                          <br />
                          Net Annual Benefit = Total Annual Benefit - (Monthly Subscription Cost × 12)
                          <br />
                          ROI % = (Net Annual Benefit / Total Cost) × 100
                          <br />
                          Payback Months = (Total Cost / Net Annual Benefit) × 12
                        </div>
                        <p className="text-xs text-cyan-700 mt-2">
                          <strong>Example:</strong> If Total Cost = $62,000 & Net Annual Benefit = $248,000, then ROI =
                          300% & Payback = 3 months.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">7. Payment Terms Impact Analysis</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          This section models how changing payment terms (e.g., Net 30 vs. Net 60) affects your DSO and
                          cash flow, showing the financial advantage of optimizing terms.
                        </p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          For each payment term (Net 30, Net 60, Net 90):
                          <br />
                          Current DSO = Base AR Days + Payment Term Days
                          <br />
                          Improved DSO = Current DSO × (1 - DSO Improvement %)
                          <br />
                          Estimated Gain = (Current DSO - Improved DSO) × Daily Revenue
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          This analysis helps identify the most impactful payment terms for improving your cash
                          conversion cycle.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          8. Business Growth Without Additional Headcount
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Models your capacity to handle increased customer volume using automation, preventing the need
                          for new hires.
                        </p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Current Collector Capacity = Number of Debtors / Number of Collectors
                          <br />
                          Automation Efficiency Factor = Labour Savings % (e.g., 40%)
                          <br />
                          New Collector Capacity = Current Collector Capacity / (1 - Automation Efficiency Factor)
                          <br />
                          Additional Capacity = New Collector Capacity - Current Collector Capacity
                          <br />
                          <br />
                          For a 50% Customer Growth Scenario:
                          <br />
                          Target Number of Debtors = Current Debtors × 1.50
                          <br />
                          Required Collectors = Target Number of Debtors / New Collector Capacity
                          <br />
                          Headcount Avoided = Number of Collectors - Required Collectors
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          <strong>Example:</strong> If 1 collector handles 100 customers and automation increases
                          efficiency by 40%, they can now handle 167 customers (100 / (1-0.40)). This means your
                          existing team can support ~67% more customers before needing to hire.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Important Notes on Calculations</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• All calculations are estimates based solely on your input data.</li>
                    <li>
                      • Real-world results may vary due to specific business conditions, implementation quality, and
                      user adoption.
                    </li>
                    <li>
                      • It is always recommended to use conservative estimates for crucial inputs like DSO improvement
                      and labour savings for robust business planning.
                    </li>
                    <li>• The detailed report provides a more granular view and advanced scenarios.</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Getting Started */}
            <AccordionItem value="tips">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-cyan-600" />
                  <span>Tips for Accurate Results</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Use Recent & Relevant Data</h4>
                      <p className="text-sm text-gray-600">
                        For inputs like DSO, Debtor Balance, and Invoice Value, use data from the last 3-6 months. If
                        your business is seasonal, consider averaging across a full year for a more representative
                        figure.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Be Conservative with Projections</h4>
                      <p className="text-sm text-gray-600">
                        When estimating DSO Improvement (%) and Labour Savings (%), it's prudent to use conservative
                        figures. This ensures your projected ROI is realistic and achievable, preventing disappointment
                        and enabling you to exceed expectations.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Accurately Calculate Labour Costs</h4>
                      <p className="text-sm text-gray-600">
                        Ensure your 'Annual Direct Labour Costs' include all direct expenses for your collections and AR
                        team: salaries, benefits, payroll taxes, and a reasonable allocation of overhead (office space,
                        equipment).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Verify Your Current DSO</h4>
                      <p className="text-sm text-gray-600">
                        DSO is the cornerstone of the ROI calculation. Double-check its accuracy using your accounting
                        system's reports. An incorrect DSO figure will significantly skew your results.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Understand Your Cost of Capital</h4>
                      <p className="text-sm text-gray-600">
                        Whether it's your interest rate on debt or your expected investment return, accurately
                        reflecting your cost of capital is vital for quantifying the financial impact of freeing up
                        cash.
                      </p>
                    </div>
                  </div>

                  {calculatorType === "detailed" && (
                    <div className="flex items-start gap-3">
                      <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        6
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Review All Detailed Report Sections</h4>
                        <p className="text-sm text-gray-600">
                          The detailed analysis provides deeper insights into areas like Payment Terms Impact,
                          Scalability, and ROI. Review these sections to fully grasp the strategic value beyond simple
                          cash flow improvements.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Need Personalized Assistance?</h4>
                  <p className="text-sm text-cyan-800 mb-3">
                    Our financial experts are available to help you navigate the calculator, interpret your results, and
                    build a compelling business case.
                  </p>
                  <ul className="text-sm text-cyan-800 space-y-1">
                    <li>📧 Email: enquiries@kuhlekt.com</li>
                    <li>🌐 Visit: kuhlekt.com/contact</li>
                    <li>📞 Schedule a demo or consultation</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
