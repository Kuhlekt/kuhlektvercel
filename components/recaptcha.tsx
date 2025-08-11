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
    const loadRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current) {
        widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
        })
      }
    }

    if (window.grecaptcha) {
      loadRecaptcha()
    } else {
      window.onRecaptchaLoad = loadRecaptcha

      // Load reCAPTCHA script
      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    return () => {
      if (widgetId.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId.current)
        } catch (error) {
          console.warn("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [onVerify, onExpire, onError])

  return <div ref={recaptchaRef} className="flex justify-center my-4" />
}
