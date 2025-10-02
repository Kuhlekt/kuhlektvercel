"use client"

import { useEffect, useState } from "react"

interface ReCAPTCHAProps {
  onVerify: (token: string | null) => void
}

export function ReCAPTCHA({ onVerify }: ReCAPTCHAProps) {
  const [siteKey, setSiteKey] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    fetch("/api/recaptcha-config")
      .then((res) => res.json())
      .then((data) => setSiteKey(data.siteKey))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (!siteKey) return

    const script = document.createElement("script")
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`
    script.async = true
    script.defer = true
    script.onload = () => setIsLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [siteKey])

  useEffect(() => {
    if (!isLoaded || !siteKey) return

    window.grecaptcha?.ready(() => {
      window.grecaptcha.execute(siteKey, { action: "submit" }).then((token: string) => {
        onVerify(token)
      })
    })
  }, [isLoaded, siteKey, onVerify])

  return (
    <div className="text-xs text-gray-500">
      This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
    </div>
  )
}

// Named export for compatibility
export { ReCAPTCHA as ReCaptcha }

// Default export
export default ReCAPTCHA
