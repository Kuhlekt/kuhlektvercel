import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <div id="top" className="max-w-6xl mx-auto px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-6xl font-bold mb-8 text-gray-900 leading-tight">
            We Help Finance Teams Get Paid Faster, With Less Stress
          </h1>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
            At Kuhlekt, we believe managing receivables should be smart, simple, and fully automated. Our platform helps
            finance teams of all sizes eliminate manual tasks, improve cash flow, and build stronger customer
            relationships through transparent credit management.
          </p>
        </div>

        {/* Mission and Image Section */}
        <div className="grid lg:grid-cols-2 gap-20 mb-24">
          {/* Left Column - Mission and Beliefs */}
          <div>
            {/* Our Mission */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                To transform accounts receivable from a manual, reactive process into a strategic, automated function
                that improves cash flow and customer relationships.
              </p>
            </div>

            {/* What We Believe */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">What We Believe</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-base">Finance teams shouldn't waste time on manual collections</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-base">Credit management should be data-driven and proactive</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-base">Customers deserve a transparent, self-service experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Manual vs Automated Comparison */}
          <div className="flex items-center justify-center">
            <Image
              src="/images/manual-vs-automated-ar.png"
              alt="Manual AR Chaos vs Automated with Kuhlekt comparison"
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
              loading="lazy"
            />
          </div>
        </div>

        {/* Our Story Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">Our Story</h2>
          <div className="max-w-4xl mx-auto space-y-8 text-lg text-gray-600 leading-relaxed">
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
      </div>

      <Footer />
    </div>
  )
}
