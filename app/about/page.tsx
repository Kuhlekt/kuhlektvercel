import { Suspense } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, TrendingUp, Users, Award, Target, ArrowRight } from "lucide-react"
import VisitorTracker from "@/components/visitor-tracker"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Kuhlekt</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We help businesses optimize their accounts receivable processes through intelligent automation and
              data-driven insights.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-8">
                  To empower businesses with intelligent accounts receivable solutions that accelerate cash flow, reduce
                  operational costs, and strengthen customer relationships through automation and analytics.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Innovation First</h4>
                      <p className="text-gray-600">Leveraging cutting-edge AI and machine learning technologies</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Customer Success</h4>
                      <p className="text-gray-600">Dedicated to delivering measurable results and ROI</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Continuous Improvement</h4>
                      <p className="text-gray-600">Always evolving to meet changing business needs</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Image
                  src="/images/manual-vs-automated-ar.png"
                  alt="Manual vs Automated AR Process Comparison"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Since our founding, we've helped hundreds of companies transform their AR processes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
                  <p className="text-gray-600">Companies Served</p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">$2.5B+</h3>
                  <p className="text-gray-600">AR Processed</p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">40%</h3>
                  <p className="text-gray-600">Average DSO Reduction</p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">98%</h3>
                  <p className="text-gray-600">Customer Satisfaction</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-xl text-gray-600">
                  Founded by finance professionals who experienced AR challenges firsthand
                </p>
              </div>

              <div className="space-y-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">The Problem We Saw</h3>
                    <p className="text-gray-600 mb-6">
                      As CFOs and finance leaders, our founders witnessed countless businesses struggling with manual AR
                      processes, delayed payments, and poor cash flow visibility. Traditional solutions were either too
                      complex or too simplistic to address real-world challenges.
                    </p>
                    <p className="text-gray-600">
                      We knew there had to be a better way to manage accounts receivable that combined automation with
                      intelligence, simplicity with power.
                    </p>
                  </div>
                  <div className="relative">
                    <Image
                      src="/images/enterprise-receivables-dashboard.png"
                      alt="Enterprise receivables dashboard showing AR analytics"
                      width={500}
                      height={300}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="lg:order-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                    <p className="text-gray-600 mb-6">
                      We built Kuhlekt to be the AR platform we wished we had as finance leaders. It combines the power
                      of AI and automation with the flexibility and insights that growing businesses need.
                    </p>
                    <p className="text-gray-600">
                      Today, we're proud to help hundreds of companies accelerate their cash flow, reduce manual work,
                      and make data-driven decisions about their receivables.
                    </p>
                  </div>
                  <div className="lg:order-1 relative">
                    <Image
                      src="/images/ar-dashboard.png"
                      alt="Kuhlekt AR dashboard interface"
                      width={500}
                      height={300}
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">We constantly push the boundaries of what's possible in AR automation.</p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Customer First</h3>
                <p className="text-gray-600">Every decision we make is guided by what's best for our customers.</p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Results Driven</h3>
                <p className="text-gray-600">We measure our success by the tangible results we deliver.</p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                <p className="text-gray-600">
                  We believe in open, honest communication with our customers, partners, and team members. No hidden
                  fees, no surprises, just clear expectations.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in everything we do, from product development to customer support, always
                  raising the bar for ourselves and the industry.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Growth Mindset</h3>
                <p className="text-gray-600">
                  We embrace challenges as opportunities to learn and grow. Continuous improvement is at the heart of
                  our culture and product development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Meet the experienced professionals leading Kuhlekt's mission
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Image
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson, CEO"
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-1">Sarah Johnson</h3>
                  <p className="text-blue-600 font-medium mb-3">CEO & Co-Founder</p>
                  <p className="text-gray-600 text-sm">
                    Former CFO with 15+ years in finance operations. Led AR transformations at Fortune 500 companies.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Image
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen, CTO"
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-1">Michael Chen</h3>
                  <p className="text-blue-600 font-medium mb-3">CTO & Co-Founder</p>
                  <p className="text-gray-600 text-sm">
                    Technology leader with expertise in AI/ML and fintech. Previously built scalable platforms at
                    leading tech companies.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Image
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez, VP of Customer Success"
                    width={120}
                    height={120}
                    className="rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-1">Jessica Rodriguez</h3>
                  <p className="text-blue-600 font-medium mb-3">VP of Customer Success</p>
                  <p className="text-gray-600 text-sm">
                    Customer success expert with deep AR domain knowledge. Ensures every client achieves their cash flow
                    goals.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Join Our Success Story?</h2>
              <p className="text-xl text-blue-100 mb-8">
                Discover how Kuhlekt can transform your accounts receivable process and accelerate your cash flow
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  <Link href="/demo">
                    Get Free Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-700 bg-transparent"
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>

              <p className="text-sm text-blue-200 mt-4">
                No credit card required • 30-day free trial • Setup in minutes
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
