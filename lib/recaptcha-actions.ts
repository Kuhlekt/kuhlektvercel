"use server"

// Server action to get reCAPTCHA configuration
export async function getRecaptchaConfig() {
  // Use RECAPTCHA_SITE_KEY instead of NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const siteKey = process.env.RECAPTCHA_SITE_KEY || ""
  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  const isEnabled = !!(siteKey && secretKey)

  return {
    siteKey,
    isEnabled,
  }
}
