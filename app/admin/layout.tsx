import type React from "react"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"

async function checkAuth() {
  // Simple auth check - in production this would verify JWT tokens
  // For now, we'll assume authenticated if accessing admin routes
  return true
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isAuthenticated = await checkAuth()

  if (!isAuthenticated) {
    redirect("/admin/login")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
