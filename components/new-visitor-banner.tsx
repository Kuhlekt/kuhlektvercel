"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MonthlyContent {
  month: number // 1-12
  title: string
  description: string
  cta: string
  ctaLink: string
  variant?: "default" | "success" | "warning" | "info"
}

const monthlyPromotions: MonthlyContent[] = [
  {
    month: 10, // October 2025
    title: "Fall into Savings! 🍂",
    description: "Get 20% off your first 3 months when you sign up in October",
    cta: "Claim Fall Offer",
    ctaLink: "/demo",
    variant: "warning",
  },
  {
    month: 11, // November 2025
    title: "Black Friday Special 🎉",
    description: "Exclusive: 30% off annual plans + free implementation",
    cta: "Get Black Friday Deal",
    ctaLink: "/demo",
    variant: "default",
  },
  {
    month: 12, // December 2025
    title: "End of Year Offer 🎄",
    description: "Start 2026 strong! 25% off + extended free trial",
    cta: "Claim Year-End Deal",
    ctaLink: "/demo",
    variant: "success",
  },
  {
    month: 1, // January 2026
    title: "New Year, New Systems 🚀",
    description: "Transform your AR process in 2026 - Special Q1 pricing",
    cta: "Start Fresh",
    ctaLink: "/demo",
    variant: "info",
  },
  {
    month: 2, // February 2026
    title: "Q1 Special Offer 💝",
    description: "Love your cash flow! 15% off for February sign-ups",
    cta: "Get Q1 Pricing",
    ctaLink: "/demo",
    variant: "default",
  },
  {
    month: 3, // March 2026
    title: "Spring Forward Sale 🌸",
    description: "Refresh your receivables - Special spring pricing available",
    cta: "Spring Into Action",
    ctaLink: "/demo",
    variant: "success",
  },
  {
    month: 4, // April 2026
    title: "Q2 Growth Special 📈",
    description: "Scale your collections - Limited Q2 offer",
    cta: "See Q2 Pricing",
    ctaLink: "/demo",
    variant: "info",
  },
  {
    month: 5, // May 2026
    title: "Mid-Year Planning 🎯",
    description: "Hit your H2 targets - Book a demo this month",
    cta: "Plan for Success",
    ctaLink: "/demo",
    variant: "warning",
  },
  {
    month: 6, // June 2026
    title: "Summer Kickoff ☀️",
    description: "Don't let receivables slow you down - Special summer rates",
    cta: "Get Summer Deal",
    ctaLink: "/demo",
    variant: "default",
  },
]

export default function NewVisitorBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [content, setContent] = useState<MonthlyContent | null>(null)

  useEffect(() => {
    // Check if user has dismissed banner in this session
    const dismissed = sessionStorage.getItem("banner-dismissed")
    if (dismissed) {
      return
    }

    // Get current month (1-12)
    const currentMonth = new Date().getMonth() + 1

    // Find content for current month
    const monthContent = monthlyPromotions.find((promo) => promo.month === currentMonth)

    if (monthContent) {
      setContent(monthContent)
      setIsVisible(true)
    } else {
      // Default content if no specific promotion
      setContent({
        month: currentMonth,
        title: "Welcome to Kuhlekt! 👋",
        description: "Transform your accounts receivable process with intelligent automation",
        cta: "Learn More",
        ctaLink: "/product",
        variant: "info",
      })
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem("banner-dismissed", "true")
  }

  if (!isVisible || !content) return null

  const variantStyles = {
    default: "bg-gradient-to-r from-cyan-600 to-blue-600",
    success: "bg-gradient-to-r from-green-600 to-emerald-600",
    warning: "bg-gradient-to-r from-orange-600 to-amber-600",
    info: "bg-gradient-to-r from-blue-600 to-indigo-600",
  }

  return (
    <div
      className={`${variantStyles[content.variant || "default"]} text-white shadow-lg transition-all duration-300 print:hidden`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex-1 flex items-center gap-4 min-w-0">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base truncate">{content.title}</p>
              <p className="text-xs sm:text-sm text-white/90 truncate">{content.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-cyan-900 hover:bg-white/90 whitespace-nowrap"
              asChild
            >
              <a href={content.ctaLink}>{content.cta}</a>
            </Button>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
