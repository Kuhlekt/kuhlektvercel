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
  const [errorState, setErrorState] = useState<string | null>(null)
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const retryCountRef = useRef(0)
  const maxRetries = 3

  useEffect(() => {
    const fetchRecaptchaConfig = async () => {
      try {
        const response = await fetch("/api/recaptcha-config")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        setSiteKey(data.siteKey)
        setIsEnabled(data.enabled)

        if (data.enabled && data.siteKey) {
          loadReCAPTCHA(data.siteKey)
        } else {
          handleFallbackToken("development-disabled")
        }
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA config:", error)
        setErrorState("config-fetch-failed")
        handleFallbackToken("config-error")
      }
    }

    fetchRecaptchaConfig().catch((error) => {
      console.error("Unhandled error in reCAPTCHA config fetch:", error)
      setErrorState("config-fetch-critical")
      handleFallbackToken("critical-error")
    })
  }, [onVerify])

  const handleFallbackToken = (reason: string) => {
    const bypassToken = `development-bypass-token-${reason}`
    console.log(`reCAPTCHA fallback activated: ${reason}`)
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

    const scriptTimeout = setTimeout(() => {
      console.error("reCAPTCHA script loading timeout")
      setErrorState("script-timeout")
      handleFallbackToken("script-timeout")
    }, 10000) // 10 second timeout

    script.onload = () => {
      clearTimeout(scriptTimeout)
      setIsLoaded(true)
      setErrorState(null)

      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          executeReCAPTCHA(key)
        })
      } else {
        console.error("grecaptcha not available after script load")
        setErrorState("grecaptcha-unavailable")
        handleFallbackToken("grecaptcha-unavailable")
      }
    }

    script.onerror = (error) => {
      clearTimeout(scriptTimeout)
      console.error("Failed to load reCAPTCHA script:", error)
      setErrorState("script-load-failed")
      handleFallbackToken("script-load-failed")
    }

    try {
      document.head.appendChild(script)
    } catch (error) {
      clearTimeout(scriptTimeout)
      console.error("Failed to append reCAPTCHA script:", error)
      setErrorState("script-append-failed")
      handleFallbackToken("script-append-failed")
    }
  }

  const executeReCAPTCHA = async (key: string) => {
    console.log("[v0] executeReCAPTCHA called with key:", key ? "present" : "missing")

    if (!window.grecaptcha || !key) {
      console.log("[v0] executeReCAPTCHA prerequisites missing")
      setErrorState("execution-prerequisites-missing")
      handleFallbackToken("execution-prerequisites-missing")
      return
    }

    try {
      console.log("[v0] Calling grecaptcha.execute...")
      const tokenValue = await window.grecaptcha.execute(key, { action: "submit" })
      console.log("[v0] grecaptcha.execute result:", tokenValue ? "token received" : "null/empty token")

      if (!tokenValue) {
        console.log("[v0] reCAPTCHA returned empty/null token")
        throw new Error("reCAPTCHA returned empty token")
      }

      console.log("reCAPTCHA token received:", tokenValue ? "✓" : "✗")
      setToken(tokenValue)
      updateHiddenInput(tokenValue)
      setErrorState(null)
      retryCountRef.current = 0

      if (onVerify) {
        console.log("[v0] Calling onVerify with token")
        onVerify(tokenValue)
      }
    } catch (error) {
      console.error("[v0] reCAPTCHA execution error:", error)
      console.log("[v0] Error type:", typeof error, "Error value:", error)
      retryCountRef.current += 1

      if (retryCountRef.current < maxRetries) {
        console.log(`[v0] Retrying reCAPTCHA execution (${retryCountRef.current}/${maxRetries})`)
        setTimeout(() => {
          console.log("[v0] Executing retry...")
          executeReCAPTCHA(key).catch((retryError) => {
            console.error("[v0] Retry execution failed:", retryError)
            setErrorState("retry-failed")
            handleFallbackToken("retry-failed")
          })
        }, 1000 * retryCountRef.current)
        return
      }

      console.log("[v0] Max retries reached, using fallback")
      setErrorState("execution-failed")
      handleFallbackToken("execution-failed")
    }
  }

  return (
    <div>
      <input ref={hiddenInputRef} type="hidden" name="recaptcha-token" value={token} readOnly />
      {!isEnabled && <p className="text-xs text-gray-500 mt-2">reCAPTCHA is disabled in development mode</p>}
      {errorState && <p className="text-xs text-yellow-600 mt-2">reCAPTCHA fallback active ({errorState})</p>}
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    grecaptcha: any
  }
}
