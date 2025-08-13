import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Building2, Users, TrendingUp } from "lucide-react"
import VisitorTracker from "@/components/visitor-tracker"

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <VisitorTracker />
      </Suspense>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Built for Finance Teams in B2B and Enterprise</h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              Comprehensive accounts receivable solutions designed to scale with your business
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* SME Credit Management Tools */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <img
                  src="/images/sme-credit-management.png"
                  alt="SME Credit Management Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">SME Credit Management Tools</h3>
                <p className="text-gray-600 mb-6">
                  Streamlined credit management designed specifically for small and medium enterprises. Automate credit
                  decisions, monitor risk, and accelerate cash flow.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Automated credit scoring and limits</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Real-time risk monitoring</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Integrated payment processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Receivables Software */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <img
                  src="/images/enterprise-receivables-dashboard.png"
                  alt="Enterprise Receivables Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Receivables Software</h3>
                <p className="text-gray-600 mb-6">
                  Comprehensive AR management for large organizations. Handle complex workflows, multi-entity
                  structures, and high-volume transactions with ease.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Multi-entity consolidation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced workflow automation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Executive reporting and analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Corporate Debt Collection System */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-purple-50 to-violet-100 flex items-center justify-center">
                <img
                  src="/images/debt-collection-system.png"
                  alt="Debt Collection System Interface"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Corporate Debt Collection System</h3>
                <p className="text-gray-600 mb-6">
                  Intelligent debt collection platform that maximizes recovery rates while maintaining customer
                  relationships. Automated dunning with personalized communication strategies.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">AI-powered collection strategies</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Automated dunning sequences</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Compliance management</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Control Software for Businesses */}
            <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
                <img
                  src="/images/credit-control-software.png"
                  alt="Credit Control Software Dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Credit Control Software for Businesses</h3>
                <p className="text-gray-600 mb-6">
                  Complete credit control solution for businesses of all sizes. From credit applications to collections,
                  manage your entire credit lifecycle in one platform.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">End-to-end credit lifecycle</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Customer self-service portal</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Integrated payment solutions</span>
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
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Kuhlekt?</h2>
              <p className="text-xl text-gray-600">Built by finance experts, for finance teams who demand excellence</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Scalable Architecture</h3>
                <p className="text-gray-600">
                  Built to grow with your business, from startup to enterprise. Handle millions of transactions with
                  ease.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Industry Expertise</h3>
                <p className="text-gray-600">
                  Developed by finance professionals who understand the complexities of modern accounts receivable
                  management.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Proven Results</h3>
                <p className="text-gray-600">
                  Our clients see an average 35% reduction in DSO and 50% improvement in collection efficiency within 90
                  days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
