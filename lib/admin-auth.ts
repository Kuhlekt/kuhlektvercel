"use server"

import { cookies } from "next/headers"

const COOKIE_NAME = "admin-token"

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)
    return token?.value === "authenticated"
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return false
  }
}

export async function setAdminAuthenticated(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
  } catch (error) {
    console.error("[v0] Set auth error:", error)
    throw error
  }
}

export async function clearAdminAuthentication(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
  } catch (error) {
    console.error("[v0] Clear auth error:", error)
  }
}
