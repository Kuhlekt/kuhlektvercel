import { Suspense } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function SolutionsPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Built for Finance Teams in B2B and Enterprise</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive accounts receivable solutions designed to accelerate cash flow and reduce manual processes
              for growing businesses.
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              {/* SME Credit Management Tools */}
              <Card className="p-8">
                <CardContent className="p-0">
                  <Image
                    src="/images/sme-credit-management.png"
                    alt="SME Credit Management Tools"
                    width={400}
                    height={250}
                    className="rounded-lg mb-6"
                  />
                  <h3 className="text-2xl font-semibold mb-4">SME Credit Management Tools</h3>
                  <p className="text-gray-600 mb-6">
                    Streamlined credit management solutions designed specifically for small and medium enterprises to
                    optimize cash flow and reduce credit risk.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Automated credit scoring and risk assessment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Real-time payment tracking and alerts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Customizable collection workflows</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise Receivables Software */}
              <Card className="p-8">
                <CardContent className="p-0">
                  <Image
                    src="/images/enterprise-receivables-dashboard.png"
                    alt="Enterprise Receivables Software"
                    width={400}
                    height={250}
                    className="rounded-lg mb-6"
                  />
                  <h3 className="text-2xl font-semibold mb-4">Enterprise Receivables Software</h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive AR automation platform for large enterprises with complex billing structures and
                    high-volume transactions.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Advanced analytics and reporting dashboard</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Multi-currency and multi-entity support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">API integrations with ERP systems</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Corporate Debt Collection System */}
              <Card className="p-8">
                <CardContent className="p-0">
                  <Image
                    src="/images/debt-collection-system.png"
                    alt="Corporate Debt Collection System"
                    width={400}
                    height={250}
                    className="rounded-lg mb-6"
                  />
                  <h3 className="text-2xl font-semibold mb-4">Corporate Debt Collection System</h3>
                  <p className="text-gray-600 mb-6">
                    Intelligent debt collection platform that automates follow-ups while maintaining positive customer
                    relationships through personalized communication.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">AI-powered collection strategies</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Automated email and SMS campaigns</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Compliance management and reporting</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Control Software for Businesses */}
              <Card className="p-8">
                <CardContent className="p-0">
                  <Image
                    src="/images/credit-control-software.png"
                    alt="Credit Control Software for Businesses"
                    width={400}
                    height={250}
                    className="rounded-lg mb-6"
                  />
                  <h3 className="text-2xl font-semibold mb-4">Credit Control Software for Businesses</h3>
                  <p className="text-gray-600 mb-6">
                    Complete credit control solution that helps businesses manage customer credit limits, monitor
                    payment behavior, and reduce bad debt exposure.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Dynamic credit limit management</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Predictive risk modeling</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">Integrated payment processing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Kuhlekt</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Scalable Architecture</h3>
                <p className="text-gray-600">
                  Our platform grows with your business, from startup to enterprise, handling increasing transaction
                  volumes seamlessly.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Industry Expertise</h3>
                <p className="text-gray-600">
                  Built by finance professionals who understand the unique challenges of accounts receivable management
                  in modern businesses.
                </p>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Proven Results</h3>
                <p className="text-gray-600">
                  Our clients typically see 40% faster collections and 25% reduction in DSO within the first 90 days of
                  implementation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
