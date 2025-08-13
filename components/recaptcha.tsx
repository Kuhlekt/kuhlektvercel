"use client"

import { useEffect, useState, useRef } from "react"

interface ReCaptchaProps {
  onVerify: (token: string) => void
}

export function ReCaptcha({ onVerify }: ReCaptchaProps) {
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        if (response.ok) {
          const config = await response.json()
          setSiteKey(config.siteKey || "")
          setIsEnabled(config.isEnabled || false)

          // If reCAPTCHA is disabled, provide a bypass token immediately
          if (!config.isEnabled) {
            onVerify("recaptcha-disabled")
          }
        } else {
          console.warn("Failed to fetch reCAPTCHA config")
          onVerify("recaptcha-config-error")
        }
      } catch (error) {
        console.error("Error fetching reCAPTCHA config:", error)
        onVerify("recaptcha-fetch-error")
      }
    }

    fetchConfig()
  }, [onVerify])

  useEffect(() => {
    if (!isEnabled || !siteKey || isLoaded) return

    const loadReCaptcha = () => {
      if (typeof window !== "undefined" && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          try {
            if (recaptchaRef.current && !widgetId.current) {
              widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
                sitekey: siteKey,
                size: "invisible",
                callback: (token: string) => {
                  onVerify(token)
                },
                "error-callback": () => {
                  console.warn("reCAPTCHA error occurred")
                  onVerify("recaptcha-error")
                },
                "expired-callback": () => {
                  console.warn("reCAPTCHA expired")
                  onVerify("recaptcha-expired")
                },
              })

              // Execute reCAPTCHA immediately for invisible mode
              setTimeout(() => {
                if (widgetId.current !== null && window.grecaptcha) {
                  try {
                    window.grecaptcha.execute(widgetId.current)
                  } catch (error) {
                    console.error("Error executing reCAPTCHA:", error)
                    onVerify("recaptcha-execute-error")
                  }
                }
              }, 500)
            }
            setIsLoaded(true)
          } catch (error) {
            console.error("reCAPTCHA render error:", error)
            onVerify("recaptcha-render-error")
          }
        })
      } else {
        // Load reCAPTCHA script
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js"
        script.async = true
        script.defer = true
        script.onload = loadReCaptcha
        script.onerror = () => {
          console.error("Failed to load reCAPTCHA script")
          onVerify("recaptcha-script-error")
        }
        document.head.appendChild(script)
      }
    }

    loadReCaptcha()

    return () => {
      if (widgetId.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId.current)
        } catch (error) {
          console.warn("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [siteKey, isEnabled, isLoaded, onVerify])

  if (!isEnabled) {
    return null
  }

  return <div ref={recaptchaRef} className="invisible-recaptcha" />
}

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

export default ReCaptcha
