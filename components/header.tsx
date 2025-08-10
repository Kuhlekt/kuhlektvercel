"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kuhlekt%20transparent%20b_ground%20with%20TM%20medium%20400%20Pxls%20-%20Copy-NQUjz8mdwGIo3E40fzD7DhXQzE0leS.png"
                alt="Kuhlekt Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation - exact spacing and styling */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium text-sm">
              Home
            </Link>
            <Link href="/product" className="text-gray-700 hover:text-gray-900 font-medium text-sm">
              Product
            </Link>
            <Link href="/solutions" className="text-gray-700 hover:text-gray-900 font-medium text-sm">
              Solutions
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium text-sm">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium text-sm">
              Contact
            </Link>
          </nav>

          <div className="flex items-center">
            {/* Desktop Demo Button - exact cyan color */}
            <Link href="/demo" className="hidden md:block">
              <Button className="bg-cyan-400 hover:bg-cyan-500 text-white text-sm font-medium px-6 py-2">
                Schedule a Demo
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-50">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              href="/product"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={closeMobileMenu}
            >
              Product
            </Link>
            <Link
              href="/solutions"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={closeMobileMenu}
            >
              Solutions
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>

            {/* Mobile Demo Button */}
            <div className="pt-4 border-t border-gray-200">
              <Link href="/demo" onClick={closeMobileMenu}>
                <Button className="w-full bg-cyan-400 hover:bg-cyan-500 text-white">Schedule a Demo</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
