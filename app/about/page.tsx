import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            We Help Finance Teams Get Paid Faster, With Less Stress
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Kuhlekt, we believe managing receivables should be smart, simple, and fully automated. Our platform helps
            finance teams of all sizes eliminate manual tasks, improve cash flow, and build stronger customer
            relationships through transparent credit management.
          </p>
        </div>
      </section>

      {/* Mission and What We Believe Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Mission and Beliefs */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                To transform accounts receivable from a manual, reactive process into a strategic, automated function
                that improves cash flow and customer relationships.
              </p>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">What We Believe</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">Finance teams shouldn't waste time on manual collections</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">Credit management should be data-driven and proactive</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600">Customers deserve a transparent, self-service experience</p>
                </div>
              </div>
            </div>

            {/* Right Column - Comparison Image */}
            <div className="relative">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-pP0JrLdkXkE7GvcSyHC2RNcSzn75fu.png"
                alt="Manual AR Chaos vs Automated with Kuhlekt - From Manual Mayhem to Streamlined Collections"
                width={500}
                height={300}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Story</h2>

          <div className="space-y-8 text-gray-600 leading-relaxed">
            <p className="text-lg">
              Kuhlekt was founded by finance professionals who experienced firsthand the challenges of managing accounts
              receivable with outdated tools and manual processes.
            </p>

            <p className="text-lg">
              After years of struggling with spreadsheets, email chains, and disconnected systems, our founders set out
              to build the comprehensive AR automation platform they wished they had.
            </p>

            <p className="text-lg">
              Today, Kuhlekt helps finance teams of all sizes streamline their collections, improve cash flow, and build
              better customer relationships through transparent credit management.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your AR Process?</h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join hundreds of companies that have already revolutionized their accounts receivable operations with
            Kuhlekt's intelligent automation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/demo"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
            >
              Request Demo
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
