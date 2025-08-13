import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from 'lucide-react'
import Link from "next/link"

const pricingPlans = [
  {
    name: "Starter",
    price: "$99",
    period: "per month",
    description: "Perfect for small businesses getting started with AR automation",
    features: [
      "Up to 1,000 invoices/month",
      "Basic automation workflows",
      "Email support",
      "Standard integrations",
      "Basic reporting",
      "Customer portal",
    ],
    notIncluded: [
      "Advanced analytics",
      "Custom integrations",
      "Phone support",
      "Dedicated account manager",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$299",
    period: "per month",
    description: "Ideal for growing companies that need advanced features",
    features: [
      "Up to 10,000 invoices/month",
      "Advanced automation workflows",
      "Priority email & chat support",
      "All standard integrations",
      "Advanced reporting & analytics",
      "Customer portal",
      "Custom workflows",
      "Multi-currency support",
    ],
    notIncluded: [
      "Phone support",
      "Dedicated account manager",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with complex requirements",
    features: [
      "Unlimited invoices",
      "Full automation suite",
      "24/7 phone & email support",
      "Custom integrations",
      "Advanced analytics & reporting",
      "White-label customer portal",
      "Custom workflows",
      "Multi-currency support",
      "Dedicated account manager",
      "SLA guarantees",
      "Custom training",
      "API access",
    ],
    notIncluded: [],
    popular: false,
  },
]

export default function PricingTablePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose the Perfect Plan for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Business
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start with a plan that fits your needs today and scale as your business grows.
            All plans include our core AR automation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-2 border-blue-500 shadow-xl scale-105"
                  : "border hover:border-gray-300 shadow-lg"
              } transition-all duration-200`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-6 py-1">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="flex items-baseline justify-center mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-500 ml-2">/{plan.period}</span>}
                </div>
                <CardDescription className="mt-4 px-4">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-start space-x-3">
                      <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-400 line-through">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-blue-600 hover:bg-blue-700"
                      : plan.name === "Enterprise"
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  asChild
                >
                  <Link href={plan.name === "Enterprise" ? "/contact" : "/demo"}>
                    {plan.name === "Enterprise" ? "Contact Sales" : "Start Free Trial"}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Feature Comparison</CardTitle>
            <CardDescription>Detailed breakdown of what's included in each plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-2 font-medium">Features</th>
                    <th className="text-center py-4 px-2 font-medium">Starter</th>
                    <th className="text-center py-4 px-2 font-medium">Professional</th>
                    <th className="text-center py-4 px-2 font-medium">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-2 font-medium">Monthly Invoice Limit</td>
                    <td className="text-center py-3 px-2">1,000</td>
                    <td className="text-center py-3 px-2">10,000</td>
                    <td className="text-center py-3 px-2">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2 font-medium">Automation Workflows</td>
                    <td className="text-center py-3 px-2">Basic</td>
                    <td className="text-center py-3 px-2">Advanced</td>
                    <td className="text-center py-3 px-2">Full Suite</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2 font-medium">Support</td>
                    <td className="text-center py-3 px-2">Email</td>
                    <td className="text-center py-3 px-2">Email & Chat</td>
                    <td className="text-center py-3 px-2">24/7 Phone & Email</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2 font-medium">Custom Integrations</td>
                    <td className="text-center py-3 px-2">
                      <X className="h-4 w-4 text-gray-400 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-2">
                      <X className="h-4 w-4 text-gray-400 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2 font-medium">Dedicated Account Manager</td>
                    <td className="text-center py-3 px-2">
                      <X className="h-4 w-4 text-gray-400 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-2">
                      <X className="h-4 w-4 text-gray-400 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions about our pricing and plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Can I change plans at any time?</h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and your billing is prorated.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">
                  Yes, we offer a 14-day free trial for all plans. No credit card required to get started.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, ACH bank transfers, and wire transfers for annual plans.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Do you offer annual discounts?</h3>
                <p className="text-gray-600">
                  Yes, annual plans receive a 20% discount compared to monthly billing. Contact sales for custom enterprise pricing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that have improved their cash flow with Kuhlekt.
            Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3" asChild>
              <Link href="/demo">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent" asChild>
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
