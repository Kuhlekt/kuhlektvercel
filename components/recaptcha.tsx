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
    const fetchConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")
        const data = await response.json()

        setSiteKey(data.siteKey)
        setIsEnabled(data.enabled)

        if (data.enabled && data.siteKey) {
          loadReCAPTCHA(data.siteKey)
        } else {
          setFallbackToken("development-disabled")
        }
      } catch (error) {
        console.log("[v0] reCAPTCHA config fetch failed, using fallback")
        setFallbackToken("config-error")
      }
    }

    fetchConfig()
  }, [])

  const setFallbackToken = (reason: string) => {
    const bypassToken = `development-bypass-token-${reason}`
    console.log(`[v0] reCAPTCHA fallback: ${reason}`)
    setToken(bypassToken)
    updateHiddenInput(bypassToken)
    if (onVerify) {
      onVerify(bypassToken)
    }
  }

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
      } else {
        setFallbackToken("grecaptcha-unavailable")
      }
    }

    script.onerror = () => {
      console.log("[v0] reCAPTCHA script failed to load")
      setFallbackToken("script-load-failed")
    }

    document.head.appendChild(script)
  }

  const executeReCAPTCHA = (key: string) => {
    console.log("[v0] executeReCAPTCHA called")

    if (!window.grecaptcha || !key) {
      setFallbackToken("execution-prerequisites-missing")
      return
    }

    console.log("[v0] Calling grecaptcha.execute...")

    window.grecaptcha
      .execute(key, { action: "submit" })
      .then((tokenValue: string) => {
        console.log("[v0] grecaptcha.execute result:", tokenValue ? "token received" : "null/empty token")

        if (tokenValue) {
          console.log("reCAPTCHA token received: ✓")
          setToken(tokenValue)
          updateHiddenInput(tokenValue)
          if (onVerify) {
            onVerify(tokenValue)
          }
        } else {
          setFallbackToken("empty-token")
        }
      })
      .catch((error: any) => {
        console.log("[v0] reCAPTCHA execution failed:", error)
        setFallbackToken("execution-failed")
      })
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
