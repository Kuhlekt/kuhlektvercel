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
  const [isEnabled, setIsEnabled] = useState(false)
  const [siteKey, setSiteKey] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/api/recaptcha-config")
        if (response.ok) {
          const config = await response.json()
          setSiteKey(config.siteKey || "")
          setIsEnabled(config.isEnabled || false)
        } else {
          console.warn("Failed to fetch reCAPTCHA config")
          setIsEnabled(false)
        }
      } catch (error) {
        console.warn("Error fetching reCAPTCHA config:", error)
        setIsEnabled(false)
      } finally {
        setIsLoading(false)
        // Always provide a token, even if reCAPTCHA is disabled
        if (!isEnabled) {
          onVerify("development-bypass-token")
        }
      }
    }

    fetchConfig()
  }, [isEnabled, onVerify])

  useEffect(() => {
    if (isLoading || !isEnabled || !siteKey) {
      return
    }

    // If reCAPTCHA is disabled, provide bypass token
    if (!isEnabled) {
      onVerify("development-bypass-token")
      return
    }

    const loadScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src*="recaptcha"]')) {
        return
      }

      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit"
      script.async = true
      script.defer = true

      script.onload = () => {
        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            try {
              if (recaptchaRef.current) {
                window.grecaptcha.render(recaptchaRef.current, {
                  sitekey: siteKey,
                  size: "invisible",
                  callback: (token: string) => {
                    if (token) {
                      onVerify(token)
                    } else {
                      onVerify("development-bypass-token")
                    }
                  },
                  "error-callback": () => {
                    console.warn("reCAPTCHA error - providing bypass token")
                    onVerify("development-bypass-token")
                  },
                  "expired-callback": () => {
                    console.warn("reCAPTCHA expired - providing bypass token")
                    onVerify("development-bypass-token")
                  },
                })
              }
            } catch (error) {
              console.warn("Error rendering reCAPTCHA:", error)
              onVerify("development-bypass-token")
            }
          })
        }
      }

      script.onerror = () => {
        console.warn("Failed to load reCAPTCHA script - providing bypass token")
        onVerify("development-bypass-token")
      }

      document.head.appendChild(script)
    }

    loadScript()
  }, [isLoading, isEnabled, siteKey, onVerify])

  // Don't render anything if loading or disabled
  if (isLoading || !isEnabled || !siteKey) {
    return null
  }

  return <div ref={recaptchaRef} className="recaptcha-container" />
}

export { ReCAPTCHA }
