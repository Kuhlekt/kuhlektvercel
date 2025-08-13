import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, TrendingUp } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function AboutPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">About Kuhlekt</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing accounts receivable management with AI-powered automation that helps businesses
              accelerate cash flow and reduce manual processes.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-12">
                To empower finance teams with intelligent automation tools that transform accounts receivable from a
                manual, time-consuming process into a strategic advantage for business growth.
              </p>

              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <img
                    src="/images/v200-businesswoman-hero.png"
                    alt="Professional businesswoman"
                    className="rounded-lg shadow-lg"
                  />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-semibold mb-6">Built for Modern Finance Teams</h3>
                  <p className="text-gray-600 mb-6">
                    Kuhlekt was founded by finance professionals who experienced firsthand the challenges of managing
                    accounts receivable in growing businesses. We understand the pain points of manual processes,
                    delayed payments, and the constant struggle to maintain healthy cash flow.
                  </p>
                  <p className="text-gray-600">
                    Our platform combines industry expertise with cutting-edge technology to deliver solutions that not
                    only solve today's problems but scale with your business as it grows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                These core principles guide everything we do and shape how we build solutions for our clients.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Users className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Customer-Centric</h3>
                  <p className="text-gray-600">
                    Every feature we build starts with understanding our customers' real-world challenges and needs.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Target className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Results-Driven</h3>
                  <p className="text-gray-600">
                    We measure success by the tangible improvements our clients see in their cash flow and efficiency.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <Award className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                  <p className="text-gray-600">
                    We're committed to delivering the highest quality solutions with attention to every detail.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <TrendingUp className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                  <p className="text-gray-600">
                    We continuously evolve our platform with the latest technology to stay ahead of industry needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet the experienced professionals leading Kuhlekt's mission to transform accounts receivable
                management.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <img
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson, CEO"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
                  <p className="text-cyan-600 font-medium mb-3">CEO & Co-Founder</p>
                  <p className="text-gray-600 text-sm">
                    Former CFO with 15+ years in finance operations. Led AR transformation at three high-growth SaaS
                    companies.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <img
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen, CTO"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
                  <p className="text-cyan-600 font-medium mb-3">CTO & Co-Founder</p>
                  <p className="text-gray-600 text-sm">
                    Former engineering leader at fintech unicorns. Expert in building scalable financial automation
                    platforms.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 text-center">
                <CardContent className="p-0">
                  <img
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez, VP of Customer Success"
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold mb-2">Jessica Rodriguez</h3>
                  <p className="text-cyan-600 font-medium mb-3">VP of Customer Success</p>
                  <p className="text-gray-600 text-sm">
                    Customer success expert with deep expertise in finance operations and change management in
                    enterprise environments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-cyan-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your AR Process?</h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of finance teams who have already accelerated their cash flow with Kuhlekt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/demo"
                className="bg-white text-cyan-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Schedule Demo
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-cyan-600 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
