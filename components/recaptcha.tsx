"use client"

import { useEffect, useState, useRef } from "react"

interface RecaptchaProps {
  onVerify?: (token: string) => void
}

export default function Recaptcha({ onVerify }: RecaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState<string | null>(null)
  const [isEnabled, setIsEnabled] = useState(false)
  const [token, setToken] = useState<string>("")
  const hiddenInputRef = useRef<HTMLInputElement>(null)

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
          const bypassToken = "development-bypass-token"
          setToken(bypassToken)
          updateHiddenInput(bypassToken)
          if (onVerify) {
            onVerify(bypassToken)
          }
        }
      })
      .catch((error) => {
        console.error("Failed to fetch reCAPTCHA config:", error)
        // Provide bypass token on error
        const bypassToken = "development-bypass-token"
        setToken(bypassToken)
        updateHiddenInput(bypassToken)
        if (onVerify) {
          onVerify(bypassToken)
        }
      })
  }, [onVerify])

  const updateHiddenInput = (tokenValue: string) => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = tokenValue
    }
  }

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
      const bypassToken = "development-bypass-token"
      setToken(bypassToken)
      updateHiddenInput(bypassToken)
      if (onVerify) {
        onVerify(bypassToken)
      }
    }

    document.head.appendChild(script)
  }

  const executeReCAPTCHA = (key: string) => {
    if (!window.grecaptcha || !key) {
      const bypassToken = "development-bypass-token"
      setToken(bypassToken)
      updateHiddenInput(bypassToken)
      if (onVerify) {
        onVerify(bypassToken)
      }
      return
    }

    try {
      window.grecaptcha
        .execute(key, { action: "submit" })
        .then((tokenValue: string) => {
          console.log("reCAPTCHA token received:", tokenValue ? "✓" : "✗")
          setToken(tokenValue)
          updateHiddenInput(tokenValue)
          if (onVerify) {
            onVerify(tokenValue)
          }
        })
        .catch((error: any) => {
          console.error("reCAPTCHA execution error:", error)
          // Provide bypass token on execution error
          const bypassToken = "development-bypass-token"
          setToken(bypassToken)
          updateHiddenInput(bypassToken)
          if (onVerify) {
            onVerify(bypassToken)
          }
        })
    } catch (error) {
      console.error("reCAPTCHA error:", error)
      // Provide bypass token on any error
      const bypassToken = "development-bypass-token"
      setToken(bypassToken)
      updateHiddenInput(bypassToken)
      if (onVerify) {
        onVerify(bypassToken)
      }
    }
  }

  return (
    <div>
      <input ref={hiddenInputRef} type="hidden" name="recaptcha-token" value={token} readOnly />
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
