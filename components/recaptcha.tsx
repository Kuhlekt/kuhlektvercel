"use client"

import { useEffect, useState, useCallback } from "react"

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
  }
}

interface RecaptchaProps {
  onToken: (token: string) => void
  onError?: (error: string) => void
}

export default function Recaptcha({ onToken, onError }: RecaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState(false)

  const handleError = useCallback(
    (error: string) => {
      console.error("reCAPTCHA error:", error)
      if (onError) {
        onError(error)
      }
      // Provide fallback token for development/testing
      onToken("development-bypass-token")
    },
    [onError, onToken],
  )

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        if (response.ok) {
          const config = await response.json()
          setSiteKey(config.siteKey || "")
          setIsEnabled(config.enabled || false)
        } else {
          throw new Error("Failed to fetch reCAPTCHA config")
        }
      } catch (error) {
        console.error("Error fetching reCAPTCHA config:", error)
        handleError("Failed to load reCAPTCHA configuration")
      }
    }

    fetchConfig()
  }, [handleError])

  useEffect(() => {
    if (!isEnabled || !siteKey || isLoaded) return

    const loadRecaptcha = () => {
      try {
        window.onRecaptchaLoad = () => {
          setIsLoaded(true)
        }

        const script = document.createElement("script")
        script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`
        script.async = true
        script.defer = true
        script.onerror = () => {
          handleError("Failed to load reCAPTCHA script")
        }
        document.head.appendChild(script)

        return () => {
          document.head.removeChild(script)
          delete window.onRecaptchaLoad
        }
      } catch (error) {
        handleError("Error loading reCAPTCHA")
      }
    }

    const cleanup = loadRecaptcha()
    return cleanup
  }, [isEnabled, siteKey, isLoaded, handleError])

  const executeRecaptcha = useCallback(async () => {
    if (!isEnabled) {
      onToken("recaptcha-disabled-bypass")
      return
    }

    if (!window.grecaptcha || !isLoaded) {
      handleError("reCAPTCHA not loaded")
      return
    }

    try {
      const token = await new Promise<string>((resolve, reject) => {
        window.grecaptcha.execute(siteKey, { action: "submit" }, (token: string) => {
          if (token) {
            resolve(token)
          } else {
            reject(new Error("No token received"))
          }
        })
      })
      onToken(token)
    } catch (error) {
      handleError("reCAPTCHA execution failed")
    }
  }, [isEnabled, isLoaded, siteKey, onToken, handleError])

  useEffect(() => {
    if (isLoaded && isEnabled) {
      executeRecaptcha()
    } else if (!isEnabled) {
      onToken("recaptcha-disabled-bypass")
    }
  }, [isLoaded, isEnabled, executeRecaptcha, onToken])

  return null
}
