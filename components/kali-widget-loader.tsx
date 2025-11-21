"use client"

import { useEffect } from "react"

export function KaliWidgetLoader() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.sessionStorage.getItem("kali_widget_initialized")) {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes("kali") || key.includes("session") || key.includes("chat"))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key))

      window.sessionStorage.setItem("kali_widget_initialized", "true")
    }

    window.KALI_API_URL = "https://kali.kuhlekt-info.com"
    window.KALI_FALLBACK_API_URL = window.location.origin

    const timestamp = Date.now()
    const script = document.createElement("script")
    script.src = `https://kali.kuhlekt-info.com/widget.js?v=2.4&t=${timestamp}`
    script.async = true

    script.onload = () => {
      console.log("[v0] Kali widget v2.4 loaded successfully")

      const chatbotClosed = localStorage.getItem("kali_chatbot_closed")
      if (chatbotClosed === "true") {
        // Hide the chatbot if it was previously closed
        const hideWidget = () => {
          const widgetElements = document.querySelectorAll('[class*="kali"], [id*="kali"], iframe[src*="kali"]')
          widgetElements.forEach((el: Element) => {
            const htmlEl = el as HTMLElement
            if (htmlEl.style.position === "fixed" || htmlEl.style.position === "absolute") {
              htmlEl.style.display = "none"
            }
          })
        }

        // Try multiple times to catch the widget
        setTimeout(hideWidget, 100)
        setTimeout(hideWidget, 500)
        setTimeout(hideWidget, 1000)
      }

      const observer = new MutationObserver(() => {
        const widgetElements = document.querySelectorAll('[class*="kali"], [id*="kali"]')
        widgetElements.forEach((el: Element) => {
          const htmlEl = el as HTMLElement
          if (htmlEl.style.display === "none" && htmlEl.style.position === "fixed") {
            localStorage.setItem("kali_chatbot_closed", "true")
          }
        })

        // Listen for clicks on close buttons
        const closeButtons = document.querySelectorAll(
          'button[aria-label*="close" i], button[class*="close" i], [role="button"][aria-label*="close" i]',
        )
        closeButtons.forEach((btn) => {
          btn.addEventListener("click", () => {
            localStorage.setItem("kali_chatbot_closed", "true")
          })
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "class"],
      })

      document.addEventListener(
        "click",
        (e) => {
          const target = e.target as HTMLElement
          if (target.closest('[class*="kali"]') || target.closest('[id*="kali"]')) {
            // Check if clicking the widget button/icon
            const isWidgetButton =
              target.tagName === "BUTTON" || target.closest("button") || target.style.cursor === "pointer"
            if (isWidgetButton) {
              localStorage.removeItem("kali_chatbot_closed")
            }
          }
        },
        true,
      )
    }

    script.onerror = (e) => {
      console.error("[v0] Failed to load Kali widget:", e)
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return null
}
