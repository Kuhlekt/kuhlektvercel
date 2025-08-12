"use client"

import { Button } from "@/components/ui/button"
import { LogOut, Shield } from "lucide-react"

export function AdminHeader() {
  const handleLogout = async () => {
    await fetch("/admin/logout", { method: "POST" })
    window.location.href = "/admin/login"
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-600" />
          <span className="font-semibold text-gray-900">Admin Panel</span>
        </div>

        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )
}
