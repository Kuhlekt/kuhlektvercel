import Image from "next/image"
import { Check } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            We Help Finance Teams Get
            <br />
            Paid Faster, With Less Stress
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At Kuhlekt, we believe managing receivables should be smart, simple, and fully automated. Our platform helps
            finance teams of all sizes eliminate manual tasks, improve cash flow, and build stronger customer
            relationships through transparent credit management.
          </p>
        </div>
      </section>

      {/* Mission and Beliefs Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                To transform accounts receivable from a manual, reactive process into a strategic, automated function
                that improves cash flow and customer relationships.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Believe</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg text-gray-700">Finance teams shouldn't waste time on manual collections</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg text-gray-700">Credit management should be data-driven and proactive</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg text-gray-700">Customers deserve a transparent, self-service experience</p>
                </div>
              </div>
            </div>

            {/* Right Column - Comparison Image */}
            <div className="flex justify-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9foiJDmmXjFUffToslbq8LYXs6SzjQ.png"
                alt="Manual AR Chaos vs Automated with Kuhlekt comparison"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Our Story</h2>

          <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
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
