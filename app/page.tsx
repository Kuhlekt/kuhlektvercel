import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  Zap,
  BarChart3,
  Target,
  Award,
  Star,
} from "lucide-react"
import VisitorTracker from "@/components/visitor-tracker"

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    🚀 Transform Your AR Process
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Accelerate Your
                    <span className="block text-yellow-300">Cash Flow</span>
                    with Smart AR
                  </h1>
                  <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                    Reduce DSO by 40% and increase collections by 60% with our AI-powered accounts receivable platform
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
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
                    <Link href="/product">Learn More</Link>
                  </Button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">40%</div>
                    <div className="text-sm text-blue-200">DSO Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">60%</div>
                    <div className="text-sm text-blue-200">Collection Increase</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">90%</div>
                    <div className="text-sm text-blue-200">Process Automation</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src="/images/v200-businesswoman-hero.png"
                    alt="Professional businesswoman using Kuhlekt AR platform"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl"
                    priority
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-12 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <p className="text-gray-600 font-medium">Trusted by leading companies worldwide</p>
            </div>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">ACME Corp</div>
              <div className="text-2xl font-bold text-gray-400">TechFlow</div>
              <div className="text-2xl font-bold text-gray-400">GlobalTrade</div>
              <div className="text-2xl font-bold text-gray-400">InnovateCo</div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Kuhlekt?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform combines AI-powered automation with human expertise to deliver exceptional results
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Faster Collections</h3>
                  <p className="text-gray-600">
                    Reduce your DSO by up to 40% with automated follow-ups and intelligent prioritization
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Increased Revenue</h3>
                  <p className="text-gray-600">
                    Boost collections by 60% through predictive analytics and personalized communication
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Time Savings</h3>
                  <p className="text-gray-600">
                    Automate 90% of routine tasks and focus your team on high-value activities
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Risk Reduction</h3>
                  <p className="text-gray-600">
                    Minimize bad debt with early warning systems and credit risk assessment
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Easy Integration</h3>
                  <p className="text-gray-600">
                    Seamlessly connect with your existing ERP, CRM, and accounting systems
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-time Insights</h3>
                  <p className="text-gray-600">Make data-driven decisions with comprehensive analytics and reporting</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Complete AR Automation Platform</h2>
                <p className="text-xl text-gray-600 mb-8">
                  From invoice generation to payment collection, manage your entire accounts receivable process in one
                  unified platform.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Automated Invoice Processing</h4>
                      <p className="text-gray-600">Generate, send, and track invoices automatically</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Smart Collection Workflows</h4>
                      <p className="text-gray-600">AI-powered follow-up sequences that adapt to customer behavior</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Customer Self-Service Portal</h4>
                      <p className="text-gray-600">
                        Let customers view invoices, make payments, and resolve disputes online
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Advanced Analytics</h4>
                      <p className="text-gray-600">Real-time dashboards and predictive insights</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/product">
                      Explore All Features <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Image
                  src="/images/kuhlekt-dashboard-interface.png"
                  alt="Kuhlekt AR Dashboard Interface"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Calculator Preview */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Calculate Your ROI</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                See how much you could save and earn with Kuhlekt's AR automation platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Target className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">$2.5M+</h3>
                  <p className="text-blue-100">Average Annual Savings</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">300%</h3>
                  <p className="text-blue-100">Average ROI in Year 1</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">6 Months</h3>
                  <p className="text-blue-100">Typical Payback Period</p>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button asChild size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                <Link href="/demo">
                  Calculate Your Savings <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Customer Success Stories */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how companies like yours have transformed their AR processes with Kuhlekt
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src="/images/sarah-johnson-headshot.png"
                      alt="Sarah Johnson"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">Sarah Johnson</h4>
                      <p className="text-sm text-gray-600">CFO, TechFlow Inc.</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    "Kuhlekt reduced our DSO from 45 to 28 days in just 6 months. The ROI was immediate and
                    substantial."
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src="/images/michael-chen-asian.png"
                      alt="Michael Chen"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">Michael Chen</h4>
                      <p className="text-sm text-gray-600">Controller, GlobalTrade</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    "The automation freed up our team to focus on strategic initiatives. Collections improved by 55%."
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src="/images/jessica-rodriguez-hispanic.png"
                      alt="Jessica Rodriguez"
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold">Jessica Rodriguez</h4>
                      <p className="text-sm text-gray-600">AR Manager, InnovateCo</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    "The customer portal reduced disputes by 70% and improved our customer relationships significantly."
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your AR Process?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of companies that have already improved their cash flow with Kuhlekt
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/demo">
                    Get Free Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Sales</Link>
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                No credit card required • 30-day free trial • Setup in minutes
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
