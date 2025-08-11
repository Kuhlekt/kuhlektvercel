"use client"

import { useEffect, useRef, useState } from "react"

interface RecaptchaProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
  }
}

export function Recaptcha({ onVerify, onExpire, onError }: RecaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)
  const [isConfigured, setIsConfigured] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if reCAPTCHA is configured on the client side
    const checkConfiguration = () => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      if (!siteKey || siteKey.trim() === "" || siteKey === "your_recaptcha_site_key_here") {
        setIsConfigured(false)
        setIsLoading(false)
        console.log("reCAPTCHA not configured - site key missing or placeholder")
        return false
      }
      console.log("reCAPTCHA configured with site key:", siteKey.substring(0, 10) + "...")
      setIsConfigured(true)
      return true
    }

    if (!checkConfiguration()) {
      return
    }

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!

    const loadRecaptcha = () => {
      console.log("Loading reCAPTCHA...")
      if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current) {
        try {
          console.log("Rendering reCAPTCHA widget...")
          widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            "expired-callback": onExpire,
            "error-callback": onError,
          })
          setIsLoading(false)
          console.log("reCAPTCHA widget rendered successfully")
        } catch (error) {
          console.error("Error rendering reCAPTCHA:", error)
          setIsLoading(false)
          if (onError) onError()
        }
      } else {
        console.log("reCAPTCHA API not ready yet...")
      }
    }

    if (window.grecaptcha && window.grecaptcha.render) {
      loadRecaptcha()
    } else {
      window.onRecaptchaLoad = loadRecaptcha

      // Check if script is already loaded
      const existingScript = document.querySelector('script[src*="recaptcha"]')
      if (!existingScript) {
        console.log("Loading reCAPTCHA script...")
        // Load reCAPTCHA script
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        script.async = true
        script.defer = true
        script.onload = () => {
          console.log("reCAPTCHA script loaded successfully")
        }
        script.onerror = () => {
          console.error("Failed to load reCAPTCHA script")
          setIsLoading(false)
          if (onError) onError()
        }
        document.head.appendChild(script)
      } else {
        console.log("reCAPTCHA script already exists")
      }
    }

    return () => {
      if (widgetId.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetId.current)
        } catch (error) {
          console.warn("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [onVerify, onExpire, onError])

  // If not configured, don't render anything
  if (!isConfigured) {
    console.log("reCAPTCHA component not rendering - not configured")
    return null
  }

  // Show loading state
  if (isLoading) {
    console.log("reCAPTCHA component showing loading state")
    return (
      <div className="flex justify-center my-4 p-4">
        <div className="text-sm text-gray-600">Loading verification...</div>
      </div>
    )
  }

  console.log("reCAPTCHA component rendering widget container")
  return <div ref={recaptchaRef} className="flex justify-center my-4" />
}
