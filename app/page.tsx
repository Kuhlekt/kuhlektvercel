"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle, TrendingUp, Users, BarChart3, Clock, DollarSign, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ROICalculatorModal } from "@/components/roi-calculator-modal"

export default function HomePage() {
  const [isROIModalOpen, setIsROIModalOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Transform Your Invoice-to-Cash Process
                </h1>
                <p className="text-xl text-muted-foreground">
                  Automate collections, reduce DSO, and improve cash flow with Kuhlekt's AI-powered platform
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/demo">
                    Request a Demo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" onClick={() => setIsROIModalOpen(true)}>
                  Calculate Your ROI
                </Button>
              </div>
              <div className="flex gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Free 30-day trial</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/kuhlekt-dashboard-interface.png"
                alt="Kuhlekt Dashboard"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <div className="text-3xl font-bold">25%</div>
                <div className="text-sm text-muted-foreground">Average DSO Reduction</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <div className="text-3xl font-bold">30%</div>
                <div className="text-sm text-muted-foreground">Labour Cost Savings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <div className="text-3xl font-bold">50%</div>
                <div className="text-sm text-muted-foreground">Faster Collections</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">
              Everything You Need to Optimize Collections
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to streamline your accounts receivable process
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
                <p className="text-muted-foreground">
                  Track DSO, aging reports, and collection performance with live dashboards
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Customer Portal</h3>
                <p className="text-muted-foreground">
                  Enable customers to view invoices, make payments, and manage their account
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Automated Workflows</h3>
                <p className="text-muted-foreground">
                  Set up smart reminders and escalation paths for overdue invoices
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join hundreds of businesses already improving their cash flow with Kuhlekt
          </p>
          <div className="flex flex-col gap-3 sm:flex-row justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/demo">Request a Demo</Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => setIsROIModalOpen(true)} className="bg-transparent">
              Calculate Your ROI
            </Button>
          </div>
        </div>
      </section>

      {/* ROI Calculator Modal */}
      <ROICalculatorModal isOpen={isROIModalOpen} onClose={() => setIsROIModalOpen(false)} />
    </div>
  )
}
