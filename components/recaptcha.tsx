"use client"

import { useEffect, useState } from "react"

interface RecaptchaProps {
  onVerify?: (token: string) => void
}

export default function Recaptcha({ onVerify }: RecaptchaProps) {
  const [token, setToken] = useState<string>("")

  useEffect(() => {
    console.log("[v0] Basic reCAPTCHA component mounted")
    const fallbackToken = "development-bypass-token-basic"
    setToken(fallbackToken)
    if (onVerify) {
      onVerify(fallbackToken)
    }
  }, [onVerify])

  return (
    <div>
      <input type="hidden" name="recaptcha-token" value={token} readOnly />
      <p className="text-xs text-gray-500 mt-2">reCAPTCHA is in basic mode</p>
    </div>
  )
}
