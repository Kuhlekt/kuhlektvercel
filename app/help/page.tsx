import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone } from "lucide-react"
import { VisitorTracker } from "@/components/visitor-tracker"

export default function HelpPage() {
  return (
    <>
      <Suspense fallback={null}>
        <VisitorTracker />
      </Suspense>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="outline" className="mb-4">
              Help Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Can We Help You?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Get the support you need to make the most of Kuhlekt's accounts receivable platform
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>Speak directly with our support team</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-gray-900 mb-2">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-600 mb-4">Monday - Friday, 9 AM - 6 PM EST</p>
                  <Button variant="outline" className="w-full bg-transparent">
                    Call Now
                  </Button>
                \
