"use client"

import { useEffect, useRef, useState } from "react"

interface ReCaptchaProps {
  onChange: (token: string | null) => void
  siteKey?: string
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (container: string | HTMLElement, options: any) => number
      execute: (widgetId?: number, options?: { action?: string }) => Promise<string>
      reset: (widgetId?: number) => void
    }
  }
}

export function ReCaptcha({ onChange, siteKey }: ReCaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const [currentSiteKey, setCurrentSiteKey] = useState(siteKey || "")
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        if (response.ok) {
          const config = await response.json()
          setCurrentSiteKey(config.siteKey || "")
          setIsEnabled(config.isEnabled || false)
        } else {
          console.warn("Failed to fetch reCAPTCHA config")
          setIsEnabled(false)
        }
      } catch (error) {
        console.warn("Error fetching reCAPTCHA config:", error)
        setIsEnabled(false)
      }
    }

    fetchConfig()
  }, [])

  useEffect(() => {
    if (!isEnabled || !currentSiteKey) {
      // Provide bypass token when reCAPTCHA is disabled
      onChange("development-bypass-token")
      return
    }

    const loadReCaptcha = () => {
      if (window.grecaptcha) {
        setIsLoaded(true)
        return
      }

      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js"
      script.async = true
      script.defer = true
      script.onload = () => setIsLoaded(true)
      script.onerror = () => {
        console.warn("Failed to load reCAPTCHA script")
        setError("Failed to load reCAPTCHA")
        onChange("script-load-error-bypass")
      }
      document.head.appendChild(script)
    }

    loadReCaptcha()
  }, [isEnabled, currentSiteKey, onChange])

  useEffect(() => {
    if (!isLoaded || !isEnabled || !currentSiteKey || !containerRef.current) {
      return
    }

    const renderReCaptcha = () => {
      try {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            try {
              if (containerRef.current && !widgetIdRef.current) {
                widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
                  sitekey: currentSiteKey,
                  callback: (token: string) => {
                    onChange(token)
                  },
                  "expired-callback": () => {
                    onChange("expired-token-bypass")
                  },
                  "error-callback": () => {
                    console.warn("reCAPTCHA error occurred")
                    onChange("error-bypass-token")
                  },
                })
              }
            } catch (error) {
              console.warn("Error rendering reCAPTCHA:", error)
              setError("Error rendering reCAPTCHA")
              onChange("render-error-bypass")
            }
          })
        }
      } catch (error) {
        console.warn("Error initializing reCAPTCHA:", error)
        setError("Error initializing reCAPTCHA")
        onChange("init-error-bypass")
      }
    }

    renderReCaptcha()

    return () => {
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current)
        } catch (error) {
          console.warn("Error resetting reCAPTCHA:", error)
        }
        widgetIdRef.current = null
      }
    }
  }, [isLoaded, isEnabled, currentSiteKey, onChange])

  if (!isEnabled) {
    return <div className="text-sm text-gray-500 text-center">reCAPTCHA is disabled in development mode</div>
  }

  if (error) {
    return <div className="text-sm text-red-500 text-center">{error} - Form submission will continue</div>
  }

  return (
    <div className="flex justify-center">
      <div ref={containerRef} />
    </div>
  )
}
