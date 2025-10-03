"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, BarChart3, CheckCircle, TrendingUp, Users, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ROICalculatorModal } from "@/components/roi-calculator-modal"

export default function LandingPage() {
  const [showROICalculator, setShowROICalculator] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 to-cyan-50 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-sm">
                <Zap className="mr-2 h-4 w-4 text-cyan-600" />
                <span className="text-cyan-900">Transform Your Invoice-to-Cash Process</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
                Accelerate Cash Flow with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                  AI-Powered
                </span>{" "}
                Collections
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Reduce DSO by 30%, automate 80% of collection tasks, and improve customer relationships with our
                intelligent receivables platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Link href="/demo">
                    Schedule a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setShowROICalculator(true)}
                  className="border-cyan-600 text-cyan-600 hover:bg-cyan-50"
                >
                  Calculate Your ROI
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Setup in minutes</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-blue-500 rounded-3xl blur-3xl opacity-20" />
              <Image
                src="/images/kuhlekt-dashboard-interface.png"
                alt="Kuhlekt Dashboard Interface"
                width={600}
                height={400}
                className="relative rounded-2xl shadow-2xl border border-gray-200"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600">30%</div>
              <div className="text-sm text-gray-600 mt-2">DSO Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600">80%</div>
              <div className="text-sm text-gray-600 mt-2">Task Automation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600">50%</div>
              <div className="text-sm text-gray-600 mt-2">Faster Payments</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600">95%</div>
              <div className="text-sm text-gray-600 mt-2">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Modern Finance Teams</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to transform your accounts receivable process and accelerate cash flow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Predictions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Predict payment behaviors and prioritize collection efforts with machine learning algorithms that
                  learn from your data.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Automated Workflows</h3>
                <p className="text-gray-600 leading-relaxed">
                  Set up intelligent workflows that automatically send reminders, escalate issues, and track payment
                  commitments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Portal</h3>
                <p className="text-gray-600 leading-relaxed">
                  Give customers 24/7 access to invoices, payment history, and self-service payment options that improve
                  satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-Time Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get instant insights into DSO, aging reports, and collection performance with customizable dashboards.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">ERP Integration</h3>
                <p className="text-gray-600 leading-relaxed">
                  Seamlessly connect with your existing ERP, accounting software, and payment systems for unified data
                  flow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="h-12 w-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Dunning</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automatically escalate overdue accounts with personalized communication strategies that maintain
                  customer relationships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Kuhlekt Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, powerful process that transforms your collections in days, not months
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect Your Data</h3>
              <p className="text-gray-600">Integrate with your ERP or upload your AR data in minutes</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Analysis</h3>
              <p className="text-gray-600">Our AI analyzes payment patterns and predicts behaviors</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Automated Actions</h3>
              <p className="text-gray-600">Smart workflows handle reminders and follow-ups automatically</p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-cyan-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Paid Faster</h3>
              <p className="text-gray-600">Watch your DSO drop and cash flow improve immediately</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Finance Leaders</h2>
            <p className="text-xl text-gray-600">Join hundreds of companies accelerating their cash flow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Kuhlekt reduced our DSO from 52 to 35 days in just 3 months. The ROI was immediate and the team loves
                  the automation."
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-gray-600">CFO, TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The AI predictions are incredibly accurate. We now know exactly which accounts to prioritize, saving
                  our team hours every week."
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-gray-600">AR Manager, Global Industries</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Setup was painless and the customer portal improved our relationships. Customers love the
                  self-service options."
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">Jessica Rodriguez</div>
                    <div className="text-sm text-gray-600">Controller, Midwest Manufacturing</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Collections?</h2>
          <p className="text-xl mb-8 text-cyan-50">
            Join the leading companies that have already accelerated their cash flow with Kuhlekt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
              <Link href="/demo">
                Schedule a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setShowROICalculator(true)}
              className="border-white text-white hover:bg-cyan-700"
            >
              Calculate Your ROI
            </Button>
          </div>
        </div>
      </section>

      {/* ROI Calculator Modal */}
      <ROICalculatorModal isOpen={showROICalculator} onClose={() => setShowROICalculator(false)} />
    </div>
  )
}
