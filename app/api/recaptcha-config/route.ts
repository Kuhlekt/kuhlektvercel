import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use environment variable or fallback to Google's test key for development
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"

    return NextResponse.json({
      siteKey,
      // Indicate if we're using the test key
      isTestMode: !process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
    })
  } catch (error) {
    console.error("Error in recaptcha-config route:", error)

    // Return Google's test key as fallback
    return NextResponse.json({
      siteKey: "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
      isTestMode: true,
      error: "Failed to load configuration, using test mode",
    })
  }
}
