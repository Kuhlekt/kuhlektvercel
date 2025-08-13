import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                We Help Finance Teams Get Paid Faster, With Less Stress
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Kuhlekt transforms accounts receivable management with intelligent automation, helping businesses reduce
                DSO and improve cash flow while maintaining strong customer relationships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors">
                  Learn More
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/v200-businesswoman-hero.png"
                alt="Professional businesswoman representing finance team success"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                src="/images/manual-vs-automated-ar.png"
                alt="Comparison between manual and automated accounts receivable processes"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that managing accounts receivable shouldn't be a source of stress for finance teams. Our
                mission is to eliminate the manual, time-consuming tasks that prevent finance professionals from
                focusing on strategic initiatives.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Reduce manual work through intelligent automation</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Improve cash flow with faster payment collection</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
                  <p className="text-gray-700">Maintain positive customer relationships</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Beliefs Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Beliefs</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do at Kuhlekt
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <CheckCircle className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automation First</h3>
              <p className="text-gray-600">
                Technology should handle repetitive tasks, freeing humans to focus on relationship building and
                strategic decisions.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <CheckCircle className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer-Centric</h3>
              <p className="text-gray-600">
                Every collection interaction should strengthen, not strain, the relationship between businesses and
                their customers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <CheckCircle className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data-Driven</h3>
              <p className="text-gray-600">
                Intelligent insights from data should inform every decision, from payment predictions to collection
                strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="space-y-6 text-lg text-gray-600">
            <p>
              Kuhlekt was founded by finance professionals who experienced firsthand the frustrations of manual accounts
              receivable management. Spending countless hours on repetitive tasks, chasing payments, and managing
              spreadsheets, they knew there had to be a better way.
            </p>
            <p>
              After years of working with enterprise finance teams, we discovered that the biggest challenge wasn't just
              collecting payments—it was doing so efficiently while maintaining positive customer relationships.
              Traditional AR solutions were either too complex for mid-market companies or too simplistic for growing
              businesses.
            </p>
            <p>
              Today, Kuhlekt serves finance teams across industries, helping them reduce DSO by up to 30% while
              improving customer satisfaction. We're proud to be the AR automation platform that grows with your
              business, from startup to enterprise.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              Finance and technology experts dedicated to transforming AR management
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <Image
                src="/images/sarah-johnson-headshot.png"
                alt="Sarah Johnson, CEO"
                width={200}
                height={200}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sarah Johnson</h3>
              <p className="text-teal-600 font-medium mb-3">CEO & Co-Founder</p>
              <p className="text-gray-600">
                Former CFO with 15+ years in finance operations, passionate about eliminating manual AR processes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <Image
                src="/images/michael-chen-asian.png"
                alt="Michael Chen, CTO"
                width={200}
                height={200}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
              <p className="text-teal-600 font-medium mb-3">CTO & Co-Founder</p>
              <p className="text-gray-600">
                Technology leader specializing in AI and automation, with expertise in financial software systems.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <Image
                src="/images/jessica-rodriguez-hispanic.png"
                alt="Jessica Rodriguez, VP of Customer Success"
                width={200}
                height={200}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Jessica Rodriguez</h3>
              <p className="text-teal-600 font-medium mb-3">VP of Customer Success</p>
              <p className="text-gray-600">
                Customer success expert focused on helping finance teams achieve their AR automation goals.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
