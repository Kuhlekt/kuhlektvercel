import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, TrendingUp, Clock, Shield, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-50 via-white to-blue-50 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border-0">
                <Zap className="w-3 h-3 mr-1" />
                Trusted by Leading Enterprises
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Invoice-to-Cash
                </span>{" "}
                Process
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Kuhlekt revolutionizes accounts receivable management with AI-powered automation, reducing DSO and
                accelerating cash flow for enterprise businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link href="/demo">
                    Schedule a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-cyan-600 text-cyan-700 hover:bg-cyan-50 bg-transparent"
                  asChild
                >
                  <Link href="/roi-calculator">Calculate Your ROI</Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">14-Day Free Trial</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <Image
                src="/images/kuhlekt-dashboard-interface.png"
                alt="Kuhlekt Dashboard Interface"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl relative z-10 border-4 border-white"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">40%</div>
              <div className="text-gray-600">Reduction in DSO</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">3x</div>
              <div className="text-gray-600">Faster Collections</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">85%</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 border-0 mb-4">Why Choose Kuhlekt</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Accelerate Cash Flow with Intelligent Automation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform streamlines every aspect of your accounts receivable process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-cyan-500 transition-all hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Reduce DSO by 40%</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Intelligent automation and predictive analytics help you collect payments faster and improve cash flow
                  predictability.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">AI-powered payment predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Automated follow-up workflows</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Real-time cash flow insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 transition-all hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Save 85% of Time</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Eliminate manual tasks and free your team to focus on strategic activities that drive business growth.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Automated invoice delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Smart payment reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">One-click reconciliation</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-cyan-500 transition-all hover:shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Enterprise-Grade Security</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Bank-level encryption and compliance ensure your financial data is always protected and secure.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">SOC 2 Type II certified</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">End-to-end encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">GDPR & CCPA compliant</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 border-0 mb-4">Simple Process</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How Kuhlekt Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in minutes and see results within days
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Connect Your Systems",
                description: "Seamlessly integrate with your existing ERP, accounting, and CRM platforms",
              },
              {
                step: "2",
                title: "Set Your Rules",
                description: "Configure automated workflows and customize collection strategies",
              },
              {
                step: "3",
                title: "AI Takes Over",
                description: "Let our intelligent system handle invoicing, reminders, and collections",
              },
              {
                step: "4",
                title: "Watch Cash Flow",
                description: "Monitor real-time analytics and enjoy improved working capital",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 border-0 mb-4">Customer Success</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how companies are transforming their AR operations with Kuhlekt
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CFO, TechCorp Solutions",
                image: "/images/sarah-johnson-headshot.png",
                quote:
                  "Kuhlekt reduced our DSO by 45% in just 3 months. The ROI was immediate and our team loves how easy it is to use.",
                stats: "45% DSO Reduction",
              },
              {
                name: "Michael Chen",
                role: "VP Finance, Global Logistics Inc",
                image: "/images/michael-chen-asian.png",
                quote:
                  "The automation capabilities are incredible. We're collecting payments 3x faster and our team has more time for strategic work.",
                stats: "3x Faster Collections",
              },
              {
                name: "Jessica Rodriguez",
                role: "Controller, Manufacturing Pro",
                image: "/images/jessica-rodriguez-hispanic.png",
                quote:
                  "Implementation was seamless and the support team is outstanding. We're seeing significant improvements in cash flow.",
                stats: "$2M Cash Released",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-cyan-500 transition-all">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-bold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed italic">"{testimonial.quote}"</p>
                  <Badge className="bg-green-100 text-green-700 border-0">{testimonial.stats}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your AR Process?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join hundreds of companies already accelerating their cash flow with Kuhlekt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-cyan-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link href="/demo">
                Schedule a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/roi-calculator">Calculate Your ROI</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-75">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>
    </div>
  )
}
