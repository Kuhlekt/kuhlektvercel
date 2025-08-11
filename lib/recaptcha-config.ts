// Server-side only recaptcha configuration
export function getRecaptchaConfig() {
  return {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    secretKey: process.env.RECAPTCHA_SECRET_KEY,
    isEnabled: !!(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_SECRET_KEY),
  }
}

// Server-side only function to get secret key for verification
export function getRecaptchaSecretKey(): string | undefined {
  return process.env.RECAPTCHA_SECRET_KEY
}

// Server-side only function to check if recaptcha is enabled
export function isRecaptchaEnabled(): boolean {
  return !!(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_SECRET_KEY)
}
