"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Rate limiting for login attempts (in production, use Redis)
const loginAttempts = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(ip: string): string {
  return `login_${ip}`
}

function isLoginRateLimited(ip: string): boolean {
  const key = getRateLimitKey(ip)
  const now = Date.now()
  const attempts = loginAttempts.get(key)

  if (!attempts || now > attempts.resetTime) {
    // Reset attempts (5 attempts per 15 minutes)
    loginAttempts.set(key, { count: 1, resetTime: now + 15 * 60 * 1000 })
    return false
  }

  if (attempts.count >= 5) {
    return true
  }

  attempts.count++
  return false
}

export async function adminLogin(formData: FormData) {
  try {
    const password = formData.get("password") as string
    const clientIP = "127.0.0.1" // In production, get real IP from headers

    if (!password) {
      return {
        success: false,
        error: "Password is required",
      }
    }

    // Check rate limiting
    if (isLoginRateLimited(clientIP)) {
      return {
        success: false,
        error: "Too many login attempts. Please try again in 15 minutes.",
      }
    }

    // Validate password length to prevent timing attacks
    if (password.length < 8 || password.length > 128) {
      return {
        success: false,
        error: "Invalid password",
      }
    }

    // Check password against environment variable
    if (password !== process.env.ADMIN_PASSWORD) {
      return {
        success: false,
        error: "Invalid password",
      }
    }

    // Clear rate limiting on successful login
    loginAttempts.delete(getRateLimitKey(clientIP))

    // Set authentication cookie with enhanced security
    const cookieStore = cookies()
    cookieStore.set("admin-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8, // Reduced to 8 hours for better security
      path: "/admin", // Restrict cookie to admin paths only
    })

    redirect("/admin/tracking")
  } catch (error) {
    console.error("Admin login error:", error)
    return {
      success: false,
      error: "An error occurred during login. Please try again.",
    }
  }
}

export async function adminLogout() {
  try {
    const cookieStore = cookies()
    cookieStore.delete("admin-auth")
    redirect("/admin/login")
  } catch (error) {
    console.error("Admin logout error:", error)
    redirect("/admin/login")
  }
}
