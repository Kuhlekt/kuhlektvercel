import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, ArrowRight } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <VisitorTracker />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-6">
                Trusted by 500+ finance teams
              </Badge>

              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
                We Help Finance Teams Get Paid Faster, With Less Stress
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Transform your accounts receivable process with Kuhlekt's advanced AR Automation and Digital Collections
                solutions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/demo">
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    Schedule a Demo <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg" className="border-gray-300 bg-transparent">
                    Contact Sales
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
              <Image
                src="/images/v200-businesswoman-hero.png"
                alt="Professional businesswoman representing Kuhlekt's AR automation solutions"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
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
              <div className="text-gray-600">Faster Dispute Resolution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">Benefits</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Why Choose Kuhlekt?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Automate Collections</h3>
                <p className="text-gray-600">
                  Reduce manual work and improve efficiency with intelligent automation workflows.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Improve Cash Flow</h3>
                <p className="text-gray-600">
                  Get paid faster with streamlined processes and better customer communication.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Reduce Risk</h3>
                <p className="text-gray-600">
                  Make better credit decisions with built-in risk assessment and monitoring tools.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Complete AR Automation Platform</h2>
            <p className="text-xl text-gray-600">Everything you need to streamline your accounts receivable process</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Streamline Your Entire AR Process</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Automated Invoice Processing</h4>
                    <p className="text-gray-600">
                      Streamline invoice delivery, tracking, and follow-up with intelligent automation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Digital Collections</h4>
                    <p className="text-gray-600">
                      Use smart workflows and templates to reach customers at the right time with the right message.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-cyan-500 text-white rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Customer Portal</h4>
                    <p className="text-gray-600">
                      Provide a branded self-service portal for customers to view invoices and make payments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Image
                src="/images/invoice-to-cash-lifecycle.png"
                alt="Invoice to Cash Life-cycle showing integrated workflow from online credit applications through global payments and reconciliation"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
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
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">CFO, TechSolutions</p>
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
                  "Implementation was smooth and the results were immediate. Kuhlekt has become an essential part of our
                  financial operations."
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to transform your accounts receivable process?</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Schedule a demo to see how Kuhlekt can help your finance team get paid faster with our advanced AR
            Automation and Digital Collections solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
                Schedule a Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-cyan-600 bg-transparent"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
