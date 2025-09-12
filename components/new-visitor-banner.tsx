"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar } from "lucide-react"
import Link from "next/link"

export function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if it's September 2025
    const now = new Date()
    const currentMonth = now.getMonth() // 0-based, so September is 8
    const currentYear = now.getFullYear()

    if (currentMonth !== 8 || currentYear !== 2025) {
      return // Don't show banner outside of September 2025
    }

    // Check if banner was dismissed today
    const today = now.toDateString()
    const dismissedDate = localStorage.getItem("banner-dismissed-date")

    if (dismissedDate !== today) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    const today = new Date().toDateString()
    localStorage.setItem("banner-dismissed-date", today)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">SEPTEMBER ONLY</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-semibold">🎉 Free Setup for September - Limited Time Offer!</span>
          </div>
          <div className="sm:hidden">
            <span className="text-sm font-semibold">🎉 Free Setup for September!</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/demo">
            <Button variant="secondary" size="sm" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold">
              Schedule a Demo Now
            </Button>
          </Link>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="sm:hidden mt-2 text-center">
        <span className="text-sm">Transform your AR process with our automation platform</span>
      </div>
    </div>
  )
}
