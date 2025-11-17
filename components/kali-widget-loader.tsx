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
      keysToRemove.forEach((key) => localStorage.removeItem(key))
      
      window.sessionStorage.setItem('kali_widget_initialized', 'true')
    }

    window.KALI_API_URL = "https://kali.kuhlekt-info.com"
    window.KALI_FALLBACK_API_URL = window.location.origin

    const timestamp = Date.now()
    const script = document.createElement("script")
    script.src = `https://kali.kuhlekt-info.com/widget.js?v=2.4&t=${timestamp}`
    script.async = true

    script.onload = () => {
      console.log("[v0] Kali widget v2.4 loaded successfully")
      
      setTimeout(() => {
        addCustomCloseButton()
      }, 1000)
    }

    script.onerror = (e) => {
      console.error("[v0] Failed to load Kali widget:", e)
    }

    document.body.appendChild(script)
    
    function addCustomCloseButton() {
      // Find any fixed or absolute positioned large elements (likely the chatbot)
      const allElements = document.querySelectorAll('div, iframe')
      
      allElements.forEach((el) => {
        const style = window.getComputedStyle(el as HTMLElement)
        const isFixed = style.position === 'fixed' || style.position === 'absolute'
        const hasHighZIndex = parseInt(style.zIndex || '0') > 1000
        
        if (isFixed && hasHighZIndex) {
          const parent = el.parentElement
          if (parent && !parent.querySelector('.custom-kali-close')) {
            // Create custom close button
            const closeBtn = document.createElement('button')
            closeBtn.className = 'custom-kali-close'
            closeBtn.innerHTML = '✕'
            closeBtn.style.cssText = `
              position: absolute;
              top: 8px;
              right: 8px;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #ef4444;
              color: white;
              border: none;
              font-size: 18px;
              font-weight: bold;
              cursor: pointer;
              z-index: 999999;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              transition: all 0.2s;
            `
            
            closeBtn.onmouseover = () => {
              closeBtn.style.background = '#dc2626'
              closeBtn.style.transform = 'scale(1.1)'
            }
            
            closeBtn.onmouseout = () => {
              closeBtn.style.background = '#ef4444'
              closeBtn.style.transform = 'scale(1)'
            }
            
            closeBtn.onclick = () => {
              const widgetContainer = el.closest('div[style*="fixed"]') || el.closest('div[style*="absolute"]') || parent
              if (widgetContainer) {
                (widgetContainer as HTMLElement).style.display = 'none'
              }
            }
            
            parent.style.position = 'relative'
            parent.appendChild(closeBtn)
          }
        }
      })
    }
    
    const interval = setInterval(addCustomCloseButton, 2000)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      clearInterval(interval)
    }
  }, [])

  return null
}
