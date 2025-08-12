"use client"

import { useEffect, useRef, useState } from "react"

interface ReCAPTCHAProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  theme?: "light" | "dark"
  size?: "normal" | "compact"
}

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
  }
}

export function ReCAPTCHA({ onVerify, onExpire, theme = "light", size = "normal" }: ReCAPTCHAProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Fetch the site key from our API
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => {
        setSiteKey(data.siteKey)
      })
      .catch((error) => {
        console.error("Failed to fetch reCAPTCHA config:", error)
        // Use development mode token if config fails
        onVerify("development-mode")
      })
  }, [onVerify])

  useEffect(() => {
    if (!siteKey) return

    // Check if reCAPTCHA is already loaded
    if (window.grecaptcha && window.grecaptcha.render) {
      setIsLoaded(true)
      return
    }

    // Define the callback function
    window.onRecaptchaLoad = () => {
      setIsLoaded(true)
    }

    // Load the reCAPTCHA script
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      delete window.onRecaptchaLoad
    }
  }, [siteKey])

  useEffect(() => {
    if (isLoaded && siteKey && recaptchaRef.current && !widgetIdRef.current) {
      try {
        widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: (token: string) => {
            onVerify(token)
          },
          "expired-callback": () => {
            onExpire?.()
          },
        })
      } catch (error) {
        console.error("Failed to render reCAPTCHA:", error)
        // Fallback to development mode
        onVerify("development-mode")
      }
    }
  }, [isLoaded, siteKey, theme, size, onVerify, onExpire])

  if (!siteKey) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded">
        <div className="text-sm text-gray-600">Loading verification...</div>
      </div>
    )
  }

  return <div ref={recaptchaRef} className="flex justify-center" />
}

// Named export for compatibility
export { ReCAPTCHA as ReCaptcha }

// Default export
export default ReCAPTCHA
