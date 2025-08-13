import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Facebook, Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { CareersModal } from "./careers-modal"
import { PrivacyModal } from "./privacy-modal"
import { TermsModal } from "./terms-modal"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/images/kuhlekt-logo.jpg"
                alt="Kuhlekt Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-xl font-bold text-white">Kuhlekt</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Transform your accounts receivable with intelligent automation. Reduce DSO, improve cash flow, and
              streamline collections.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about" className="text-sm hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/solutions" className="text-sm hover:text-white transition-colors">
                Solutions
              </Link>
              <Link href="/product" className="text-sm hover:text-white transition-colors">
                Product
              </Link>
              <Link href="/pricing-table" className="text-sm hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/help" className="text-sm hover:text-white transition-colors">
                Help Center
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-sm">info@kuhlekt.com</p>
                  <p className="text-xs text-gray-400">General inquiries</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-sm">+1 (555) 123-4567</p>
                  <p className="text-xs text-gray-400">Mon-Fri, 9 AM - 6 PM EST</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-sm">123 Business Ave, Suite 100</p>
                  <p className="text-xs text-gray-400">New York, NY 10001</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
            <p className="text-sm text-gray-400">Get the latest updates on AR best practices and product news.</p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700">Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-sm text-gray-400">
              © {currentYear} Kuhlekt, Inc. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <PrivacyModal />
              <TermsModal />
              <CareersModal />
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Made with ❤️ for finance teams</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
