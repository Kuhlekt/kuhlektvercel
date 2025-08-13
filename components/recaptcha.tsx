"use client"

import { useEffect, useRef, useState } from "react"

interface RecaptchaProps {
  onVerify: (token: string) => void
  onExpire: () => void
  onError: () => void
}

declare global {
  interface Window {
    grecaptcha: {
      render: (container: string | HTMLElement, options: any) => number
      reset: (widgetId?: number) => void
      getResponse: (widgetId?: number) => string
      ready: (callback: () => void) => void
    }
  }
}

export function Recaptcha({ onVerify, onExpire, onError }: RecaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState<string>("")
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Fetch site key from API
    const fetchSiteKey = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        const data = await response.json()
        setSiteKey(data.siteKey)
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA site key:", error)
        // Use test key as fallback
        setSiteKey("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI")
      }
    }

    fetchSiteKey()
  }, [])

  useEffect(() => {
    if (!siteKey) return

    // Load reCAPTCHA script
    const loadRecaptcha = () => {
      if (typeof window !== "undefined" && !window.grecaptcha) {
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js"
        script.async = true
        script.defer = true
        script.onload = () => {
          setIsLoaded(true)
        }
        script.onerror = () => {
          console.error("Failed to load reCAPTCHA script")
          onError()
        }
        document.head.appendChild(script)
      } else if (window.grecaptcha) {
        setIsLoaded(true)
      }
    }

    loadRecaptcha()
  }, [siteKey, onError])

  useEffect(() => {
    if (isLoaded && siteKey && recaptchaRef.current && typeof window !== "undefined" && window.grecaptcha) {
      // Clear any existing widget
      if (widgetIdRef.current !== null) {
        try {
          window.grecaptcha.reset(widgetIdRef.current)
        } catch (error) {
          console.warn("Failed to reset reCAPTCHA:", error)
        }
      }

      // Clear the container
      recaptchaRef.current.innerHTML = ""

      try {
        window.grecaptcha.ready(() => {
          if (recaptchaRef.current) {
            widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
              sitekey: siteKey,
              callback: onVerify,
              "expired-callback": onExpire,
              "error-callback": onError,
            })
          }
        })
      } catch (error) {
        console.error("Failed to render reCAPTCHA:", error)
        onError()
      }
    }
  }, [isLoaded, siteKey, onVerify, onExpire, onError])

  if (!siteKey) {
    return <div className="text-sm text-gray-500">Loading CAPTCHA...</div>
  }

  return (
    <div className="flex justify-center">
      <div ref={recaptchaRef} />
    </div>
  )
}
