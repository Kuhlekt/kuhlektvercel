"use client"

import { useEffect, useState, useRef } from "react"

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (
        container: string | HTMLElement,
        options: { sitekey: string; callback: (token: string) => void; theme?: string },
      ) => void
    }
  }
}

interface RecaptchaProps {
  onVerify?: (token: string) => void | Promise<any>
}

export default function Recaptcha({ onVerify }: RecaptchaProps) {
  const [token, setToken] = useState<string>("")
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef<boolean>(false)

  const safeOnVerify = (token: string) => {
    try {
      if (onVerify) {
        const result = onVerify(token)
        if (result && typeof result === "object" && "then" in result && typeof result.then === "function") {
          result.catch((error: any) => {
            // Silently catch any errors from onVerify callback
          })
        }
      }
    } catch (error) {
      // Silently catch any synchronous errors
    }
  }

  useEffect(() => {
    if (initializedRef.current) {
      return
    }
    initializedRef.current = true

    const fetchConfigAndInitialize = async () => {
      try {
        const configResponse = await fetch("/api/recaptcha-config")
        const config = await configResponse.json()

        if (!config.siteKey || !config.enabled) {
          const fallbackToken = "development-bypass-token-no-site-key"
          setToken(fallbackToken)
          safeOnVerify(fallbackToken)
          return
        }

        const siteKey = config.siteKey

        const script = document.createElement("script")
        script.src = `https://www.google.com/recaptcha/api.js`
        script.async = true
        script.defer = true

        script.onload = () => {
          setScriptLoaded(true)

          if (window.grecaptcha && recaptchaRef.current) {
            window.grecaptcha.ready(() => {
              try {
                window.grecaptcha.render(recaptchaRef.current!, {
                  sitekey: siteKey,
                  callback: (responseToken: string) => {
                    setToken(responseToken)
                    safeOnVerify(responseToken)
                  },
                  theme: "light",
                })
              } catch (error) {
                console.error("Failed to render reCAPTCHA:", error)
                const fallbackToken = "development-bypass-token-render-error"
                setToken(fallbackToken)
                safeOnVerify(fallbackToken)
              }
            })
          }
        }

        script.onerror = () => {
          setScriptLoaded(false)
          const fallbackToken = "development-bypass-token-script-error"
          setToken(fallbackToken)
          safeOnVerify(fallbackToken)
        }

        document.head.appendChild(script)
      } catch (error) {
        const fallbackToken = "development-bypass-token-config-error"
        setToken(fallbackToken)
        safeOnVerify(fallbackToken)
      }
    }

    fetchConfigAndInitialize().catch((error) => {
      const fallbackToken = "development-bypass-token-init-error"
      setToken(fallbackToken)
      safeOnVerify(fallbackToken)
    })
  }, [])

  return (
    <div className="my-4">
      <div ref={recaptchaRef} id="recaptcha-container"></div>
      <input type="hidden" name="recaptcha-token" value={token} readOnly />
      <input type="hidden" name="g-recaptcha-response" value={token} readOnly />
    </div>
  )
}
