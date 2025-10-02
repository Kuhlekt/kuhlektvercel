import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Clock,
  DollarSign,
  Shield,
  Zap,
  BarChart3,
  Users,
  Building2,
  Award,
  Target,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ROICalculatorButton } from "@/components/roi-calculator"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-cyan-100 text-cyan-800 hover:bg-cyan-200 border-none">
                #1 AR Automation Platform
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Accounts Receivable
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Automate invoice-to-cash processes, reduce DSO by 30%, and accelerate cash flow with AI-powered
                collections management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Link href="/demo">
                    Schedule a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <ROICalculatorButton />
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">30%</div>
                  <div className="text-sm text-gray-600">DSO Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">350%</div>
                  <div className="text-sm text-gray-600">ROI</div>
                </div>
              </div>
            </div>
            <div className="relative lg:h-[600px] h-[400px]">
              <Image
                src="/images/ar-dashboard.png"
                alt="Kuhlekt AR Dashboard"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The AR Challenge</h2>
            <p className="text-xl text-gray-600">
              Traditional accounts receivable processes drain resources and slow cash flow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Clock,
                title: "Manual & Time-Consuming",
                description: "Teams spend 20+ hours weekly on manual invoice follow-ups and reconciliation",
              },
              {
                icon: TrendingUp,
                title: "Extended DSO",
                description: "Average DSO of 45+ days locks up critical working capital",
              },
              {
                icon: Users,
                title: "Poor Customer Experience",
                description: "Generic communications and delayed responses frustrate customers",
              },
            ].map((item, index) => (
              <Card key={index} className="border-red-200 bg-red-50">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Kuhlekt Solution</h2>
            <p className="text-xl text-gray-600">End-to-end AR automation powered by AI and intelligent workflows</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Zap,
                title: "Automated Collections",
                description: "AI-powered dunning sequences and smart reminders",
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                description: "Live dashboards and predictive insights",
              },
              {
                icon: Shield,
                title: "Dispute Management",
                description: "Streamlined resolution workflows",
              },
              {
                icon: DollarSign,
                title: "Payment Processing",
                description: "Integrated payment gateway and reconciliation",
              },
            ].map((item, index) => (
              <Card key={index} className="border-cyan-200 bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete AR Automation</h2>
            <p className="text-xl text-gray-600">Everything you need to optimize your invoice-to-cash cycle</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {[
                {
                  title: "Intelligent Dunning Engine",
                  description: "Multi-channel automated reminders with AI-optimized timing and messaging",
                },
                {
                  title: "Customer Self-Service Portal",
                  description: "Branded portal for invoice viewing, payments, and dispute submission",
                },
                {
                  title: "Predictive Cash Flow",
                  description: "ML-powered forecasting based on payment history and customer behavior",
                },
                {
                  title: "ERP Integration",
                  description: "Seamless sync with QuickBooks, Xero, NetSuite, and SAP",
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-cyan-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative lg:h-[500px] h-[400px]">
              <Image
                src="/images/kuhlekt-dashboard-interface.png"
                alt="Kuhlekt Dashboard Interface"
                fill
                className="object-contain rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Measurable Impact</h2>
            <p className="text-xl text-gray-600">Join 500+ companies improving their cash flow and efficiency</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                metric: "30%",
                label: "DSO Reduction",
                description: "Average decrease in Days Sales Outstanding",
              },
              {
                metric: "95%",
                label: "Time Savings",
                description: "Reduction in manual AR tasks",
              },
              {
                metric: "25%",
                label: "Collection Rate",
                description: "Improvement in on-time payments",
              },
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="text-5xl font-bold text-cyan-600">{item.metric}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.label}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Your Industry</h2>
            <p className="text-xl text-gray-600">Specialized solutions for diverse business needs</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: "B2B Enterprises",
                description: "Complex payment terms and multi-entity management",
              },
              {
                icon: Users,
                title: "Mid-Market Companies",
                description: "Scalable automation without enterprise complexity",
              },
              {
                icon: Target,
                title: "Service Providers",
                description: "Subscription billing and recurring revenue management",
              },
            ].map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className="bg-cyan-100 w-12 h-12 rounded-lg flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-cyan-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                  <Button variant="link" className="text-cyan-600 p-0">
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600">Companies of all sizes rely on Kuhlekt to optimize their AR</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "Kuhlekt reduced our DSO from 52 days to 35 days in just 3 months. The ROI was immediate.",
                author: "Sarah Johnson",
                role: "CFO, TechCorp Industries",
                image: "/images/sarah-johnson-headshot.png",
              },
              {
                quote: "The automation freed up our team to focus on strategic work instead of chasing invoices.",
                author: "Michael Chen",
                role: "Controller, Global Manufacturing Co.",
                image: "/images/michael-chen-asian.png",
              },
              {
                quote:
                  "Customer satisfaction improved dramatically with the self-service portal and proactive communication.",
                author: "Jessica Rodriguez",
                role: "VP Finance, ServiceTech Solutions",
                image: "/images/jessica-rodriguez-hispanic.png",
              },
            ].map((item, index) => (
              <Card key={index}>
                <CardContent className="p-6 space-y-4">
                  <Award className="h-8 w-8 text-cyan-600" />
                  <p className="text-gray-700 italic">"{item.quote}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.author}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{item.author}</div>
                      <div className="text-sm text-gray-600">{item.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold">Ready to Transform Your AR Process?</h2>
          <p className="text-xl text-cyan-100">Join hundreds of companies accelerating their cash flow with Kuhlekt</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-cyan-600 hover:bg-gray-100">
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
