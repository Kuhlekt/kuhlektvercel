"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getVisitorData } from "@/components/visitor-tracker"

export function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isNewVisitor, setIsNewVisitor] = useState(false)

  useEffect(() => {
    // Check if banner was already dismissed
    const bannerDismissed = localStorage.getItem("kuhlekt_banner_dismissed")
    if (bannerDismissed) {
      return
    }

    // Check visitor data to determine if this is a new visitor
    const checkVisitorStatus = () => {
      const visitorData = getVisitorData()

      if (!visitorData) {
        // No visitor data yet, wait a bit and check again
        setTimeout(checkVisitorStatus, 500)
        return
      }

      // Show banner for new users or users with less than 3 page views
      const shouldShowBanner = visitorData.isNewUser || (visitorData.pageViews && visitorData.pageViews <= 3)

      if (shouldShowBanner) {
        setIsNewVisitor(true)
        setIsVisible(true)
      }
    }

    // Wait a bit for visitor tracking to initialize
    setTimeout(checkVisitorStatus, 1000)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem("kuhlekt_banner_dismissed", "true")
  }

  const handleScheduleDemo = () => {
    // Navigate to demo page
    window.location.href = "/demo"
  }

  if (!isVisible || !isNewVisitor) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 px-4 relative z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 text-xs font-semibold px-2 py-1 rounded-full">LIMITED TIME</span>
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
