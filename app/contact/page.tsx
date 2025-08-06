"use client";

import { useActionState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactForm } from "./actions";

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(
    submitContactForm,
    null
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section
        id="top"
        className="bg-gradient-to-br from-slate-50 to-blue-50 py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full mb-6">
            Get in Touch
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-gray-900">Let's Talk About</span>
            <br />
            <span className="text-cyan-500">Your AR Challenges</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Ready to transform your accounts receivable process? Our team is
            here to help you get started and answer any questions you might
            have.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Send us a message
              </h2>
              <Card className="p-8">
                <CardContent className="p-0">
                  {/* Success/Error Message */}
                  {state && (
                    <div
                      className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                        state.success
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      {state.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <p
                        className={`text-sm ${
                          state.success ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {state.message}
                      </p>
                    </div>
                  )}

                  <form action={formAction} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="John"
                          className="mt-1"
                          required
                          disabled={isPending}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          className="mt-1"
                          required
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@company.com"
                        className="mt-1"
                        required
                        disabled={isPending}
                      />
                    </div>

                    <div>
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Your Company"
                        className="mt-1"
                        required
                        disabled={isPending}
                      />
                    </div>

                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select name="role" disabled={isPending}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cfo">CFO</SelectItem>
                          <SelectItem value="controller">Controller</SelectItem>
                          <SelectItem value="ar-manager">AR Manager</SelectItem>
                          <SelectItem value="finance-director">
                            Finance Director
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="company-size">Company Size</Label>
                      <Select name="companySize" disabled={isPending}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">1-10 employees</SelectItem>
                          <SelectItem value="11-50">11-50 employees</SelectItem>
                          <SelectItem value="51-200">
                            51-200 employees
                          </SelectItem>
                          <SelectItem value="201-1000">
                            201-1000 employees
                          </SelectItem>
                          <SelectItem value="1000+">1000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your AR challenges and how we can help..."
                        className="mt-1 min-h-[120px]"
                        required
                        disabled={isPending}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isPending}
                    >
                      {isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Get in touch
              </h2>

              <div className="space-y-8">
                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Offices</h3>
                        <p className="text-gray-600">
                          Houston, TX, United States
                          <br />
                          <br />
                          Hope Island, QLD, Australia
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Phone</h3>
                        <p className="text-gray-600">+1832 888 8575</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Email</h3>
                        <p className="text-gray-600">
                          Sales: enquiries@kuhlekt.com
                          <br />
                          Support: support@kuhlekt.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mt-12 space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Prefer to talk?
                </h3>
                <Button
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white w-full"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-lg mb-3">
                  How quickly can we get started?
                </h3>
                <p className="text-gray-600">
                  Most customers are up and running within 1-2 weeks. Our
                  implementation team will work with you and we answer any
                  questions to ensure a smooth transition.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-lg mb-3">
                  Do you integrate with our ERP?
                </h3>
                <p className="text-gray-600">
                  Yes! We integrate with all major ERP systems including SAP,
                  Oracle, NetSuite, QuickBooks, and many others.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-lg mb-3">
                  What kind of support do you provide?
                </h3>
                <p className="text-gray-600">
                  We offer 24/7 support via phone, email, and chat. Plus
                  dedicated customer success managers for enterprise customers.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6">
              <CardContent className="p-0">
                <h3 className="font-semibold text-lg mb-3">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  Yes! We offer a 14-day free trial with full access to all
                  features. No credit card required to get started.
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
