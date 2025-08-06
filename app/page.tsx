"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  CheckCircle,
  Play,
  Shield,
  Users,
  Zap,
  BarChart3,
  Settings,
  Target,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

function TestimonialCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CFO",
      company: "TechCorp Inc.",
      image: "/images/sarah-johnson-headshot.png",
      quote:
        "Kuhlekt has transformed our accounts receivable process. We've reduced DSO by 30% and our team spends 80% less time on manual collections.",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Finance Director",
      company: "Global Manufacturing",
      image: "/images/michael-chen-asian.png",
      quote:
        "The automated workflows and customer portal have completely changed how we manage credit. Our customers love the transparency and we love the efficiency.",
    },
    {
      id: 3,
      name: "Jessica Rodriguez",
      role: "Controller",
      company: "InnovateTech Solutions",
      image: "/images/jessica-rodriguez-hispanic.png",
      quote:
        "Implementation was seamless and the ROI was immediate. We've improved our cash flow by 40% and reduced disputes by 60%. Kuhlekt is a game-changer.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative max-w-4xl mx-auto">
      <Card className="p-8 min-h-[300px] flex items-center">
        <CardContent className="p-0 w-full">
          <div className="flex items-center gap-1 justify-center mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>

          <blockquote className="text-lg text-gray-700 mb-8 italic min-h-[80px] flex items-center justify-center text-center">
            "{testimonials[currentSlide].quote}"
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image
                src={testimonials[currentSlide].image || "/placeholder.svg"}
                alt={`${testimonials[currentSlide].name} - ${testimonials[currentSlide].role}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  // Fallback to placeholder if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = `/placeholder.svg?height=64&width=64&text=${testimonials[
                    currentSlide
                  ].name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}`;
                }}
              />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">
                {testimonials[currentSlide].name}
              </div>
              <div className="text-sm text-gray-600">
                {testimonials[currentSlide].role}
              </div>
              <div className="text-sm text-gray-500">
                {testimonials[currentSlide].company}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5 text-gray-600" />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-cyan-500" : "bg-gray-300"
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge className="bg-red-500 text-white px-4 py-2 rounded-full">
              ⭐ Trusted by 500+ finance teams
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold">
                <span className="text-cyan-500">Automate AR.</span>
                <br />
                <span className="text-red-500">Get Paid Faster.</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-lg">
                The #1 platform for B2B credit collections and AR automation.
                Eliminate manual processes, streamline debt recovery, and
                improve cash flow.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/demo">
                <Button
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-8"
                >
                  Schedule a Demo →
                </Button>
              </Link>
              <Link
                href="https://www.youtube.com/watch?v=iVmvBRzQZDA"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Play className="w-4 h-4" />
                  Watch Product Tour
                </Button>
              </Link>
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
            {/* Main image - Businesswoman moved 25mm left with no background */}
            <div className="relative z-10 -ml-25">
              <Image
                src="/images/businesswoman.png"
                alt="Professional businesswoman"
                width={400}
                height={400}
                className="rounded-lg"
                priority
              />
            </div>

            {/* Testimonial Card */}
            <Card className="absolute top-4 right-4 w-80 bg-white shadow-lg z-20">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <blockquote className="text-sm text-gray-700 mb-4 italic">
                  "Kuhlekt transformed our accounts receivable process. We
                  reduced DSO by 30% and our team now spends 80% less time on
                  manual collections. The ROI was immediate and substantial."
                </blockquote>
                <div>
                  <div className="font-semibold text-cyan-600">
                    Maria Rodriguez
                  </div>
                  <div className="text-xs text-gray-500">CFO at TechStream</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
              80%
            </div>
            <div className="text-gray-600 font-medium">
              Manual Tasks Eliminated
            </div>
          </div>
          <div>
            <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
              30%
            </div>
            <div className="text-gray-600 font-medium">DSO Reduction</div>
          </div>
          <div>
            <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
              500+
            </div>
            <div className="text-gray-600 font-medium">Finance Teams</div>
          </div>
          <div>
            <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
              99%
            </div>
            <div className="text-gray-600 font-medium">
              Customer Satisfaction
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">
            Benefits
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Kuhlekt helps you:
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-600">
                Automate debt recovery
              </h3>
              <p className="text-gray-600">
                Reduce Days Sales Outstanding (DSO) with intelligent automation
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-600">
                Improve cash flow
              </h3>
              <p className="text-gray-600">
                Get real-time insights into your receivables and cash position
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-600">
                Streamline collections
              </h3>
              <p className="text-gray-600">
                Coordinate collection processes across teams with ease
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-600">
                Enhance credit control
              </h3>
              <p className="text-gray-600">
                Use built-in risk assessment tools to make better credit
                decisions
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-600">
                Empower customers
              </h3>
              <p className="text-gray-600">
                Provide a branded self-service credit portal for your customers
              </p>
            </CardContent>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-shadow bg-white">
            <CardContent className="p-0">
              <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-cyan-600">
                Eliminate manual work
              </h3>
              <p className="text-gray-600">
                Achieve end-to-end automation of your collections process
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
                  30%
                </div>
                <div className="text-gray-600 font-medium">
                  Average DSO Reduction
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
                  80%
                </div>
                <div className="text-gray-600 font-medium">
                  Manual Tasks Eliminated
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
                  40%
                </div>
                <div className="text-gray-600 font-medium">
                  Cash Flow Improvement
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-cyan-500 mb-2">
                  60%
                </div>
                <div className="text-gray-600 font-medium">
                  Dispute Resolution Time
                </div>
              </div>
            </div>

            {/* Replace the Card with the full dashboard image */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-jpSrZGOMhC4615WFkCejfhVOY8KFkd.png"
                alt="Kuhlekt Dashboard showing comprehensive AR metrics, KPIs, workload management, and real-time analytics"
                width={800}
                height={600}
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>

          <div className="text-center mt-16">
            <p className="text-lg text-gray-600">
              Everything you need to streamline your accounts receivable process
            </p>
          </div>
        </div>
      </section>

      {/* Customer Testimonials Carousel */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 mb-16">
            Hear from finance teams that have transformed their AR process with
            Kuhlekt
          </p>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">
              Comparison
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Why Choose Kuhlekt?
            </h2>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-4 font-semibold">Feature</th>
                      <th className="text-center p-4 font-semibold bg-cyan-500 text-white">
                        Kuhlekt
                      </th>
                      <th className="text-center p-4 font-semibold">
                        Traditional Software
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">
                        B2B Advanced Credit Collection Tools
                      </td>
                      <td className="p-4 text-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center text-gray-400">✗</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-4">
                        Invoice-to-Cash Advanced Automation
                      </td>
                      <td className="p-4 text-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center text-gray-400">✗</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">
                        Online Credit Applications Direct into ERP
                      </td>
                      <td className="p-4 text-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center text-gray-400">✗</td>
                    </tr>
                    <tr className="border-b bg-gray-50">
                      <td className="p-4">Receivables KPIs & Reporting</td>
                      <td className="p-4 text-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center text-gray-400">Limited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Dispute Management Automation</td>
                      <td className="p-4 text-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center text-gray-400">Manual</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="p-4">Credit Limit Management</td>
                      <td className="p-4 text-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 text-center text-gray-400">Manual</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* KPIs Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">
              Impact
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Improve KPIs Across the Board
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingDown className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Reduce DSO</h3>
                <p className="text-gray-600">
                  Automated reminders and tools help you get paid faster
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Improve AR Turnover
                </h3>
                <p className="text-gray-600">
                  Smart workflows optimize your collections process
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Enhance Productivity
                </h3>
                <p className="text-gray-600">
                  Streamline your team focus on high-value accounts
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Increase Cash Collection
                </h3>
                <p className="text-gray-600">
                  Boost your cash collection by 35-50%
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Slash Manual Tasks
                </h3>
                <p className="text-gray-600">
                  Eliminate up to 80% of manual work
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Reduce Credit Risk
                </h3>
                <p className="text-gray-600">
                  Built-in credit scoring and risk assessment
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-4">
              Use Cases
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Use Cases
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">
                  For Finance Teams
                </h3>
                <p className="text-gray-600 mb-6">
                  Automate credit control, dispute management, and payment
                  follow-up to free up your team.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                  <Settings className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">For Operations</h3>
                <p className="text-gray-600 mb-6">
                  Get a unified view of the entire receivables pipeline to
                  optimize your operations.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">For Executives</h3>
                <p className="text-gray-600 mb-6">
                  Improve visibility into cash flow and receivables KPIs for
                  better decision making.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
