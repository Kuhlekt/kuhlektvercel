import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, TrendingUp, Users, Shield, Zap, Clock, DollarSign } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorTracker />
      </Suspense>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
              Complete AR Solutions
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Accounts Receivable
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Comprehensive solutions designed for businesses of all sizes. From automated invoicing to advanced
              collections management, we have the tools to optimize your cash flow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8 py-3" asChild>
                <Link href="/demo">Get Free Demo</Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent" asChild>
                <Link href="/contact">Talk to Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Solutions for Every Business Size</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Whether you're a growing SME or an established enterprise, our scalable solutions adapt to your unique
              requirements.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* SME Solution */}
            <Card className="relative overflow-hidden border-2 hover:border-blue-200 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">SME</Badge>
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Small & Medium Enterprises</CardTitle>
                <CardDescription>
                  Perfect for businesses with 10-500 employees looking to automate their AR processes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Automated invoice generation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Payment reminders & follow-ups</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Customer payment portal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Basic reporting & analytics</span>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/demo?solution=sme">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Mid-Market Solution */}
            <Card className="relative overflow-hidden border-2 border-blue-200 bg-blue-50/50">
              <div className="absolute top-4 right-4">
                <Badge className="bg-blue-600">Most Popular</Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Mid-Market</Badge>
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Growing Businesses</CardTitle>
                <CardDescription>
                  Ideal for companies with 500-2000 employees requiring advanced AR management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Everything in SME +</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Advanced collections workflows</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Credit risk assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Multi-currency support</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/demo?solution=midmarket">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Solution */}
            <Card className="relative overflow-hidden border-2 hover:border-purple-200 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">Enterprise</Badge>
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Large Enterprises</CardTitle>
                <CardDescription>
                  Comprehensive solution for enterprises with 2000+ employees and complex requirements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Everything in Mid-Market +</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Custom integrations & APIs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Dedicated account manager</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 priority support</span>
                  </div>
                </div>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/contact?solution=enterprise">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features That Drive Results</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform includes everything you need to streamline your accounts receivable process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Automated Workflows</h3>
              <p className="text-gray-600 text-sm">
                Streamline repetitive tasks with intelligent automation that adapts to your business rules.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600 text-sm">
                Monitor payment status, aging reports, and collection activities in real-time.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Cash Flow Optimization</h3>
              <p className="text-gray-600 text-sm">
                Improve DSO and reduce bad debt with predictive analytics and smart collections.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Compliance & Security</h3>
              <p className="text-gray-600 text-sm">
                Bank-level security with full compliance to industry standards and regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Industry-Specific Solutions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tailored solutions that understand the unique challenges of your industry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">M</span>
                  </div>
                  Manufacturing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Handle complex B2B transactions, manage extended payment terms, and integrate with ERP systems.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Purchase order matching
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Multi-location billing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Supply chain financing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">H</span>
                  </div>
                  Healthcare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Navigate insurance claims, patient billing, and regulatory compliance with specialized tools.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Insurance verification
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    HIPAA compliance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Patient payment plans
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">S</span>
                  </div>
                  SaaS & Technology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Manage subscription billing, usage-based pricing, and recurring revenue optimization.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Subscription management
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Usage-based billing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Churn prevention
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI Calculator Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                ROI Calculator
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Calculate Your Potential Savings</h2>
              <p className="text-lg text-gray-600 mb-8">
                See how much time and money you could save by automating your accounts receivable process. Our customers
                typically see a 300% ROI within the first year.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold">85%</span>
                  </div>
                  <div>
                    <p className="font-semibold">Reduction in DSO</p>
                    <p className="text-sm text-gray-600">Average days sales outstanding improvement</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">70%</span>
                  </div>
                  <div>
                    <p className="font-semibold">Time Savings</p>
                    <p className="text-sm text-gray-600">Less time spent on manual AR tasks</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold">95%</span>
                  </div>
                  <div>
                    <p className="font-semibold">Collection Rate</p>
                    <p className="text-sm text-gray-600">Improvement in successful collections</p>
                  </div>
                </div>
              </div>

              <Button size="lg" className="px-8 py-3" asChild>
                <Link href="/demo?calculator=true">
                  Try ROI Calculator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <Image
                  src="/images/dso-reduction-chart.png"
                  alt="DSO Reduction Chart showing improvement over time"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your AR Process?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses that have already improved their cash flow with Kuhlekt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3" asChild>
              <Link href="/demo">Start Free Trial</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/contact">Schedule Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
