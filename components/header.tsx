"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X } from 'lucide-react'
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Product", href: "/product" },
  { name: "Solutions", href: "/solutions" },
  { name: "About", href: "/about" },
  { name: "Help", href: "/help" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/images/kuhlekt-logo.jpg"
                alt="Kuhlekt Logo"
                width={32}
                height={32}
                className="rounded"
                priority
              />
              <span className="text-xl font-bold text-gray-900">Kuhlekt</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
            <Button asChild>
              <Link href="/demo">Get Demo</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Image
                    src="/images/kuhlekt-logo.jpg"
                    alt="Kuhlekt Logo"
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <span>Kuhlekt</span>
                </SheetTitle>
                <SheetDescription>
                  Transform your accounts receivable with intelligent automation
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center py-2 text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="grid gap-2">
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/contact" onClick={() => setIsOpen(false)}>
                        Contact
                      </Link>
                    </Button>
                    <Button className="justify-start" asChild>
                      <Link href="/demo" onClick={() => setIsOpen(false)}>
                        Get Demo
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
