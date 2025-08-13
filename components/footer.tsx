import Link from "next/link"
import Image from "next/image"
import { PrivacyModal } from "./privacy-modal"
import { TermsModal } from "./terms-modal"
import { CareersModal } from "./careers-modal"

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <Image className="h-7" src="/images/kuhlekt-logo.jpg" alt="Kuhlekt" width={120} height={28} />
            <p className="text-sm leading-6 text-gray-300">
              Revolutionizing accounts receivable management with AI-powered automation and intelligent insights.
            </p>
            <div className="flex space-x-6">{/* Social media icons can be added here */}</div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Solutions</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/solutions" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Credit Management
                    </Link>
                  </li>
                  <li>
                    <Link href="/solutions" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Debt Collection
                    </Link>
                  </li>
                  <li>
                    <Link href="/solutions" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Customer Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="/solutions" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Analytics & Reporting
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/about" className="text-sm leading-6 text-gray-300 hover:text-white">
                      About
                    </Link>
                  </li>
                  <li>
                    <CareersModal />
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Quick Links</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/product" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Product
                    </Link>
                  </li>
                  <li>
                    <Link href="/demo" className="text-sm leading-6 text-gray-300 hover:text-white">
                      Get Demo
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <PrivacyModal />
                  </li>
                  <li>
                    <TermsModal />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">&copy; 2024 Kuhlekt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
