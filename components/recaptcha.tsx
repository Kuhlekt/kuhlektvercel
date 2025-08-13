"use client"

import { useEffect, useState } from "react"

interface ReCaptchaProps {
  onVerify: (token: string) => void
}

export function ReCaptcha({ onVerify }: ReCaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    // Fetch reCAPTCHA configuration
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => {
        setSiteKey(data.siteKey || "")
        setIsEnabled(data.enabled || false)

        if (data.enabled && data.siteKey) {
          loadReCaptchaScript(data.siteKey)
        } else {
          // Provide bypass token for development or when disabled
          onVerify("development-bypass-token")
        }
      })
      .catch((error) => {
        console.error("Failed to fetch reCAPTCHA config:", error)
        // Provide bypass token on error
        onVerify("config-error-bypass-token")
      })
  }, [onVerify])

  const loadReCaptchaScript = (siteKey: string) => {
    if (document.getElementById("recaptcha-script")) {
      initializeReCaptcha(siteKey)
      return
    }

    const script = document.createElement("script")
    script.id = "recaptcha-script"
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)
      initializeReCaptcha(siteKey)
    }

    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script")
      onVerify("script-error-bypass-token")
    }

    document.head.appendChild(script)
  }

  const initializeReCaptcha = (siteKey: string) => {
    if (typeof window !== "undefined" && window.grecaptcha) {
      try {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(siteKey, { action: "submit" })
            .then((token: string) => {
              onVerify(token)
            })
            .catch((error: any) => {
              console.error("reCAPTCHA execution error:", error)
              onVerify("execution-error-bypass-token")
            })
        })
      } catch (error) {
        console.error("reCAPTCHA initialization error:", error)
        onVerify("init-error-bypass-token")
      }
    }
  }

  // Auto-execute reCAPTCHA when loaded
  useEffect(() => {
    if (isLoaded && siteKey && isEnabled) {
      initializeReCaptcha(siteKey)
    }
  }, [isLoaded, siteKey, isEnabled, onVerify])

  return (
    <div className="recaptcha-container">
      {isEnabled && siteKey ? (
        <p className="text-sm text-gray-500">
          This site is protected by reCAPTCHA and the Google{" "}
          <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="https://policies.google.com/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          apply.
        </p>
      ) : (
        <p className="text-sm text-gray-500">reCAPTCHA is disabled for development</p>
      )}
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}
