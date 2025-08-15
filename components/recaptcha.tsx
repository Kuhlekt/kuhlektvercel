"use client"

import { useEffect, useState, useRef } from "react"

interface RecaptchaProps {
  onVerify?: (token: string) => void | Promise<any>
}

export default function Recaptcha({ onVerify }: RecaptchaProps) {
  const [token, setToken] = useState<string>("")
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false)
  const [grecaptchaReady, setGrecaptchaReady] = useState<boolean>(false)
  const initializedRef = useRef<boolean>(false)

  const safeOnVerify = (token: string) => {
    try {
      if (onVerify) {
        const result = onVerify(token)
        if (result && typeof result === "object" && "then" in result && typeof result.then === "function") {
          result.catch((error: any) => {
            console.log("[v0] onVerify promise rejected:", error)
          })
        }
      }
    } catch (error) {
      console.log("[v0] onVerify error:", error)
    }
  }

  useEffect(() => {
    if (initializedRef.current) {
      return
    }
    initializedRef.current = true

    console.log("[v0] reCAPTCHA component mounted - fetching server config")

    const fetchConfigAndInitialize = async () => {
      try {
        const configResponse = await fetch("/api/recaptcha-config")
        const config = await configResponse.json()

        if (!config.siteKey || !config.enabled) {
          console.log("[v0] No reCAPTCHA site key found, using fallback token")
          const fallbackToken = "development-bypass-token-no-site-key"
          setToken(fallbackToken)
          safeOnVerify(fallbackToken)
          return
        }

        const siteKey = config.siteKey
        console.log("[v0] Loading reCAPTCHA script with site key from server")

        const script = document.createElement("script")
        script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
        script.async = true
        script.defer = true

        script.onload = () => {
          console.log("[v0] reCAPTCHA script loaded successfully")
          setScriptLoaded(true)

          if (window.grecaptcha) {
            console.log("[v0] Calling grecaptcha.ready")
            window.grecaptcha.ready(() => {
              console.log("[v0] grecaptcha.ready callback executed")
              setGrecaptchaReady(true)

              console.log("[v0] Calling grecaptcha.execute")
              window.grecaptcha
                .execute(siteKey, { action: "submit" })
                .then((executeToken) => {
                  console.log("[v0] grecaptcha.execute result:", executeToken ? "token received" : "no token")
                  const finalToken = executeToken || "development-bypass-token-execute-failed"
                  setToken(finalToken)
                  safeOnVerify(finalToken)
                })
                .catch((error) => {
                  console.log("[v0] grecaptcha.execute error:", error)
                  const fallbackToken = "development-bypass-token-execute-error"
                  setToken(fallbackToken)
                  safeOnVerify(fallbackToken)
                })
            })
          }
        }

        script.onerror = () => {
          console.log("[v0] reCAPTCHA script failed to load")
          setScriptLoaded(false)
          const fallbackToken = "development-bypass-token-script-error"
          setToken(fallbackToken)
          safeOnVerify(fallbackToken)
        }

        document.head.appendChild(script)
      } catch (error) {
        console.log("[v0] Failed to fetch reCAPTCHA config:", error)
        const fallbackToken = "development-bypass-token-config-error"
        setToken(fallbackToken)
        safeOnVerify(fallbackToken)
      }
    }

    fetchConfigAndInitialize()
  }, [])

  return (
    <div>
      <input type="hidden" name="recaptcha-token" value={token} readOnly />
      <p className="text-xs text-gray-500 mt-2">
        reCAPTCHA execute mode - Script: {scriptLoaded ? "Yes" : "No"}, Ready: {grecaptchaReady ? "Yes" : "No"}
      </p>
    </div>
  )
}
