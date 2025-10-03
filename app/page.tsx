"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, TrendingDown, Clock, DollarSign, Users, PlayCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-cyan-100 text-cyan-800 text-sm font-semibold px-4 py-2 rounded-full">
                  #1 AR Automation Platform
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                  Accounts Receivable
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Automate collections, reduce DSO by 30%, and eliminate 80% of manual AR tasks. Join 500+ companies
                transforming their cash flow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg">
                    Request a Demo
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 px-8 py-6 text-lg bg-white shadow-md"
                  onClick={() => window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")}
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                  Watch Product Tour
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Trusted by 500+ finance teams</p>
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
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg -z-10 blur-3xl opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "30%", label: "DSO Reduction", icon: TrendingDown },
              { value: "80%", label: "Time Saved", icon: Clock },
              { value: "$2M+", label: "Cash Recovered", icon: DollarSign },
              { value: "500+", label: "Happy Clients", icon: Users },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The Hidden Cost of Manual AR Management
            </h2>
            <p className="text-xl text-gray-600">
              Traditional accounts receivable processes are draining your resources and cash flow
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Slow Collections",
                description: "Average DSO of 45+ days ties up working capital",
                impact: "Lost opportunity cost",
              },
              {
                title: "Manual Processes",
                description: "AR teams spend 70% of time on repetitive tasks",
                impact: "Low productivity",
              },
              {
                title: "Poor Visibility",
                description: "Lack of real-time insights into cash flow",
                impact: "Reactive decisions",
              },
            ].map((problem, index) => (
              <Card key={index} className="border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{problem.title}</h3>
                  <p className="text-gray-600 mb-2">{problem.description}</p>
                  <p className="text-sm text-red-600 font-semibold">{problem.impact}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Kuhlekt: Your Complete AR Automation Solution
            </h2>
            <p className="text-xl text-gray-600">
              Streamline collections, accelerate cash flow, and empower your finance team
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "Automated Collections",
                description: "AI-powered reminders and follow-ups reduce manual work by 80%",
                features: ["Smart email sequences", "Multi-channel outreach", "Personalized messaging"],
              },
              {
                icon: "📊",
                title: "Real-Time Analytics",
                description: "Get instant visibility into your AR performance and cash flow",
                features: ["Live dashboards", "Predictive insights", "Custom reports"],
              },
              {
                icon: "💳",
                title: "Self-Service Portal",
                description: "Customers can view invoices and make payments 24/7",
                features: ["Secure payment processing", "Invoice history", "Dispute management"],
              },
            ].map((solution, index) => (
              <Card key={index} className="border-cyan-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl">{solution.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{solution.title}</h3>
                  <p className="text-gray-600 mb-4">{solution.description}</p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How Kuhlekt Works</h2>
            <p className="text-xl text-gray-600">Get up and running in days, not months</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Connect",
                description: "Integrate with your existing accounting software in minutes",
              },
              {
                step: "2",
                title: "Configure",
                description: "Set up your collection workflows and communication preferences",
              },
              {
                step: "3",
                title: "Automate",
                description: "Let Kuhlekt handle reminders, follow-ups, and payment tracking",
              },
              {
                step: "4",
                title: "Optimize",
                description: "Use insights to continuously improve your AR performance",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Join hundreds of finance teams who trust Kuhlekt</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "CFO, TechCorp",
                image: "/images/sarah-johnson-headshot.png",
                quote: "Kuhlekt reduced our DSO by 35% in just 3 months. The ROI was immediate.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                role: "Finance Director, GlobalTrade",
                image: "/images/michael-chen-asian.png",
                quote: "Our AR team now focuses on high-value activities instead of chasing payments.",
                rating: 5,
              },
              {
                name: "Jessica Rodriguez",
                role: "Controller, ManuCo",
                image: "/images/jessica-rodriguez-hispanic.png",
                quote: "The customer portal has significantly improved our payment collection rates.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
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
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cyan-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your AR Process?</h2>
          <p className="text-xl mb-8 text-cyan-100">
            Join 500+ companies that have already reduced their DSO and improved cash flow
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-6 text-lg">
                Request a Demo
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg bg-transparent"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-cyan-100">No credit card required • Free 14-day trial • Cancel anytime</p>
        </div>
      </section>
    </div>
  )
}
