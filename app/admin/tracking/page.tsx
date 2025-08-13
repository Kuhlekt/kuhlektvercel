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
import { TrendingUp, Users, MousePointer, Clock, Globe, RefreshCw, Download, Eye } from "lucide-react"
import Link from "next/link"

interface Visitor {
  id: string
  timestamp: number
  ip: string
  userAgent: string
  page: string
  referrer: string
  location?: {
    country?: string
    city?: string
  }
  sessionDuration?: number
  pageViews?: number
  isActive?: boolean
}

interface PageHistory {
  page: string
  timestamp: number
  visitorId: string
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function TrackingPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [pageHistory, setPageHistory] = useState<PageHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false)

  // Load data
  useEffect(() => {
    const loadData = () => {
      try {
        const storedVisitors = localStorage.getItem("kuhlekt_visitors")
        const storedPageHistory = localStorage.getItem("kuhlekt_page_history")

        if (storedVisitors) {
          setVisitors(JSON.parse(storedVisitors))
        }

        if (storedPageHistory) {
          setPageHistory(JSON.parse(storedPageHistory))
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Set up real-time updates
    let interval: NodeJS.Timeout
    if (isRealTimeEnabled) {
      interval = setInterval(loadData, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRealTimeEnabled])

  // Calculate analytics data
  const analytics = {
    totalVisitors: visitors.length,
    activeVisitors: visitors.filter((v) => v.isActive).length,
    totalPageViews: pageHistory.length || visitors.reduce((sum, v) => sum + (v.pageViews || 1), 0),
    avgSessionDuration:
      visitors.length > 0
        ? Math.round(visitors.reduce((sum, v) => sum + (v.sessionDuration || 0), 0) / visitors.length)
        : 0,
    bounceRate:
      visitors.length > 0
        ? Math.round((visitors.filter((v) => (v.pageViews || 1) === 1).length / visitors.length) * 100)
        : 0,
    conversionRate:
      visitors.length > 0
        ? Math.round(
            (visitors.filter((v) => v.page.includes("/demo") || v.page.includes("/contact")).length / visitors.length) *
              100,
          )
        : 0,
  }

  // Top pages data
  const topPages =
    pageHistory.length > 0
      ? Object.entries(
          pageHistory.reduce(
            (acc, entry) => {
              acc[entry.page] = (acc[entry.page] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ),
        )
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([page, views]) => ({ page, views }))
      : visitors
          .reduce(
            (acc, visitor) => {
              const existing = acc.find((item) => item.page === visitor.page)
              if (existing) {
                existing.views += visitor.pageViews || 1
              } else {
                acc.push({ page: visitor.page, views: visitor.pageViews || 1 })
              }
              return acc
            },
            [] as { page: string; views: number }[],
          )
          .sort((a, b) => b.views - a.views)
          .slice(0, 10)

  // Traffic sources data
  const trafficSources = visitors.reduce(
    (acc, visitor) => {
      let source = "Direct"
      if (visitor.referrer) {
        if (visitor.referrer.includes("google")) source = "Google"
        else if (visitor.referrer.includes("facebook")) source = "Facebook"
        else if (visitor.referrer.includes("twitter")) source = "Twitter"
        else if (visitor.referrer.includes("linkedin")) source = "LinkedIn"
        else source = "Referral"
      }

      const existing = acc.find((item) => item.name === source)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: source, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  // Hourly traffic data (last 24 hours)
  const hourlyTraffic = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date()
    hour.setHours(hour.getHours() - (23 - i), 0, 0, 0)
    const hourStart = hour.getTime()
    const hourEnd = hourStart + 60 * 60 * 1000

    const visitsInHour = visitors.filter((v) => v.timestamp >= hourStart && v.timestamp < hourEnd).length

    return {
      hour: hour.getHours(),
      visits: visitsInHour,
      label: `${hour.getHours()}:00`,
    }
  })

  const exportAnalytics = () => {
    const analyticsData = {
      summary: analytics,
      topPages,
      trafficSources,
      hourlyTraffic,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-analytics-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Comprehensive website analytics and visitor insights</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/visitors">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Visitor Details
              </Button>
            </Link>
            <Button
              variant={isRealTimeEnabled ? "default" : "outline"}
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRealTimeEnabled ? "animate-spin" : ""}`} />
              {isRealTimeEnabled ? "Real-time On" : "Real-time Off"}
            </Button>
            <Button onClick={exportAnalytics}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalVisitors}</p>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.totalPageViews}</p>
                  <p className="text-sm text-gray-500 mt-1">Total interactions</p>
                </div>
                <MousePointer className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                  <p className="text-3xl font-bold text-gray-900">{formatDuration(analytics.avgSessionDuration)}</p>
                  <p className="text-sm text-gray-500 mt-1">Time on site</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Now</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.activeVisitors}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    <p className="text-sm text-gray-500">Live visitors</p>
                  </div>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.bounceRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Single page visits</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{analytics.conversionRate}%</p>
                  <p className="text-sm text-gray-500 mt-1">Demo/Contact visits</p>
                </div>
                <Globe className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hourly Traffic */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic by Hour (Last 24h)</CardTitle>
            </CardHeader>
            <CardContent>
              {hourlyTraffic.some((h) => h.visits > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No traffic data available for the last 24 hours</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              {trafficSources.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trafficSources}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {trafficSources.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-300 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No traffic source data available</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <div className="space-y-4">
                {topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="font-medium text-gray-900">{page.page}</p>
                        <p className="text-sm text-gray-500">{page.views} views</p>
                      </div>
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(page.views / Math.max(...topPages.map((p) => p.views))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MousePointer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No page data available</h3>
                <p className="text-gray-500">Page view data will appear here once visitors start browsing your site.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
