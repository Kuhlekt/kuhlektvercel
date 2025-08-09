import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ContactForm from "@/components/contact-form"
import DemoForm from "@/components/demo-form"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Visitor Tracking System</h1>
          <div className="space-x-4">
            <Button asChild variant="outline">
              <Link href="#contact">Contact</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#demo">Demo</Link>
            </Button>
            <Button asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Platform</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience comprehensive visitor tracking and affiliate management. Get in touch or request a demo to see
            how we can help your business grow.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <section id="contact">
            <ContactForm />
          </section>

          <section id="demo">
            <DemoForm />
          </section>
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>System Features</CardTitle>
              <CardDescription>Comprehensive tracking and management capabilities</CardDescription>
            </CardHeader>
            <CardContent className="text-left">
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Complete visitor tracking with IP, country, and duration
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Form submissions with affiliate validation
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Comprehensive affiliate management system
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Real-time admin dashboard with all data
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Referential integrity between affiliates and submissions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
