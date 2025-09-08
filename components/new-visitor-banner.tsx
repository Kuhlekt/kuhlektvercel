"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if we're still in September 2025
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() // 0-based, so September is 8
    const currentYear = currentDate.getFullYear()

    // Only show banner during September 2025
    if (currentMonth !== 8 || currentYear !== 2025) {
      return
    }

    // Check if banner was already dismissed for today
    const today = currentDate.toDateString()
    const bannerDismissedToday = localStorage.getItem("kuhlekt_banner_dismissed_date")

    if (bannerDismissedToday === today) {
      return
    }

    // Show banner after a short delay
    setTimeout(() => {
      setIsVisible(true)
    }, 1000)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    // Store dismissal for today only - banner will show again tomorrow
    const today = new Date().toDateString()
    localStorage.setItem("kuhlekt_banner_dismissed_date", today)
  }

  const handleScheduleDemo = () => {
    // Navigate to demo page
    window.location.href = "/demo"
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 text-xs font-semibold px-2 py-1 rounded-full">SEPTEMBER ONLY</span>
            <span className="font-medium">🎉 Free Setup for September - Transform Your AR Process Today!</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleScheduleDemo}
            variant="secondary"
            size="sm"
            className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold"
          >
            Schedule a Demo Now
          </Button>

          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Close banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Mobile responsive version */}
      <div className="md:hidden mt-2">
        <div className="text-center">
          <Button
            onClick={handleScheduleDemo}
            variant="secondary"
            size="sm"
            className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold w-full"
          >
            Schedule a Demo Now
          </Button>
        </div>
      </div>
    </div>
  )
}
