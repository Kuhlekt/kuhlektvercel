import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section
        id="ar-automation"
        className="bg-gradient-to-br from-slate-50 to-blue-50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
            The Complete AR Automation Platform for Modern Finance Teams
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Automate the full AR lifecycle—credit application, invoicing,
            follow-up, dispute resolution, and payment.
          </p>
          <Link href="/demo">
            <Button
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-8"
            >
              Schedule a Demo <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* AR Software Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Accounts Receivable Software That Works for You
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Automate the full AR lifecycle—credit application, invoicing,
                follow-up, dispute resolution, and payment.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Automated invoice delivery and follow-up
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Smart prioritization of collection activities
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Integrated payment processing
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/ar-dashboard.png"
                alt="Invoice to Cash Life-cycle showing integrated workflow from online credit applications through global payments and reconciliation"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Digital Collections Tools */}
      <section id="digital-collections" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <Image
                src="/images/digital-collections.png"
                alt="Digital Collections workflow with email templates, SMS automation, payment tracking, and activity logging"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                loading="lazy"
              />
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Digital Collections Tools
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Use email/SMS templates, automated workflows, and smart routing
                to reach the right customer at the right time.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Automated email and SMS reminders
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Customizable collection sequences
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Performance tracking for collectors
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Credit Portal */}
      <section id="credit-portal" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Customer Credit Portal
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Let customers check balances, view invoices, and submit payments
                or disputes online.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Self-service invoice management
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">Online payment options</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                  <span className="text-gray-700">
                    Branded customer experience
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/images/customer-portal.png"
                alt="Customer Credit Portal interface showing account dashboard with balance overview, invoice management, payment options, and dispute submission capabilities"
                width={800}
                height={600}
                className="rounded-lg shadow-lg w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section id="dispute-management" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for AR Automation
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools designed to streamline your entire receivables
              process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Credit Applications
                </h3>
                <p className="text-gray-600">
                  Streamline credit approval with automated workflows and risk
                  assessment tools.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Invoice Management
                </h3>
                <p className="text-gray-600">
                  Automated invoice delivery, tracking, and follow-up to ensure
                  timely payments.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Dispute Resolution
                </h3>
                <p className="text-gray-600">
                  Centralized dispute management with automated workflows and
                  documentation.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Payment Processing
                </h3>
                <p className="text-gray-600">
                  Multiple payment options with automatic reconciliation and
                  posting.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Analytics & Reporting
                </h3>
                <p className="text-gray-600">
                  Real-time dashboards and comprehensive reports for better
                  decision making.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">ERP Integration</h3>
                <p className="text-gray-600">
                  Seamless integration with your existing ERP and accounting
                  systems.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">
              Results
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Proven Results for Finance Teams
            </h2>
            <p className="text-xl text-gray-600">
              See the impact Kuhlekt has on key AR metrics
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
                30%
              </div>
              <div className="text-gray-600 font-medium">
                Average DSO Reduction
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
                80%
              </div>
              <div className="text-gray-600 font-medium">
                Manual Tasks Eliminated
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
                40%
              </div>
              <div className="text-gray-600 font-medium">
                Cash Flow Improvement
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
                60%
              </div>
              <div className="text-gray-600 font-medium">
                Faster Dispute Resolution
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
