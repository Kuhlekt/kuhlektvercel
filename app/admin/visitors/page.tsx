"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, MousePointer, Calendar, RefreshCw, Target } from "lucide-react"

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
  affiliates: {
    total: number
    breakdown: Record<string, { count: number; demo: number; contact: number }>
  }
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [authenticated, setAuthenticated] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch stats
      const statsResponse = await fetch("/api/admin/visitors?type=stats", {
        headers: { Authorization: "Bearer admin123" },
      })
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      // Fetch visitors
      const visitorsResponse = await fetch("/api/admin/visitors", {
        headers: { Authorization: "Bearer admin123" },
      })
      if (visitorsResponse.ok) {
        const visitorsData = await visitorsResponse.json()
        setVisitors(visitorsData)
      }

      // Fetch page views
      const pageViewsResponse = await fetch("/api/admin/visitors?type=pageviews", {
        headers: { Authorization: "Bearer admin123" },
      })
      if (pageViewsResponse.ok) {
        const pageViewsData = await pageViewsResponse.json()
        setPageViews(pageViewsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = () => {
    if (password === "admin123") {
      setAuthenticated(true)
      fetchData()
    } else {
      alert("Invalid password")
    }
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                  <Calendar className="w-8 h-8 text-purple-600" />
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
                  <MousePointer className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Page Views</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pageViews.today}</p>
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
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  )
}
