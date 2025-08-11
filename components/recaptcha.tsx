"use client"

import { useEffect, useRef } from "react"

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

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

    if (!siteKey) {
      console.error("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not configured")
      if (onError) onError()
      return
    }

    const loadRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current) {
        try {
          widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            "expired-callback": onExpire,
            "error-callback": onError,
          })
        } catch (error) {
          console.error("Error rendering reCAPTCHA:", error)
          if (onError) onError()
        }
      }
    }

    if (window.grecaptcha && window.grecaptcha.render) {
      loadRecaptcha()
    } else {
      window.onRecaptchaLoad = loadRecaptcha

      // Check if script is already loaded
      const existingScript = document.querySelector('script[src*="recaptcha"]')
      if (!existingScript) {
        // Load reCAPTCHA script
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        script.async = true
        script.defer = true
        script.onerror = () => {
          console.error("Failed to load reCAPTCHA script")
          if (onError) onError()
        }
        document.head.appendChild(script)
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

  // If no site key is configured, show a message instead of breaking
  if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    return (
      <div className="flex justify-center my-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-sm text-yellow-800">reCAPTCHA configuration required</p>
      </div>
    )
  }

  return <div ref={recaptchaRef} className="flex justify-center my-4" />
}
