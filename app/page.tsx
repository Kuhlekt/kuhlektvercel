"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Play, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gray-50 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge className="bg-red-500 text-white px-4 py-2 rounded-full">⭐ Trusted by 500+ finance teams</Badge>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold">
                  <span className="text-cyan-500">Automate AR.</span>
                  <br />
                  <span className="text-red-500">Get Paid Faster.</span>
                </h1>

                <p className="text-xl text-gray-600 max-w-lg">
                  The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, streamline
                  debt recovery, and improve cash flow.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white px-8">
                    Schedule a Demo →
                  </Button>
                </Link>
                <Link href="https://www.youtube.com/watch?v=iVmvBRzQZDA" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="flex items-center gap-2 bg-transparent">
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
              {/* Main image - Professional businesswoman */}
              <div className="relative z-10">
                <Image
                  src="https://sjc.microlink.io/B-8RrlTokm_idSCD6F9SnwbpO5g4F0nqHVENhnraPCC7ZcQrBOGfXy_i-0gucrb97m1dH_vrtZtnUodRnsJcmg.jpeg"
                  alt="Professional businesswoman in blue blazer"
                  width={500}
                  height={400}
                  className="rounded-lg w-full h-auto object-cover"
                  priority
                />
              </div>

              {/* Testimonial Card Overlay */}
              <Card className="absolute top-4 right-4 w-80 bg-white shadow-lg z-20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-sm text-gray-700 mb-4 italic">
                    "Kuhlekt transformed our accounts receivable process. We reduced DSO by 30% and our team now spends
                    80% less time on manual collections. The ROI was immediate and substantial."
                  </blockquote>
                  <div>
                    <div className="font-semibold text-cyan-600">Maria Rodriguez</div>
                    <div className="text-xs text-gray-500">CFO at TechStream</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">80%</div>
              <div className="text-gray-600 font-medium">Manual Tasks Eliminated</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">30%</div>
              <div className="text-gray-600 font-medium">DSO Reduction</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Finance Teams</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">99%</div>
              <div className="text-gray-600 font-medium">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">Benefits</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Kuhlekt helps you:</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-cyan-600">Automate debt recovery</h3>
                <p className="text-gray-600">Reduce Days Sales Outstanding (DSO) with intelligent automation</p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-cyan-600">Improve cash flow</h3>
                <p className="text-gray-600">Get real-time insights into your receivables and cash position</p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-cyan-600">Streamline collections</h3>
                <p className="text-gray-600">Coordinate collection processes across teams with ease</p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-cyan-600">Enhance credit control</h3>
                <p className="text-gray-600">Use built-in risk assessment tools to make better credit decisions</p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-cyan-600">Empower customers</h3>
                <p className="text-gray-600">Provide a branded self-service credit portal for your customers</p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-cyan-600">Eliminate manual work</h3>
                <p className="text-gray-600">Achieve end-to-end automation of your collections process</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to transform your accounts receivable process?</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Schedule a demo to see how Kuhlekt can help your finance team get paid faster with our advanced AR
            Automation and Digital Collections solutions.
          </p>
          <Link href="/demo">
            <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
              Schedule a Demo →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
