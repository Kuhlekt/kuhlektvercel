import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Shield,
  Zap,
  BarChart3,
  Target,
  Award,
  Star,
} from "lucide-react"
import Link from "next/link"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorTracker />
      </Suspense>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50 pt-20 pb-16">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200">
                  <Zap className="w-3 h-3 mr-1" />
                  AI-Powered Collections
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transform Your
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                    {" "}
                    Accounts Receivable
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Kuhlekt's AI-driven platform reduces DSO by 40% and increases collection rates by 60%. Automate your
                  entire receivables process from invoice to cash.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
                  >
                    Get Free Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/solutions">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-300 hover:border-cyan-500 px-8 py-3 text-lg bg-transparent"
                  >
                    View Solutions
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">No Setup Fees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">30-Day Free Trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-600">Cancel Anytime</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <img
                  src="/images/kuhlekt-dashboard-interface.png"
                  alt="Kuhlekt Dashboard Interface"
                  className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200"
                />
              </div>
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-2xl opacity-20 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-xl mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">40%</div>
              <div className="text-sm text-gray-600">DSO Reduction</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">60%</div>
              <div className="text-sm text-gray-600">Collection Rate Increase</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">75%</div>
              <div className="text-sm text-gray-600">Time Savings</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Happy Clients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 mb-4">
              Platform Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Optimize Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform combines AI intelligence with proven collection strategies to maximize your
              cash flow and minimize manual work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-xl mb-4">
                  <Zap className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle className="text-xl">AI-Powered Automation</CardTitle>
                <CardDescription>
                  Intelligent workflows that adapt to customer behavior and payment patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Smart dunning sequences
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Predictive analytics
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Automated follow-ups
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Real-Time Analytics</CardTitle>
                <CardDescription>Comprehensive dashboards with actionable insights and KPI tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    DSO monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Collection forecasting
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Performance metrics
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl">Compliance & Security</CardTitle>
                <CardDescription>Enterprise-grade security with full regulatory compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    GDPR compliant
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    SOC 2 certified
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Bank-level encryption
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Smart Segmentation</CardTitle>
                <CardDescription>Automatically categorize customers based on risk and payment behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Risk scoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Behavioral analysis
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Custom workflows
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Customer Portal</CardTitle>
                <CardDescription>Self-service portal for customers to view invoices and make payments</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Online payments
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Invoice history
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Payment plans
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl mb-4">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl">Integration Ready</CardTitle>
                <CardDescription>
                  Seamlessly connect with your existing ERP, CRM, and accounting systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    API-first design
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Pre-built connectors
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time sync
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-lg text-gray-600">
              Join hundreds of companies that have transformed their collections process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "Kuhlekt reduced our DSO from 45 to 28 days in just 3 months. The AI-powered insights have completely
                  transformed how we approach collections."
                </blockquote>
                <div className="flex items-center">
                  <img
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-600">CFO, TechCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "The automation features saved us 20 hours per week on manual follow-ups. Our collection rate improved
                  by 55% within the first quarter."
                </blockquote>
                <div className="flex items-center">
                  <img
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Michael Chen</div>
                    <div className="text-sm text-gray-600">Controller, Manufacturing Plus</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4">
                  "Implementation was seamless and the ROI was immediate. Kuhlekt's platform is intuitive and the
                  customer support is exceptional."
                </blockquote>
                <div className="flex items-center">
                  <img
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez"
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">Jessica Rodriguez</div>
                    <div className="text-sm text-gray-600">Finance Director, Global Services</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Collections Process?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies that have reduced their DSO and increased cash flow with Kuhlekt's AI-powered
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-3 text-lg font-semibold bg-transparent"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
