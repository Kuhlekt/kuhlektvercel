import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function requireAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")

  if (!session || session.value !== "authenticated") {
    redirect("/admin/login")
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")

  return session?.value === "authenticated"
}

export async function getSession() {
  const cookieStore = await cookies()
  return cookieStore.get("admin_session")
}
