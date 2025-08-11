// Server-side only recaptcha configuration - NO direct env var access
export function getRecaptchaConfigForAPI() {
  // This function should only be called from API routes
  // Get environment variables only in API routes, not in shared lib files
  return {
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "",
    secretKey: process.env.RECAPTCHA_SECRET_KEY,
    isEnabled: !!(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && process.env.RECAPTCHA_SECRET_KEY),
  }
}

// Server-side only function to get secret key for verification
export function getRecaptchaSecretKey(): string | undefined {
  return process.env.RECAPTCHA_SECRET_KEY
}
