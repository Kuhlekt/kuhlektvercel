"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  BarChart3,
  Clock,
  DollarSign,
  FileText,
  Mail,
  Phone,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { ROICalculatorModal } from "@/components/roi-calculator-modal"

export default function Home() {
  const [isROIModalOpen, setIsROIModalOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-600 via-cyan-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Transform Your Accounts Receivable Management
              </h1>
              <p className="text-xl md:text-2xl text-cyan-50 leading-relaxed">
                Reduce DSO, improve cash flow, and automate your collections with our intelligent AR platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-cyan-700 hover:bg-cyan-50 text-lg px-8"
                  onClick={() => setIsROIModalOpen(true)}
                >
                  Calculate Your ROI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  <Link href="/demo" className="flex items-center">
                    Book a Demo
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative lg:block hidden">
              <Image
                src="/images/kuhlekt-dashboard-interface.png"
                alt="Kuhlekt Dashboard"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">30%</div>
                <div className="text-gray-600">Average DSO Reduction</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">50%</div>
                <div className="text-gray-600">Faster Payment Processing</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">75%</div>
                <div className="text-gray-600">Reduction in Manual Work</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 mb-2">99%</div>
                <div className="text-gray-600">Collection Success Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Kuhlekt for Your AR Management?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform streamlines your entire accounts receivable process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <Zap className="h-10 w-10 text-cyan-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Automated Collections</h3>
                <p className="text-gray-600">
                  Automate payment reminders, follow-ups, and escalations with intelligent workflows
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <BarChart3 className="h-10 w-10 text-cyan-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
                <p className="text-gray-600">
                  Get instant visibility into your AR performance with comprehensive dashboards and reports
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-cyan-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Risk Management</h3>
                <p className="text-gray-600">
                  Identify and mitigate risks early with predictive analytics and credit scoring
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Mail className="h-10 w-10 text-cyan-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Multi-channel Communication</h3>
                <p className="text-gray-600">
                  Reach customers via email, SMS, and automated calls with personalized messaging
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <FileText className="h-10 w-10 text-cyan-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Document Management</h3>
                <p className="text-gray-600">Centralize and organize all invoices, statements, and payment records</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <Phone className="h-10 w-10 text-cyan-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">Customer Portal</h3>
                <p className="text-gray-600">
                  Provide a self-service portal for customers to view balances and make payments
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Powerful Dashboard, Simple to Use</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our intuitive interface gives you complete control over your accounts receivable operations. Monitor
                performance, manage workflows, and take action—all from a single dashboard.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-cyan-100 p-1">
                    <div className="h-2 w-2 rounded-full bg-cyan-600" />
                  </div>
                  <div>
                    <strong className="text-gray-900">Customizable Dashboards:</strong>
                    <span className="text-gray-600"> Track the metrics that matter most to your business</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-cyan-100 p-1">
                    <div className="h-2 w-2 rounded-full bg-cyan-600" />
                  </div>
                  <div>
                    <strong className="text-gray-900">Real-time Updates:</strong>
                    <span className="text-gray-600"> See changes as they happen with live data synchronization</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 rounded-full bg-cyan-100 p-1">
                    <div className="h-2 w-2 rounded-full bg-cyan-600" />
                  </div>
                  <div>
                    <strong className="text-gray-900">Mobile Ready:</strong>
                    <span className="text-gray-600"> Manage your AR on the go with our mobile-optimized interface</span>
                  </div>
                </li>
              </ul>
              <Button asChild size="lg">
                <Link href="/product">
                  Explore Features
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div>
              <Image
                src="/images/ar-dashboard.png"
                alt="AR Dashboard Preview"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Real results from real businesses</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
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
                    <div className="text-sm text-gray-600">CFO, TechCorp</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Kuhlekt reduced our DSO by 35% in just 3 months. The automation saved our team countless hours, and
                  the insights helped us make better credit decisions."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
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
                    <div className="text-sm text-gray-600">Controller, ManufacturePro</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The customer portal was a game-changer. Our clients love being able to manage their accounts online,
                  and we've seen a significant reduction in payment disputes."
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
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
                    <div className="text-sm text-gray-600">VP Finance, GlobalTrade Inc</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Implementation was seamless, and the ROI was immediate. We're collecting faster and spending less
                  time chasing payments. Highly recommend!"
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your AR Process?</h2>
          <p className="text-xl text-cyan-50 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have improved their cash flow and reduced collection costs with Kuhlekt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-cyan-700 hover:bg-cyan-50 text-lg px-8"
              onClick={() => setIsROIModalOpen(true)}
            >
              Calculate Your ROI
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link href="/demo">Schedule a Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      <ROICalculatorModal isOpen={isROIModalOpen} onClose={() => setIsROIModalOpen(false)} />
    </div>
  )
}
