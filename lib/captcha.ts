export async function verifyCaptcha(token: string): Promise<boolean> {
  // If it's a bypass token (for disabled reCAPTCHA or errors), allow it
  if (
    token === "recaptcha-disabled" ||
    token === "recaptcha-config-error" ||
    token === "recaptcha-fetch-error" ||
    token === "recaptcha-error" ||
    token === "recaptcha-expired" ||
    token === "recaptcha-render-error" ||
    token === "recaptcha-execute-error" ||
    token === "recaptcha-script-error"
  ) {
    console.log("reCAPTCHA bypassed:", token)
    return true
  }

  // If no reCAPTCHA secret key is configured, allow bypass
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.log("reCAPTCHA secret key not configured, bypassing verification")
    return true
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    // On error, allow the request to proceed (fail open)
    return true
  }
}
