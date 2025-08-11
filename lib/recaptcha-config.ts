export function getRecaptchaConfig() {
  return {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    secretKey: process.env.RECAPTCHA_SECRET_KEY,
    isEnabled: !!(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_SECRET_KEY),
  }
}
