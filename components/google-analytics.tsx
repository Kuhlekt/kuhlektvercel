"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      const url = pathname + searchParams.toString()
      console.log("[v0] Sending page view to Google Analytics:", url)

      window.gtag("config", "G-Z5H3V9LW83", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      })

      // Also send a manual page_view event
      window.gtag("event", "page_view", {
        page_path: url,
        page_title: document.title,
        page_location: window.location.href,
      })

      console.log("[v0] Google Analytics page view sent")
    }
  }, [pathname, searchParams])

  return null
}
