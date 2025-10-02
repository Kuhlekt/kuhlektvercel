import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Shield,
  Zap,
  Target,
  BarChart3,
  Lightbulb,
  PlayCircle,
  Calculator,
} from "lucide-react"
import { ROICalculatorModal } from "@/components/roi-calculator-modal"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1.5">
                <TrendingUp className="mr-2 h-4 w-4" />
                Transform Your Invoice-to-Cash Process
              </Badge>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Accelerate Cash Flow with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                  AI-Powered
                </span>{" "}
                Collections
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Kuhlekt automates your accounts receivable process, reduces DSO by up to 30%, and helps you get paid
                faster—without the manual effort.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button
                    size="lg"
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg w-full sm:w-auto"
                  >
                    Request a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/product">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-600 hover:text-white px-8 py-6 text-lg w-full sm:w-auto bg-white shadow-md"
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Product Tour
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">30%</div>
                  <div className="text-sm text-gray-600">Faster Collections</div>
                </div>
                <div className="h-12 w-px bg-gray-300" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">50%</div>
                  <div className="text-sm text-gray-600">Time Saved</div>
                </div>
                <div className="h-12 w-px bg-gray-300" />
                <div>
                  <div className="text-3xl font-bold text-gray-900">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime SLA</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-3xl opacity-20 animate-pulse" />
              <Image
                src="/images/kuhlekt-dashboard-interface.png"
                alt="Kuhlekt Dashboard Interface"
                width={700}
                height={500}
                className="relative rounded-2xl shadow-2xl border border-gray-200"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 text-sm mb-8">TRUSTED BY LEADING BUSINESSES WORLDWIDE</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="text-2xl font-bold text-gray-400">COMPANY A</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY B</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY C</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY D</div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">The Challenge</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Manual Collections Are Holding Your Business Back</h2>
            <p className="text-xl text-gray-600">
              Are you spending too much time chasing invoices instead of growing your business?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-red-100 bg-white">
              <CardHeader>
                <Clock className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-xl">Slow Payment Cycles</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Average DSO of 45+ days ties up critical working capital and limits growth opportunities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 bg-white">
              <CardHeader>
                <Users className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-xl">Resource Intensive</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Your team wastes hours on repetitive tasks like sending reminders and making collection calls.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-100 bg-white">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-red-600 mb-4" />
                <CardTitle className="text-xl">Revenue Leakage</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Manual processes lead to missed follow-ups, resulting in increased bad debt and write-offs.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-white text-cyan-700">The Solution</Badge>
            <h2 className="text-4xl font-bold mb-6">Automate Your Entire Invoice-to-Cash Cycle</h2>
            <p className="text-xl text-cyan-100">
              Kuhlekt uses AI and automation to transform your collections process, helping you get paid faster with
              less effort.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <Zap className="h-12 w-12 text-cyan-300 mb-4" />
                <CardTitle className="text-xl text-white">Intelligent Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-cyan-100">
                  Automatically send personalized payment reminders via email and SMS based on customer behavior
                  patterns.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <Target className="h-12 w-12 text-cyan-300 mb-4" />
                <CardTitle className="text-xl text-white">Smart Prioritization</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-cyan-100">
                  AI-powered risk scoring helps you focus on high-value accounts that need attention, maximizing
                  collection efficiency.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-cyan-300 mb-4" />
                <CardTitle className="text-xl text-white">Real-Time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-cyan-100">
                  Get instant visibility into your AR metrics, payment trends, and team performance with comprehensive
                  dashboards.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <Shield className="h-12 w-12 text-cyan-300 mb-4" />
                <CardTitle className="text-xl text-white">Secure Customer Portal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-cyan-100">
                  Let customers view invoices, make payments, and set up payment plans through a branded self-service
                  portal.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <CheckCircle2 className="h-12 w-12 text-cyan-300 mb-4" />
                <CardTitle className="text-xl text-white">Seamless Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-cyan-100">
                  Connect with your existing ERP, accounting software, and CRM systems with pre-built integrations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20 text-white">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-cyan-300 mb-4" />
                <CardTitle className="text-xl text-white">Predictive Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-cyan-100">
                  Leverage machine learning to predict payment dates and identify potential defaults before they happen.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-cyan-100 text-cyan-700">How It Works</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Get Started in Minutes, Not Months</h2>
            <p className="text-xl text-gray-600">Our simple three-step process gets you up and running quickly.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold z-10">
                1
              </div>
              <Card className="pt-8 border-2 border-cyan-100">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Connect Your Systems</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-center">
                    Integrate Kuhlekt with your existing accounting software, ERP, or CRM in just a few clicks.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold z-10">
                2
              </div>
              <Card className="pt-8 border-2 border-cyan-100">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Customize Your Workflows</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-center">
                    Set up automated payment reminders, escalation rules, and communication preferences.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-cyan-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold z-10">
                3
              </div>
              <Card className="pt-8 border-2 border-cyan-100">
                <CardHeader>
                  <CardTitle className="text-xl text-center">Watch Collections Improve</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-center">
                    Let AI handle the heavy lifting while you monitor results and watch your DSO drop.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator CTA */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Calculator className="h-16 w-16 mx-auto mb-6 text-cyan-200" />
            <h2 className="text-4xl font-bold mb-6">Calculate Your Potential ROI</h2>
            <p className="text-xl text-cyan-100 mb-8">
              See how much time and money you could save by automating your invoice-to-cash process with Kuhlekt.
            </p>
            <ROICalculatorModal />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Badge className="mb-4 bg-cyan-100 text-cyan-700">Success Stories</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Loved by Finance Teams Everywhere</h2>
            <p className="text-xl text-gray-600">See what our customers have to say about Kuhlekt.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                    <CardDescription>CFO, TechCorp Inc.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "Kuhlekt reduced our DSO from 52 days to 34 days in just 3 months. The automation freed up our team to
                  focus on strategic work instead of chasing payments."
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">Michael Chen</CardTitle>
                    <CardDescription>VP Finance, GrowthCo</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "The AI-powered insights helped us identify at-risk accounts early. We've decreased our bad debt by
                  40% since implementing Kuhlekt."
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">Jessica Rodriguez</CardTitle>
                    <CardDescription>Controller, ServicePro</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 italic">
                  "Setup was incredibly easy, and the customer portal has improved our client relationships. Payment
                  disputes are down 60% since launch."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Collections Process?</h2>
            <p className="text-xl text-cyan-100 mb-8">
              Join hundreds of businesses that have automated their invoice-to-cash cycle with Kuhlekt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-6 text-lg w-full sm:w-auto"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg w-full sm:w-auto bg-transparent"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
            <p className="text-sm text-cyan-200 mt-6">No credit card required • Free 14-day trial • Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  )
}
