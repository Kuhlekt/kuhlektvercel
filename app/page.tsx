"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calculator, ChevronRight, Users, TrendingUp, Clock, Zap, Play } from "lucide-react"
import { ROICalculatorModal } from "@/components/roi-calculator-modal"

export default function Home() {
  const [isROIModalOpen, setIsROIModalOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Transform Your Invoice-to-Cash Process
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Accelerate Cash Flow with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                  Intelligent Automation
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Kuhlekt's AI-powered platform reduces DSO by 30%, automates collections, and delivers ROI in months—not
                years. Join industry leaders who've transformed their AR operations.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Link href="/demo" className="block">
                    <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white w-full">
                      Schedule a Demo →
                    </Button>
                  </Link>
                  <Link href="https://youtu.be/iVmvBRzQZDA" target="_blank" rel="noopener noreferrer" className="block">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-300 w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Watch Product Tour
                    </Button>
                  </Link>
                </div>
                <div>
                  <Button
                    size="lg"
                    onClick={() => setIsROIModalOpen(true)}
                    className="bg-red-500 hover:bg-red-600 text-white w-full h-full"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Your ROI
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 border-2 border-white"
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-900">Trusted by 500+ businesses</div>
                  <div className="text-gray-600">Average 28-day DSO reduction</div>
                </div>
              </div>
            </div>

            <div className="relative lg:block hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 blur-3xl" />
              <img
                src="/images/kuhlekt-dashboard-interface.png"
                alt="Kuhlekt Dashboard Interface"
                className="relative rounded-2xl shadow-2xl border border-gray-200"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "30%", label: "Average DSO Reduction" },
              { value: "50%", label: "Time Saved on Collections" },
              { value: "6 months", label: "Average ROI Timeline" },
              { value: "99.9%", label: "System Uptime SLA" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Kuhlekt?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Purpose-built for modern finance teams who demand results, not just features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Accelerate Cash Flow",
                description:
                  "Reduce DSO by 30% through intelligent automation, predictive analytics, and proactive customer engagement",
                color: "from-cyan-500 to-blue-600",
              },
              {
                icon: Users,
                title: "Scale Without Headcount",
                description:
                  "Handle 3x more customers with your existing team. Our automation handles routine tasks so your team focuses on exceptions",
                color: "from-purple-500 to-pink-600",
              },
              {
                icon: Clock,
                title: "Deploy in Days, Not Months",
                description:
                  "Pre-built integrations, automated workflows, and expert support mean you're live in weeks with measurable ROI in months",
                color: "from-orange-500 to-red-600",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Industry Leaders</h2>
            <p className="text-xl text-gray-600">
              Join hundreds of finance teams who've transformed their AR operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Kuhlekt reduced our DSO from 52 to 35 days in just 6 months. The ROI was immediate and our team is more productive than ever.",
                author: "Sarah Johnson",
                role: "CFO, TechCorp Industries",
                image: "/images/sarah-johnson-headshot.png",
              },
              {
                quote:
                  "The automation capabilities are game-changing. We're handling 40% more customers with the same team size.",
                author: "Michael Chen",
                role: "VP Finance, Global Manufacturing Ltd",
                image: "/images/michael-chen-asian.png",
              },
              {
                quote:
                  "Implementation was seamless and support has been outstanding. This is the AR solution we've been waiting for.",
                author: "Jessica Rodriguez",
                role: "Controller, Services Group Inc",
                image: "/images/jessica-rodriguez-hispanic.png",
              },
            ].map((testimonial, idx) => (
              <div key={idx} className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                <div className="text-6xl text-cyan-500 mb-4">"</div>
                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your AR Operations?</h2>
          <p className="text-xl text-cyan-50 mb-8 leading-relaxed">
            See how Kuhlekt can reduce your DSO, accelerate cash flow, and deliver measurable ROI in months
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 text-lg px-8">
                Schedule Your Demo
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              size="lg"
              onClick={() => setIsROIModalOpen(true)}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 text-lg px-8"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Your ROI
            </Button>
          </div>
        </div>
      </section>

      <ROICalculatorModal isOpen={isROIModalOpen} onClose={() => setIsROIModalOpen(false)} />
    </div>
  )
}
