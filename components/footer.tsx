"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { CareersModal } from "./careers-modal"
import { PrivacyModal } from "./privacy-modal"
import { TermsModal } from "./terms-modal"

export function Footer() {
  const [isCareersModalOpen, setIsCareersModalOpen] = useState(false)
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const openCareersModal = () => setIsCareersModalOpen(true)
  const closeCareersModal = () => setIsCareersModalOpen(false)

  const openPrivacyModal = () => setIsPrivacyModalOpen(true)
  const closePrivacyModal = () => setIsPrivacyModalOpen(false)

  const openTermsModal = () => setIsTermsModalOpen(true)
  const closeTermsModal = () => setIsTermsModalOpen(false)

  return (
    <footer>
      {/* CTA Section */}
      <section className="bg-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to transform your accounts receivable process?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Schedule a demo to see how Kuhlekt can help your finance team get paid faster with our advanced AR
            Automation and Digital Collections solutions.
          </p>
          <Link href="/demo#top">
            <Button size="lg" className="bg-cyan-500 text-white hover:bg-cyan-600">
              Schedule a Demo →
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Links */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Tagline */}
            <div className="space-y-4">
              <Link href="/" className="inline-block">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20400%20Pxls%20-%20Copy-NQUjz8mdwGIo3E40fzD7DhXQzE0leS.png"
                  alt="Kuhlekt Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              </Link>
              <p className="text-gray-600">We help finance teams get paid faster, with less stress.</p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Product</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/product#ar-automation" className="hover:text-gray-900">
                    AR Automation
                  </Link>
                </li>
                <li>
                  <Link href="/product#digital-collections" className="hover:text-gray-900">
                    Digital Collections
                  </Link>
                </li>
                <li>
                  <Link href="/product#credit-portal" className="hover:text-gray-900">
                    Credit Portal
                  </Link>
                </li>
                <li>
                  <Link href="/product#dispute-management" className="hover:text-gray-900">
                    Dispute Management
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Solutions</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/solutions#sme-credit-management" className="hover:text-gray-900">
                    SME Credit Management
                  </Link>
                </li>
                <li>
                  <Link href="/solutions#enterprise-receivables" className="hover:text-gray-900">
                    Enterprise Receivables
                  </Link>
                </li>
                <li>
                  <Link href="/solutions#corporate-debt-collection" className="hover:text-gray-900">
                    Corporate Debt Collection
                  </Link>
                </li>
                <li>
                  <Link href="/solutions#credit-control-software" className="hover:text-gray-900">
                    Credit Control Software
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-900">Company</h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <Link href="/about#top" className="hover:text-gray-900 text-left">
                    About
                  </Link>
                </li>
                <li>
                  <button onClick={openCareersModal} className="hover:text-gray-900 text-left">
                    Careers
                  </button>
                </li>
                <li>
                  <Link href="/contact#top" className="hover:text-gray-900 text-left">
                    Contact
                  </Link>
                </li>
                <li>
                  <button onClick={openTermsModal} className="hover:text-gray-900 text-left">
                    Terms of Trade
                  </button>
                </li>
                <li>
                  <button onClick={openPrivacyModal} className="hover:text-gray-900 text-left">
                    Privacy and Security Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">© 2025 Kuhlekt. All rights reserved.</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <Link href="/product" className="hover:text-gray-700">
                  Accounts Receivable Software
                </Link>
                <span>|</span>
                <Link href="/solutions" className="hover:text-gray-700">
                  Credit Management Tools
                </Link>
                <span>|</span>
                <Link href="/product" className="hover:text-gray-700">
                  Digital Collections Platform
                </Link>
                <span>|</span>
                <Link href="/solutions" className="hover:text-gray-700">
                  Invoice to Cash Solutions
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CareersModal isOpen={isCareersModalOpen} onClose={closeCareersModal} />
      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={closePrivacyModal} />
      <TermsModal isOpen={isTermsModalOpen} onClose={closeTermsModal} />
    </footer>
  )
}

// Export as default as well to support both import styles
export default Footer
