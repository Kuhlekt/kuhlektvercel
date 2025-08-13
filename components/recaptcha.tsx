"use client"

import { useEffect, useState } from "react"

interface RecaptchaProps {
  onVerify?: (token: string) => void
}

export default function Recaptcha({ onVerify }: RecaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Fetch reCAPTCHA configuration
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => {
        setSiteKey(data.siteKey)
        setIsEnabled(data.enabled)

        if (data.enabled && data.siteKey) {
          loadReCAPTCHA(data.siteKey)
        } else {
          // Provide bypass token for development
          if (onVerify) {
            onVerify("development-bypass-token")
          }
        }
      })
      .catch((error) => {
        console.error("Failed to fetch reCAPTCHA config:", error)
        // Provide bypass token on error
        if (onVerify) {
          onVerify("development-bypass-token")
        }
      })
  }, [onVerify])

  const loadReCAPTCHA = (key: string) => {
    if (isLoaded || !key) return

    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${key}`
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)

      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          executeReCAPTCHA(key)
        })
      }
    }

    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script")
      // Provide bypass token on script load error
      if (onVerify) {
        onVerify("development-bypass-token")
      }
    }

    document.head.appendChild(script)
  }

  const executeReCAPTCHA = (key: string) => {
    if (!window.grecaptcha || !key) {
      if (onVerify) {
        onVerify("development-bypass-token")
      }
      return
    }

    try {
      window.grecaptcha
        .execute(key, { action: "submit" })
        .then((token: string) => {
          if (onVerify) {
            onVerify(token)
          }
        })
        .catch((error: any) => {
          console.error("reCAPTCHA execution error:", error)
          // Provide bypass token on execution error
          if (onVerify) {
            onVerify("development-bypass-token")
          }
        })
    } catch (error) {
      console.error("reCAPTCHA error:", error)
      // Provide bypass token on any error
      if (onVerify) {
        onVerify("development-bypass-token")
      }
    }
  }

  // Add hidden input for form submission
  return (
    <div>
      <input type="hidden" name="recaptcha-token" value="" />
      {!isEnabled && <p className="text-xs text-gray-500 mt-2">reCAPTCHA is disabled in development mode</p>}
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: any
  }
}
