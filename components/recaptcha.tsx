"use client"

import { useEffect, useRef, useState } from "react"

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
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    async function fetchSiteKey() {
      try {
        const response = await fetch("/api/recaptcha-config")
        const data = await response.json()
        setSiteKey(data.siteKey)
        setIsEnabled(data.isEnabled)
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA config:", error)
        setIsEnabled(false)
      }
    }

    fetchSiteKey()
  }, [])

  useEffect(() => {
    if (!isEnabled || !siteKey) return

    const loadRecaptcha = () => {
      if (window.grecaptcha && recaptchaRef.current) {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          "expired-callback": () => onVerify(""),
          "error-callback": () => onVerify(""),
        })
      }
    }

    if (window.grecaptcha) {
      window.grecaptcha.ready(loadRecaptcha)
    } else {
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
  }, [siteKey, isEnabled, onVerify])

  useEffect(() => {
    if (!isEnabled) {
      onVerify("development-mode")
    }
  }, [isEnabled, onVerify])

  if (!isEnabled) {
    return null
  }

  return <div ref={recaptchaRef} className="flex justify-center" />
}

// Named export for compatibility
export { ReCAPTCHA }

// Additional named export as ReCaptcha (with different casing)
export const ReCaptcha = ReCAPTCHA
