// Server-side only recaptcha configuration
export function getRecaptchaConfig() {
  // Only access environment variables on the server side
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server side")
  }

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  return {
    siteKey,
    secretKey,
    isEnabled: !!(siteKey && secretKey),
  }
}

// Server-side only function to get secret key for verification
export function getRecaptchaSecretKey(): string | undefined {
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server side")
  }
  return process.env.RECAPTCHA_SECRET_KEY
}

// Server-side only function to check if recaptcha is enabled
export function isRecaptchaEnabled(): boolean {
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server side")
  }
  return !!(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_SECRET_KEY)
}
