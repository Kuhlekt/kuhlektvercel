import { Suspense } from "react"
import { CheckCircle } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function AboutPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              We Help Finance Teams Get Paid Faster, With Less Stress
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              At Kuhlekt, we believe managing receivables should be smart, simple, and fully automated. Our platform
              helps finance teams of all sizes eliminate manual tasks, improve cash flow, and build stronger customer
              relationships through transparent credit management.
            </p>
          </div>

          {/* Mission and Beliefs Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-8">
                To transform accounts receivable from a manual, reactive process into a strategic, automated function
                that improves cash flow and customer relationships.
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Believe</h2>
              <ul className="space-y-4">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Finance teams shouldn't waste time on manual collections</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Credit management should be data-driven and proactive</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-600">Customers deserve a transparent, self-service experience</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center justify-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9foiJDmmXjFUffToslbq8LYXs6SzjQ.png"
                alt="Manual AR Chaos vs Automated with Kuhlekt"
                className="w-full max-w-lg rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Our Story Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
            <div className="max-w-4xl mx-auto space-y-6 text-gray-600">
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
