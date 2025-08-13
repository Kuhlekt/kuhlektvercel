"use client"

import Link from "next/link"
import { useState } from "react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              Kuhlekt
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/product" className="text-gray-700 hover:text-blue-600 transition-colors">
              Product
            </Link>
            <Link href="/solutions" className="text-gray-700 hover:text-blue-600 transition-colors">
              Solutions
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/demo"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Request Demo
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="sr-only">Open menu</span>
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-gray-600 mt-1 transition-all ${isMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}
              ></span>
            </div>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link href="/product" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Product
              </Link>
              <Link href="/solutions" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Solutions
              </Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                About
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Contact
              </Link>
              <Link href="/demo" className="block px-3 py-2 bg-blue-600 text-white rounded-md">
                Request Demo
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
