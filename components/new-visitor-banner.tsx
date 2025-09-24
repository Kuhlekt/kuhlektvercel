"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar } from "lucide-react"
import Link from "next/link"

export default function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkBannerVisibility = () => {
      const now = new Date()
      const currentMonth = now.getMonth() + 1 // getMonth() returns 0-11
      const currentYear = now.getFullYear()

      // Only show during September 2025
      if (currentMonth !== 9 || currentYear !== 2025) {
        setIsLoading(false)
        return
      }

      // Check if banner was dismissed today
      const dismissedDate = localStorage.getItem("september-banner-dismissed")
      const today = now.toDateString()

      if (dismissedDate !== today) {
        setIsVisible(true)
      }

      setIsLoading(false)
    }

    checkBannerVisibility()
  }, [])

  const handleClose = () => {
    const today = new Date().toDateString()
    localStorage.setItem("september-banner-dismissed", today)
    setIsVisible(false)
  }

  if (isLoading || !isVisible) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold">SEPTEMBER ONLY</span>
          </div>

          <div className="hidden sm:block">
            <span className="text-lg font-semibold">🎉 Free Setup for September - Limited Time Offer!</span>
          </div>

          <div className="sm:hidden">
            <span className="text-sm font-semibold">🎉 Free Setup for September!</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            asChild
            variant="secondary"
            size="sm"
            className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold"
          >
            <Link href="/demo">Schedule a Demo Now</Link>
          </Button>

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
        <Button
          asChild
          variant="secondary"
          size="sm"
          className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold w-full"
        >
          <Link href="/demo">Schedule a Demo Now</Link>
        </Button>
      </div>
    </div>
  )
}
