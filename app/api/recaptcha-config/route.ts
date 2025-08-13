import { NextResponse } from "next/server"

export async function GET() {
  // Always use Google's test key for development and preview environments
  // This test key works on any domain and always passes verification
  const testSiteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"

  return NextResponse.json({
    siteKey: testSiteKey,
    isEnabled: true,
    isTestMode: true,
  })
}
