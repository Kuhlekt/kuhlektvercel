import { NextResponse } from "next/server"
import { getRecaptchaConfig } from "@/lib/recaptcha-config"

export async function GET() {
  try {
    const config = getRecaptchaConfig()

    return NextResponse.json({
      isConfigured: config.isConfigured,
      siteKey: config.siteKey,
    })
  } catch (error) {
    console.error("Error getting reCAPTCHA config:", error)
    return NextResponse.json({
      isConfigured: false,
      siteKey: null,
    })
  }
}
