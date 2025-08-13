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
  Users,
} from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function SolutionsPage() {
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
                    🚀 Complete AR Solutions
                  </Badge>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                    Transform Your
                    <span className="block text-yellow-300">AR Operations</span>
                    End-to-End
                  </h1>
                  <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                    From credit management to collections, our comprehensive suite of solutions automates your entire
                    accounts receivable process
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
                    <Link href="/contact">Contact Sales</Link>
                  </Button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">95%</div>
                    <div className="text-sm text-blue-200">Process Automation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">50%</div>
                    <div className="text-sm text-blue-200">Faster Collections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-300">35%</div>
                    <div className="text-sm text-blue-200">DSO Reduction</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10">
                  <Image
                    src="/images/enterprise-receivables-dashboard.png"
                    alt="Enterprise AR dashboard showing comprehensive receivables management"
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

        {/* Solutions Overview */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Complete AR Solution Suite</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every tool you need to optimize your accounts receivable process, from initial credit assessment to
                final payment collection
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Credit Management</h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive credit assessment, limit setting, and ongoing monitoring with real-time risk alerts
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Automated credit scoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Dynamic limit management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Risk monitoring & alerts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Smart Collections</h3>
                  <p className="text-gray-600 mb-4">
                    AI-powered collection strategies with automated workflows and multi-channel communication
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Intelligent prioritization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Automated dunning sequences</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Multi-channel outreach</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Customer Portal</h3>
                  <p className="text-gray-600 mb-4">
                    Self-service portal for customers to view invoices, make payments, and communicate with your team
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Online payment processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Invoice management</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Dispute resolution</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Process Automation</h3>
                  <p className="text-gray-600 mb-4">
                    End-to-end workflow automation that eliminates manual tasks and accelerates your AR cycle
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Workflow orchestration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Document automation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Task management</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Analytics & Reporting</h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive dashboards and reports that provide deep insights into your AR performance
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Real-time dashboards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Custom reporting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">Predictive analytics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow border-l-4 border-l-indigo-500">
                <CardContent className="p-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Integration Hub</h3>
                  <p className="text-gray-600 mb-4">
                    Seamless integration with your existing ERP, CRM, and accounting systems for unified operations
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">ERP connectivity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">CRM synchronization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">API-first architecture</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Industry Solutions */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Industry-Specific Solutions</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tailored AR solutions designed for the unique challenges of your industry
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <Image
                      src="/images/sme-credit-management.png"
                      alt="SME Credit Management Solution"
                      width={300}
                      height={200}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Manufacturing</h3>
                  <p className="text-gray-600 mb-4">
                    Specialized solutions for complex supply chains, long payment terms, and high-volume transactions
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <Image
                      src="/images/digital-collections.png"
                      alt="Digital Collections Solution"
                      width={300}
                      height={200}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Technology</h3>
                  <p className="text-gray-600 mb-4">
                    Fast-growing tech companies need agile AR solutions that scale with rapid business expansion
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Learn More
                  </Button>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="mb-4">
                    <Image
                      src="/images/debt-collection-system.png"
                      alt="Debt Collection System"
                      width={300}
                      height={200}
                      className="rounded-lg w-full h-48 object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Healthcare</h3>
                  <p className="text-gray-600 mb-4">
                    Navigate complex insurance processes and patient billing with specialized healthcare AR workflows
                  </p>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Calculate Your ROI</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                See the potential impact of Kuhlekt's AR solutions on your business performance
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">$1.2M+</h3>
                  <p className="text-blue-100">Average Annual Savings</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">35%</h3>
                  <p className="text-blue-100">DSO Reduction</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">280%</h3>
                  <p className="text-blue-100">Average ROI</p>
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

        {/* Success Stories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Customer Success Stories</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real results from companies that transformed their AR operations with Kuhlekt
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-6">
                    <Image
                      src="/images/sarah-johnson-headshot.png"
                      alt="Sarah Johnson"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="text-xl font-semibold">Sarah Johnson</h4>
                      <p className="text-gray-600">CFO, TechFlow Inc.</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-lg text-gray-700 italic mb-6">
                    "Kuhlekt's comprehensive solution reduced our DSO from 45 to 28 days in just 6 months. The
                    automation has freed up our team to focus on strategic initiatives, and our cash flow has never been
                    better."
                  </blockquote>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">38%</div>
                      <div className="text-sm text-gray-600">DSO Reduction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">$2.1M</div>
                      <div className="text-sm text-gray-600">Annual Savings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">85%</div>
                      <div className="text-sm text-gray-600">Time Saved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-6">
                    <Image
                      src="/images/michael-chen-asian.png"
                      alt="Michael Chen"
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                    <div>
                      <h4 className="text-xl font-semibold">Michael Chen</h4>
                      <p className="text-gray-600">Finance Director, GlobalTrade</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-lg text-gray-700 italic mb-6">
                    "The credit management features have been game-changing. We've reduced bad debt by 60% and our
                    collection rates have improved dramatically. The ROI was evident within the first quarter."
                  </blockquote>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">60%</div>
                      <div className="text-sm text-gray-600">Bad Debt Reduction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">45%</div>
                      <div className="text-sm text-gray-600">Collection Rate Increase</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-purple-600">320%</div>
                      <div className="text-sm text-gray-600">ROI</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Ready to Transform Your AR Operations?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join hundreds of companies that have revolutionized their accounts receivable process with Kuhlekt's
                comprehensive solution suite
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/demo">
                    Schedule Demo <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/contact">Contact Sales Team</Link>
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                No credit card required • 30-day free trial • Implementation support included
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
