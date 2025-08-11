import { NextResponse } from "next/server"
import { getRecaptchaConfig } from "@/lib/recaptcha-config"

export async function GET() {
  const config = getRecaptchaConfig()

  return NextResponse.json({
    siteKey: config.siteKey,
    isEnabled: config.isEnabled,
  })
}
