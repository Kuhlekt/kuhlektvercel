import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              We Help Finance Teams Get Paid Faster, With Less Stress
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kuhlekt transforms accounts receivable management with intelligent automation, helping businesses reduce
              DSO and improve cash flow.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-8">
                We believe that managing accounts receivable shouldn't be a constant source of stress for finance teams.
                Our mission is to automate the complex, time-consuming tasks that keep finance professionals from
                focusing on strategic growth initiatives.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Reduce manual work by up to 80%</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Improve cash flow predictability</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Enhance customer relationships</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/manual-vs-automated-ar.png"
                alt="Manual vs Automated AR comparison showing efficiency improvements"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Believe</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our core beliefs drive everything we do, from product development to customer support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Automation First</h3>
              <p className="text-gray-600">
                Every process should be automated by default, with human intervention only when truly necessary.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Obsessed</h3>
              <p className="text-gray-600">
                We succeed when our customers succeed. Their growth and efficiency improvements are our north star.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Continuous Innovation</h3>
              <p className="text-gray-600">
                The AR landscape is constantly evolving. We stay ahead by continuously innovating and adapting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-600">
            <p>
              Kuhlekt was founded by finance professionals who experienced firsthand the frustration of managing
              accounts receivable with outdated tools and manual processes. After years of late nights chasing payments
              and struggling with cash flow visibility, we knew there had to be a better way.
            </p>
            <p>
              We started building Kuhlekt in 2020, combining our deep understanding of finance operations with
              cutting-edge automation technology. Our goal was simple: create a solution that would give finance teams
              their time back while improving their results.
            </p>
            <p>
              Today, Kuhlekt serves hundreds of companies worldwide, helping them reduce their DSO by an average of 25%
              while cutting manual AR work by up to 80%. We're just getting started on our mission to transform how
              businesses manage their receivables.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
