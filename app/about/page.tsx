import { CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              We Help Finance Teams Get Paid Faster, With Less Stress
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Kuhlekt transforms accounts receivable management through intelligent automation, helping businesses
              reduce DSO, improve cash flow, and eliminate manual processes.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-8">
                  We believe that managing accounts receivable shouldn't be a constant source of stress for finance
                  teams. Our mission is to automate the complex, time-consuming processes that keep finance
                  professionals from focusing on strategic initiatives.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Reduce manual data entry by 90%</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Accelerate collections by 40%</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Improve cash flow predictability</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-teal-600 mb-2">500+</div>
                  <div className="text-gray-600 mb-4">Finance teams trust Kuhlekt</div>
                  <div className="text-4xl font-bold text-teal-600 mb-2">30%</div>
                  <div className="text-gray-600 mb-4">Average DSO reduction</div>
                  <div className="text-4xl font-bold text-teal-600 mb-2">$2M+</div>
                  <div className="text-gray-600">Average cash flow improvement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">What We Believe</h2>
            <p className="text-lg text-gray-600">
              Our core principles guide everything we do, from product development to customer success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Automation First</h3>
                <p className="text-gray-600">
                  Every manual process is an opportunity for automation. We believe technology should handle repetitive
                  tasks so humans can focus on strategy.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Success</h3>
                <p className="text-gray-600">
                  Our success is measured by our customers' success. We're committed to delivering measurable
                  improvements in DSO and cash flow.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Continuous Innovation</h3>
                <p className="text-gray-600">
                  The AR landscape is constantly evolving. We stay ahead of the curve with cutting-edge technology and
                  industry best practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-lg leading-relaxed mb-6">
                Kuhlekt was founded by a team of finance professionals and technology experts who experienced firsthand
                the frustrations of manual accounts receivable processes. After years of working with spreadsheets,
                manual follow-ups, and disconnected systems, we knew there had to be a better way.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                We started with a simple question: "What if AR management could be as automated and intelligent as
                modern marketing and sales processes?" This led us to develop a platform that combines AI-powered
                automation with deep financial expertise.
              </p>
              <p className="text-lg leading-relaxed">
                Today, Kuhlekt serves hundreds of finance teams across industries, helping them reduce DSO, improve cash
                flow, and eliminate the stress of manual AR management. We're just getting started on our mission to
                transform how businesses manage their receivables.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your AR Process?</h2>
            <p className="text-xl text-teal-100 mb-8">
              Join hundreds of finance teams who have already reduced their DSO and improved cash flow with Kuhlekt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/demo"
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Schedule a Demo
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
