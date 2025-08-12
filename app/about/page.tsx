import { CheckCircle, Users, TrendingUp, Clock, Shield, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">About Kuhlekt</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're revolutionizing accounts receivable management with intelligent automation that helps finance teams
              collect payments faster and reduce manual work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
                <Link href="/demo">Schedule a Demo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Kuhlekt, we believe that managing accounts receivable shouldn't be a constant source of stress for
                finance teams. Our mission is to eliminate the manual, time-consuming tasks that prevent finance
                professionals from focusing on strategic initiatives.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We've built an intelligent AR automation platform that learns from your business patterns, automates
                routine tasks, and provides actionable insights to help you get paid faster.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-teal-500" />
                  <span className="text-gray-700">Reduce DSO by up to 30%</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-teal-500" />
                  <span className="text-gray-700">Eliminate 80% of manual AR tasks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-teal-500" />
                  <span className="text-gray-700">Improve cash flow predictability</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/ar-dashboard.png"
                alt="Kuhlekt AR Dashboard"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Finance Teams Worldwide</h2>
            <p className="text-lg text-gray-600">
              Our platform has helped hundreds of companies streamline their AR processes
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">500+</div>
              <div className="text-gray-600">Companies Using Kuhlekt</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">$2.5B+</div>
              <div className="text-gray-600">AR Managed Annually</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">30%</div>
              <div className="text-gray-600">Average DSO Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">80%</div>
              <div className="text-gray-600">Reduction in Manual Tasks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer-Centric</h3>
                <p className="text-gray-600">
                  Every feature we build is designed with our customers' success in mind. We listen, learn, and iterate
                  based on real user feedback.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Innovation</h3>
                <p className="text-gray-600">
                  We're constantly pushing the boundaries of what's possible in AR automation, leveraging the latest
                  technologies to solve complex problems.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Security</h3>
                <p className="text-gray-600">
                  Your financial data is sacred. We maintain the highest security standards and compliance
                  certifications to protect your information.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Efficiency</h3>
                <p className="text-gray-600">
                  Time is money. Our platform is designed to maximize efficiency and minimize the time spent on routine
                  AR tasks.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in everything we do, from product development to customer support and beyond.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
                <p className="text-gray-600">
                  We believe in open communication and transparency with our customers, partners, and team members.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600">Meet the experienced professionals leading Kuhlekt's mission</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/images/sarah-johnson-headshot.png"
                  alt="Sarah Johnson"
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Sarah Johnson</h3>
                <p className="text-teal-600 mb-3">CEO & Co-Founder</p>
                <p className="text-gray-600 text-sm">
                  Former VP of Finance at TechCorp with 15+ years of experience in financial operations and AR
                  management.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/images/michael-chen-asian.png"
                  alt="Michael Chen"
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Michael Chen</h3>
                <p className="text-teal-600 mb-3">CTO & Co-Founder</p>
                <p className="text-gray-600 text-sm">
                  Former Principal Engineer at DataFlow with expertise in AI/ML and financial technology platforms.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Image
                  src="/images/jessica-rodriguez-hispanic.png"
                  alt="Jessica Rodriguez"
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Jessica Rodriguez</h3>
                <p className="text-teal-600 mb-3">VP of Customer Success</p>
                <p className="text-gray-600 text-sm">
                  Customer success leader with 12+ years helping finance teams optimize their processes and achieve
                  their goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your AR Process?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Join hundreds of finance teams who have already streamlined their accounts receivable with Kuhlekt's
            intelligent automation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/demo">Schedule a Demo</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-teal-600 bg-transparent"
            >
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
