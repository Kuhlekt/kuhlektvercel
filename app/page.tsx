"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  Shield,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  PlayCircle,
} from "lucide-react"
import { ROICalculatorModal } from "@/components/roi-calculator-modal"

export default function HomePage() {
  const [showROICalculator, setShowROICalculator] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-block">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  AI-Powered Credit Management
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  Accounts Receivable
                </span>{" "}
                Management
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Kuhlekt's AI-driven platform helps businesses reduce DSO by up to 40%, improve cash flow, and automate
                credit control processes with enterprise-grade security.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Button asChild size="lg" className="w-full text-lg h-14">
                    <Link href="/demo">
                      Schedule a Demo
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full text-lg h-14 bg-transparent">
                    <a href="https://www.youtube.com/watch?v=your-video-id" target="_blank" rel="noopener noreferrer">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Watch Product Tour
                    </a>
                  </Button>
                </div>
                <Button
                  onClick={() => setShowROICalculator(true)}
                  variant="default"
                  size="lg"
                  className="w-full text-lg h-auto py-6 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Calculate Your ROI
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Free 30-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">No credit card required</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/images/kuhlekt-dashboard-interface.png"
                  alt="Kuhlekt Dashboard Interface"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-cyan-200 to-blue-200 rounded-full blur-3xl opacity-20" />
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
              <div className="text-sm text-muted-foreground">Average DSO Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Collection Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Businesses Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI-Powered Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Kuhlekt?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines AI automation with human expertise to deliver exceptional results.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle>Reduce DSO by 40%</CardTitle>
                <CardDescription>
                  Our AI-powered platform identifies payment patterns and optimizes collection strategies in real-time.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Save 20+ Hours Weekly</CardTitle>
                <CardDescription>
                  Automate repetitive tasks like payment reminders, invoice generation, and customer communications.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Improve Cash Flow</CardTitle>
                <CardDescription>
                  Get paid faster with intelligent payment predictions and automated follow-up sequences.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Enterprise Security</CardTitle>
                <CardDescription>
                  Bank-level encryption, SOC 2 compliance, and role-based access control protect your sensitive data.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Real-Time Analytics</CardTitle>
                <CardDescription>
                  Get instant insights into your AR performance with customizable dashboards and detailed reports.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>White-Glove Support</CardTitle>
                <CardDescription>
                  Dedicated account manager, 24/7 technical support, and comprehensive training for your team.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Kuhlekt Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold mb-4">Connect Your Systems</h3>
                <p className="text-muted-foreground">
                  Seamlessly integrate with your existing accounting software, ERP, or CRM in just a few clicks.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-600 to-transparent" />
            </div>
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold mb-4">AI Analyzes Your Data</h3>
                <p className="text-muted-foreground">
                  Our AI engine analyzes your historical data to identify patterns and optimize collection strategies.
                </p>
              </div>
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-cyan-600 to-transparent" />
            </div>
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-cyan-600 text-white flex items-center justify-center text-2xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold mb-4">Watch Your DSO Drop</h3>
                <p className="text-muted-foreground">
                  Sit back and watch as automated workflows and intelligent reminders reduce your DSO and improve cash
                  flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See what our customers are saying about Kuhlekt
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">CFO, TechCorp</div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "Kuhlekt reduced our DSO from 65 days to 38 days in just 3 months. The ROI was immediate and
                  substantial."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">Finance Director, GlobalTrade</div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The automation saved our team 25 hours per week. We can now focus on strategic initiatives instead of
                  chasing payments."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez"
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-semibold">Jessica Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Controller, Manufacturing Co</div>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The AI-powered insights helped us identify at-risk accounts early. Our bad debt has decreased by
                  60%."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your AR Process?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join hundreds of businesses that have already improved their cash flow with Kuhlekt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link href="/demo">
                Schedule a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              onClick={() => setShowROICalculator(true)}
              size="lg"
              variant="outline"
              className="text-lg bg-white text-cyan-600 hover:bg-gray-100"
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Calculate Your ROI
            </Button>
          </div>
        </div>
      </section>

      <ROICalculatorModal open={showROICalculator} onOpenChange={setShowROICalculator} />
    </div>
  )
}
