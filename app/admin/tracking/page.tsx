"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Users, Eye, MousePointer, TrendingUp, RefreshCw } from "lucide-react"
import Link from "next/link"

interface Visitor {
  id: string
  timestamp: number
  ip: string
  userAgent: string
  page: string
  referrer: string
  location?: {
    country: string
    city: string
    region: string
  }
  device: {
    type: "desktop" | "mobile" | "tablet"
    browser: string
    os: string
  }
  sessionId: string
  isActive: boolean
  pageViews: number
  timeOnSite: number
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

interface PageHistory {
  page: string
  timestamp: number
  sessionId: string
}

// Function to get all visitors from localStorage
function getAllVisitors(): Visitor[] {
  if (typeof window === "undefined") return []

  try {
    const visitors = localStorage.getItem("visitors")
    return visitors ? JSON.parse(visitors) : []
  } catch (error) {
    console.error("Error loading visitors:", error)
    return []
  }
}

// Function to get page history from localStorage
function getPageHistory(): PageHistory[] {
  if (typeof window === "undefined") return []

  try {
    const history = localStorage.getItem("pageHistory")
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error("Error loading page history:", error)
    return []
  }
}

export default function TrackingPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [pageHistory, setPageHistory] = useState<PageHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      const visitorData = getAllVisitors()
      const historyData = getPageHistory()
      setVisitors(visitorData)
      setPageHistory(historyData)
      setLoading(false)
    }

    loadData()
  }, [])

  // Calculate analytics data
  const analytics = {
    totalVisitors: visitors.length,
    activeVisitors: visitors.filter((v) => v.isActive).length,
    totalPageViews: visitors.reduce((sum, v) => sum + v.pageViews, 0),
    avgTimeOnSite:
      visitors.length > 0 ? Math.round(visitors.reduce((sum, v) => sum + v.timeOnSite, 0) / visitors.length / 1000) : 0,
    bounceRate:
      visitors.length > 0 ? Math.round((visitors.filter((v) => v.pageViews === 1).length / visitors.length) * 100) : 0,
    conversionRate:
      visitors.length > 0
        ? Math.round(
            (visitors.filter((v) => v.page.includes("/demo") || v.page.includes("/contact")).length / visitors.length) *
              100,
          )
        : 0,
  }

  // Top pages data
  const topPages = pageHistory.reduce(
    (acc, entry) => {
      acc[entry.page] = (acc[entry.page] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topPagesData = Object.entries(topPages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }))

  // Device breakdown
  const deviceData = visitors.reduce(
    (acc, visitor) => {
      acc[visitor.device.type] = (acc[visitor.device.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const deviceChartData = Object.entries(deviceData).map(([device, count]) => ({
    device: device.charAt(0).toUpperCase() + device.slice(1),
    count,
    percentage: visitors.length > 0 ? Math.round((count / visitors.length) * 100) : 0,
  }))

  // Traffic sources
  const trafficSources = visitors.reduce(
    (acc, visitor) => {
      const source =
        visitor.utmSource ||
        (visitor.referrer.includes("google")
          ? "Google"
          : visitor.referrer.includes("facebook")
            ? "Facebook"
            : visitor.referrer.includes("twitter")
              ? "Twitter"
              : visitor.referrer
                ? "Referral"
                : "Direct")
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const trafficSourceData = Object.entries(trafficSources)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([source, count]) => ({ source, count }))

  // Hourly traffic (last 24 hours)
  const now = Date.now()
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now - (23 - i) * 60 * 60 * 1000).getHours()
    const hourStart = now - (23 - i) * 60 * 60 * 1000
    const hourEnd = hourStart + 60 * 60 * 1000

    const visitorsInHour = visitors.filter((v) => v.timestamp >= hourStart && v.timestamp < hourEnd).length

    return {
      hour: `${hour}:00`,
      visitors: visitorsInHour,
    }
  })

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive visitor analytics and insights</p>
          </div>
          <Link href="/admin/visitors">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View Visitors
            </Button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.activeVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalPageViews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.avgTimeOnSite}s</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.bounceRate}%</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hourly Traffic */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic by Hour (Last 24h)</CardTitle>
            </CardHeader>
            <CardContent>
              {hourlyData.some((d) => d.visitors > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visitors" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No traffic data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {deviceChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device, percentage }) => `${device} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {deviceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">No device data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              {topPagesData.length > 0 ? (
                <div className="space-y-4">
                  {topPagesData.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{page.page}</span>
                      </div>
                      <Badge variant="secondary">{page.views} views</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No page data available</div>
              )}
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              {trafficSourceData.length > 0 ? (
                <div className="space-y-4">
                  {trafficSourceData.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">{source.source}</span>
                      </div>
                      <Badge variant="secondary">{source.count} visitors</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No traffic source data available</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {visitors.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
              <p className="text-gray-600 mb-4">
                Start tracking visitors to see analytics data here. Once visitors start coming to your site, you'll see
                detailed insights about their behavior, traffic sources, and more.
              </p>
              <Link href="/admin/visitors">
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  View Visitor Tracking
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
