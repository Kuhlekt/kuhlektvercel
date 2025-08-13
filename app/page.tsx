import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ArrowRight, Users, TrendingUp, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
                Automate Your Accounts Receivable Process
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Streamline credit management, accelerate collections, and reduce DSO with our comprehensive AR
                automation platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3">
                    Get Free Demo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/solutions">
                  <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                    View Solutions
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/v200-businesswoman-hero.png"
                alt="Professional businesswoman working with financial data and AR automation dashboard"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-600 mb-2">85%</div>
              <div className="text-gray-600">Faster Collections</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-600 mb-2">60%</div>
              <div className="text-gray-600">DSO Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-600 mb-2">95%</div>
              <div className="text-gray-600">Process Automation</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-600 mb-2">0000+</div>
              <div className="text-gray-600">Finance Teams Trust Us</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Complete AR Automation Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From credit applications to collections, manage your entire accounts receivable process in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Credit Management</h3>
                <p className="text-gray-600 mb-4">
                  Streamline credit applications, set limits, and monitor customer creditworthiness with automated
                  workflows.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Automated credit scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Real-time risk assessment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Collections</h3>
                <p className="text-gray-600 mb-4">
                  AI-powered collection strategies that prioritize accounts and automate follow-ups for maximum
                  recovery.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Automated dunning sequences</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Multi-channel communication</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Risk Monitoring</h3>
                <p className="text-gray-600 mb-4">
                  Continuous monitoring of customer financial health with early warning systems and predictive
                  analytics.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Early warning alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Portfolio risk analysis</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Process Automation</h3>
                <p className="text-gray-600 mb-4">
                  Eliminate manual tasks with intelligent automation that handles routine AR processes seamlessly.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Workflow automation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Document generation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Customer Portal</h3>
                <p className="text-gray-600 mb-4">
                  Self-service portal for customers to view invoices, make payments, and communicate with your team.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Online payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Invoice management</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Analytics & Reporting</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive dashboards and reports to track performance, identify trends, and optimize processes.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Real-time dashboards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                    <span className="text-sm text-gray-600">Custom reporting</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Powerful Dashboard & Analytics</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get complete visibility into your AR performance with real-time insights and actionable analytics.
            </p>
          </div>

          <div className="relative">
            <Image
              src="/images/ar-dashboard.png"
              alt="Kuhlekt AR Dashboard showing key metrics, aging reports, and collection performance analytics"
              width={1200}
              height={700}
              className="rounded-lg shadow-2xl mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Trusted by Finance Teams Worldwide</h2>
            <p className="text-xl text-gray-600">See how companies are transforming their AR processes with Kuhlekt</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson, CFO"
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-gray-600 text-sm">CFO, TechCorp</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Kuhlekt reduced our DSO by 45% in just 6 months. The automation features have freed up our team to
                  focus on strategic initiatives."
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen, Finance Director"
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-gray-600 text-sm">Finance Director, GlobalTrade</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The credit management features have significantly reduced our bad debt. We now have complete
                  visibility into customer risk."
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Image
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez, AR Manager"
                    width={60}
                    height={60}
                    className="rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold">Jessica Rodriguez</div>
                    <div className="text-gray-600 text-sm">AR Manager, ManufacturingPlus</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Collections have never been easier. The automated workflows and customer portal have improved our
                  cash flow dramatically."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Transform Your AR Process?</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Join thousands of finance teams who have automated their accounts receivable and improved cash flow with
            Kuhlekt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-3">
                Start Free Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-3 bg-transparent"
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
