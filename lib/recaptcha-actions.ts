"use server"

export async function verifyRecaptcha(token: string): Promise<{ success: boolean; score?: number; error?: string }> {
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

    if (token === "browser-error" || token.includes("browser-error") || token.startsWith("development-bypass-token")) {
      console.log(`reCAPTCHA fallback token detected: ${token}`)
      const isDevelopment = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview"

      if (isDevelopment) {
        console.log("Fallback token allowed in development/preview mode")
        return { success: true, score: 0.9 }
      } else {
        console.error("Fallback token rejected in production")
        return { success: false, error: "Invalid reCAPTCHA token" }
      }
    }

    console.log("Verifying reCAPTCHA v3 token:", token.substring(0, 20) + "...")

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

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
        return { success: false, error: "reCAPTCHA verification failed" }
      }

      const data = await response.json()
      console.log("reCAPTCHA v3 verification response:", { success: data.success, score: data.score })

      if (data.success && typeof data.score === "number") {
        const threshold = 0.5 // Adjust this threshold as needed

        if (data.score >= threshold) {
          console.log(`reCAPTCHA verification successful with score ${data.score}`)
          return { success: true, score: data.score }
        } else {
          console.warn(`reCAPTCHA score ${data.score} below threshold ${threshold}`)
          return { success: false, score: data.score, error: "reCAPTCHA score too low" }
        }
      } else {
        const errorCodes = data["error-codes"] || []
        console.error("reCAPTCHA verification failed:", errorCodes)

        if (errorCodes.includes("invalid-input-secret")) {
          return { success: false, error: "reCAPTCHA configuration error" }
        }

        return { success: false, error: "reCAPTCHA verification failed" }
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error("reCAPTCHA verification timeout")
        return { success: false, error: "reCAPTCHA verification timeout" }
      }
      throw fetchError
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error)
    return { success: false, error: "reCAPTCHA verification failed" }
  }
}
