"use client"

import { useEffect, useState } from "react"

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
  const [isLoaded, setIsLoaded] = useState(false)
  const [siteKey, setSiteKey] = useState("")

  useEffect(() => {
    // Fetch the site key from our API
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => {
        setSiteKey(data.siteKey)
        loadRecaptcha(data.siteKey)
      })
      .catch((error) => {
        console.error("Failed to load reCAPTCHA config:", error)
        // Fallback to development mode
        const devKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
        setSiteKey(devKey)
        loadRecaptcha(devKey)
      })
  }, [])

  const loadRecaptcha = (key: string) => {
    if (window.grecaptcha) {
      setIsLoaded(true)
      return
    }

    window.onRecaptchaLoad = () => {
      setIsLoaded(true)
    }

    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit"
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }

  useEffect(() => {
    if (isLoaded && siteKey && window.grecaptcha) {
      const container = document.getElementById("recaptcha-container")
      if (container && !container.hasChildNodes()) {
        window.grecaptcha.render("recaptcha-container", {
          sitekey: siteKey,
          callback: onVerify,
          "expired-callback": () => onVerify(""),
          "error-callback": () => onVerify(""),
        })
      }
    }
  }, [isLoaded, siteKey, onVerify])

  if (!siteKey) {
    return <div className="text-sm text-gray-500">Loading reCAPTCHA...</div>
  }

  return <div id="recaptcha-container" className="flex justify-center" />
}

// Named export for compatibility
export { ReCAPTCHA }

// Additional named export with different casing
export const ReCaptcha = ReCAPTCHA
