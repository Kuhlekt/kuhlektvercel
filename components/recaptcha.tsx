"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
import { getRecaptchaConfig } from "@/lib/recaptcha-actions"

interface RecaptchaProps {
  onVerify: (token: string) => void
  onExpire?: () => void
  onError?: () => void
}

interface RecaptchaConfig {
  siteKey: string
  isEnabled: boolean
}

export function Recaptcha({ onVerify, onExpire, onError }: RecaptchaProps) {
  const [config, setConfig] = useState<RecaptchaConfig | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    getRecaptchaConfig()
      .then(setConfig)
      .catch((error) => {
        console.error("Failed to load reCAPTCHA config:", error)
        setConfig({ siteKey: "", isEnabled: false })
      })
  }, [])

  useEffect(() => {
    if (isLoaded && config?.isEnabled && config.siteKey && typeof window !== "undefined" && window.grecaptcha) {
      try {
        const widgetId = window.grecaptcha.render("recaptcha-container", {
          sitekey: config.siteKey,
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
        })

        return () => {
          if (typeof window !== "undefined" && window.grecaptcha && widgetId !== undefined) {
            try {
              window.grecaptcha.reset(widgetId)
            } catch (e) {
              // Ignore reset errors
            }
          }
        }
      } catch (error) {
        console.error("reCAPTCHA render error:", error)
      }
    }
  }, [isLoaded, config, onVerify, onExpire, onError])

  if (!config?.isEnabled || !config.siteKey) {
    return null
  }

  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js"
        onLoad={() => setIsLoaded(true)}
        onError={() => console.error("Failed to load reCAPTCHA script")}
      />
      <div id="recaptcha-container" />
    </>
  )
}

declare global {
  interface Window {
    grecaptcha: any
  }
}
