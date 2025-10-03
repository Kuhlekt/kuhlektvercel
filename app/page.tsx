"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Zap,
  Shield,
  BarChart3,
  Clock,
  DollarSign,
  FileText,
  Settings,
  Smartphone,
  Calculator,
} from "lucide-react"
import { ROICalculatorModal } from "@/components/roi-calculator-modal"

export default function Home() {
  const [showROICalculator, setShowROICalculator] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-white py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border-cyan-200">
                Transform Your Invoice-to-Cash Process
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Accelerate Cash Flow with
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                  {" "}
                  Smart AR Automation
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Kuhlekt streamlines your accounts receivable process, reducing DSO by up to 30% while cutting collection
                costs by 40%. Join leading enterprises who trust us to transform their invoice-to-cash lifecycle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link href="/demo">
                    Request a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 bg-transparent"
                  onClick={() => setShowROICalculator(true)}
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Your ROI
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Setup in minutes</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-3xl opacity-20 animate-pulse" />
              <Image
                src="/images/kuhlekt-dashboard-interface.png"
                alt="Kuhlekt Dashboard Interface"
                width={600}
                height={400}
                className="relative rounded-2xl shadow-2xl border border-gray-200"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "30%", label: "DSO Reduction", icon: TrendingUp },
              { value: "40%", label: "Cost Savings", icon: DollarSign },
              { value: "50%", label: "Faster Collections", icon: Clock },
              { value: "99.9%", label: "Uptime SLA", icon: Shield },
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex justify-center">
                  <stat.icon className="h-8 w-8 text-cyan-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 border-cyan-200 mb-4">
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Optimize Cash Flow
            </h2>
            <p className="text-xl text-gray-600">
              From automated dunning to AI-powered credit decisions, Kuhlekt provides a complete AR automation platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Automated Dunning",
                description: "Smart, multi-channel payment reminders that adapt to customer behavior and preferences",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                description: "Comprehensive dashboards with actionable insights into your AR performance and trends",
                color: "from-cyan-400 to-blue-500",
              },
              {
                icon: Shield,
                title: "Credit Management",
                description: "AI-powered credit scoring and risk assessment to minimize bad debt exposure",
                color: "from-green-400 to-emerald-500",
              },
              {
                icon: Users,
                title: "Customer Portal",
                description: "Self-service portal for customers to view invoices, make payments, and manage disputes",
                color: "from-purple-400 to-pink-500",
              },
              {
                icon: FileText,
                title: "Invoice Processing",
                description: "Automated invoice generation, delivery, and tracking with customizable templates",
                color: "from-blue-400 to-indigo-500",
              },
              {
                icon: Settings,
                title: "Workflow Automation",
                description: "Customizable workflows that automate repetitive tasks and enforce business rules",
                color: "from-red-400 to-rose-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-cyan-200 transition-all hover:shadow-lg group cursor-pointer"
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">
                Measurable Results
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Deliver Real Business Value</h2>
              <div className="space-y-6">
                {[
                  {
                    title: "Reduce DSO by 30%",
                    description: "Get paid faster with automated reminders and streamlined payment processes",
                  },
                  {
                    title: "Cut Collection Costs by 40%",
                    description:
                      "Eliminate manual tasks and optimize collector productivity with intelligent automation",
                  },
                  {
                    title: "Improve Cash Flow Predictability",
                    description: "AI-powered forecasting helps you plan better with accurate payment predictions",
                  },
                  {
                    title: "Enhance Customer Experience",
                    description: "Self-service tools and proactive communication strengthen customer relationships",
                  },
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/ar-dashboard.png"
                alt="AR Dashboard Analytics"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl border border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200 mb-4">
              Trusted by Industry Leaders
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join Companies Transforming Their AR</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CFO, TechCorp",
                image: "/images/sarah-johnson-headshot.png",
                quote:
                  "Kuhlekt reduced our DSO from 45 to 32 days in just 3 months. The ROI was immediate and transformative.",
              },
              {
                name: "Michael Chen",
                role: "Director of Finance, Global Logistics Inc",
                image: "/images/michael-chen-asian.png",
                quote:
                  "The automation features freed up our team to focus on strategic initiatives. Collection efficiency improved by 50%.",
              },
              {
                name: "Jessica Rodriguez",
                role: "AR Manager, Enterprise Solutions",
                image: "/images/jessica-rodriguez-hispanic.png",
                quote:
                  "Customer satisfaction went up while payment times went down. Kuhlekt is a game-changer for AR teams.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-purple-200 transition-all">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-20 bg-white border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200 mb-4">
              Seamless Integration
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Works With Your Existing Systems</h2>
            <p className="text-xl text-gray-600">Connect with your ERP, CRM, and payment platforms in minutes</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70">
            {["SAP", "Oracle", "Microsoft Dynamics", "Salesforce", "QuickBooks", "NetSuite", "Xero", "Stripe"].map(
              (platform, index) => (
                <div
                  key={index}
                  className="text-2xl font-bold text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {platform}
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">Ready to Transform Your AR Process?</h2>
            <p className="text-xl text-cyan-50">
              Join hundreds of companies already improving their cash flow with Kuhlekt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-cyan-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/demo">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 bg-transparent"
                onClick={() => setShowROICalculator(true)}
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Your ROI
              </Button>
            </div>
            <div className="flex items-center justify-center gap-8 pt-8 text-cyan-100">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                <span className="text-sm">Mobile Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Bank-Level Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Modal */}
      <ROICalculatorModal isOpen={showROICalculator} onClose={() => setShowROICalculator(false)} />
    </div>
  )
}
