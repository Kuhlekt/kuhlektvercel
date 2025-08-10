import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Play } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-red-500 text-white px-4 py-2 rounded-full mb-6">
                ★ Trusted by 500+ finance teams
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                <span className="text-cyan-500">Automate AR.</span>{" "}
                <span className="text-red-500">Get Paid Faster.</span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, streamline
                debt recovery, and improve cash flow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/demo">
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    Schedule a Demo →
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-gray-300 bg-white">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Product Tour
                </Button>
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
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-FGHYnnjZ43yqXOEZXmLE5ucaRE1EHG.png"
                alt="Professional businesswoman with testimonial overlay showing Kuhlekt's impact on accounts receivable automation"
                width={600}
                height={400}
                className="rounded-lg w-full h-auto"
              />
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
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Automate debt recovery</h3>
                <p className="text-gray-600">Reduce Days Sales Outstanding (DSO) with intelligent automation</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Improve cash flow</h3>
                <p className="text-gray-600">Get real-time insights into your receivables and cash position</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Streamline collections</h3>
                <p className="text-gray-600">Coordinate collection processes across teams with ease</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Enhance credit control</h3>
                <p className="text-gray-600">Use built-in risk assessment tools to make better credit decisions</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Empower customers</h3>
                <p className="text-gray-600">Provide a branded self-service credit portal for your customers</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
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
          <div className="text-center mb-12">
            <Image
              src="/images/kuhlekt-dashboard-interface.png"
              alt="Kuhlekt Dashboard Interface showing comprehensive AR management with accounts tracking, PTPs, disputes, workload management, and performance metrics"
              width={1200}
              height={800}
              className="rounded-lg shadow-2xl mx-auto"
            />
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
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
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
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "The automation features have saved us countless hours. Our DSO has dropped significantly and cash
                  flow has never been better."
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
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
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
}
