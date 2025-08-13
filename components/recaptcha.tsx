"use client"

import { useEffect, useRef } from "react"

interface ReCAPTCHAProps {
  onVerify: (token: string) => void
}

declare global {
  interface Window {
    grecaptcha: any
    onRecaptchaLoad: () => void
  }
}

export default function ReCAPTCHA({ onVerify }: ReCAPTCHAProps) {
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  useEffect(() => {
    const loadRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && recaptchaRef.current) {
        try {
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
            size: "invisible",
            callback: onVerify,
            "error-callback": () => {
              console.error("reCAPTCHA error")
            },
            "expired-callback": () => {
              console.log("reCAPTCHA expired")
            },
          })

          // Add execute method to the container
          if (recaptchaRef.current) {
            ;(recaptchaRef.current as any).execute = () => {
              if (widgetIdRef.current !== null) {
                window.grecaptcha.execute(widgetIdRef.current)
              }
            }
          }
        } catch (error) {
          console.error("Error rendering reCAPTCHA:", error)
        }
      }
    }

    // Set up global callback
    window.onRecaptchaLoad = loadRecaptcha

    // Load reCAPTCHA script if not already loaded
    if (!window.grecaptcha) {
      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    } else {
      loadRecaptcha()
    }

    return () => {
      // Cleanup
      if (widgetIdRef.current !== null && window.grecaptcha && window.grecaptcha.reset) {
        try {
          window.grecaptcha.reset(widgetIdRef.current)
        } catch (error) {
          console.error("Error resetting reCAPTCHA:", error)
        }
      }
    }
  }, [onVerify])

  return <div ref={recaptchaRef} className="invisible-recaptcha" />
}

export { ReCAPTCHA }
