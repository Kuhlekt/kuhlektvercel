"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  CheckCircle,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  Shield,
  Zap,
  ArrowRight,
  PlayCircle,
  Star,
} from "lucide-react"
import Image from "next/image"
import { ROICalculatorModal } from "@/components/roi-calculator-modal"

export default function HomePage() {
  const [isROIModalOpen, setIsROIModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  #1 AR Automation Platform
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Get Paid Faster with Intelligent AR Automation
              </h1>
              <p className="text-xl text-cyan-50 leading-relaxed">
                Transform your accounts receivable process with AI-powered automation. Reduce DSO by up to 30%,
                eliminate manual tasks, and improve cash flow—all while enhancing customer relationships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo#top">
                  <Button
                    size="lg"
                    className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-200"
                  >
                    Request a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/product#top">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white text-cyan-600 hover:bg-gray-50 border-2 border-white font-semibold px-8 py-6 text-lg shadow-md"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Product Tour
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white/30 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-sm text-cyan-50">Trusted by 500+ companies</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-cyan-50 ml-2">4.9/5 rating</span>
                </div>
              </div>
            </div>
            <div className="relative lg:block hidden">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                <Image
                  src="/images/kuhlekt-dashboard-interface.png"
                  alt="Kuhlekt Dashboard Interface"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">30%</div>
              <div className="text-gray-600">Average DSO Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">500+</div>
              <div className="text-gray-600">Active Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">40%</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime SLA</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Optimize Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines automation, intelligence, and seamless integrations to transform your
              AR process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-cyan-500 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Automated Collections</h3>
                <p className="text-gray-600 leading-relaxed">
                  AI-powered reminders and follow-ups that adapt to customer behavior, reducing manual work by 80%.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Real-Time Analytics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive dashboards and insights to track DSO, aging reports, and collection effectiveness.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Customer Portal</h3>
                <p className="text-gray-600 leading-relaxed">
                  Self-service portal for customers to view invoices, make payments, and resolve disputes instantly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                  <DollarSign className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Payment Processing</h3>
                <p className="text-gray-600 leading-relaxed">
                  Integrated payment options including ACH, credit cards, and digital wallets for faster payments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Credit Management</h3>
                <p className="text-gray-600 leading-relaxed">
                  Automated credit scoring and limits with real-time monitoring to minimize bad debt risk.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Dispute Resolution</h3>
                <p className="text-gray-600 leading-relaxed">
                  Streamlined workflow for managing and resolving payment disputes with full audit trails.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How Kuhlekt Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get up and running in days, not months. Our simple implementation process ensures quick time-to-value.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 hover:border-cyan-500 transition-all duration-200">
                <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Connect Your Systems</h3>
                <p className="text-gray-600 leading-relaxed">
                  Seamlessly integrate with your existing ERP, accounting software, and payment processors in hours.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 hover:border-cyan-500 transition-all duration-200">
                <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Configure Your Workflows</h3>
                <p className="text-gray-600 leading-relaxed">
                  Set up automated collection strategies, payment terms, and customer communication preferences.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-100 hover:border-cyan-500 transition-all duration-200">
                <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Start Collecting Faster</h3>
                <p className="text-gray-600 leading-relaxed">
                  Watch as automation takes over manual tasks and your DSO begins to drop within the first month.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Why Finance Teams Choose Kuhlekt</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Stop chasing payments and start optimizing your cash flow. Our platform gives you the tools and insights
                needed to transform your AR operations.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Reduce DSO by 30%</h4>
                    <p className="text-gray-600">
                      Automated workflows and intelligent reminders accelerate payment cycles significantly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Save 40% of Team Time</h4>
                    <p className="text-gray-600">
                      Eliminate manual follow-ups and data entry, freeing your team for strategic work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Improve Customer Satisfaction</h4>
                    <p className="text-gray-600">
                      Self-service portal and professional communications enhance customer experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Decrease Bad Debt</h4>
                    <p className="text-gray-600">
                      Proactive credit management and early warning systems minimize write-offs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/dso-reduction-chart.png"
                alt="DSO Reduction Chart"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl border-4 border-gray-100"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Trusted by Finance Leaders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how companies are transforming their accounts receivable with Kuhlekt.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-gray-100 hover:border-cyan-500 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "Kuhlekt reduced our DSO from 52 to 38 days in just 3 months. The automation has freed up our team to
                  focus on strategic initiatives."
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-600">CFO, TechCorp Industries</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-cyan-500 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "The customer portal has been a game-changer. Our clients love the transparency and our collection
                  rates have improved by 25%."
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Michael Chen</div>
                    <div className="text-sm text-gray-600">Controller, Global Manufacturing Co</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-100 hover:border-cyan-500 hover:shadow-xl transition-all duration-200">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "Implementation was seamless and the ROI was immediate. We're saving 15 hours per week on collections
                  tasks."
                </p>
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Jessica Rodriguez</div>
                    <div className="text-sm text-gray-600">AR Manager, Retail Solutions Inc</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Integrates with Your Existing Stack</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect seamlessly with popular accounting, ERP, and payment platforms.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
              <div className="text-4xl font-bold text-gray-400">QuickBooks</div>
              <div className="text-4xl font-bold text-gray-400">Xero</div>
              <div className="text-4xl font-bold text-gray-400">NetSuite</div>
              <div className="text-4xl font-bold text-gray-400">SAP</div>
              <div className="text-4xl font-bold text-gray-400">Stripe</div>
              <div className="text-4xl font-bold text-gray-400">PayPal</div>
              <div className="text-4xl font-bold text-gray-400">Salesforce</div>
              <div className="text-4xl font-bold text-gray-400">HubSpot</div>
            </div>
            <div className="text-center mt-8">
              <Link href="/product#integrations" className="text-cyan-600 hover:text-cyan-700 font-semibold">
                View all integrations <ArrowRight className="inline h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Accounts Receivable?
          </h2>
          <p className="text-xl text-cyan-50 mb-8 leading-relaxed">
            Join hundreds of companies that have optimized their collections and improved cash flow with Kuhlekt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo#top">
              <Button
                size="lg"
                className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg shadow-xl"
              >
                Schedule a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact#top">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ROI Calculator Modal */}
      <ROICalculatorModal isOpen={isROIModalOpen} onClose={() => setIsROIModalOpen(false)} />
    </div>
  )
}
