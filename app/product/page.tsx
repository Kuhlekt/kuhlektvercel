import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  ArrowRight,
  Users,
  TrendingUp,
  Clock,
  Shield,
  CreditCard,
  FileText,
  BarChart3,
  Zap,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorTracker />
      </Suspense>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Product Overview
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The Complete AR Automation Platform for <span className="text-red-600">Modern Finance Teams</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your entire accounts receivable process with our comprehensive suite of AI-powered tools
              designed to reduce DSO and maximize cash flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/demo">
                  Get Free Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AR Software Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                AR Software
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Automated Invoice Delivery & Follow-up
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our intelligent AR software automatically sends invoices, tracks payments, and follows up with customers
                using personalized communication sequences.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Smart Invoice Distribution</h3>
                    <p className="text-gray-600">
                      Automatically send invoices via email, portal, or EDI based on customer preferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Intelligent Follow-up Sequences</h3>
                    <p className="text-gray-600">AI-powered reminders that adapt based on customer payment behavior</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Payment Tracking & Matching</h3>
                    <p className="text-gray-600">Automatically match payments to invoices and update your ERP system</p>
                  </div>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/demo">
                  See AR Software in Action <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img src="/images/ar-dashboard.png" alt="AR Dashboard Interface" className="rounded-lg shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Digital Collections Tools */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="/images/digital-collections.png"
                alt="Digital Collections Interface"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="order-1 lg:order-2">
              <Badge variant="secondary" className="mb-4">
                Digital Collections
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Advanced Collection Tools & Workflows
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform your collections process with AI-powered tools that prioritize accounts, automate outreach,
                and maximize recovery rates.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email & SMS Templates</h3>
                    <p className="text-gray-600">
                      Pre-built, customizable templates for every stage of the collection process
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Automated Workflows</h3>
                    <p className="text-gray-600">
                      Set up escalation sequences that adapt based on customer response and payment history
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Priority Scoring</h3>
                    <p className="text-gray-600">
                      AI algorithms rank accounts by likelihood to pay and collection difficulty
                    </p>
                  </div>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/demo">
                  Explore Collections Tools <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Credit Portal */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">
                Customer Portal
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Self-Service Invoice Management</h2>
              <p className="text-lg text-gray-600 mb-8">
                Empower your customers with a branded portal where they can view invoices, make payments, and manage
                their account information 24/7.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Branded Customer Experience</h3>
                    <p className="text-gray-600">White-labeled portal that matches your company branding and style</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Multiple Payment Options</h3>
                    <p className="text-gray-600">Accept credit cards, ACH, wire transfers, and digital wallets</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Dispute Management</h3>
                    <p className="text-gray-600">Customers can submit disputes and track resolution status online</p>
                  </div>
                </div>
              </div>
              <Button className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/demo">
                  View Customer Portal <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img
                src="/images/customer-portal.png"
                alt="Customer Portal Interface"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Complete Feature Set
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Everything You Need for AR Success</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform includes all the tools and features you need to transform your accounts
              receivable operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CreditCard className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Credit Applications</CardTitle>
                <CardDescription>
                  Digital credit application forms with automated approval workflows and credit scoring integration.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Invoice Management</CardTitle>
                <CardDescription>
                  Centralized invoice tracking, automated delivery, and real-time status updates across all channels.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Analytics & Reporting</CardTitle>
                <CardDescription>
                  Comprehensive dashboards and reports to track DSO, collection rates, and team performance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>ERP Integration</CardTitle>
                <CardDescription>
                  Seamless integration with popular ERP systems including SAP, Oracle, NetSuite, and QuickBooks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Mail className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Communication Hub</CardTitle>
                <CardDescription>
                  Unified inbox for all customer communications with automated response suggestions and templates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle>Compliance & Security</CardTitle>
                <CardDescription>
                  Bank-level security with SOC 2 compliance, data encryption, and audit trails for all activities.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Proven Results
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Transform Your AR Performance</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join hundreds of companies that have revolutionized their accounts receivable operations with Kuhlekt.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">30%</h3>
              <p className="text-gray-600">DSO Reduction</p>
            </div>

            <div className="text-center">
              <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">80%</h3>
              <p className="text-gray-600">Manual Tasks Eliminated</p>
            </div>

            <div className="text-center">
              <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">60%</h3>
              <p className="text-gray-600">Increase in Collection Rates</p>
            </div>

            <div className="text-center">
              <div className="bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">25%</h3>
              <p className="text-gray-600">Improvement in Cash Flow</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your AR Process?</h2>
          <p className="text-xl text-red-100 mb-8">
            See how Kuhlekt can help you reduce DSO, improve cash flow, and eliminate manual AR tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/demo">
                Get Free Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 bg-transparent"
              asChild
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
