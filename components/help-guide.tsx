"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle, Calculator, TrendingUp, DollarSign, Clock, Users, Target } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function HelpGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <HelpCircle className="h-4 w-4" />
          Help Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">ROI Calculator Help Guide</DialogTitle>
          <DialogDescription>Understand how to use the calculator and what each metric means</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Overview Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Calculator Overview</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Kuhlekt ROI Calculator helps you understand the financial impact of improving your invoice-to-cash
                process. Choose between Simple or Detailed calculators based on the information you have available.
              </p>
            </section>

            {/* Key Metrics Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Key Metrics Explained</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">DSO (Days Sales Outstanding)</h4>
                  <p className="text-sm text-muted-foreground">
                    The average number of days it takes to collect payment after a sale. Lower DSO means faster cash
                    collection. Formula: (Accounts Receivable / Annual Revenue) × 365
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">One-Time Cash Flow Improvement</h4>
                  <p className="text-sm text-muted-foreground">
                    The immediate cash released when you reduce DSO. This is working capital that was tied up in
                    accounts receivable. Formula: (Daily Revenue × DSO Reduction in Days)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    Example: A company with $10M annual revenue reducing DSO by 10 days releases $274k in cash
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">Working Capital Released</h4>
                  <p className="text-sm text-muted-foreground">
                    Cash freed up from faster collections that can be reinvested in growth, used to pay down debt, or
                    improve liquidity. This is the same as One-Time Cash Flow Improvement.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">ROI (Return on Investment)</h4>
                  <p className="text-sm text-muted-foreground">
                    The percentage return on your investment in Kuhlekt. Formula: ((Annual Benefits - Annual Cost) /
                    Total First Year Investment) × 100
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">Payback Period</h4>
                  <p className="text-sm text-muted-foreground">
                    How long it takes to recover your investment. Formula: (Total First Year Investment / Total Annual
                    Benefit) × 12 months
                  </p>
                </div>
              </div>
            </section>

            {/* Input Fields Guide */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Input Fields Guide</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Simple Calculator</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <strong>Current DSO:</strong> Your current average collection period in days
                    </li>
                    <li>
                      <strong>Average Invoice Value:</strong> Typical invoice amount
                    </li>
                    <li>
                      <strong>Monthly Invoices:</strong> Number of invoices sent per month
                    </li>
                    <li>
                      <strong>Expected DSO Improvement:</strong> Percentage reduction in DSO (typically 30-50%)
                    </li>
                    <li>
                      <strong>Cost of Capital:</strong> Your interest rate on loans or opportunity cost (typically
                      5-15%)
                    </li>
                  </ul>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">Detailed Calculator</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>
                      <strong>Implementation Cost:</strong> One-time setup and integration costs
                    </li>
                    <li>
                      <strong>Monthly Cost:</strong> Ongoing subscription or service fees
                    </li>
                    <li>
                      <strong>Current DSO:</strong> Your current average collection period in days
                    </li>
                    <li>
                      <strong>Debtors Balance:</strong> Total accounts receivable (annual average)
                    </li>
                    <li>
                      <strong>Interest Rate:</strong> Cost of borrowing or return on deposits
                    </li>
                    <li>
                      <strong>Labour Costs:</strong> Annual direct costs for collections team
                    </li>
                    <li>
                      <strong>Current Bad Debts:</strong> Annual write-offs from uncollected invoices
                    </li>
                    <li>
                      <strong>DSO Improvement:</strong> Expected percentage reduction (30-50% typical)
                    </li>
                    <li>
                      <strong>Labour Savings:</strong> Efficiency gain from automation (20-40% typical)
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Calculation Formulas */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">How We Calculate Benefits</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-cyan-50 dark:bg-cyan-950/20 p-3 rounded-lg">
                  <h4 className="font-semibold mb-1">1. Working Capital Released</h4>
                  <p className="text-muted-foreground">
                    = (Annual Revenue / 365) × DSO Reduction Days
                    <br />
                    This is the immediate cash freed up from faster collections
                  </p>
                </div>

                <div className="bg-cyan-50 dark:bg-cyan-950/20 p-3 rounded-lg">
                  <h4 className="font-semibold mb-1">2. Interest Savings</h4>
                  <p className="text-muted-foreground">
                    = Working Capital Released × Interest Rate
                    <br />
                    Annual savings from reduced borrowing or increased deposits
                  </p>
                </div>

                <div className="bg-cyan-50 dark:bg-cyan-950/20 p-3 rounded-lg">
                  <h4 className="font-semibold mb-1">3. Labour Cost Savings</h4>
                  <p className="text-muted-foreground">
                    = Annual Labour Costs × Labour Savings %
                    <br />
                    Efficiency gains from automation and streamlined processes
                  </p>
                </div>

                <div className="bg-cyan-50 dark:bg-cyan-950/20 p-3 rounded-lg">
                  <h4 className="font-semibold mb-1">4. Bad Debt Reduction</h4>
                  <p className="text-muted-foreground">
                    = Current Bad Debts × 40%
                    <br />
                    Improved collections reduce write-offs by approximately 40%
                  </p>
                </div>

                <div className="bg-cyan-50 dark:bg-cyan-950/20 p-3 rounded-lg">
                  <h4 className="font-semibold mb-1">5. Total Annual Benefit</h4>
                  <p className="text-muted-foreground">
                    = Interest Savings + Labour Savings + Bad Debt Reduction
                    <br />
                    Combined recurring annual benefits
                  </p>
                </div>
              </div>
            </section>

            {/* Tips Section */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Tips for Accurate Results</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Use actual financial data from your accounting system for most accurate results</li>
                <li>DSO can be calculated from your balance sheet: (Accounts Receivable / Annual Revenue) × 365</li>
                <li>Conservative estimates: Use 30% DSO improvement and 20% labour savings</li>
                <li>Aggressive estimates: Use 50% DSO improvement and 40% labour savings</li>
                <li>Include all direct labour costs: salaries, benefits, and overhead for collections team</li>
                <li>Bad debt reduction assumes improved follow-up and payment options reduce write-offs</li>
              </ul>
            </section>

            {/* Typical Results */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Typical Results by Company Size</h3>
              </div>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">Small Business ($1-5M Revenue)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Working Capital Released: $50k - $250k</li>
                    <li>• Annual Savings: $10k - $50k</li>
                    <li>• Typical ROI: 200-400%</li>
                    <li>• Payback Period: 3-6 months</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">Mid-Market ($5-50M Revenue)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Working Capital Released: $250k - $2.5M</li>
                    <li>• Annual Savings: $50k - $500k</li>
                    <li>• Typical ROI: 300-600%</li>
                    <li>• Payback Period: 2-4 months</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-3">
                  <h4 className="font-semibold text-sm mb-2">Enterprise ($50M+ Revenue)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Working Capital Released: $2.5M+</li>
                    <li>• Annual Savings: $500k+</li>
                    <li>• Typical ROI: 400-800%</li>
                    <li>• Payback Period: 1-3 months</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our team is here to help you get the most accurate ROI calculation for your business.
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <div>
                  <strong>Email:</strong>{" "}
                  <a href="mailto:enquiries@kuhlekt.com" className="text-cyan-600 hover:underline">
                    enquiries@kuhlekt.com
                  </a>
                </div>
                <div>
                  <strong>Website:</strong>{" "}
                  <a
                    href="https://kuhlekt.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-600 hover:underline"
                  >
                    kuhlekt.com
                  </a>
                </div>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
