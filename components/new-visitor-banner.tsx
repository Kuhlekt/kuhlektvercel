"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if banner was dismissed in this session
    const dismissed = sessionStorage.getItem("banner-dismissed")
    if (!dismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem("banner-dismissed", "true")
  }

  if (!isVisible) return null

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center md:text-left">
          <p className="text-sm md:text-base font-medium">
            <span className="font-bold">September 2025 Promotion:</span> Get 20% off your first 3 months with code
            SEPT2025
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 shrink-0"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
