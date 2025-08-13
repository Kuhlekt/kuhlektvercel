import { Suspense } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import VisitorTracker from "@/components/visitor-tracker"

export default function SolutionsPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Built for Finance Teams in B2B and Enterprise</h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive accounts receivable solutions designed to accelerate cash flow and reduce operational costs
            </p>
          </div>
        </section>

        {/* Solutions Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* SME Credit Management Tools */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/images/sme-credit-management.png"
                    alt="SME Credit Management Tools"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">SME Credit Management Tools</h3>
                  <p className="text-gray-600 mb-6">
                    Streamline credit decisions for small and medium enterprises with automated scoring, limit
                    management, and risk assessment tools.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Automated credit scoring and approval workflows</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Real-time credit limit monitoring and alerts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Integration with credit bureaus and data providers</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enterprise Receivables Software */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/images/enterprise-receivables-dashboard.png"
                    alt="Enterprise Receivables Software"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Receivables Software</h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive AR management platform for large enterprises with complex billing cycles and multiple
                    subsidiaries.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Multi-entity and multi-currency support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Advanced analytics and executive dashboards</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Seamless ERP and accounting system integration</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Corporate Debt Collection System */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/images/debt-collection-system.png"
                    alt="Corporate Debt Collection System"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Corporate Debt Collection System</h3>
                  <p className="text-gray-600 mb-6">
                    AI-powered collections platform that prioritizes accounts, automates communications, and maximizes
                    recovery rates.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Intelligent account prioritization and segmentation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Automated dunning sequences and payment reminders</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Compliance management and audit trails</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Credit Control Software for Businesses */}
              <Card className="overflow-hidden">
                <div className="aspect-video relative">
                  <Image
                    src="/images/credit-control-software.png"
                    alt="Credit Control Software for Businesses"
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Credit Control Software for Businesses</h3>
                  <p className="text-gray-600 mb-6">
                    End-to-end credit control solution that manages the entire customer lifecycle from application to
                    payment.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Customer onboarding and credit application processing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Ongoing credit monitoring and limit adjustments</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">Dispute management and resolution workflows</span>
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
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Kuhlekt</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our solutions are built on three core pillars that ensure success for your finance team
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Scalable Architecture</h3>
                <p className="text-gray-600">
                  Built to grow with your business, from startup to enterprise, handling millions of transactions with
                  ease.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Industry Expertise</h3>
                <p className="text-gray-600">
                  Developed by finance professionals who understand the unique challenges of B2B accounts receivable
                  management.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Proven Results</h3>
                <p className="text-gray-600">
                  Our clients typically see 35% reduction in DSO and 50% improvement in collection efficiency within 90
                  days.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
