interface CaptchaResult {
  success: boolean
  error?: string
}

export async function verifyCaptcha(token: string): Promise<CaptchaResult> {
  try {
    if (!token) {
      return {
        success: false,
        error: "No CAPTCHA token provided",
      }
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY
    if (!secretKey) {
      console.error("RECAPTCHA_SECRET_KEY not configured")
      return {
        success: false,
        error: "CAPTCHA verification not configured",
      }
    }

    // Use Google's test secret key if we detect the test site key
    const testSiteKey = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
    const testSecretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"

    const verificationKey = secretKey === testSiteKey ? testSecretKey : secretKey

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: verificationKey,
        response: token,
      }),
    })

    if (!response.ok) {
      return {
        success: false,
        error: "CAPTCHA verification service unavailable",
      }
    }

    const data = await response.json()

    if (data.success) {
      return {
        success: true,
      }
    } else {
      console.error("CAPTCHA verification failed:", data["error-codes"])
      return {
        success: false,
        error: "CAPTCHA verification failed",
      }
    }
  } catch (error) {
    console.error("CAPTCHA verification error:", error)
    return {
      success: false,
      error: "CAPTCHA verification error",
    }
  }
}
