import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Target, Award, Globe, DollarSign, Zap, Shield } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorTracker />
      </Suspense>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
                About Kuhlekt
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Revolutionizing{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Accounts Receivable
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're on a mission to transform how businesses manage their accounts receivable. Through innovative
                technology and deep industry expertise, we help companies optimize their cash flow and reduce collection
                times.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="px-8 py-3" asChild>
                  <Link href="/demo">See Our Platform</Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent" asChild>
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
                <Image
                  src="/images/v200-businesswoman-hero.png"
                  alt="Professional businesswoman representing Kuhlekt's expertise"
                  width={600}
                  height={500}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="border-2 border-blue-100 bg-blue-50/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To empower businesses of all sizes with intelligent accounts receivable solutions that streamline
                  operations, improve cash flow, and drive sustainable growth. We believe every business deserves access
                  to enterprise-grade AR technology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 bg-purple-50/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed">
                  To become the global leader in accounts receivable automation, setting new standards for efficiency,
                  transparency, and customer experience. We envision a world where businesses can focus on growth while
                  we handle their AR complexities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform has helped thousands of companies improve their accounts receivable processes and achieve
              better financial outcomes.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5,000+</div>
              <p className="text-gray-600">Active Customers</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$2.5B+</div>
              <p className="text-gray-600">Processed Annually</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">25+</div>
              <p className="text-gray-600">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Customer Success</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We measure our success by our customers' success. Every feature we build and every decision we make is
                  driven by delivering exceptional value to our users.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We continuously push the boundaries of what's possible in accounts receivable technology, leveraging
                  AI and automation to solve complex business challenges.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Trust & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We understand the critical nature of financial data and maintain the highest standards of security,
                  compliance, and data protection in everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Kuhlekt Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses that trust Kuhlekt to manage their accounts receivable. Let's discuss how we
            can help optimize your cash flow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-3" asChild>
              <Link href="/demo">Get Free Demo</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              asChild
            >
              <Link href="/contact">Talk to Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
