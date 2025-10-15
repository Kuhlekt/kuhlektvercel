"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check-auth")
        const data = await response.json()
        setIsAuthenticated(data.authenticated)
      } catch (error) {
        console.error("[v0] Auth check failed:", error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold">Loading...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please log in to access the admin dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your Kuhlekt website</p>
        </div>

        {/* Admin Features */}
        <div className="mb-12">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Admin Features</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Link href="/admin/agent-console">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Agent Console</CardTitle>
                  <CardDescription>Respond to customer chat requests</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/contact-requests">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Chat Handoff Requests</CardTitle>
                  <CardDescription>View customer handoff requests</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/admin/chats">
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle>All Chat Conversations</CardTitle>
                  <CardDescription>View complete chat history</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>

        {/* Website Sitemap */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold text-gray-900">Website Sitemap</h2>
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 text-left font-semibold">Page</th>
                      <th className="pb-3 text-left font-semibold">URL</th>
                      <th className="pb-3 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 font-medium">Home</td>
                      <td className="py-3">
                        <a href="/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          /
                        </a>
                      </td>
                      <td className="py-3 text-gray-600">Main landing page</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">About</td>
                      <td className="py-3">
                        <a
                          href="/about"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          /about
                        </a>
                      </td>
                      <td className="py-3 text-gray-600">About Kuhlekt</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Services</td>
                      <td className="py-3">
                        <a
                          href="/services"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          /services
                        </a>
                      </td>
                      <td className="py-3 text-gray-600">Services offered</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Contact</td>
                      <td className="py-3">
                        <a
                          href="/contact"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          /contact
                        </a>
                      </td>
                      <td className="py-3 text-gray-600">Contact form</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">ROI Calculator</td>
                      <td className="py-3">
                        <a
                          href="https://roi.kuhlekt-info.com/"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          roi.kuhlekt-info.com
                        </a>
                      </td>
                      <td className="py-3 text-gray-600">ROI calculation tool</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium">Kali Chatbot</td>
                      <td className="py-3">
                        <a
                          href="https://kali.kuhlekt-info.com/"
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          kali.kuhlekt-info.com
                        </a>
                      </td>
                      <td className="py-3 text-gray-600">AI chatbot assistant</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
