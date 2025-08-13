import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function AboutPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Kuhlekt</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing accounts receivable management for B2B companies with intelligent automation and
              data-driven insights that reduce DSO and improve cash flow.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6">
                  To empower finance teams with cutting-edge technology that transforms accounts receivable from a
                  reactive process into a strategic advantage. We believe that efficient cash flow management is the
                  foundation of business growth.
                </p>
                <p className="text-lg text-gray-600">
                  Our platform combines artificial intelligence, automation, and deep industry expertise to deliver
                  measurable results that directly impact your bottom line.
                </p>
              </div>
              <div className="relative">
                <img
                  src="/images/kuhlekt-dashboard-interface.png"
                  alt="Kuhlekt Dashboard Interface"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We continuously push the boundaries of what's possible in AR management, leveraging the latest
                    technologies to solve complex financial challenges.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe in clear communication, honest reporting, and providing complete visibility into your
                    accounts receivable performance.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Every feature we build is designed to deliver measurable improvements in DSO, collection rates, and
                    overall financial performance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Company Stats */}
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Track Record</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Companies Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">35%</div>
                <div className="text-gray-600">Average DSO Reduction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">$2.5B</div>
                <div className="text-gray-600">AR Managed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                <div className="text-gray-600">Platform Uptime</div>
              </div>
            </div>
          </div>

          {/* Technology Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Built for the Future</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Enterprise-Grade Technology</h3>
                <p className="text-lg text-gray-600 mb-6">
                  Our platform is built on modern cloud infrastructure with enterprise-grade security, scalability, and
                  reliability. We use advanced machine learning algorithms to predict payment behavior and optimize
                  collection strategies.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">AI/ML</Badge>
                  <Badge variant="secondary">Cloud Native</Badge>
                  <Badge variant="secondary">API-First</Badge>
                  <Badge variant="secondary">SOC 2 Compliant</Badge>
                  <Badge variant="secondary">99.9% SLA</Badge>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/images/ar-dashboard.png"
                  alt="Advanced AR Analytics Dashboard"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center bg-blue-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Transform Your AR?</h2>
            <p className="text-lg text-gray-600 mb-6">
              Join hundreds of companies that have already improved their cash flow with Kuhlekt.
            </p>
            <div className="space-x-4">
              <a
                href="/demo"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Schedule a Demo
              </a>
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
