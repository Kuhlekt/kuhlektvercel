import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Star, TrendingUp, Users, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-red-500 text-white mb-6 px-3 py-1">
                <Star className="w-4 h-4 mr-1" />
                Trusted by 500+ finance teams
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-cyan-500">Automate AR.</span><br />
                <span className="text-red-500">Get Paid Faster.</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                The #1 platform for B2B credit collections and AR automation. Eliminate manual processes, 
                streamline debt recovery, and improve cash flow.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/demo">
                  <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white">
                    Schedule a Demo <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-gray-300">
                  <span className="mr-2">▶</span> Watch Product Tour
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Free 14-day trial
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="/images/businesswoman.png"
                alt="Professional businesswoman using Kuhlekt AR automation platform"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
              
              {/* Testimonial Overlay */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg max-w-sm">
                <p className="text-gray-600 italic mb-3">
                  "Kuhlekt transformed our accounts receivable process. We reduced DSO by 30% and our team now spends 80% 
                  less time on manual collections. The ROI was immediate and substantial."
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/sarah-johnson-headshot.png"
                    alt="Maria Rodriguez"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-cyan-600">Maria Rodriguez</p>
                    <p className="text-sm text-gray-500">CFO at TechStream</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-2">80%</div>
              <div className="text-gray-600">Manual Tasks Eliminated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-2">30%</div>
              <div className="text-gray-600">DSO Reduction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-2">500+</div>
              <div className="text-gray-600">Finance Teams</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-cyan-500 mb-2">99%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-800 mb-4">Benefits</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Kuhlekt helps you:
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Improve Cash Flow</h3>
                <p className="text-gray-600">
                  Accelerate collections with automated follow-ups, payment reminders, and intelligent prioritization 
                  to get paid faster.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Reduce Manual Work</h3>
                <p className="text-gray-600">
                  Eliminate time-consuming manual tasks with automated workflows, smart routing, and AI-powered 
                  decision making.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Minimize Risk</h3>
                <p className="text-gray-600">
                  Proactively identify at-risk accounts with predictive analytics and take action before 
                  problems escalate.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Everything you need to automate AR
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From invoice processing to collections management, Kuhlekt provides a complete platform 
              for accounts receivable automation.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">AR Automation Platform</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Automated Invoice Processing</h4>
                    <p className="text-gray-600">
                      Streamline invoice creation, delivery, and tracking with intelligent automation that 
                      reduces errors and saves time.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Digital Collections</h4>
                    <p className="text-gray-600">
                      Engage customers through multiple channels with personalized communication strategies 
                      that improve payment rates.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h4>
                    <p className="text-gray-600">
                      Get deep insights into your AR performance with real-time dashboards and predictive 
                      analytics that drive better decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Image
                src="/images/ar-dashboard.png"
                alt="Kuhlekt AR Dashboard showing key metrics and analytics"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Trusted by finance teams worldwide
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Kuhlekt has revolutionized our collections process. We've seen a 40% improvement in collection rates 
                  and our team is much more efficient."
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/michael-chen-asian.png"
                    alt="Michael Chen"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Michael Chen</p>
                    <p className="text-sm text-gray-500">Finance Director, GlobalTech</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "The automation features have saved us countless hours. Our DSO has dropped significantly and 
                  cash flow has never been better."
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/jessica-rodriguez-hispanic.png"
                    alt="Jessica Rodriguez"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Jessica Rodriguez</p>
                    <p className="text-sm text-gray-500">CFO, InnovateCorp</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Implementation was smooth and the results were immediate. Kuhlekt has become an essential 
                  part of our financial operations."
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src="/images/sarah-johnson-headshot.png"
                    alt="Sarah Johnson"
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-500">Controller, TechSolutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to transform your AR process?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-3xl mx-auto">
            Join 500+ finance teams who trust Kuhlekt to automate their accounts receivable and get paid faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100">
                Schedule a Demo <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-cyan-600">
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
