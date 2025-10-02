"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar } from "lucide-react"
import Link from "next/link"

export function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if we're in September 2025
    const now = new Date()
    const isSeptember2025 = now.getMonth() === 8 && now.getFullYear() === 2025

    if (!isSeptember2025) {
      return
    }

    // Check if dismissed today
    const dismissedDate = localStorage.getItem("bannerDismissed")
    const today = now.toDateString()

    if (dismissedDate !== today) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    const today = new Date().toDateString()
    localStorage.setItem("bannerDismissed", today)
    setIsDismissed(true)
    setIsVisible(false)
  }

  if (!isVisible || isDismissed) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 flex-1">
          <Calendar className="h-5 w-5 flex-shrink-0" />
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm sm:text-base">🎉 Free Setup for September!</span>
            <span className="hidden sm:inline text-sm">Limited time offer - Schedule your demo now</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/demo">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold whitespace-nowrap"
            >
              Schedule Demo
            </Button>
          </Link>
          <button
            onClick={handleDismiss}
            className="text-white hover:text-gray-200 transition-colors p-1"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
