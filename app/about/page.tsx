import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            We Help Finance Teams Get Paid Faster, With Less Stress
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            At Kuhlekt, we believe managing receivables should be smart, simple, and fully automated. Our platform helps
            finance teams of all sizes eliminate manual tasks, improve cash flow, and build stronger customer
            relationships through transparent credit management.
          </p>
        </div>
      </section>

      {/* Mission and Beliefs Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div>
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To transform accounts receivable from a manual, reactive process into a strategic, automated function
                  that improves cash flow and customer relationships.
                </p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Believe</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Finance teams shouldn't waste time on manual collections</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Credit management should be data-driven and proactive</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-teal-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Customers deserve a transparent, self-service experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Comparison Image */}
            <div className="flex justify-center">
              <Image
                src="/images/manual-vs-automated-ar.png"
                alt="Manual AR Chaos vs Automated with Kuhlekt - Comparison showing stressed finance professional versus calm automated workflow"
                width={500}
                height={350}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Story</h2>

          <div className="space-y-8 text-gray-600 leading-relaxed">
            <p>
              Kuhlekt was founded by finance professionals who experienced firsthand the challenges of managing accounts
              receivable with outdated tools and manual processes.
            </p>

            <p>
              After years of struggling with spreadsheets, email chains, and disconnected systems, our founders set out
              to build the comprehensive AR automation platform they wished they had.
            </p>

            <p>
              Today, Kuhlekt helps finance teams of all sizes streamline their collections, improve cash flow, and build
              better customer relationships through transparent credit management.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
