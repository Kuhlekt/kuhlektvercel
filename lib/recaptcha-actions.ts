"use server"

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.log("No reCAPTCHA secret key configured, allowing verification")
      return { success: true }
    }

    const testSecretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
    const keyToUse = testSecretKey

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${keyToUse}&response=${token}`,
    })

    const data = await response.json()

    console.log("reCAPTCHA verification response:", {
      success: data.success,
      errorCodes: data["error-codes"],
      hostname: data.hostname,
      challenge_ts: data.challenge_ts,
    })

    if (data.success) {
      return { success: true }
    } else {
      const errorCodes = data["error-codes"] || []
      let errorMessage = "reCAPTCHA verification failed"

      if (errorCodes.includes("invalid-input-secret")) {
        errorMessage = "Invalid reCAPTCHA secret key"
      } else if (errorCodes.includes("invalid-input-response")) {
        errorMessage = "Invalid reCAPTCHA token"
      } else if (errorCodes.includes("timeout-or-duplicate")) {
        errorMessage = "reCAPTCHA token expired or already used"
      }

      return { success: false, error: errorMessage }
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, error: "Verification failed" }
  }
}
