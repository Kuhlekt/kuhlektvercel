"use client"

import { useEffect } from "react"

export function KaliWidgetLoader() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.sessionStorage.getItem('kali_widget_initialized')) {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (key.includes("kali") || key.includes("session") || key.includes("chat"))) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => {
        console.log("[v0] Clearing stored session data:", key)
        localStorage.removeItem(key)
      })
      
      window.sessionStorage.setItem('kali_widget_initialized', 'true')
    }

    window.KALI_API_URL = "https://kali.kuhlekt-info.com"
    window.KALI_FALLBACK_API_URL = window.location.origin

    console.log("[v0] Configuring Kali Widget v2.4")
    console.log("[v0] Primary API URL:", window.KALI_API_URL)
    console.log("[v0] Fallback API URL:", window.KALI_FALLBACK_API_URL)

    const resizeWidgetElements = () => {
      const isMobile = window.innerWidth < 768
      const targetWidth = isMobile ? 380 : 450
      const targetHeight = isMobile ? 550 : 600
      
      // Find all elements that look like modals/popups positioned fixed or absolute
      const allElements = document.querySelectorAll('*')
      allElements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement
        const styles = window.getComputedStyle(htmlElement)
        
        // Check if element is a fixed/absolute positioned container that's too large
        if ((styles.position === 'fixed' || styles.position === 'absolute') && 
            styles.zIndex && parseInt(styles.zIndex) > 1000) {
          
          const width = htmlElement.offsetWidth
          const height = htmlElement.offsetHeight
          
          // If element is taking up more than 50% of screen width or 70% height, resize it
          if (width > window.innerWidth * 0.5 || height > window.innerHeight * 0.7) {
            console.log('[v0] Resizing large widget element:', htmlElement)
            htmlElement.style.cssText = `
              ${htmlElement.style.cssText}
              max-width: ${targetWidth}px !important;
              width: ${targetWidth}px !important;
              max-height: ${targetHeight}px !important;
              height: auto !important;
              bottom: ${isMobile ? 10 : 20}px !important;
              right: ${isMobile ? 10 : 20}px !important;
              left: auto !important;
              top: auto !important;
              transform: none !important;
              overflow-y: auto !important;
            `
          }
        }
      })
    }

    const observer = new MutationObserver((mutations) => {
      resizeWidgetElements()
    })

    const timestamp = Date.now()
    const script = document.createElement("script")
    script.src = `https://kali.kuhlekt-info.com/widget.js?v=2.4&t=${timestamp}`
    script.async = true

    script.onload = () => {
      console.log("[v0] Kali widget v2.4 loaded successfully at", new Date().toISOString())
      
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      })
      
      const intervalId = setInterval(resizeWidgetElements, 500)
      
      ;(window as any).kaliResizeInterval = intervalId
    }

    script.onerror = (e) => {
      console.error("[v0] Failed to load Kali widget script:", e)
    }

    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      observer.disconnect()
      if ((window as any).kaliResizeInterval) {
        clearInterval((window as any).kaliResizeInterval)
      }
    }
  }, [])

  return null
}
