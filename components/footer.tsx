"use client"

import Link from "next/link"
import { useState } from "react"
import { PrivacyModal } from "./privacy-modal"
import { TermsModal } from "./terms-modal"
import { CareersModal } from "./careers-modal"

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [showCareers, setShowCareers] = useState(false)

  return (
    <>
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <img src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" className="h-8 w-auto mr-3" />
                <span className="text-xl font-bold">Kuhlekt</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                Revolutionizing accounts receivable with AI-powered automation. Reduce DSO, improve cash flow, and
                streamline your collections process.
              </p>
              <div className="text-sm text-gray-400">
                <p>© 2024 Kuhlekt. All rights reserved.</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/product" className="text-gray-300 hover:text-white transition-colors">
                    Product
                  </Link>
                </li>
                <li>
                  <Link href="/solutions" className="text-gray-300 hover:text-white transition-colors">
                    Solutions
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/demo" className="hover:text-white transition-colors">
                    Request Demo
                  </Link>
                </li>
                <li>
                  <a href="mailto:info@kuhlekt.com" className="hover:text-white transition-colors">
                    info@kuhlekt.com
                  </a>
                </li>
                <li>
                  <a href="tel:+15551234567" className="hover:text-white transition-colors">
                    +1 (555) 123-4567
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <div className="flex space-x-6 text-sm text-gray-400">
              <button onClick={() => setShowPrivacy(true)} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => setShowTerms(true)} className="hover:text-white transition-colors">
                Terms of Service
              </button>
              <button onClick={() => setShowCareers(true)} className="hover:text-white transition-colors">
                Careers
              </button>
            </div>
            <div className="mt-4 sm:mt-0 text-sm text-gray-400">Made with ❤️ for better business</div>
          </div>
        </div>
      </footer>

      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <CareersModal isOpen={showCareers} onClose={() => setShowCareers(false)} />
    </>
  )
}

export default Footer
