import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function requireAdminAuth() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")

  if (!adminSession || adminSession.value !== "authenticated") {
    redirect("/admin/login")
  }

  return true
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = cookies()
  const adminSession = cookieStore.get("admin_session")

  return adminSession?.value === "authenticated"
}

export async function clearAdminSession() {
  const cookieStore = cookies()
  cookieStore.delete("admin_session")
}
