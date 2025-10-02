"use client"

import { useState, useEffect } from "react"
import { X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkBannerVisibility = () => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() // 0-based (0 = January, 8 = September)

      // Only show during September 2025
      if (currentYear !== 2025 || currentMonth !== 8) {
        setIsLoading(false)
        return
      }

      // Check if banner was dismissed today
      const today = now.toDateString()
      const dismissedDate = localStorage.getItem("banner-dismissed-date")

      if (dismissedDate !== today) {
        setIsVisible(true)
      }

      setIsLoading(false)
    }

    checkBannerVisibility()
  }, [])

  const handleClose = () => {
    const today = new Date().toDateString()
    localStorage.setItem("banner-dismissed-date", today)
    setIsVisible(false)
  }

  if (isLoading || !isVisible) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span className="font-semibold">Free Setup for September!</span>
          </div>
          <div className="hidden md:block">
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">SEPTEMBER ONLY</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
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
      <div className="md:hidden mt-2 text-center">
        <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">SEPTEMBER ONLY</span>
      </div>
    </div>
  )
}
