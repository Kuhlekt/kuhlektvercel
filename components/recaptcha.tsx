"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
  }
}

interface RecaptchaProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}

export function Recaptcha({ onVerify, onExpire, onError }: RecaptchaProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch site key from server
  useEffect(() => {
    const fetchSiteKey = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        const data = await response.json()
        setSiteKey(data.siteKey)
      } catch (error) {
        console.error("Error fetching reCAPTCHA config:", error)
        // Use test key as fallback
        setSiteKey("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSiteKey()
  }, [])

  useEffect(() => {
    if (!siteKey || isLoading) return

    const loadRecaptcha = () => {
      if (window.grecaptcha && recaptchaRef.current && !widgetId.current) {
        try {
          widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            "expired-callback": onExpire,
            "error-callback": onError,
            theme: "light",
            size: "normal",
          })
        } catch (error) {
          console.error("Error rendering reCAPTCHA:", error)
        }
      }
    }

    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
      script.async = true
      script.defer = true

      window.onRecaptchaLoad = loadRecaptcha

      document.head.appendChild(script)

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
        delete window.onRecaptchaLoad
      }
    } else {
      loadRecaptcha()
    }

    return () => {
      if (widgetId.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId.current)
        } catch (error) {
          console.error("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [siteKey, isLoading, onVerify, onExpire, onError])

  if (isLoading) {
    return (
      <div className="flex justify-center my-4">
        <div className="animate-pulse bg-gray-200 h-20 w-80 rounded"></div>
      </div>
    )
  }

  return <div ref={recaptchaRef} className="flex justify-center my-4" />
}

export function resetRecaptcha(widgetId?: number) {
  if (window.grecaptcha) {
    try {
      if (widgetId !== undefined) {
        window.grecaptcha.reset(widgetId)
      } else {
        window.grecaptcha.reset()
      }
    } catch (error) {
      console.error("Error resetting reCAPTCHA:", error)
    }
  }
}
