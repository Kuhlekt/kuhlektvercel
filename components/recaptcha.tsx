"use client"

import { useEffect, useState } from "react"

interface ReCaptchaProps {
  onVerify: (token: string) => void
}

export function ReCaptcha({ onVerify }: ReCaptchaProps) {
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        if (response.ok) {
          const config = await response.json()
          setSiteKey(config.siteKey || "")
          setIsEnabled(config.enabled || false)

          if (config.enabled && config.siteKey) {
            loadReCaptchaScript(config.siteKey)
          } else {
            // Provide bypass token when disabled
            onVerify("development-mode-bypass-token")
          }
        } else {
          console.warn("Failed to fetch reCAPTCHA config, using bypass token")
          onVerify("development-mode-bypass-token")
        }
      } catch (error) {
        console.error("Error fetching reCAPTCHA config:", error)
        onVerify("development-mode-bypass-token")
      }
    }

    fetchConfig()
  }, [onVerify])

  const loadReCaptchaScript = (key: string) => {
    if (isLoaded || !key) return

    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${key}`
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)
      executeReCaptcha(key)
    }

    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script")
      setError("Failed to load reCAPTCHA")
      onVerify("script-load-error-bypass-token")
    }

    document.head.appendChild(script)
  }

  const executeReCaptcha = (key: string) => {
    if (!window.grecaptcha || !key) {
      onVerify("grecaptcha-not-available-bypass-token")
      return
    }

    try {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(key, { action: "submit" })
          .then((token: string) => {
            if (token) {
              onVerify(token)
            } else {
              onVerify("empty-token-bypass")
            }
          })
          .catch((error: any) => {
            console.error("reCAPTCHA execution error:", error)
            setError("reCAPTCHA verification failed")
            onVerify("execution-error-bypass-token")
          })
      })
    } catch (error) {
      console.error("reCAPTCHA error:", error)
      setError("reCAPTCHA error occurred")
      onVerify("catch-error-bypass-token")
    }
  }

  if (!isEnabled) {
    return null
  }

  if (error) {
    return <div className="text-sm text-gray-500">reCAPTCHA temporarily unavailable (using bypass mode)</div>
  }

  return (
    <div className="text-sm text-gray-500">
      This site is protected by reCAPTCHA and the Google{" "}
      <a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline">
        Privacy Policy
      </a>{" "}
      and{" "}
      <a href="https://policies.google.com/terms" className="text-blue-600 hover:underline">
        Terms of Service
      </a>{" "}
      apply.
    </div>
  )
}

declare global {
  interface Window {
    grecaptcha: any
  }
}
