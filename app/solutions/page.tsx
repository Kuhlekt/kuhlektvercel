import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, TrendingUp, Clock, Shield, Users } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"
import Link from "next/link"

export default function SolutionsPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Comprehensive AR Solutions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your accounts receivable process with our integrated suite of automation tools designed for
              modern finance teams.
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <img
                    src="/images/ar-dashboard.png"
                    alt="AR Dashboard"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle className="text-2xl">Automated Collections</CardTitle>
                  <CardDescription className="text-base">
                    Streamline your collection process with intelligent automation that follows up on overdue accounts
                    while maintaining customer relationships.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Automated payment reminders</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Customizable escalation workflows</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Multi-channel communication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Performance analytics</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/demo">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <img
                    src="/images/customer-portal.png"
                    alt="Customer Portal"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle className="text-2xl">Customer Portal</CardTitle>
                  <CardDescription className="text-base">
                    Empower your customers with self-service capabilities that reduce support burden and improve payment
                    experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Online payment processing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Invoice viewing and download</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Dispute management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Payment history tracking</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/demo">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <img
                    src="/images/credit-control-software.png"
                    alt="Credit Management"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle className="text-2xl">Credit Management</CardTitle>
                  <CardDescription className="text-base">
                    Make informed credit decisions with AI-powered risk assessment and automated credit limit
                    management.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">AI-powered credit scoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Automated credit limit adjustments</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Risk monitoring and alerts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Credit application workflow</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/demo">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0 mb-6">
                  <img
                    src="/images/enterprise-receivables-dashboard.png"
                    alt="Analytics Dashboard"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <CardTitle className="text-2xl">Analytics & Reporting</CardTitle>
                  <CardDescription className="text-base">
                    Gain deep insights into your AR performance with comprehensive analytics and customizable reporting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Real-time AR dashboards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">DSO and aging analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Collection effectiveness metrics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Custom report builder</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full">
                    <Link href="/demo">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Kuhlekt?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive platform delivers measurable results that transform your AR operations
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Faster Collections</h3>
                <p className="text-gray-600">
                  Reduce DSO by up to 40% with automated workflows and intelligent follow-ups
                </p>
              </div>

              <div className="text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Time Savings</h3>
                <p className="text-gray-600">Eliminate 60% of manual AR tasks through intelligent automation</p>
              </div>

              <div className="text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Risk Reduction</h3>
                <p className="text-gray-600">Minimize bad debt with AI-powered credit scoring and risk assessment</p>
              </div>

              <div className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Better Relationships</h3>
                <p className="text-gray-600">
                  Improve customer satisfaction with self-service portals and professional communication
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your AR Process?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              See how our solutions can accelerate your cash flow and reduce manual work
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/demo">
                  Schedule Demo <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
