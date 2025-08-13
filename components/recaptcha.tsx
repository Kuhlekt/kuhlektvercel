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
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState(false)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    // Fetch reCAPTCHA configuration
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => {
        setSiteKey(data.siteKey || "")
        setIsEnabled(data.enabled || false)

        if (!data.enabled) {
          // If reCAPTCHA is disabled, provide fallback token
          const fallbackToken = "recaptcha-disabled-fallback-token"
          onVerify(fallbackToken)
          onChange?.(fallbackToken)
          return
        }

        if (!data.siteKey) {
          setError("reCAPTCHA site key not configured")
          const fallbackToken = "recaptcha-config-error-fallback-token"
          onVerify(fallbackToken)
          onChange?.(fallbackToken)
          return
        }

        // Load reCAPTCHA script
        loadRecaptchaScript()
      })
      .catch((err) => {
        console.error("Failed to fetch reCAPTCHA config:", err)
        setError("Failed to load reCAPTCHA configuration")
        const fallbackToken = "recaptcha-error-fallback-token"
        onVerify(fallbackToken)
        onChange?.(fallbackToken)
      })
  }, [onVerify, onChange])

  const loadRecaptchaScript = () => {
    if (window.grecaptcha) {
      initializeRecaptcha()
      return
    }

    // Set up callback for when script loads
    window.onRecaptchaLoad = () => {
      setIsLoaded(true)
      initializeRecaptcha()
    }

    // Load the script
    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`
    script.async = true
    script.defer = true
    script.onerror = () => {
      console.error("Failed to load reCAPTCHA script")
      setError("Failed to load reCAPTCHA")
      const fallbackToken = "recaptcha-error-fallback-token"
      onVerify(fallbackToken)
      onChange?.(fallbackToken)
    }
    document.head.appendChild(script)
  }

  const initializeRecaptcha = () => {
    if (!window.grecaptcha || !recaptchaRef.current || !siteKey) return

    try {
      window.grecaptcha.render(recaptchaRef.current, {
        sitekey: siteKey,
        size: "invisible",
        callback: (token: string) => {
          onVerify(token)
          onChange?.(token)
        },
        "error-callback": () => {
          console.error("reCAPTCHA error occurred")
          setError("reCAPTCHA verification failed")
          const fallbackToken = "recaptcha-error-fallback-token"
          onVerify(fallbackToken)
          onChange?.(fallbackToken)
        },
      })

      // Auto-execute invisible reCAPTCHA
      setTimeout(() => {
        if (window.grecaptcha) {
          window.grecaptcha.execute()
        }
      }, 1000)
    } catch (err) {
      console.error("reCAPTCHA initialization error:", err)
      setError("reCAPTCHA initialization failed")
      const fallbackToken = "recaptcha-error-fallback-token"
      onVerify(fallbackToken)
      onChange?.(fallbackToken)
    }
  }

  // Development mode fallback
  useEffect(() => {
    if (process.env.NODE_ENV === "development" && !isEnabled) {
      const fallbackToken = "development-mode-token"
      onVerify(fallbackToken)
      onChange?.(fallbackToken)
    }
  }, [isEnabled, onVerify, onChange])

  if (!isEnabled) {
    return <div className="text-sm text-gray-500">reCAPTCHA verification disabled</div>
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
