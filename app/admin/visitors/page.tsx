"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye, Users, FileText, TrendingUp, Settings, LogOut } from "lucide-react"

interface Visitor {
  id: string
  ip: string
  userAgent: string
  firstVisit: Date
  lastVisit: Date
  pageViews: number
  pages: string[]
  referrer?: string
  formSubmissions: FormSubmission[]
}

interface FormSubmission {
  id: string
  type: "contact" | "demo"
  timestamp: Date
  data: Record<string, any>
  status: "pending" | "completed" | "failed"
}

interface VisitorStats {
  totalVisitors: number
  recentVisitors: number
  totalPageViews: number
  totalFormSubmissions: number
}

interface Affiliate {
  id: string
  name: string
  email: string
  code: string
  commissionRate: number
  totalEarnings: number
  status: "active" | "inactive" | "pending"
  createdAt: Date
  lastActivity?: Date
}

interface AffiliateStats {
  totalAffiliates: number
  activeAffiliates: number
  totalCommissions: number
  monthlyCommissions: number
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null)
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [affiliateStats, setAffiliateStats] = useState<AffiliateStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("visitors")

  // Password change form
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/password", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      })

      if (response.ok) {
        setIsAuthenticated(true)
        await fetchData()
      } else {
        setError("Invalid password")
      }
    } catch (error) {
      setError("Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch visitors
      const visitorsResponse = await fetch("/api/admin/visitors", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      })

      if (visitorsResponse.ok) {
        const visitorsData = await visitorsResponse.json()
        setVisitors(
          visitorsData.visitors.map((v: any) => ({
            ...v,
            firstVisit: new Date(v.firstVisit),
            lastVisit: new Date(v.lastVisit),
            formSubmissions: v.formSubmissions.map((s: any) => ({
              ...s,
              timestamp: new Date(s.timestamp),
            })),
          })),
        )
        setVisitorStats(visitorsData.stats)
      }

      // Fetch affiliates
      const affiliatesResponse = await fetch("/api/admin/affiliates", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      })

      if (affiliatesResponse.ok) {
        const affiliatesData = await affiliatesResponse.json()
        setAffiliates(
          affiliatesData.affiliates.map((a: any) => ({
            ...a,
            createdAt: new Date(a.createdAt),
            lastActivity: a.lastActivity ? new Date(a.lastActivity) : undefined,
          })),
        )
        setAffiliateStats(affiliatesData.stats)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage("")

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New passwords don't match")
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters")
      return
    }

    try {
      const response = await fetch("/api/admin/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (response.ok) {
        setPasswordMessage("Password updated successfully")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setShowPasswordForm(false)
        // Update the stored password for future requests
        setPassword(newPassword)
      } else {
        const data = await response.json()
        setPasswordMessage(data.error || "Failed to update password")
      }
    } catch (error) {
      setPasswordMessage("Error updating password")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setPassword("")
    setVisitors([])
    setVisitorStats(null)
    setAffiliates([])
    setAffiliateStats(null)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-gray-900">Kuhlekt Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowPasswordForm(!showPasswordForm)}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showPasswordForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
                {passwordMessage && (
                  <p
                    className={`text-sm ${passwordMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}
                  >
                    {passwordMessage}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button type="submit">Update Password</Button>
                  <Button type="button" variant="outline" onClick={() => setShowPasswordForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="visitors">
              <Users className="w-4 h-4 mr-2" />
              Visitors
            </TabsTrigger>
            <TabsTrigger value="affiliates">
              <TrendingUp className="w-4 h-4 mr-2" />
              Affiliates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visitors" className="space-y-6">
            {/* Visitor Stats */}
            {visitorStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-cyan-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                        <p className="text-2xl font-bold text-gray-900">{visitorStats.totalVisitors}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Eye className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Recent Visitors (24h)</p>
                        <p className="text-2xl font-bold text-gray-900">{visitorStats.recentVisitors}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Page Views</p>
                        <p className="text-2xl font-bold text-gray-900">{visitorStats.totalPageViews}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Form Submissions</p>
                        <p className="text-2xl font-bold text-gray-900">{visitorStats.totalFormSubmissions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Visitors Table */}
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
                        <th className="text-left p-2">First Visit</th>
                        <th className="text-left p-2">Last Visit</th>
                        <th className="text-left p-2">Page Views</th>
                        <th className="text-left p-2">Pages</th>
                        <th className="text-left p-2">Form Submissions</th>
                        <th className="text-left p-2">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visitors.map((visitor) => (
                        <tr key={visitor.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-mono text-xs">{visitor.ip}</td>
                          <td className="p-2">{visitor.firstVisit.toLocaleDateString()}</td>
                          <td className="p-2">{visitor.lastVisit.toLocaleDateString()}</td>
                          <td className="p-2">{visitor.pageViews}</td>
                          <td className="p-2">
                            <div className="flex flex-wrap gap-1">
                              {visitor.pages.slice(0, 3).map((page, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {page}
                                </Badge>
                              ))}
                              {visitor.pages.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{visitor.pages.length - 3}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="flex flex-wrap gap-1">
                              {visitor.formSubmissions.map((submission) => (
                                <Badge
                                  key={submission.id}
                                  variant={
                                    submission.status === "completed"
                                      ? "default"
                                      : submission.status === "failed"
                                        ? "destructive"
                                        : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {submission.type}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-2 text-xs text-gray-600 max-w-32 truncate">
                            {visitor.referrer || "Direct"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates" className="space-y-6">
            {/* Affiliate Stats */}
            {affiliateStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-cyan-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Affiliates</p>
                        <p className="text-2xl font-bold text-gray-900">{affiliateStats.totalAffiliates}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Affiliates</p>
                        <p className="text-2xl font-bold text-gray-900">{affiliateStats.activeAffiliates}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${affiliateStats.totalCommissions.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Monthly Commissions</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${affiliateStats.monthlyCommissions.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Affiliates Table */}
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Code</th>
                        <th className="text-left p-2">Commission Rate</th>
                        <th className="text-left p-2">Total Earnings</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Created</th>
                        <th className="text-left p-2">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {affiliates.map((affiliate) => (
                        <tr key={affiliate.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{affiliate.name}</td>
                          <td className="p-2">{affiliate.email}</td>
                          <td className="p-2 font-mono text-xs bg-gray-100 rounded px-2 py-1 inline-block">
                            {affiliate.code}
                          </td>
                          <td className="p-2">{(affiliate.commissionRate * 100).toFixed(1)}%</td>
                          <td className="p-2 font-medium">${affiliate.totalEarnings.toFixed(2)}</td>
                          <td className="p-2">
                            <Badge
                              variant={
                                affiliate.status === "active"
                                  ? "default"
                                  : affiliate.status === "inactive"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {affiliate.status}
                            </Badge>
                          </td>
                          <td className="p-2">{affiliate.createdAt.toLocaleDateString()}</td>
                          <td className="p-2">
                            {affiliate.lastActivity ? affiliate.lastActivity.toLocaleDateString() : "Never"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
