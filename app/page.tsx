import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  TrendingUp,
  Zap,
  Clock,
  BarChart3,
  Shield,
  Users,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Target,
} from "lucide-react"
import { ROICalculatorButton } from "@/components/roi-calculator"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Transform Your AR Operations
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Automate Your Invoice-to-Cash Process
              </h1>
              <p className="text-xl text-cyan-50 leading-relaxed">
                Reduce DSO by 30%, accelerate cash flow, and eliminate manual AR tasks with Kuhlekt's AI-powered
                automation platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 shadow-lg">
                  <Link href="/demo">
                    Schedule a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <ROICalculatorButton />
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold">30%</div>
                  <div className="text-cyan-100 text-sm">DSO Reduction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">80%</div>
                  <div className="text-cyan-100 text-sm">Time Saved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">350%</div>
                  <div className="text-cyan-100 text-sm">ROI</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl blur-2xl opacity-30" />
              <Image
                src="/images/ar-dashboard.png"
                alt="Kuhlekt AR Dashboard"
                width={600}
                height={400}
                className="relative rounded-2xl shadow-2xl border-4 border-white/20"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 mb-8 text-sm font-semibold uppercase tracking-wide">
            Trusted by Leading Organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">COMPANY 1</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY 2</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY 3</div>
            <div className="text-2xl font-bold text-gray-400">COMPANY 4</div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Are Manual AR Processes Holding You Back?
            </h2>
            <p className="text-xl text-gray-600">
              Most businesses struggle with inefficient accounts receivable management. Sound familiar?
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-red-200 bg-white">
              <CardContent className="p-6">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Slow Cash Collection</h3>
                <p className="text-gray-600">
                  Manual follow-ups and payment delays create cash flow problems and extend your DSO.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-white">
              <CardContent className="p-6">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Resource Intensive</h3>
                <p className="text-gray-600">
                  Your team spends countless hours on repetitive tasks instead of strategic activities.
                </p>
              </CardContent>
            </Card>
            <Card className="border-red-200 bg-white">
              <CardContent className="p-6">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Limited Visibility</h3>
                <p className="text-gray-600">
                  Lack of real-time insights makes it difficult to identify issues and optimize performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Complete AR Automation Solution</h2>
            <p className="text-xl text-gray-600">
              Kuhlekt automates your entire invoice-to-cash process, from billing to payment collection.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white">
              <CardContent className="p-6">
                <div className="bg-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Automated Invoicing</h3>
                <p className="text-gray-600">
                  Generate and send professional invoices automatically with customizable templates and schedules.
                </p>
              </CardContent>
            </Card>
            <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white">
              <CardContent className="p-6">
                <div className="bg-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Smart Collections</h3>
                <p className="text-gray-600">
                  AI-powered payment reminders and follow-ups adapt to customer behavior and payment patterns.
                </p>
              </CardContent>
            </Card>
            <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white">
              <CardContent className="p-6">
                <div className="bg-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Payment Processing</h3>
                <p className="text-gray-600">
                  Accept payments through multiple channels with automatic reconciliation and posting.
                </p>
              </CardContent>
            </Card>
            <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white">
              <CardContent className="p-6">
                <div className="bg-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Real-Time Analytics</h3>
                <p className="text-gray-600">
                  Monitor DSO, aging reports, and collection performance with interactive dashboards.
                </p>
              </CardContent>
            </Card>
            <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white">
              <CardContent className="p-6">
                <div className="bg-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">Credit Management</h3>
                <p className="text-gray-600">
                  Assess customer creditworthiness and set automated credit limits and terms.
                </p>
              </CardContent>
            </Card>
            <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-white">
              <CardContent className="p-6">
                <div className="bg-cyan-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">ERP Integration</h3>
                <p className="text-gray-600">
                  Seamlessly connect with your existing ERP, accounting software, and business systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Measurable Business Impact</h2>
              <p className="text-gray-300 text-lg mb-8">
                Our customers see dramatic improvements in their AR operations within the first 90 days.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-600 rounded-full p-2 mt-1">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Reduce DSO by 30%</h3>
                    <p className="text-gray-300">Accelerate cash collection and improve working capital.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-600 rounded-full p-2 mt-1">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Save 80% of AR Time</h3>
                    <p className="text-gray-300">Free your team to focus on high-value strategic work.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-600 rounded-full p-2 mt-1">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Increase Collection Rates</h3>
                    <p className="text-gray-300">Reduce bad debt and improve overall receivables health.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-600 rounded-full p-2 mt-1">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Enhance Customer Experience</h3>
                    <p className="text-gray-300">Provide seamless payment options and timely communications.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/dso-reduction-chart.png"
                alt="DSO Reduction Chart"
                width={500}
                height={400}
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your AR Operations?</h2>
          <p className="text-xl text-cyan-50 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have automated their invoice-to-cash process with Kuhlekt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 shadow-lg">
              <Link href="/demo">
                Schedule a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <ROICalculatorButton />
          </div>
        </div>
      </section>
    </div>
  )
}
