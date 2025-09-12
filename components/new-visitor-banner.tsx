"use client"

import { useState, useEffect } from "react"
import { X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if it's September 2025
    const now = new Date()
    const currentMonth = now.getMonth() // 0-11 (September = 8)
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
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold">SEPTEMBER ONLY</span>
          </div>

          <div className="hidden md:block">
            <span className="text-lg font-bold">🎉 Free Setup for September!</span>
            <span className="ml-2 text-sm opacity-90">
              Get your AR automation platform set up at no cost this month.
            </span>
          </div>

          <div className="md:hidden">
            <div className="text-sm font-bold">🎉 Free Setup for September!</div>
            <div className="text-xs opacity-90">Get AR automation set up free this month</div>
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
            className="text-white/80 hover:text-white transition-colors p-1"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
