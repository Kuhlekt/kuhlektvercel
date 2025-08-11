"use server"

// Server action to get reCAPTCHA configuration
export async function getRecaptchaConfig() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  const isEnabled = !!(siteKey && secretKey)

  return {
    siteKey,
    isEnabled,
  }
}
