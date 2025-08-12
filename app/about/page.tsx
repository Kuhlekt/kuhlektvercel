import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Target, Award, TrendingUp, Shield, Zap } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm font-medium">
            About Kuhlekt
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">Revolutionizing Accounts Receivable</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're transforming how businesses manage their accounts receivable with cutting-edge automation technology
            that streamlines operations, improves cash flow, and eliminates manual inefficiencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/demo"
              className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Request Demo
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Target className="h-8 w-8 text-blue-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To empower businesses of all sizes with intelligent AR automation solutions that streamline
                  operations, improve cash flow, and eliminate the inefficiencies of manual accounts receivable
                  processes. We believe every business deserves access to enterprise-grade financial automation tools.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Award className="h-8 w-8 text-green-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg leading-relaxed">
                  To become the leading provider of AR automation technology globally, helping businesses worldwide
                  achieve financial efficiency and focus on what matters most - growing their business. We envision a
                  future where manual AR processes are a thing of the past.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600">
              Trusted by businesses worldwide to optimize their financial operations
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">$2B+</div>
              <div className="text-gray-600 font-medium">AR Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">40%</div>
              <div className="text-gray-600 font-medium">Average DSO Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-600 font-medium">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h2>
            <p className="text-xl text-gray-600">Experienced professionals dedicated to transforming AR management</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <Image
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                <p className="text-blue-600 font-medium mb-3">CEO & Founder</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Former CFO with 15+ years in financial operations and AR management. Sarah founded Kuhlekt after
                  experiencing firsthand the challenges of manual AR processes in enterprise environments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <Image
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
                <p className="text-blue-600 font-medium mb-3">CTO & Co-Founder</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Technology leader with expertise in AI, automation, and enterprise software. Michael leads our
                  engineering team in building scalable, secure AR automation solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-8 text-center">
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <Image
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2">Jessica Rodriguez</h3>
                <p className="text-blue-600 font-medium mb-3">VP of Customer Success</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Customer experience expert focused on driving business outcomes. Jessica ensures our clients achieve
                  maximum value from their AR automation investment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-yellow-600" />
                  Innovation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We continuously push the boundaries of what's possible in AR automation technology, staying ahead of
                  industry trends and customer needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  Customer Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our customers' success is our success. We're committed to delivering measurable results and
                  exceptional support throughout their journey.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe in open communication and honest relationships with our customers, partners, and team
                  members.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-purple-600" />
                  Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We strive for excellence in everything we do, from product development to customer service and beyond.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-indigo-600" />
                  Collaboration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We work together as a team and with our customers to achieve shared goals and create mutual success.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  Integrity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We conduct business with the highest ethical standards and moral principles, building trust through
                  our actions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <CardContent className="py-16 px-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your AR Process?</h2>
              <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                Join hundreds of companies that have already revolutionized their accounts receivable operations with
                Kuhlekt's intelligent automation platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/demo"
                  className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-lg"
                >
                  Request Demo
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-lg"
                >
                  Contact Us
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
