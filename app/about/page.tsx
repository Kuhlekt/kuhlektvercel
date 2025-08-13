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
              DSO and improve cash flow while maintaining strong customer relationships.
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
                Our mission is to eliminate the manual, time-consuming processes that keep CFOs awake at night and
                replace them with intelligent, automated solutions that work seamlessly in the background.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Reduce Days Sales Outstanding (DSO) by up to 40%</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Automate 80% of routine collection activities</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Improve customer satisfaction through personalized communication</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">Provide real-time visibility into cash flow forecasting</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/manual-vs-automated-ar.png"
                alt="Manual vs Automated AR Management Comparison"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Beliefs Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Believe</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our core beliefs drive everything we do, from product development to customer support.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <CheckCircle className="w-8 h-8 text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automation Should Be Intelligent</h3>
              <p className="text-gray-600">
                We don't believe in one-size-fits-all automation. Our AI learns your business patterns and adapts to
                provide personalized, context-aware solutions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <CheckCircle className="w-8 h-8 text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Relationships Matter</h3>
              <p className="text-gray-600">
                Getting paid faster shouldn't come at the expense of customer relationships. Our platform helps maintain
                positive interactions while improving collection rates.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <CheckCircle className="w-8 h-8 text-teal-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Drives Decisions</h3>
              <p className="text-gray-600">
                Every action should be backed by data. We provide comprehensive analytics and insights to help you make
                informed decisions about your AR strategy.
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
              Kuhlekt was born from the frustration of watching talented finance professionals spend countless hours on
              manual, repetitive tasks that technology should handle. Our founders, having worked in both finance and
              technology roles, witnessed firsthand how outdated AR processes were holding businesses back.
            </p>
            <p>
              We started with a simple question: "What if accounts receivable could run itself?" This led us to develop
              an AI-powered platform that not only automates routine tasks but actually gets smarter over time, learning
              from each interaction to improve outcomes.
            </p>
            <p>
              Today, we're proud to help hundreds of businesses transform their AR operations, reduce stress for finance
              teams, and improve cash flow predictability. But we're just getting started – our vision is to make
              intelligent AR automation accessible to businesses of all sizes.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
