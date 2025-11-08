"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Visit {
  id: number
  visitor_id: string
  session_id: string
  page: string
  referrer: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_term: string | null
  utm_content: string | null
  affiliate: string | null
  device_type: string | null
  browser: string | null
  os: string | null
  page_views: number
  session_duration: number
  is_new_user: boolean
  first_visit: string
  last_visit: string
  created_at: string
}

export default function SiteVisitsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const [visits, setVisits] = useState<Visit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "new" | "returning">("all")

  useEffect(() => {
    // Check if already authenticated
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadVisits()
    }
  }, [isAuthenticated])

  async function checkAuth() {
    try {
      const response = await fetch("/api/site-visits")
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setIsAuthenticating(true)
    setAuthError("")

    try {
      const response = await fetch("/api/site-visits/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setPassword("")
      } else {
        setAuthError("Invalid password")
      }
    } catch {
      setAuthError("Authentication failed")
    } finally {
      setIsAuthenticating(false)
    }
  }

  async function handleLogout() {
    await fetch("/api/site-visits/auth", { method: "DELETE" })
    setIsAuthenticated(false)
    setVisits([])
  }

  async function loadVisits() {
    try {
      setIsLoading(true)
      const response = await fetch("/api/site-visits")
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false)
          throw new Error("Session expired. Please login again.")
        }
        throw new Error("Failed to load site visits")
      }
      const data = await response.json()
      setVisits(data.visits || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Site Visits Analytics</CardTitle>
            <CardDescription>Enter password to view analytics dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isAuthenticating}
                  className="w-full"
                />
              </div>
              {authError && <p className="text-sm text-red-600">{authError}</p>}
              <Button type="submit" disabled={isAuthenticating || !password} className="w-full">
                {isAuthenticating ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredVisits = visits.filter((visit) => {
    if (filter === "new") return visit.is_new_user
    if (filter === "returning") return !visit.is_new_user
    return true
  })

  const totalVisits = visits.length
  const newVisitors = visits.filter((v) => v.is_new_user).length
  const returningVisitors = totalVisits - newVisitors
  const avgSessionDuration = visits.reduce((acc, v) => acc + v.session_duration, 0) / totalVisits || 0
  const avgPageViews = visits.reduce((acc, v) => acc + v.page_views, 0) / totalVisits || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading site visits...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <Button onClick={handleLogout}>Back to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Site Visits Analytics</h1>
            <p className="text-gray-600 mt-2">Privacy-compliant visitor tracking (no PII collected)</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Total Visits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVisits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">New Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{newVisitors}</div>
              <p className="text-xs text-gray-500 mt-1">{((newVisitors / totalVisits) * 100).toFixed(1)}% of total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Returning Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{returningVisitors}</div>
              <p className="text-xs text-gray-500 mt-1">
                {((returningVisitors / totalVisits) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-600">Avg. Session Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{Math.round(avgSessionDuration)}s</div>
              <p className="text-xs text-gray-500 mt-1">{avgPageViews.toFixed(1)} pages/visit</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            All Visits ({totalVisits})
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "new" ? "bg-green-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            New Visitors ({newVisitors})
          </button>
          <button
            onClick={() => setFilter("returning")}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === "returning" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Returning ({returningVisitors})
          </button>
        </div>

        {/* Visits Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Site Visits</CardTitle>
            <CardDescription>Anonymized visitor data (no IP addresses or personal information)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-600">
                    <th className="pb-3">Timestamp</th>
                    <th className="pb-3">Page</th>
                    <th className="pb-3">Referrer</th>
                    <th className="pb-3">Device</th>
                    <th className="pb-3">Browser</th>
                    <th className="pb-3">OS</th>
                    <th className="pb-3">Pages</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">UTM Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredVisits.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-8 text-center text-gray-500">
                        No visits found
                      </td>
                    </tr>
                  ) : (
                    filteredVisits.map((visit) => (
                      <tr key={visit.id} className="text-sm">
                        <td className="py-3 text-gray-900">
                          {new Date(visit.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 text-gray-900 max-w-xs truncate">{visit.page}</td>
                        <td className="py-3 text-gray-600 max-w-xs truncate">{visit.referrer || "-"}</td>
                        <td className="py-3 text-gray-600">{visit.device_type || "-"}</td>
                        <td className="py-3 text-gray-600">{visit.browser || "-"}</td>
                        <td className="py-3 text-gray-600">{visit.os || "-"}</td>
                        <td className="py-3 text-gray-900">{visit.page_views}</td>
                        <td className="py-3 text-gray-900">{visit.session_duration}s</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              visit.is_new_user ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {visit.is_new_user ? "New" : "Returning"}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">{visit.utm_source || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Privacy Compliance</h3>
          <p className="text-sm text-blue-800">
            This analytics dashboard displays anonymized visitor data only. No personally identifiable information (PII)
            such as IP addresses, email addresses, or names are collected or displayed. All data is aggregated and
            anonymized in compliance with GDPR, CCPA, and other privacy regulations.
          </p>
        </div>
      </div>
    </div>
  )
}
