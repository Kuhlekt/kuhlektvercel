import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>

      {/* Hero Section */}
      <section id="sme-credit-management" className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
            Built for Finance Teams in B2B and Enterprise
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Trusted by 0000's+ finance team members</p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section id="enterprise-receivables" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* SME Credit Management Tools */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white" id="sme-credit-management">
              <CardContent className="p-0">
                <div className="mb-6 bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                  <Image
                    src="/images/sme-credit-management.png"
                    alt="Small Business Credit Management workflow showing new account onboarding, automated collections, and payments"
                    width={400}
                    height={200}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">SME Credit Management Tools</h3>
                <p className="text-gray-600 mb-6">
                  Tools designed for lean finance teams to manage credit limits, automate AR, and reduce risk.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Simplified credit application process</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Automated collections for small teams</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Basic risk assessment tools</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enterprise Receivables Software */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="mb-6 bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                  <Image
                    src="/images/enterprise-receivables-dashboard.png"
                    alt="Enterprise Receivables Software dashboard showing 4-stage workflow"
                    width={400}
                    height={200}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">Enterprise Receivables Software</h3>
                <p className="text-gray-600 mb-6">
                  Scalable workflows for large, distributed teams with complex credit and collections processes.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Multi-entity support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Advanced workflow automation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Enterprise-grade reporting</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Corporate Debt Collection System */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white" id="corporate-debt-collection">
              <CardContent className="p-0">
                <div className="mb-6 bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                  <Image
                    src="/images/debt-collection-system.png"
                    alt="Corporate Debt Collection System interface with AI-powered prioritization and professional users"
                    width={400}
                    height={200}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">Corporate Debt Collection System</h3>
                <p className="text-gray-600 mb-6">
                  Systematically automate collection sequences with smart prioritization and workflow automation.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">AI-powered collection prioritization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Automated escalation paths</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Legal integration for severe cases</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Control Software for Businesses */}
            <Card className="p-8 hover:shadow-lg transition-shadow bg-white" id="credit-control-software">
              <CardContent className="p-0">
                <div className="mb-6 bg-gray-50 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                  <Image
                    src="/images/credit-control-software.png"
                    alt="Credit Control Software dashboard showing credit limit management, approval workflows, and risk scoring"
                    width={400}
                    height={200}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">Credit Control Software for Businesses</h3>
                <p className="text-gray-600 mb-6">
                  Centralize all your credit control activities—from approvals to overdue escalations.
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Credit limit management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Approval workflows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-gray-700">Risk scoring and monitoring</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Solutions?</h2>
            <p className="text-xl text-gray-600">Tailored for different business sizes and complexity levels</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scalable Architecture</h3>
              <p className="text-gray-600">Solutions that grow with your business, from SME to enterprise scale</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Industry Expertise</h3>
              <p className="text-gray-600">Built by finance professionals who understand your challenges</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Proven Results</h3>
              <p className="text-gray-600">Trusted by 0000's+ finance team members</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
