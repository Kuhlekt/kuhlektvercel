import { NextResponse } from "next/server"

export async function GET() {
  // Always use Google's test key to avoid domain issues
  const siteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"

  return NextResponse.json({ siteKey })
}
