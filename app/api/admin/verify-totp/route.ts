import { type NextRequest, NextResponse } from "next/server"

function verifyTOTP(token: string, secret: string): boolean {
  const timeStep = 30
  const currentTime = Math.floor(Date.now() / 1000 / timeStep)

  // Check current time window and previous/next windows for clock drift
  for (let i = -1; i <= 1; i++) {
    const time = currentTime + i
    const hash = require("crypto")
      .createHmac("sha1", Buffer.from(secret, "base32"))
      .update(Buffer.from(time.toString(16).padStart(16, "0"), "hex"))
      .digest()

    const offset = hash[hash.length - 1] & 0xf
    const code =
      (((hash[offset] & 0x7f) << 24) |
        ((hash[offset + 1] & 0xff) << 16) |
        ((hash[offset + 2] & 0xff) << 8) |
        (hash[offset + 3] & 0xff)) %
      1000000

    if (code.toString().padStart(6, "0") === token) {
      return true
    }
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    const { token, secret } = await request.json()

    if (!token || !secret) {
      return NextResponse.json({ valid: false, error: "Missing token or secret" })
    }

    const isValid = verifyTOTP(token, secret)

    return NextResponse.json({ valid: isValid })
  } catch (error) {
    return NextResponse.json({ valid: false, error: "Verification failed" })
  }
}
