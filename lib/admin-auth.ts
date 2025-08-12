import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function requireAdminAuth() {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")

  if (!session || session.value !== "authenticated") {
    redirect("/admin/login")
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin-session")
  return session?.value === "authenticated"
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
  redirect("/admin/login")
}
