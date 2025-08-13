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
        setSiteKey(data.siteKey)
        setIsEnabled(data.enabled)

        if (!data.enabled) {
          // If reCAPTCHA is disabled, provide a fallback token
          const fallbackToken = "recaptcha-disabled-fallback-token"
          onVerify(fallbackToken)
          onChange?.(fallbackToken)
          return
        }

        if (!data.siteKey) {
          setError("reCAPTCHA site key not configured")
          const errorToken = "recaptcha-error-fallback-token"
          onVerify(errorToken)
          onChange?.(errorToken)
          return
        }

        // Load reCAPTCHA script
        loadRecaptchaScript()
      })
      .catch((err) => {
        console.error("Failed to fetch reCAPTCHA config:", err)
        setError("Failed to load reCAPTCHA configuration")
        const errorToken = "recaptcha-load-error-fallback-token"
        onVerify(errorToken)
        onChange?.(errorToken)
      })
  }, [onVerify, onChange])

  const loadRecaptchaScript = () => {
    if (window.grecaptcha) {
      initializeRecaptcha()
      return
    }

    window.onRecaptchaLoad = () => {
      setIsLoaded(true)
      initializeRecaptcha()
    }

    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`
    script.async = true
    script.defer = true
    script.onerror = () => {
      setError("Failed to load reCAPTCHA script")
      const errorToken = "recaptcha-load-error-fallback-token"
      onVerify(errorToken)
      onChange?.(errorToken)
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
          setError("reCAPTCHA verification failed")
          const errorToken = "recaptcha-error-fallback-token"
          onVerify(errorToken)
          onChange?.(errorToken)
        },
      })

      // Auto-execute the invisible reCAPTCHA
      setTimeout(() => {
        if (window.grecaptcha) {
          window.grecaptcha.execute()
        }
      }, 1000)
    } catch (err) {
      console.error("Error initializing reCAPTCHA:", err)
      setError("Error initializing reCAPTCHA")
      const errorToken = "recaptcha-error-fallback-token"
      onVerify(errorToken)
      onChange?.(errorToken)
    }
  }

  // Don't render anything if reCAPTCHA is disabled
  if (!isEnabled) {
    return null
  }

  if (error) {
    return <div className="text-sm text-gray-500">reCAPTCHA temporarily unavailable</div>
  }

  return (
    <div>
      <div ref={recaptchaRef}></div>
      {!isLoaded && <div className="text-sm text-gray-500">Loading security verification...</div>}
    </div>
  )
}

export default ReCaptcha
