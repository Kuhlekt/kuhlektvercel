"use client"

import { useState, useEffect } from "react"
import { X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if it's September 2025
    const now = new Date()
    const currentMonth = now.getMonth() // 0-based (8 = September)
    const currentYear = now.getFullYear()

    if (currentMonth !== 8 || currentYear !== 2025) {
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
    <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span className="bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">SEPTEMBER ONLY</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-semibold">🎉 Free Setup for September - Schedule a Demo Now!</span>
          </div>
          <div className="sm:hidden">
            <span className="text-sm font-semibold">🎉 Free Setup - Demo Now!</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button asChild size="sm" className="bg-white text-cyan-600 hover:bg-gray-100 font-semibold">
            <Link href="/demo">Schedule Demo</Link>
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
    </div>
  )
}
