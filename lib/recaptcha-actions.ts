"use server"

export async function getRecaptchaSiteKey() {
  return {
    siteKey: process.env.RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    isEnabled: !!process.env.RECAPTCHA_SITE_KEY,
  }
}
