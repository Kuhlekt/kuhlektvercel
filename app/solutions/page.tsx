import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function SolutionsPage() {
  return (
    <>
      <VisitorTracker />
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built for Finance Teams in B2B and Enterprise
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive accounts receivable solutions designed to reduce DSO, improve cash flow, and streamline your
              collections process.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">SME Credit Management Tools</CardTitle>
                <CardDescription>
                  Streamlined credit management for small and medium enterprises with automated workflows and real-time
                  insights.
                </CardDescription>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Automated credit scoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Real-time payment tracking</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Customer portal access</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <img
                    src="/images/sme-credit-management.png"
                    alt="SME Credit Management Tools"
                    className="w-full h-45 object-cover rounded-lg"
                  />
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Enterprise Receivables Software</CardTitle>
                <CardDescription>
                  Comprehensive AR management for large enterprises with advanced analytics and multi-entity support.
                </CardDescription>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Multi-entity management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Advanced reporting suite</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">API integrations</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <img
                    src="/images/enterprise-receivables-dashboard.png"
                    alt="Enterprise Receivables Software"
                    className="w-full h-45 object-cover rounded-lg"
                  />
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Corporate Debt Collection System</CardTitle>
                <CardDescription>
                  Intelligent debt collection workflows with automated escalation and compliance management.
                </CardDescription>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Automated escalation rules</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Compliance monitoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Performance analytics</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <img
                    src="/images/debt-collection-system.png"
                    alt="Corporate Debt Collection System"
                    className="w-full h-45 object-cover rounded-lg"
                  />
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Credit Control Software for Businesses</CardTitle>
                <CardDescription>
                  Complete credit control solution with risk assessment, limit management, and automated workflows.
                </CardDescription>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Risk assessment tools</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Credit limit management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Workflow automation</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <img
                    src="/images/credit-control-software.png"
                    alt="Credit Control Software for Businesses"
                    className="w-full h-45 object-cover rounded-lg"
                  />
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose Kuhlekt?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Scalable Architecture</h3>
                <p className="text-gray-600">
                  Built to grow with your business, from startup to enterprise scale with cloud-native infrastructure.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Industry Expertise</h3>
                <p className="text-gray-600">
                  Deep understanding of B2B finance processes with solutions tailored to your industry needs.
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Proven Results</h3>
                <p className="text-gray-600">
                  Average 35% reduction in DSO within 90 days with measurable improvements in cash flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
