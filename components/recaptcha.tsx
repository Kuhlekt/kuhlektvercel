"use client"

import { useEffect, useState, useRef } from "react"

interface ReCaptchaProps {
  onVerify: (token: string) => void
  onError?: (error: string) => void
}

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
  }
}

export default function ReCaptcha({ onVerify, onError }: ReCaptchaProps) {
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        if (!response.ok) {
          throw new Error("Failed to fetch reCAPTCHA config")
        }
        const config = await response.json()
        setSiteKey(config.siteKey || "")
        setIsEnabled(config.isEnabled || false)
      } catch (error) {
        console.error("Error fetching reCAPTCHA config:", error)
        setError("Failed to load reCAPTCHA configuration")
        // Provide fallback token for development
        onVerify("development-mode-token")
      }
    }

    fetchConfig()
  }, [onVerify])

  useEffect(() => {
    if (!siteKey || !isEnabled || isLoaded) return

    const loadRecaptcha = () => {
      try {
        // Create script element
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
        script.async = true
        script.defer = true

        script.onerror = () => {
          console.error("Failed to load reCAPTCHA script")
          setError("Failed to load reCAPTCHA")
          onVerify("development-mode-token")
        }

        // Define the callback function
        window.onRecaptchaLoad = () => {
          try {
            if (window.grecaptcha && recaptchaRef.current && !widgetId.current) {
              widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
                sitekey: siteKey,
                callback: (token: string) => {
                  if (token) {
                    onVerify(token)
                  } else {
                    onVerify("development-mode-token")
                  }
                },
                "error-callback": () => {
                  console.error("reCAPTCHA error occurred")
                  setError("reCAPTCHA verification failed")
                  if (onError) {
                    onError("reCAPTCHA verification failed")
                  }
                  // Provide fallback token
                  onVerify("development-mode-token")
                },
                "expired-callback": () => {
                  console.warn("reCAPTCHA expired")
                  setError("reCAPTCHA expired, please try again")
                  if (onError) {
                    onError("reCAPTCHA expired")
                  }
                  // Provide fallback token
                  onVerify("development-mode-token")
                },
              })
              setIsLoaded(true)
            }
          } catch (error) {
            console.error("Error rendering reCAPTCHA:", error)
            setError("Error rendering reCAPTCHA")
            onVerify("development-mode-token")
          }
        }

        document.head.appendChild(script)

        return () => {
          // Cleanup
          if (script.parentNode) {
            script.parentNode.removeChild(script)
          }
          if (window.onRecaptchaLoad) {
            delete window.onRecaptchaLoad
          }
        }
      } catch (error) {
        console.error("Error loading reCAPTCHA:", error)
        setError("Error loading reCAPTCHA")
        onVerify("development-mode-token")
      }
    }

    loadRecaptcha()
  }, [siteKey, isEnabled, isLoaded, onVerify, onError])

  const executeRecaptcha = async (): Promise<string> => {
    return new Promise((resolve) => {
      try {
        if (!isEnabled || !siteKey) {
          resolve("development-mode-token")
          return
        }

        if (window.grecaptcha && widgetId.current !== null) {
          const token = window.grecaptcha.getResponse(widgetId.current)
          if (token) {
            resolve(token)
          } else {
            // Reset and try again
            window.grecaptcha.reset(widgetId.current)
            resolve("development-mode-token")
          }
        } else {
          resolve("development-mode-token")
        }
      } catch (error) {
        console.error("Error executing reCAPTCHA:", error)
        resolve("development-mode-token")
      }
    })
  }

  // Expose executeRecaptcha method
  useEffect(() => {
    if (recaptchaRef.current) {
      ;(recaptchaRef.current as any).executeRecaptcha = executeRecaptcha
    }
  }, [])

  if (!isEnabled || !siteKey) {
    return null
  }

  return (
    <div className="recaptcha-container">
      <div ref={recaptchaRef} className="g-recaptcha"></div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  )
}
