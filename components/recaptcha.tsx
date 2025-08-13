"use client"

import { useEffect, useState } from "react"

interface ReCaptchaProps {
  onVerify: (token: string) => void
}

export function ReCaptcha({ onVerify }: ReCaptchaProps) {
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        if (response.ok) {
          const config = await response.json()
          setSiteKey(config.siteKey)
          setIsEnabled(config.enabled)
        } else {
          setError("Failed to load reCAPTCHA configuration")
        }
      } catch (err) {
        setError("Failed to load reCAPTCHA configuration")
        console.error("reCAPTCHA config error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [])

  useEffect(() => {
    if (!isEnabled || !siteKey || error) {
      // If reCAPTCHA is disabled or there's an error, automatically verify
      onVerify("disabled")
      setIsLoaded(true)
      return
    }

    // Load reCAPTCHA script
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(siteKey, { action: "submit" })
            .then((token: string) => {
              onVerify(token)
              setIsLoaded(true)
            })
            .catch((err: any) => {
              console.error("reCAPTCHA execution error:", err)
              onVerify("error")
              setIsLoaded(true)
            })
        })
      }
    }

    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script")
      onVerify("error")
      setIsLoaded(true)
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [siteKey, isEnabled, onVerify, error])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="text-sm text-gray-500">Loading security verification...</div>
      </div>
    )
  }

  if (error || !isEnabled || !isLoaded) {
    return null
  }

  return <div className="text-xs text-gray-500 text-center py-2">Security verification enabled</div>
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: any
  }
}

export default ReCaptcha
