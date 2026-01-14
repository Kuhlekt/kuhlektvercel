"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/design-mode/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20400%20Pxls%20-%20Copy.png"
              alt="Kuhlekt Logo"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          <nav className="hidden md:flex space-x-8" aria-label="Main navigation">
            <Link href="/" className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200">
              Home
            </Link>
            <Link
              href="/product"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Product
            </Link>
            <Link
              href="/solutions"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Solutions
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/pricing-table"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-cyan-600 font-medium transition-colors duration-200"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex">
            <Link href="/demo">
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-2 transition-colors duration-200">
                Schedule a Demo
              </Button>
            </Link>
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-cyan-600 hover:bg-gray-100 transition-colors duration-200"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden py-4 border-t border-gray-200 bg-white"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/product"
                className="text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Product
              </Link>
              <Link
                href="/solutions"
                className="text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/pricing-table"
                className="text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-cyan-600 font-medium py-2 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link href="/demo" onClick={() => setIsMenuOpen(false)}>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white w-full font-medium py-2 transition-colors duration-200">
                  Schedule a Demo
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
