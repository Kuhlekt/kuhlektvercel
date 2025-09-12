"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Calendar } from "lucide-react"
import Link from "next/link"

export function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkShouldShow = () => {
      // Check if it's September 2025
      const now = new Date()
      const currentMonth = now.getMonth() // 0-based, so September is 8
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
    }

    checkShouldShow()
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
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-3 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-yellow-300" />
            <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">SEPTEMBER ONLY</span>
          </div>

          <div className="hidden md:block">
            <span className="text-lg font-semibold">🎉 Free Setup for September!</span>
            <span className="ml-2 text-blue-100">Get your AR automation platform configured at no cost.</span>
          </div>

          <div className="md:hidden">
            <div className="text-sm font-semibold">🎉 Free Setup for September!</div>
            <div className="text-xs text-blue-100">AR automation platform setup at no cost</div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/demo">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Schedule a Demo Now
            </Button>
          </Link>

          <button
            onClick={handleClose}
            className="text-white hover:text-yellow-300 transition-colors p-1 hover:bg-white/10 rounded"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
