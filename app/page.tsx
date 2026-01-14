"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { ROICalculatorModal } from "@/components/roi-calculator-modal"

// Inline SVG icons for Cyber Monday page
const GiftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-6 w-6"
  >
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
)

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2 h-5 w-5"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ZapIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="inline-block mr-2 h-8 w-8"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8 flex-shrink-0 mt-1"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const HomePageContent = ({
  isCollapsed,
  setIsROICalculatorModalOpen,
}: { isCollapsed: boolean; setIsROICalculatorModalOpen: any }) => (
  <div className="min-h-screen bg-gray-50">
    {/* Hero Section */}
    <section className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-red-500 text-white px-4 py-2 rounded-full mb-6">★ Trusted by 500+ finance teams</Badge>

            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="text-cyan-500">Automate AR.</span> <span className="text-red-500">Get Paid Faster.</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, streamline debt
              recovery, and improve cash flow.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col gap-4 sm:grid sm:grid-rows-2">
                <Link href="/demo" className="w-full">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white w-full">
                    Schedule a Demo →
                  </Button>
                </Link>
                <Link href="https://youtu.be/iVmvBRzQZDA" target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white w-full">
                    ▶ Watch Product Tour
                  </Button>
                </Link>
              </div>
              <Link href="#" onClick={() => setIsROICalculatorModalOpen(true)} className="block">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white h-full w-full">
                  🧮 Calculate Your ROI
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Free 14-day trial
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/images/businesswoman.png"
              alt="Professional businesswoman with testimonial overlay showing Kuhlekt's impact on accounts receivable automation"
              width={500}
              height={350}
              className="rounded-lg w-full h-auto max-w-lg"
            />

            <Card className="absolute top-6 right-6 w-64 bg-white shadow-xl z-20 border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
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

    {/* Stats Section */}
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-500 mb-2">80%</div>
            <div className="text-gray-600">Manual Tasks Eliminated</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-500 mb-2">30%</div>
            <div className="text-gray-600">DSO Reduction</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-500 mb-2">500+</div>
            <div className="text-gray-600">Finance Teams</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-500 mb-2">99%</div>
            <div className="text-gray-600">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>

    {/* Benefits Section */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">Benefits</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Kuhlekt helps you:</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-cyan-600">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Automate debt recovery</h3>
              <p className="text-gray-600">Reduce Days Sales Outstanding (DSO) with intelligent automation</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-cyan-600">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Improve cash flow</h3>
              <p className="text-gray-600">Get real-time insights into your receivables and cash position</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-cyan-600">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Streamline collections</h3>
              <p className="text-gray-600">Coordinate collection processes across teams with ease</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-cyan-600">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enhance credit control</h3>
              <p className="text-gray-600">Use built-in risk assessment tools to make better credit decisions</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-cyan-600">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Empower customers</h3>
              <p className="text-gray-600">Provide a branded self-service credit portal for your customers</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl text-cyan-600">✓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Eliminate manual work</h3>
              <p className="text-gray-600">Achieve end-to-end automation of your collections process</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    {/* Dashboard Preview */}
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <Badge className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">Platform</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">See Your AR Performance at a Glance</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Get real-time insights into your receivables with our comprehensive dashboard and reporting tools.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-cyan-500 text-xl flex-shrink-0 mt-1">✓</span>
                <p className="text-lg text-gray-700">Real-time AR performance metrics</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-500 text-xl flex-shrink-0 mt-1">✓</span>
                <p className="text-lg text-gray-700">Workload management and prioritization</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyan-500 text-xl flex-shrink-0 mt-1">✓</span>
                <p className="text-lg text-gray-700">Comprehensive analytics and reporting</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Image
              src="/images/kuhlekt-dashboard-interface.png"
              alt="Kuhlekt Dashboard Interface"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl mx-auto w-full h-auto max-w-md"
            />
          </div>
        </div>
      </div>
    </section>

    {/* Additional Stats */}
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-500 mb-2">30%</div>
            <div className="text-gray-600">Average DSO Reduction</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-500 mb-2">80%</div>
            <div className="text-gray-600">Manual Tasks Eliminated</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-500 mb-2">40%</div>
            <div className="text-gray-600">Cash Flow Improvement</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-500 mb-2">60%</div>
            <div className="text-gray-600">Dispute Resolution Time</div>
          </div>
        </div>
      </div>
    </section>

    {/* Bottom Message */}
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl text-gray-600">Everything you need to streamline your accounts receivable process</p>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Kuhlekt has revolutionized our collections process. We've seen a 40% improvement in collection rates
                and our team is much more efficient."
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/michael-chen-asian.png"
                  alt="Michael Chen"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">Michael Chen</p>
                  <p className="text-sm text-gray-500">Finance Director, GlobalTech</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The automation features have saved us countless hours. Our DSO has dropped significantly and cash flow
                has never been better."
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/jessica-rodriguez-hispanic.png"
                  alt="Jessica Rodriguez"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">Jessica Rodriguez</p>
                  <p className="text-sm text-gray-500">CFO, InnovateCorp</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "Implementation was smooth and the results were immediate. Kuhlekt has become an essential part of our
                financial operations."
              </p>
              <div className="flex items-center gap-3">
                <Image
                  src="/images/sarah-johnson-headshot.png"
                  alt="Sarah Johnson"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-500">Controller, TechSolutions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </div>
)

const HomePage = () => {
  const [isROICalculatorModalOpen, setIsROICalculatorModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <HomePageContent isCollapsed={false} setIsROICalculatorModalOpen={setIsROICalculatorModalOpen} />
      {mounted && (
        <ROICalculatorModal isOpen={isROICalculatorModalOpen} onClose={() => setIsROICalculatorModalOpen(false)} />
      )}
    </>
  )
}

export default HomePage
