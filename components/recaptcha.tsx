"use client"

import { useEffect, useState, useRef } from "react"

interface ReCAPTCHAProps {
  onVerify: (token: string) => void
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (container: string | HTMLElement, options: any) => number
      getResponse: (widgetId?: number) => string
      reset: (widgetId?: number) => void
    }
  }
}

const ReCAPTCHA = ({ onVerify }: ReCAPTCHAProps) => {
  const [siteKey, setSiteKey] = useState<string>("")
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string>("")
  const [retryCount, setRetryCount] = useState(0)
  const recaptchaRef = useRef<HTMLDivElement>(null)
  const widgetId = useRef<number | null>(null)
  const isRendered = useRef<boolean>(false)
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    async function fetchSiteKey() {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000) // Increased timeout to 8 seconds

        const response = await fetch("/api/recaptcha-config", {
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        const data = await response.json()
        setSiteKey(data.siteKey || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI")
        setIsEnabled(data.enabled !== false)
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA config:", error)
        setSiteKey("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI")
        setIsEnabled(true)
      }
    }

    fetchSiteKey()
  }, [])

  const retryLoad = () => {
    if (retryCount < 2) {
      setRetryCount((prev) => prev + 1)
      setError("")
      setIsLoaded(false)
      isRendered.current = false
    }
  }

  useEffect(() => {
    if (!isEnabled || !siteKey) return

    const loadRecaptcha = () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }

      if (window.grecaptcha && window.grecaptcha.ready) {
        window.grecaptcha.ready(() => {
          setIsLoaded(true)
          setError("")
        })
        return
      }

      const script = document.createElement("script")
      script.src = "https://www.google.com/recaptcha/api.js"
      script.async = true
      script.defer = true

      loadingTimeout.current = setTimeout(() => {
        setError("reCAPTCHA loading timeout")
      }, 20000)

      script.onload = () => {
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current)
        }

        if (window.grecaptcha && window.grecaptcha.ready) {
          window.grecaptcha.ready(() => {
            setIsLoaded(true)
            setError("")
          })
        }
      }

      script.onerror = () => {
        if (loadingTimeout.current) {
          clearTimeout(loadingTimeout.current)
        }
        setError("Failed to load reCAPTCHA script")
      }

      if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
        document.head.appendChild(script)
      }
    }

    loadRecaptcha()

    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }
    }
  }, [siteKey, isEnabled, retryCount]) // Added retryCount to dependencies

  useEffect(() => {
    if (isLoaded && siteKey && recaptchaRef.current && window.grecaptcha && !isRendered.current) {
      try {
        // Clear any existing content in the container
        if (recaptchaRef.current) {
          recaptchaRef.current.innerHTML = ""
        }

        widgetId.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: siteKey,
          size: "normal",
          callback: (token: string) => {
            if (token) {
              onVerify(token)
              setError("") // Clear any previous errors on successful verification
            }
          },
          "expired-callback": () => {
            setError("reCAPTCHA expired, please try again")
          },
          "error-callback": () => {
            setError("reCAPTCHA error occurred")
          },
        })

        isRendered.current = true
      } catch (err) {
        console.error("Failed to render reCAPTCHA:", err)
        setError(`Failed to render reCAPTCHA: ${err}`)
      }
    }
  }, [isLoaded, siteKey, onVerify])

  useEffect(() => {
    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current)
      }

      if (widgetId.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetId.current)
        } catch (err) {
          console.error("Error resetting reCAPTCHA:", err)
        }
      }
      isRendered.current = false
      widgetId.current = null
    }
  }, [])

  if (!isEnabled) {
    return null
  }

  return (
    <div className="my-4">
      <div ref={recaptchaRef} />
      {error && (
        <div className="text-sm text-red-600 mt-2">
          <p>{error}</p>
          {error.includes("timeout") && retryCount < 2 && (
            <button type="button" onClick={retryLoad} className="mt-1 text-blue-600 hover:text-blue-800 underline">
              Try again
            </button>
          )}
        </div>
      )}
      {!isLoaded && !error && <p className="text-sm text-gray-600 mt-2">Loading reCAPTCHA...</p>}
    </div>
  )
}

ReCAPTCHA.displayName = "ReCAPTCHA"

export default ReCAPTCHA
export { ReCAPTCHA }
