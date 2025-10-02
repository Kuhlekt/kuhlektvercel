"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Calculator, TrendingUp, DollarSign, Clock, Users, HelpCircle } from "lucide-react"
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
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <HelpCircle className="h-6 w-6 text-cyan-600" />
            ROI Calculator Help
          </DialogTitle>
          <DialogDescription>
            {calculatorType === "simple"
              ? "Understanding the Simple ROI Calculator"
              : "Understanding the Detailed ROI Calculator"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <Accordion type="multiple" defaultValue={["overview", "inputs", "calculations"]} className="w-full">
            {/* Overview */}
            <AccordionItem value="overview">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-cyan-600" />
                  <span>Overview</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4 pt-4">
                {calculatorType === "simple" ? (
                  <>
                    <p className="text-gray-700">
                      The Simple ROI Calculator provides a quick estimate of your potential savings by focusing on the
                      primary benefit of accounts receivable automation: <strong>working capital improvement</strong>{" "}
                      through reduced Days Sales Outstanding (DSO).
                    </p>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <h4 className="font-semibold text-cyan-900 mb-2">What this calculator shows:</h4>
                      <ul className="space-y-2 text-sm text-cyan-800">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">•</span>
                          <span>How much cash is currently tied up in receivables</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">•</span>
                          <span>How much cash can be released through faster collections</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">•</span>
                          <span>Annual savings based on your cost of capital</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">•</span>
                          <span>Your projected new DSO after implementing Kuhlekt</span>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700">
                      The Detailed ROI Calculator provides a comprehensive analysis of all the financial benefits from
                      automating your invoice-to-cash process. It considers multiple factors to give you a complete
                      picture of your potential ROI.
                    </p>
                    <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
                      <h4 className="font-semibold text-cyan-900 mb-2">This calculator analyzes 6 key areas:</h4>
                      <ul className="space-y-2 text-sm text-cyan-800">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">1.</span>
                          <span>
                            <strong>Working Capital:</strong> Cash released from faster collections
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">2.</span>
                          <span>
                            <strong>Interest Savings:</strong> Reduced borrowing costs or increased investment income
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">3.</span>
                          <span>
                            <strong>Labour Costs:</strong> Savings from automation and efficiency gains
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">4.</span>
                          <span>
                            <strong>Bad Debt:</strong> Reduction through better credit management
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">5.</span>
                          <span>
                            <strong>ROI & Payback:</strong> Return on investment and time to recover costs
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-600 mt-1">6.</span>
                          <span>
                            <strong>Scalability:</strong> How the solution grows with your business
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Additional Analysis Sections:</h4>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>Payment Terms Impact Analysis:</strong> Compare how different payment terms (Net 30,
                            Net 60, Net 90) affect your DSO and estimated gains
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>Business Growth Without Additional Headcount:</strong> See how automation enables
                            you to handle more customers without hiring additional staff
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>Visual Charts:</strong> Investment vs Annual Savings, Cumulative Savings Over Time,
                            and DSO Comparison graphs
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          <span>
                            <strong>Comprehensive Summary:</strong> Detailed breakdown of all financial impacts and
                            benefits
                          </span>
                        </li>
                      </ul>
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
                  <span>Input Fields Explained</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                {calculatorType === "simple" ? (
                  <>
                    <div className="space-y-4">
                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-1">Expected DSO Improvement (%)</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          The percentage reduction in Days Sales Outstanding you can expect with Kuhlekt.
                        </p>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          <p className="text-gray-700">
                            <strong>Typical Range:</strong> 15-30%
                          </p>
                          <p className="text-gray-700 mt-1">
                            <strong>Example:</strong> If your current DSO is 45 days and you expect 20% improvement,
                            your new DSO would be 36 days.
                          </p>
                        </div>
                      </div>

                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-1">Cost of Capital (%)</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Your annual interest rate or opportunity cost of capital.
                        </p>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          <p className="text-gray-700">
                            <strong>Use:</strong> Business loan rate, line of credit rate, or expected return on
                            investments
                          </p>
                          <p className="text-gray-700 mt-1">
                            <strong>Example:</strong> If you pay 8% on your line of credit, use 8%
                          </p>
                        </div>
                      </div>

                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-1">Current DSO (Days)</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Your current Days Sales Outstanding - the average number of days it takes to collect payment.
                        </p>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          <p className="text-gray-700">
                            <strong>Calculation:</strong> (Accounts Receivable / Total Credit Sales) × Number of Days
                          </p>
                          <p className="text-gray-700 mt-1">
                            <strong>Industry Average:</strong> 30-45 days for most B2B companies
                          </p>
                        </div>
                      </div>

                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-1">Average Invoice Value ($)</h4>
                        <p className="text-sm text-gray-600 mb-2">The typical dollar amount of your invoices.</p>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          <p className="text-gray-700">
                            <strong>Calculation:</strong> Total invoice value / Number of invoices
                          </p>
                          <p className="text-gray-700 mt-1">
                            <strong>Tip:</strong> Use an average over 3-6 months for accuracy
                          </p>
                        </div>
                      </div>

                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-1">Monthly Invoices</h4>
                        <p className="text-sm text-gray-600 mb-2">How many invoices you issue per month on average.</p>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          <p className="text-gray-700">
                            <strong>Include:</strong> All credit invoices sent to customers
                          </p>
                          <p className="text-gray-700 mt-1">
                            <strong>Exclude:</strong> Cash sales or immediate payments
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      {/* Cost Structure */}
                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Cost Structure
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Implementation Cost</p>
                            <p className="text-xs text-gray-600">
                              One-time setup fee for system configuration, data migration, and training. Typical range:
                              $5,000-$50,000
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Monthly Subscription Cost</p>
                            <p className="text-xs text-gray-600">
                              Recurring platform fee based on transaction volume and features. Typical range:
                              $500-$5,000
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Annual Direct Labour Costs</p>
                            <p className="text-xs text-gray-600">
                              Total cost of your collections team (salaries, benefits, overhead). Used to calculate
                              automation savings.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bank Interest */}
                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Bank Interest
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Interest Type</p>
                            <p className="text-xs text-gray-600">
                              <strong>Loan:</strong> If you borrow to fund operations (use loan interest rate)
                              <br />
                              <strong>Deposit:</strong> If you invest excess cash (use investment return rate)
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Interest Rate (%)</p>
                            <p className="text-xs text-gray-600">
                              Annual interest rate. Typical ranges: Loans 6-12%, Deposits 3-5%
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bad Debt */}
                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Bad Debt
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Current Bad Debts (Annual)</p>
                            <p className="text-xs text-gray-600">
                              Total amount written off as uncollectable per year. Check your P&L or aged debtors report.
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Average Bad Debt (%)</p>
                            <p className="text-xs text-gray-600">
                              Bad debt as a percentage of total sales. Industry average: 1-5%. Calculate: (Bad Debt /
                              Total Sales) × 100
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Expected Savings */}
                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Expected Savings
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">DSO Improvement (%)</p>
                            <p className="text-xs text-gray-600">
                              Expected reduction in collection time. Conservative: 15-20%, Typical: 25-35%, Aggressive:
                              40%+
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Labour Savings (%)</p>
                            <p className="text-xs text-gray-600">
                              Efficiency gain from automation. Conservative: 20-30%, Typical: 35-45%, Aggressive: 50%+
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Financial Metrics */}
                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Calculator className="h-4 w-4" />
                          Financial Metrics
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Current DSO (Days)</p>
                            <p className="text-xs text-gray-600">
                              Average days to collect payment. Formula: (Accounts Receivable / Credit Sales) × 365
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Debtors Balance</p>
                            <p className="text-xs text-gray-600">
                              Total outstanding accounts receivable. Find this on your balance sheet.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Team Structure */}
                      <div className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Team Structure & Growth
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-800">Number of Debtors</p>
                            <p className="text-xs text-gray-600">
                              Total number of credit customers. Helps assess system load and pricing.
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Number of Collectors</p>
                            <p className="text-xs text-gray-600">
                              Full-time equivalent staff managing collections. Used for labour savings calculation.
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Projected Customer Growth (%)</p>
                            <p className="text-xs text-gray-600">
                              Expected annual growth in customer base. Shows scalability benefits of automation.
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
                          Reduction through better credit management (40% improvement):
                        </p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Bad Debt Reduction = Current Bad Debts × 0.40
                        </div>
                      </div>

                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <h4 className="font-semibold text-cyan-900 mb-3">5. Total Annual Benefit</h4>
                        <p className="text-sm text-cyan-800 mb-2">Sum of all benefits:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Total Benefit = Interest Savings + Labour Savings + Bad Debt Reduction
                        </div>
                      </div>

                      <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                        <h4 className="font-semibold text-cyan-900 mb-3">6. ROI & Payback Period</h4>
                        <p className="text-sm text-cyan-800 mb-2">Return on investment calculation:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Total Cost = Implementation Cost + (Monthly Cost × 12)
                          <br />
                          Net Annual Benefit = Total Annual Benefit - Annual Subscription
                          <br />
                          ROI % = (Net Annual Benefit / Total Cost) × 100
                          <br />
                          Payback Months = (Total Cost / Total Annual Benefit) × 12
                        </div>
                        <p className="text-xs text-cyan-700 mt-2">
                          <strong>Example:</strong> If Total Cost is $62,000 and Total Annual Benefit is $248,000, ROI =
                          300% and Payback = 3 months
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">7. Payment Terms Impact Analysis</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          Shows how different payment terms affect your cash flow:
                        </p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          For each payment term (Net 30, Net 60, Net 90):
                          <br />
                          Current DSO = Base DSO + Payment Term Days
                          <br />
                          Improved DSO = Current DSO × (1 - DSO Improvement %)
                          <br />
                          Estimated Gain = (Current DSO - Improved DSO) × Daily Revenue
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          This helps you understand which payment terms offer the greatest improvement opportunity.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          8. Business Growth Without Additional Headcount
                        </h4>
                        <p className="text-sm text-gray-700 mb-2">Calculate capacity gains from automation:</p>
                        <div className="bg-white rounded p-3 font-mono text-xs">
                          Current Capacity = Number of Debtors / Number of Collectors
                          <br />
                          Automation Efficiency = Labour Savings % (e.g., 40%)
                          <br />
                          New Capacity = Current Capacity / (1 - Automation Efficiency)
                          <br />
                          Additional Capacity = New Capacity - Current Capacity
                          <br />
                          <br />
                          For 50% Growth Scenario:
                          <br />
                          Additional Customers = Current Debtors × 0.50
                          <br />
                          Additional Revenue = Additional Customers × Average Revenue per Customer
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          <strong>Example:</strong> If you currently manage 500 customers with 5 collectors (100 each),
                          and automation provides 40% efficiency, you could handle 833 customers with the same team - an
                          additional 333 customers without new hires.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Important Notes</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• All calculations are estimates based on your inputs</li>
                    <li>• Actual results may vary based on implementation and business factors</li>
                    <li>• Conservative estimates are recommended for business planning</li>
                    <li>• Contact our team for a detailed, customized analysis</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Getting Started */}
            <AccordionItem value="getting-started">
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
                      <h4 className="font-semibold text-gray-900">Use Recent Data</h4>
                      <p className="text-sm text-gray-600">
                        Use data from the last 3-6 months for the most accurate projections. Seasonal businesses should
                        average across different periods.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Be Conservative</h4>
                      <p className="text-sm text-gray-600">
                        When estimating improvement percentages, use conservative figures. It's better to exceed
                        expectations than fall short.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Include All Costs</h4>
                      <p className="text-sm text-gray-600">
                        For labour costs, include salaries, benefits, overhead, and any related expenses for your
                        collections team.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Verify Your DSO</h4>
                      <p className="text-sm text-gray-600">
                        Double-check your DSO calculation using your accounting system or reports. This is the most
                        critical input for accurate results.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      5
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Consider Seasonality</h4>
                      <p className="text-sm text-gray-600">
                        If your business has seasonal variations, use annual averages or adjust inputs to reflect
                        typical conditions.
                      </p>
                    </div>
                  </div>

                  {calculatorType === "detailed" && (
                    <div className="flex items-start gap-3">
                      <div className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        6
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Review All Report Sections</h4>
                        <p className="text-sm text-gray-600">
                          The detailed report includes Payment Terms Impact Analysis and Business Growth projections.
                          Review these sections to understand how automation enables scalability and optimizes different
                          payment term scenarios.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold text-cyan-900 mb-2">Need Help?</h4>
                  <p className="text-sm text-cyan-800 mb-3">
                    Our team is here to help you get accurate results and understand your potential ROI.
                  </p>
                  <ul className="text-sm text-cyan-800 space-y-1">
                    <li>📧 Email: enquiries@kuhlekt.com</li>
                    <li>🌐 Website: kuhlekt.com</li>
                    <li>📞 Schedule a personalized consultation</li>
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
