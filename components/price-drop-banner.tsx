"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useState } from "react"

export function PriceDropBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-gray-900 shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg sm:text-xl font-bold">🎉 2026 PRICE DROP!</span>
              <span className="text-sm sm:text-base">20% off all categories this year</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 mt-1">Guaranteed Price Drop</p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/pricing-table">
              <Button size="sm" className="bg-gray-900 text-amber-400 hover:bg-gray-800 font-semibold">
                View Pricing →
              </Button>
            </Link>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-amber-300 rounded transition-colors"
              aria-label="Close banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
