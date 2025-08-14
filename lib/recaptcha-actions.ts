"use server"

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; error?: string }> {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error("reCAPTCHA secret key not found in environment variables")
      return { success: false, error: "reCAPTCHA not configured" }
    }

    if (!token || token.trim() === "") {
      console.error("reCAPTCHA token is empty or invalid")
      return { success: false, error: "Invalid reCAPTCHA token" }
    }

    if (token === "browser-error" || token.includes("browser-error")) {
      console.log("reCAPTCHA browser error detected - allowing submission with warning")
      const isDevelopment = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"

      if (isDevelopment) {
        console.log("Browser error bypass allowed in development/preview mode")
        return { success: true }
      } else {
        // In production, still allow but log the issue
        console.warn("Browser error in production - allowing submission but logging issue")
        return { success: true }
      }
    }

    if (token === "development-bypass-token") {
      const isDevelopment = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"
      console.log(`reCAPTCHA bypass token detected - environment: ${process.env.NODE_ENV || "unknown"}`)

      if (isDevelopment) {
        console.log("reCAPTCHA bypass allowed in development/preview mode")
        return { success: true }
      } else {
        console.warn("reCAPTCHA bypass token rejected in production")
        return { success: false, error: "Invalid reCAPTCHA token" }
      }
    }

    console.log("Verifying reCAPTCHA token:", token.substring(0, 20) + "...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    try {
      const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error("reCAPTCHA API response not ok:", response.status, response.statusText)
        return { success: false, error: "reCAPTCHA API error" }
      }

      const data = await response.json()
      console.log("reCAPTCHA verification response:", data)

      if (data.success) {
        console.log("reCAPTCHA verification successful")
        return { success: true }
      } else {
        const errorCodes = data["error-codes"] || []
        console.error("reCAPTCHA verification failed:", errorCodes)

        if (errorCodes.includes("invalid-input-response")) {
          return { success: false, error: "Invalid reCAPTCHA response. Please try again." }
        } else if (errorCodes.includes("timeout-or-duplicate")) {
          return { success: false, error: "reCAPTCHA expired. Please try again." }
        } else if (errorCodes.includes("invalid-input-secret")) {
          return { success: false, error: "reCAPTCHA configuration error" }
        }

        return {
          success: false,
          error: `reCAPTCHA verification failed: ${errorCodes.join(", ") || "Unknown error"}`,
        }
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === "AbortError") {
        console.error("reCAPTCHA verification timeout")
        return { success: false, error: "reCAPTCHA verification timeout. Please try again." }
      }
      throw fetchError
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)

    const isProduction = process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production"
    if (isProduction && error.message?.includes("network")) {
      console.warn("Network error in production - allowing submission with warning")
      return { success: true } // Allow submission but log the issue
    }

    return { success: false, error: "Verification failed due to network error" }
  }
}
