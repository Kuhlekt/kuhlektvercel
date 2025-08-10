"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Play, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <VisitorTracker />

      {/* Header */}
      <Header />

      {/* Hero Section - Exact match to kuhlekt.com */}
      <section className="bg-white py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Red badge exactly as shown */}
              <Badge className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                ⭐ Trusted by 500+ finance teams
              </Badge>

              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-cyan-400">Automate AR.</span>
                  <br />
                  <span className="text-red-500">Get Paid Faster.</span>
                </h1>

                <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                  The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, streamline
                  debt recovery, and improve cash flow.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo#top">
                  <Button
                    size="lg"
                    className="bg-cyan-400 hover:bg-cyan-500 text-white px-8 py-3 text-base font-medium"
                  >
                    Schedule a Demo →
                  </Button>
                </Link>
                <Link href="https://www.youtube.com/watch?v=iVmvBRzQZDA" target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-2 px-8 py-3 text-base font-medium bg-transparent"
                  >
                    <Play className="w-4 h-4" />
                    Watch Product Tour
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free 14-day trial
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Professional businesswoman image - restored original */}
              <div className="relative z-10">
                <Image
                  src="/images/businesswoman.png"
                  alt="Professional businesswoman in blue blazer"
                  width={600}
                  height={500}
                  className="w-full h-auto object-cover rounded-lg"
                  priority
                />
              </div>

              {/* Testimonial Card positioned exactly as in screenshot */}
              <Card className="absolute top-8 right-8 w-72 bg-white shadow-xl z-20 border-0">
                <CardContent className="p-5">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-sm text-gray-700 mb-4 italic leading-relaxed">
                    "Kuhlekt transformed our accounts receivable process. We reduced DSO by 30% and our team now spends
                    80% less time on manual collections. The ROI was immediate and substantial."
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">Maria Rodriguez</div>
                    <div className="text-xs text-gray-500">CFO at TechStream</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Exact colors and layout */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2">80%</div>
              <div className="text-gray-600 font-medium text-sm">Manual Tasks Eliminated</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2">30%</div>
              <div className="text-gray-600 font-medium text-sm">DSO Reduction</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2">500+</div>
              <div className="text-gray-600 font-medium text-sm">Finance Teams</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-cyan-400 mb-2">99%</div>
              <div className="text-gray-600 font-medium text-sm">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section - Exact as shown in screenshot */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-6 text-sm font-medium">
              Benefits
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Kuhlekt helps you:</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-600">Automate debt recovery</h3>
                <p className="text-gray-600 text-sm">Reduce Days Sales Outstanding (DSO) with intelligent automation</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-600">Improve cash flow</h3>
                <p className="text-gray-600 text-sm">Get real-time insights into your receivables and cash position</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-600">Streamline collections</h3>
                <p className="text-gray-600 text-sm">Coordinate collection processes across teams with ease</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-600">Enhance credit control</h3>
                <p className="text-gray-600 text-sm">
                  Use built-in risk assessment tools to make better credit decisions
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-600">Empower customers</h3>
                <p className="text-gray-600 text-sm">Provide a branded self-service credit portal for your customers</p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-cyan-600">Eliminate manual work</h3>
                <p className="text-gray-600 text-sm">Achieve end-to-end automation of your collections process</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Section - Added back */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">Platform</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">See Your AR Performance at a Glance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get real-time insights into your receivables with our comprehensive dashboard and reporting tools.
            </p>
          </div>

          <div className="relative">
            <Image
              src="/images/kuhlekt-dashboard.png"
              alt="Kuhlekt Dashboard showing accounts receivable metrics, workload management, and performance analytics"
              width={1200}
              height={800}
              className="w-full h-auto rounded-lg shadow-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
