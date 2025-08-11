// Server-side configuration check
export function getRecaptchaConfig() {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  const isConfigured = !!(
    siteKey &&
    siteKey.trim() !== "" &&
    siteKey !== "your_recaptcha_site_key_here" &&
    secretKey &&
    secretKey.trim() !== ""
  )

  return {
    isConfigured,
    siteKey: isConfigured ? siteKey : null,
  }
}
