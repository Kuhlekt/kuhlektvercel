"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, MousePointer, Calendar, RefreshCw, Target, FileText } from "lucide-react"
import React from "react"

interface VisitorData {
  id: string
  ipAddress: string
  userAgent: string
  referrer: string
  currentPage: string
  timestamp: string
  sessionId: string
  country?: string
  city?: string
  device?: string
  browser?: string
  os?: string
  affiliate?: string
  affiliateSource?: "demo" | "contact"
  affiliateTimestamp?: string
}

interface PageView {
  id: string
  visitorId: string
  page: string
  timestamp: string
  timeSpent?: number
}

interface FormSubmission {
  id: string
  visitorId: string
  sessionId: string
  formType: "demo" | "contact"
  timestamp: string
  data: {
    firstName?: string
    lastName?: string
    email?: string
    company?: string
    role?: string
    companySize?: string
    message?: string
    challenges?: string
    affiliate?: string
  }
  ipAddress?: string
  userAgent?: string
}

interface Stats {
  visitors: {
    today: number
    week: number
    month: number
    total: number
  }
  pageViews: {
    today: number
    week: number
    month: number
    total: number
  }
  forms: {
    today: number
    week: number
    month: number
    total: number
  }
  affiliates: {
    total: number
    breakdown: Record<string, { count: number; demo: number; contact: number }>
  }
}

function PasswordManagement({ currentPassword }: { currentPassword: string }) {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords don't match")
      return
    }

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: oldPassword,
          newPassword: newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Password updated successfully!")
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setMessage(data.error || "Failed to update password")
      }
    } catch (error) {
      setMessage("Error updating password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Admin Password</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Current Password</label>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min 6 characters)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />
          </div>
          <Button
            onClick={handlePasswordChange}
            disabled={loading || !oldPassword || !newPassword || !confirmPassword}
            className="w-full"
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
          {message && (
            <div
              className={`text-sm p-2 rounded ${
                message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function AffiliateManagement({ authToken }: { authToken: string }) {
  const [affiliates, setAffiliates] = useState<string[]>([])
  const [newAffiliate, setNewAffiliate] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchAffiliates = async () => {
    try {
      const response = await fetch("/api/admin/affiliates", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (response.ok) {
        const data = await response.json()
        setAffiliates(data.affiliates)
      }
    } catch (error) {
      console.error("Error fetching affiliates:", error)
    }
  }

  const addAffiliate = async () => {
    if (!newAffiliate.trim()) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ code: newAffiliate, action: "add" }),
      })

      if (response.ok) {
        const data = await response.json()
        setAffiliates(data.affiliates)
        setNewAffiliate("")
      }
    } catch (error) {
      console.error("Error adding affiliate:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeAffiliate = async (code: string) => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/affiliates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ code, action: "remove" }),
      })

      if (response.ok) {
        const data = await response.json()
        setAffiliates(data.affiliates)
      }
    } catch (error) {
      console.error("Error removing affiliate:", error)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchAffiliates()
  }, [authToken])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Code Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter affiliate code"
              value={newAffiliate}
              onChange={(e) => setNewAffiliate(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && addAffiliate()}
            />
            <Button onClick={addAffiliate} disabled={loading || !newAffiliate.trim()}>
              Add
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Valid Affiliate Codes:</h4>
            {affiliates.length === 0 ? (
              <p className="text-gray-500">No affiliate codes configured</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {affiliates.map((code) => (
                  <div key={code} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="font-mono text-sm">{code}</span>
                    <Button size="sm" variant="destructive" onClick={() => removeAffiliate(code)} disabled={loading}>
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [authToken, setAuthToken] = useState("")

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch stats
      const statsResponse = await fetch("/api/admin/visitors?type=stats", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch visitors
      const visitorsResponse = await fetch("/api/admin/visitors", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (visitorsResponse.ok) {
        const visitorsData = await visitorsResponse.json()
        setVisitors(visitorsData)
      }

      // Fetch page views
      const pageViewsResponse = await fetch("/api/admin/visitors?type=pageviews", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (pageViewsResponse.ok) {
        const pageViewsData = await pageViewsResponse.json()
        setPageViews(pageViewsData)
      }

      // Fetch form submissions
      const formsResponse = await fetch("/api/admin/visitors?type=forms", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (formsResponse.ok) {
        const formsData = await formsResponse.json()
        setFormSubmissions(formsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    // Use password as auth token for API calls
    setAuthToken(password)
    setAuthenticated(true)
    fetchData()
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Visitor Analytics</h1>
          <Button onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.visitors.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Page Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pageViews.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Form Submissions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.forms.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.visitors.today}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MousePointer className="w-8 h-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Forms</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.forms.today}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-cyan-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Affiliate Visitors</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.affiliates.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="visitors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="pageviews">Page Views</TabsTrigger>
            <TabsTrigger value="forms">Form Submissions</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="affiliate-management">Affiliate Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>Recent Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">IP Address</th>
                        <th className="text-left p-2">Device</th>
                        <th className="text-left p-2">Browser</th>
                        <th className="text-left p-2">OS</th>
                        <th className="text-left p-2">Current Page</th>
                        <th className="text-left p-2">Affiliate</th>
                        <th className="text-left p-2">Referrer</th>
                        <th className="text-left p-2">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((visitor) => (
                        <tr key={visitor.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-mono text-xs">{visitor.ipAddress}</td>
                          <td className="p-2">
                            <Badge variant="outline">{visitor.device || "Unknown"}</Badge>
                          </td>
                          <td className="p-2">
                            <Badge variant="outline">{visitor.browser || "Unknown"}</Badge>
                          </td>
                          <td className="p-2">
                            <Badge variant="outline">{visitor.os || "Unknown"}</Badge>
                          </td>
                          <td className="p-2 text-blue-600">{visitor.currentPage}</td>
                          <td className="p-2">
                            {visitor.affiliate ? (
                              <Badge className="bg-cyan-100 text-cyan-800">
                                {visitor.affiliate} ({visitor.affiliateSource})
                              </Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-2 text-gray-600 max-w-xs truncate">{visitor.referrer || "Direct"}</td>
                          <td className="p-2 text-gray-500">{new Date(visitor.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pageviews">
            <Card>
              <CardHeader>
                <CardTitle>Recent Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Visitor ID</th>
                        <th className="text-left p-2">Page</th>
                        <th className="text-left p-2">Timestamp</th>
                        <th className="text-left p-2">Time Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageViews.map((pageView) => (
                        <tr key={pageView.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-mono text-xs">{pageView.visitorId}</td>
                          <td className="p-2 text-blue-600">{pageView.page}</td>
                          <td className="p-2 text-gray-500">{new Date(pageView.timestamp).toLocaleString()}</td>
                          <td className="p-2 text-gray-600">{pageView.timeSpent ? `${pageView.timeSpent}s` : "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Form Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Type</th>
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Company</th>
                        <th className="text-left p-2">Affiliate</th>
                        <th className="text-left p-2">IP Address</th>
                        <th className="text-left p-2">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <Badge
                              className={
                                submission.formType === "demo"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }
                            >
                              {submission.formType}
                            </Badge>
                          </td>
                          <td className="p-2">
                            {submission.data.firstName} {submission.data.lastName}
                          </td>
                          <td className="p-2 text-blue-600">{submission.data.email}</td>
                          <td className="p-2">{submission.data.company}</td>
                          <td className="p-2">
                            {submission.data.affiliate ? (
                              <Badge className="bg-cyan-100 text-cyan-800">{submission.data.affiliate}</Badge>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-2 font-mono text-xs">{submission.ipAddress}</td>
                          <td className="p-2 text-gray-500">{new Date(submission.timestamp).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.affiliates.breakdown && Object.keys(stats.affiliates.breakdown).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Affiliate Code</th>
                          <th className="text-left p-2">Total Visitors</th>
                          <th className="text-left p-2">Demo Forms</th>
                          <th className="text-left p-2">Contact Forms</th>
                          <th className="text-left p-2">Conversion Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(stats.affiliates.breakdown).map(([affiliate, data]) => (
                          <tr key={affiliate} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-semibold">{affiliate}</td>
                            <td className="p-2">{data.count}</td>
                            <td className="p-2">{data.demo}</td>
                            <td className="p-2">{data.contact}</td>
                            <td className="p-2">
                              {data.count > 0
                                ? `${(((data.demo + data.contact) / data.count) * 100).toFixed(1)}%`
                                : "0%"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No affiliate data available yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliate-management">
            <AffiliateManagement authToken={authToken} />
          </TabsContent>

          <TabsContent value="settings">
            <PasswordManagement currentPassword={authToken} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
