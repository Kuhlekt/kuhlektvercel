"use client"

import { useState, useEffect } from "react"
import { X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    const dismissedDate = localStorage.getItem("kuhlekt-banner-dismissed")

    if (dismissedDate !== today) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    const today = new Date().toDateString()
    localStorage.setItem("kuhlekt-banner-dismissed", today)
    setIsVisible(false)
  }

  const handleScheduleDemo = () => {
    window.location.href = "/demo"
  }

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-3 px-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">SEPTEMBER ONLY</span>
            <Calendar className="h-4 w-4" />
          </div>
          <div className="hidden sm:block">
            <span className="font-semibold text-lg">🎉 Free Setup for September!</span>
            <span className="ml-2 text-blue-100">Transform your AR process with zero setup costs</span>
          </div>
          <div className="sm:hidden">
            <span className="font-semibold">🎉 Free Setup!</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handleScheduleDemo}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Schedule Demo Now
          </Button>
          <button
            onClick={handleClose}
            className="text-white hover:text-blue-200 transition-colors p-1"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
