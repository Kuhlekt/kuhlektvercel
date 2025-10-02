"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle, Building2, FileText, Mail, Globe, Phone, MessageSquare } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export function HelpGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <HelpCircle className="h-4 w-4" />
          Help Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Kuhlekt Help Center</DialogTitle>
          <DialogDescription>
            Everything you need to know about Kuhlekt and how we can help your business
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh] pr-4">
          <div className="space-y-6">
            {/* About Kuhlekt */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">About Kuhlekt</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kuhlekt is an intelligent invoice-to-cash automation platform that helps businesses accelerate cash
                flow, reduce collection costs, and improve customer relationships. Our platform combines automation,
                analytics, and AI to transform your accounts receivable process.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">🚀 Faster Collections</h4>
                  <p className="text-xs text-muted-foreground">
                    Reduce Days Sales Outstanding (DSO) by 30-50% with automated reminders, payment links, and
                    intelligent follow-ups.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">💰 Improved Cash Flow</h4>
                  <p className="text-xs text-muted-foreground">
                    Release working capital tied up in receivables and reduce borrowing costs or increase investment
                    returns.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">⚡ Reduced Costs</h4>
                  <p className="text-xs text-muted-foreground">
                    Save 20-40% on collection labour costs through automation and streamlined workflows.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">📊 Better Insights</h4>
                  <p className="text-xs text-muted-foreground">
                    Real-time dashboards and analytics help you make data-driven decisions about credit and collections.
                  </p>
                </div>
              </div>
            </section>

            {/* Using the Website */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Using This Website</h3>
              </div>
              <div className="space-y-4">
                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">Navigation</h4>
                  <p className="text-sm text-muted-foreground">
                    Use the main navigation menu to explore different sections: Home, Features, Pricing, ROI Calculator,
                    Case Studies, and Contact. The menu is accessible from any page.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">ROI Calculator</h4>
                  <p className="text-sm text-muted-foreground">
                    Our ROI Calculator helps you estimate the financial impact of implementing Kuhlekt. Click the help
                    icon within the calculator for detailed guidance on inputs, calculations, and how to interpret your
                    results.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">Case Studies</h4>
                  <p className="text-sm text-muted-foreground">
                    Read real-world success stories from businesses that have transformed their collections process with
                    Kuhlekt. Filter by industry, company size, or specific challenges.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">Contact & Demo</h4>
                  <p className="text-sm text-muted-foreground">
                    Request a personalized demo, schedule a consultation, or get in touch with our team through the
                    Contact page. We typically respond within 24 hours.
                  </p>
                </div>
              </div>
            </section>

            {/* Resources */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Resources & Documentation</h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="border rounded-lg p-3 hover:border-cyan-600 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-sm mb-1">Product Documentation</h4>
                  <p className="text-xs text-muted-foreground">
                    Detailed guides on features, integrations, and best practices for using Kuhlekt.
                  </p>
                </div>
                <div className="border rounded-lg p-3 hover:border-cyan-600 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-sm mb-1">Video Tutorials</h4>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step video guides covering setup, configuration, and advanced features.
                  </p>
                </div>
                <div className="border rounded-lg p-3 hover:border-cyan-600 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-sm mb-1">Blog & Insights</h4>
                  <p className="text-xs text-muted-foreground">
                    Industry insights, best practices, and tips for optimizing your collections process.
                  </p>
                </div>
                <div className="border rounded-lg p-3 hover:border-cyan-600 transition-colors cursor-pointer">
                  <h4 className="font-semibold text-sm mb-1">Webinars & Events</h4>
                  <p className="text-xs text-muted-foreground">
                    Join live sessions with our experts and learn from other Kuhlekt users.
                  </p>
                </div>
              </div>
            </section>

            {/* Common Questions */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-cyan-600" />
                <h3 className="text-lg font-semibold">Common Questions</h3>
              </div>
              <div className="space-y-3">
                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">How long does implementation take?</h4>
                  <p className="text-sm text-muted-foreground">
                    Most implementations are completed within 2-4 weeks, including data migration, system configuration,
                    and team training. We provide dedicated support throughout the process.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">What systems does Kuhlekt integrate with?</h4>
                  <p className="text-sm text-muted-foreground">
                    Kuhlekt integrates with major accounting systems (QuickBooks, Xero, Sage, NetSuite), ERPs, and
                    payment gateways. We also offer API access for custom integrations.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">Is my data secure?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes. We use bank-level encryption, comply with SOC 2 Type II standards, and maintain strict data
                    privacy policies. Your data is stored securely and never shared with third parties.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">What kind of support do you offer?</h4>
                  <p className="text-sm text-muted-foreground">
                    We provide email support, live chat, phone support, and a comprehensive knowledge base. Premium
                    plans include dedicated account managers and priority support.
                  </p>
                </div>

                <div className="border-l-4 border-cyan-600 pl-4 py-2">
                  <h4 className="font-semibold text-sm mb-1">Can I try Kuhlekt before committing?</h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! We offer a 30-day free trial with full access to all features. No credit card required.
                    Schedule a demo to see the platform in action with your own data.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Mail className="h-5 w-5 text-cyan-600" />
                Get in Touch
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Our team is here to answer your questions, provide personalized demos, and help you get started with
                Kuhlekt.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-cyan-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <a href="mailto:enquiries@kuhlekt.com" className="text-sm text-cyan-600 hover:underline">
                      enquiries@kuhlekt.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-cyan-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Website</p>
                    <a
                      href="https://kuhlekt.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-600 hover:underline"
                    >
                      kuhlekt.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-cyan-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Phone</p>
                    <p className="text-sm text-muted-foreground">Available during business hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-cyan-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri, 9am-5pm</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-cyan-200 dark:border-cyan-800">
                <p className="text-sm text-muted-foreground">
                  <strong>Response Time:</strong> We typically respond to all inquiries within 24 hours during business
                  days.
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
