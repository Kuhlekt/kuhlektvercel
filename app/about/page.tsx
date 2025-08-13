import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Target, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About</h1>
        <p className="text-lg text-gray-600">This page is under construction.</p>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-6">About Kuhlekt</Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              We Help Finance Teams Get Paid Faster, With Less Stress
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Kuhlekt is the leading AR automation platform that transforms how businesses manage their accounts
              receivable. We eliminate manual processes, reduce DSO, and improve cash flow for finance teams worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                  Schedule a Demo
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-gray-300 bg-transparent">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8">
                To revolutionize accounts receivable management by providing intelligent automation tools that help
                businesses get paid faster, reduce manual work, and improve cash flow predictability.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Eliminate 80% of manual AR tasks through intelligent automation</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Reduce Days Sales Outstanding (DSO) by an average of 30%</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Improve cash flow predictability and financial planning</span>
                </div>
              </div>
            </div>
            <div>
              <Image
                src="/images/ar-dashboard.png"
                alt="Kuhlekt AR Dashboard"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">What We Believe</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our core values drive everything we do and shape how we serve our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Success First</h3>
                <p className="text-gray-600">
                  We measure our success by our customers' success. Every feature we build and every decision we make is
                  driven by delivering value to finance teams.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation & Excellence</h3>
                <p className="text-gray-600">
                  We continuously innovate to stay ahead of industry needs, delivering cutting-edge solutions that set
                  new standards in AR automation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparency & Trust</h3>
                <p className="text-gray-600">
                  We build lasting relationships through honest communication, transparent pricing, and reliable support
                  that our customers can count on.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/manual-vs-automated-ar.png"
                alt="Manual vs Automated AR Process"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Kuhlekt was founded by finance professionals who experienced firsthand the frustrations of manual AR
                processes. Spending countless hours on repetitive tasks, chasing payments, and struggling with cash flow
                visibility, they knew there had to be a better way.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                In 2020, we set out to build the AR automation platform we wished we had. Today, we're proud to serve
                over 500 finance teams worldwide, helping them reclaim their time and transform their cash flow
                management.
              </p>
              <p className="text-lg text-gray-600">
                Our journey continues as we innovate and expand our platform to meet the evolving needs of modern
                finance teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">Ready to Transform Your AR Process?</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Join hundreds of finance teams who have already automated their accounts receivable and improved their cash
            flow with Kuhlekt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
                Schedule a Demo
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
