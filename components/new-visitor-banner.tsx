"use client"

import { useState, useEffect } from "react"
import { X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [bannerContent, setBannerContent] = useState({ title: "", badge: "", offer: "" })

  useEffect(() => {
    const checkBannerVisibility = () => {
      const now = new Date()
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth()

      const monthlyBanners: Record<string, { title: string; badge: string; offer: string }> = {
        "2025-9": {
          title: "Springboard into the final 3 months of '25",
          badge: "OCTOBER ONLY",
          offer: "30-day risk-free pilot + waived onboarding fee",
        },
        "2025-10": {
          title: "Black Friday Enterprise Sale",
          badge: "NOVEMBER ONLY",
          offer: "Buy 12 months, get 2 months free",
        },
        "2025-11": {
          title: "Year-end cash flow & AR health check",
          badge: "DECEMBER ONLY",
          offer: "Free AR health audit + discounted first 3 months",
        },
        "2026-0": {
          title: "New Year, new efficiency",
          badge: "JANUARY ONLY",
          offer: "Effortless Onboarding Bundle + extra user seats free for 3 months",
        },
        "2026-1": {
          title: "Valentine's for your Receivables",
          badge: "FEBRUARY ONLY",
          offer: "Refer & Reward program",
        },
        "2026-2": {
          title: "End-of-H1 push",
          badge: "MARCH ONLY",
          offer: "Flexible contract + bonus services",
        },
        "2026-3": {
          title: "Autumn efficiencies",
          badge: "APRIL ONLY",
          offer: "Bundle discount on modules / upgrade",
        },
        "2026-4": {
          title: "End-of-financial-year precommit",
          badge: "MAY ONLY",
          offer: "Lock-in for FY27",
        },
        "2026-5": {
          title: "Financial Year Close / Kickstart next year",
          badge: "JUNE ONLY",
          offer: "Bonus implementation support + extended trial period",
        },
      }

      const monthKey = `${currentYear}-${currentMonth}`
      const content = monthlyBanners[monthKey]

      if (!content) {
        setIsLoading(false)
        return
      }

      const today = now.toDateString()
      const dismissedDate = localStorage.getItem("banner-dismissed-date")

      if (dismissedDate !== today) {
        setBannerContent(content)
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
            <span className="font-semibold">{bannerContent.title}</span>
          </div>
          <div className="hidden md:block">
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">{bannerContent.badge}</span>
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

      <div className="md:hidden mt-2 text-center">
        <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">{bannerContent.badge}</span>
      </div>
    </div>
  )
}
