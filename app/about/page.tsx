import { Suspense } from "react"
import { CheckCircle } from "lucide-react"
import VisitorTracker from "@/components/visitor-tracker"
import Image from "next/image"

export default function AboutPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              We Help Finance Teams Get Paid Faster, With Less Stress
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              At Kuhlekt, we believe managing receivables should be smart, simple, and fully automated. Our platform
              helps finance teams of all sizes eliminate manual tasks, improve cash flow, and build stronger customer
              relationships through transparent credit management.
            </p>
          </div>

          {/* Mission and Beliefs Section */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-12">
                {/* Our Mission */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    To transform accounts receivable from a manual, reactive process into a strategic, automated
                    function that improves cash flow and customer relationships.
                  </p>
                </div>

                {/* What We Believe */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Believe</h2>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <p className="text-lg text-gray-600">Finance teams shouldn't waste time on manual collections</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <p className="text-lg text-gray-600">Credit management should be data-driven and proactive</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <p className="text-lg text-gray-600">Customers deserve a transparent, self-service experience</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Comparison Image */}
              <div className="lg:pl-8">
                <div className="relative">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9foiJDmmXjFUffToslbq8LYXs6SzjQ.png"
                    alt="Manual AR Chaos vs Automated with Kuhlekt - From Manual Mayhem to Streamlined Collections"
                    width={600}
                    height={400}
                    className="w-full h-auto rounded-lg shadow-lg"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Our Story Section */}
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Our Story</h2>
            <div className="space-y-8 text-lg text-gray-600 leading-relaxed">
              <p>
                Kuhlekt was founded by finance professionals who experienced firsthand the challenges of managing
                accounts receivable with outdated tools and manual processes.
              </p>
              <p>
                After years of struggling with spreadsheets, email chains, and disconnected systems, our founders set
                out to build the comprehensive AR automation platform they wished they had.
              </p>
              <p>
                Today, Kuhlekt helps finance teams of all sizes streamline their collections, improve cash flow, and
                build better customer relationships through transparent credit management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
