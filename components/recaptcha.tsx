"use client"

import { useEffect, useRef, useState } from "react"

interface ReCaptchaProps {
  onVerify: (token: string) => void
  onChange?: (token: string) => void
}

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
  }
}

export function ReCaptcha({ onVerify, onChange }: ReCaptchaProps) {
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)

  useEffect(() => {
    // Fetch reCAPTCHA configuration
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => {
        setSiteKey(data.siteKey || "")
        setIsEnabled(data.isEnabled || false)

        if (!data.siteKey && data.isEnabled) {
          setError("reCAPTCHA site key not configured")
          // Provide fallback token
          const fallbackToken = "recaptcha-error-fallback-token"
          onVerify(fallbackToken)
          onChange?.(fallbackToken)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch reCAPTCHA config:", err)
        setError("Failed to load reCAPTCHA configuration")
        // Provide fallback token
        const fallbackToken = "recaptcha-error-fallback-token"
        onVerify(fallbackToken)
        onChange?.(fallbackToken)
      })
  }, [onVerify, onChange])

  useEffect(() => {
    if (!isEnabled || !siteKey || isLoaded) return

    // Set up global callback
    window.onRecaptchaLoad = () => {
      setIsLoaded(true)
    }

    // Load reCAPTCHA script
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`
    script.async = true
    script.defer = true

    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script")
      setError("Failed to load reCAPTCHA")
      // Provide fallback token
      const fallbackToken = "recaptcha-not-loaded-token"
      onVerify(fallbackToken)
      onChange?.(fallbackToken)
    }

    document.head.appendChild(script)

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
      if (window.onRecaptchaLoad) {
        delete window.onRecaptchaLoad
      }
    }
  }, [isEnabled, siteKey, isLoaded, onVerify, onChange])

  useEffect(() => {
    if (!isLoaded || !window.grecaptcha || !recaptchaRef.current || widgetId.current !== null) return

    try {
      widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
        sitekey: siteKey,
        size: "invisible",
        callback: (token: string) => {
          onVerify(token)
          onChange?.(token)
        },
        "error-callback": () => {
          console.error("reCAPTCHA error occurred")
          setError("reCAPTCHA verification failed")
          // Provide fallback token
          const fallbackToken = "recaptcha-error-fallback-token"
          onVerify(fallbackToken)
          onChange?.(fallbackToken)
        },
        "expired-callback": () => {
          console.log("reCAPTCHA expired")
          // Reset and provide fallback
          const fallbackToken = "recaptcha-timeout-token"
          onVerify(fallbackToken)
          onChange?.(fallbackToken)
        },
      })
    } catch (err) {
      console.error("Error rendering reCAPTCHA:", err)
      setError("Error initializing reCAPTCHA")
      // Provide fallback token
      const fallbackToken = "recaptcha-error-fallback-token"
      onVerify(fallbackToken)
      onChange?.(fallbackToken)
    }
  }, [isLoaded, siteKey, onVerify, onChange])

  // Auto-execute invisible reCAPTCHA
  useEffect(() => {
    if (widgetId.current !== null && window.grecaptcha) {
      const timer = setTimeout(() => {
        try {
          window.grecaptcha.execute(widgetId.current)
        } catch (err) {
          console.error("Error executing reCAPTCHA:", err)
          // Provide fallback token
          const fallbackToken = "recaptcha-error-fallback-token"
          onVerify(fallbackToken)
          onChange?.(fallbackToken)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [widgetId.current, onVerify, onChange])

  // Provide development token if reCAPTCHA is disabled
  useEffect(() => {
    if (!isEnabled) {
      const devToken = "development-mode-token"
      onVerify(devToken)
      onChange?.(devToken)
    }
  }, [isEnabled, onVerify, onChange])

  if (!isEnabled) {
    return <div className="text-sm text-gray-500">reCAPTCHA is disabled in development mode</div>
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>
  }

  return (
    <div>
      <div ref={recaptchaRef}></div>
      {!isLoaded && <div className="text-sm text-gray-500">Loading reCAPTCHA...</div>}
    </div>
  )
}

export default ReCaptcha
