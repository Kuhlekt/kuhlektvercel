"use client"

import { useEffect, useRef } from "react"

interface ReCAPTCHAProps {
  onVerify: (token: string) => void
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          "expired-callback": () => void
          "error-callback": () => void
        },
      ) => number
      reset: (widgetId?: number) => void
    }
  }
}

export default function ReCAPTCHA({ onVerify }: ReCAPTCHAProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha && recaptchaRef.current) {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", // Test key
          callback: onVerify,
          "expired-callback": () => onVerify(""),
          "error-callback": () => onVerify(""),
        })
      }
    }

    if (window.grecaptcha) {
      window.grecaptcha.ready(loadRecaptcha)
    } else {
      // Load reCAPTCHA script
      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js"
      script.async = true
      script.defer = true
      script.onload = () => {
        window.grecaptcha.ready(loadRecaptcha)
      }
      document.head.appendChild(script)
    }

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(widgetIdRef.current)
      }
    }
  }, [onVerify])

  return <div ref={recaptchaRef} className="flex justify-center" />
}

// Named export for compatibility
export { ReCAPTCHA }
