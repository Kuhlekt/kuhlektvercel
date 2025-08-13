"use client"

import { useEffect, useState, useCallback } from "react"

interface RecaptchaProps {
  onVerify: (token: string) => void
  onError?: () => void
}

export default function Recaptcha({ onVerify, onError }: RecaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        if (response.ok) {
          const config = await response.json()
          setSiteKey(config.siteKey)
          setIsEnabled(config.enabled)
        } else {
          console.warn("Failed to fetch reCAPTCHA config")
          setIsEnabled(false)
        }
      } catch (error) {
        console.error("Error fetching reCAPTCHA config:", error)
        setIsEnabled(false)
      }
    }

    fetchConfig()
  }, [])

  const loadRecaptchaScript = useCallback(() => {
    if (typeof window !== "undefined" && !window.grecaptcha && siteKey && isEnabled) {
      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit"
      script.async = true
      script.defer = true
      script.onload = () => {
        setIsLoaded(true)
      }
      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script")
        onVerify("development-bypass-token")
        if (onError) onError()
      }
      document.head.appendChild(script)
    } else if (!isEnabled) {
      // If reCAPTCHA is disabled, provide bypass token
      onVerify("development-bypass-token")
    }
  }, [siteKey, isEnabled, onVerify, onError])

  useEffect(() => {
    if (siteKey !== null) {
      loadRecaptchaScript()
    }
  }, [siteKey, loadRecaptchaScript])

  const executeRecaptcha = useCallback(() => {
    if (!isEnabled) {
      onVerify("development-bypass-token")
      return
    }

    if (typeof window !== "undefined" && window.grecaptcha && isLoaded && siteKey) {
      try {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(siteKey, { action: "submit" })
            .then((token: string) => {
              if (token) {
                onVerify(token)
              } else {
                console.warn("reCAPTCHA returned empty token")
                onVerify("development-bypass-token")
              }
            })
            .catch((error: any) => {
              console.error("reCAPTCHA execution error:", error)
              onVerify("development-bypass-token")
              if (onError) onError()
            })
        })
      } catch (error) {
        console.error("reCAPTCHA error:", error)
        onVerify("development-bypass-token")
        if (onError) onError()
      }
    } else {
      // Fallback if reCAPTCHA is not available
      onVerify("development-bypass-token")
    }
  }, [isLoaded, siteKey, isEnabled, onVerify, onError])

  useEffect(() => {
    if (isLoaded || !isEnabled) {
      executeRecaptcha()
    }
  }, [isLoaded, isEnabled, executeRecaptcha])

  return null
}

declare global {
  interface Window {
    grecaptcha: any
  }
}
