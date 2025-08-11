"use server"

// Server action to get reCAPTCHA configuration
export async function getRecaptchaConfig() {
  // Get the site key from server environment (not NEXT_PUBLIC)
  const siteKey = process.env.RECAPTCHA_SITE_KEY
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  // Check if both keys are available
  const isEnabled = Boolean(siteKey && secretKey)

  return {
    siteKey: siteKey || "",
    isEnabled,
  }
}
