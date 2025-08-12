"use client"

import { useEffect, useRef, useState } from "react"

interface ReCAPTCHAProps {
  onVerify: (token: string) => void
}

interface ReCAPTCHAConfig {
  siteKey: string
  isEnabled: boolean
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
  const [config, setConfig] = useState<ReCAPTCHAConfig | null>(null)

  useEffect(() => {
    // Fetch ReCAPTCHA config from server
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then(setConfig)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!config?.isEnabled || !config.siteKey) return

    const loadRecaptcha = () => {
      if (window.grecaptcha && recaptchaRef.current) {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: config.siteKey,
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
  }, [config, onVerify])

  if (!config?.isEnabled) {
    return null
  }

  return <div ref={recaptchaRef} className="flex justify-center" />
}

// Named export for compatibility
export { ReCAPTCHA }
