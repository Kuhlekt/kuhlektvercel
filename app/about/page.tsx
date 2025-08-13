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
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
              We Help Finance Teams Get Paid Faster, With Less Stress
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              At Kuhlekt, we believe managing receivables should be smart, simple, and fully automated. Our platform
              helps finance teams of all sizes eliminate manual tasks, improve cash flow, and build stronger customer
              relationships through transparent credit management.
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left Column */}
              <div className="space-y-12">
                {/* Our Mission */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
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
                      <p className="text-gray-600 text-lg">Finance teams shouldn't waste time on manual collections</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-600 text-lg">Credit management should be data-driven and proactive</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-600 text-lg">Customers deserve a transparent, self-service experience</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Comparison Image */}
              <div className="flex justify-center lg:justify-end">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9foiJDmmXjFUffToslbq8LYXs6SzjQ.png"
                  alt="Manual AR Chaos vs Automated with Kuhlekt - From Manual Mayhem to Streamlined Collections"
                  width={600}
                  height={300}
                  className="rounded-lg shadow-lg max-w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
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
        </section>
      </div>
    </>
  )
}
