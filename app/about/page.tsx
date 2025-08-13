import { Suspense } from "react"
import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function AboutPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
              We Help Finance Teams Get Paid Faster, With Less Stress
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At Kuhlekt, we believe managing receivables should be smart, simple, and fully automated. Our platform
              helps finance teams of all sizes eliminate manual tasks, improve cash flow, and build stronger customer
              relationships through transparent credit management.
            </p>
          </div>
        </section>

        {/* Mission & Beliefs */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-600 mb-12">
                  To transform accounts receivable from a manual, reactive process into a strategic, automated function
                  that improves cash flow and customer relationships.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Believe</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Finance teams shouldn't waste time on manual collections</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Credit management should be data-driven and proactive</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600">Customers deserve a transparent, self-service experience</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Image
                  src="/images/manual-vs-automated-comparison.png"
                  alt="Manual AR Chaos vs Automated with Kuhlekt comparison"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Story</h2>

              <div className="space-y-8 text-gray-600">
                <p className="text-lg">
                  Kuhlekt was founded by finance professionals who experienced firsthand the challenges of managing
                  accounts receivable with outdated tools and manual processes.
                </p>

                <p className="text-lg">
                  After years of struggling with spreadsheets, email chains, and disconnected systems, our founders set
                  out to build the comprehensive AR automation platform they wished they had.
                </p>

                <p className="text-lg">
                  Today, Kuhlekt helps finance teams of all sizes streamline their collections, improve cash flow, and
                  build better customer relationships through transparent credit management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
