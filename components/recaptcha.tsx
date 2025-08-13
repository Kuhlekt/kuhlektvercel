"use client"

import { useEffect, useState, useRef } from "react"

interface ReCaptchaProps {
  onVerify?: (token: string) => void
  onChange?: (token: string | null) => void
}

export function ReCaptcha({ onVerify, onChange }: ReCaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        const config = await response.json()
        setSiteKey(config.siteKey || "")
        setIsEnabled(config.isEnabled || false)
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA config:", error)
        // Provide fallback token for development
        const fallbackToken = "development-mode-token"
        onVerify?.(fallbackToken)
        onChange?.(fallbackToken)
      }
    }

    fetchConfig()
  }, [onVerify, onChange])

  useEffect(() => {
    if (!isEnabled || !siteKey || isLoaded) return

    const loadRecaptcha = () => {
      if (typeof window !== "undefined" && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          try {
            if (recaptchaRef.current && !widgetId.current) {
              widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
                sitekey: siteKey,
                size: "invisible",
                callback: (token: string) => {
                  onVerify?.(token)
                  onChange?.(token)
                },
                "error-callback": () => {
                  console.warn("reCAPTCHA error occurred, providing fallback token")
                  const fallbackToken = "recaptcha-error-fallback-token"
                  onVerify?.(fallbackToken)
                  onChange?.(fallbackToken)
                },
                "expired-callback": () => {
                  console.warn("reCAPTCHA expired, providing fallback token")
                  const fallbackToken = "recaptcha-expired-fallback-token"
                  onVerify?.(fallbackToken)
                  onChange?.(fallbackToken)
                },
              })
            }
            setIsLoaded(true)
          } catch (error) {
            console.error("reCAPTCHA render error:", error)
            const fallbackToken = "recaptcha-render-error-token"
            onVerify?.(fallbackToken)
            onChange?.(fallbackToken)
          }
        })
      } else {
        // Load reCAPTCHA script
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js"
        script.async = true
        script.defer = true
        script.onload = loadRecaptcha
        script.onerror = () => {
          console.error("Failed to load reCAPTCHA script, providing fallback token")
          const fallbackToken = "recaptcha-script-error-token"
          onVerify?.(fallbackToken)
          onChange?.(fallbackToken)
        }
        document.head.appendChild(script)
      }
    }

    loadRecaptcha()

    return () => {
      if (widgetId.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId.current)
        } catch (error) {
          console.warn("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [siteKey, isEnabled, isLoaded, onVerify, onChange])

  // Provide fallback token if reCAPTCHA is disabled
  useEffect(() => {
    if (!isEnabled) {
      const fallbackToken = "recaptcha-disabled-token"
      onVerify?.(fallbackToken)
      onChange?.(fallbackToken)
    }
  }, [isEnabled, onVerify, onChange])

  if (!isEnabled) {
    return null
  }

  return <div ref={recaptchaRef} className="invisible-recaptcha" />
}

export default ReCaptcha

// Global type declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string
          size?: string
          callback?: (token: string) => void
          "error-callback"?: () => void
          "expired-callback"?: () => void
        },
      ) => number
      reset: (widgetId: number) => void
      execute: (widgetId: number) => void
    }
  }
}
