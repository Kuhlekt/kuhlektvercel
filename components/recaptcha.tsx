"use client"

import { useEffect, useRef, useState } from "react"

interface ReCAPTCHAProps {
  onVerify: (token: string) => void
}

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
  }
}

export default function ReCAPTCHA({ onVerify }: ReCAPTCHAProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Fetch site key from server
    async function fetchSiteKey() {
      try {
        const response = await fetch("/api/recaptcha-config")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSiteKey(data.siteKey || "")
        setIsEnabled(data.isEnabled || false)

        // If reCAPTCHA is disabled, provide a development token
        if (!data.isEnabled) {
          onVerify("development-mode")
        }
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA config:", error)
        setIsEnabled(false)
        setHasError(true)
        // Provide development token on error
        onVerify("development-mode")
      }
    }

    fetchSiteKey()
  }, [onVerify])

  useEffect(() => {
    if (!isEnabled || !siteKey || isLoaded || hasError) return

    const loadRecaptcha = () => {
      try {
        if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current && !widgetIdRef.current) {
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            size: "invisible",
            callback: (token: string) => {
              if (token) {
                console.log("reCAPTCHA success")
                onVerify(token)
              } else {
                console.warn("reCAPTCHA returned empty token")
                onVerify("development-mode")
              }
            },
            "error-callback": () => {
              console.warn("reCAPTCHA error - using development mode")
              setHasError(true)
              onVerify("development-mode")
            },
            "expired-callback": () => {
              console.warn("reCAPTCHA expired - using development mode")
              onVerify("development-mode")
            },
          })

          // Add execute method to the container
          if (recaptchaRef.current) {
            ;(recaptchaRef.current as any).execute = () => {
              if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.execute) {
                try {
                  window.grecaptcha.execute(widgetIdRef.current)
                } catch (error) {
                  console.warn("Error executing reCAPTCHA:", error)
                  onVerify("development-mode")
                }
              } else {
                onVerify("development-mode")
              }
            }
          }

          setIsLoaded(true)
        }
      } catch (error) {
        console.error("Error rendering reCAPTCHA:", error)
        setHasError(true)
        onVerify("development-mode")
      }
    }

    // Set up global callback
    window.onRecaptchaLoad = loadRecaptcha

    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
      script.async = true
      script.defer = true
      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script")
        setHasError(true)
        onVerify("development-mode")
      }
      document.head.appendChild(script)
    } else {
      loadRecaptcha()
    }

    return () => {
      // Cleanup
      if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current)
        } catch (error) {
          console.error("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [onVerify, siteKey, isEnabled, isLoaded, hasError])

  if (!isEnabled || hasError) {
    return null
  }

  return <div ref={recaptchaRef} className="invisible-recaptcha" />
}

export { ReCAPTCHA }
