"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("kuhlekt_admin_auth")
      if (adminAuth) {
        try {
          const authData = JSON.parse(adminAuth)
          const isValid = authData.authenticated && authData.expires > Date.now()
          setIsAuthenticated(isValid)

          if (!isValid && pathname !== "/admin/login") {
            localStorage.removeItem("kuhlekt_admin_auth")
            router.push("/admin/login")
          }
        } catch {
          setIsAuthenticated(false)
          if (pathname !== "/admin/login") {
            router.push("/admin/login")
          }
        }
      } else if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }
      setLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  const handleLogout = () => {
    localStorage.removeItem("kuhlekt_admin_auth")
    setIsAuthenticated(false)
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null
  }

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Kuhlekt Admin
              </Link>
              <Badge variant="secondary">Admin Panel</Badge>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/admin/visitors"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/admin/visitors" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Visitors
              </Link>

              <Link
                href="/admin/tracking"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/admin/tracking" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Tracking
              </Link>

              <Link
                href="/admin/change-password"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === "/admin/change-password"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Change Password
              </Link>

              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
