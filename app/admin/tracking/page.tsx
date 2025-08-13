"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, MapPin, Eye, MousePointer, Globe, RefreshCw, BarChart3, PieChart } from "lucide-react"

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
  }
  sessionId: string
  isActive: boolean
}

interface PageHistory {
  page: string
  timestamp: number
  sessionId: string
}

export default function TrackingPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [pageHistory, setPageHistory] = useState<PageHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("24h")

  // Get all visitors from localStorage
  const getAllVisitors = (): Visitor[] => {
    try {
      const stored = localStorage.getItem("kuhlekt_visitors")
      if (stored) {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (error) {
      console.error("Error loading visitors:", error)
    }
    return []
  }

  // Get page history from localStorage
  const getPageHistory = (): PageHistory[] => {
    try {
      const stored = localStorage.getItem("kuhlekt_page_history")
      if (stored) {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (error) {
      console.error("Error loading page history:", error)
    }
    return []
  }

  // Load data
  const loadData = () => {
    setIsLoading(true)
    const allVisitors = getAllVisitors()
    const allPageHistory = getPageHistory()
    setVisitors(allVisitors)
    setPageHistory(allPageHistory)
    setIsLoading(false)
  }

  // Filter data by time range
  const getFilteredData = () => {
    const now = Date.now()
    const timeRanges = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      all: Number.POSITIVE_INFINITY,
    }

    const timeRange_ms = timeRanges[timeRange as keyof typeof timeRanges] || timeRanges["24h"]

    const filteredVisitors =
      timeRange_ms === Number.POSITIVE_INFINITY
        ? visitors
        : visitors.filter((visitor) => now - visitor.timestamp <= timeRange_ms)

    const filteredPageHistory =
      timeRange_ms === Number.POSITIVE_INFINITY
        ? pageHistory
        : pageHistory.filter((page) => now - page.timestamp <= timeRange_ms)

    return { filteredVisitors, filteredPageHistory }
  }

  // Calculate analytics
  const calculateAnalytics = () => {
    const { filteredVisitors, filteredPageHistory } = getFilteredData()

    // Basic stats
    const totalVisitors = filteredVisitors.length
    const uniqueVisitors = new Set(filteredVisitors.map((v) => v.ip)).size
    const activeVisitors = filteredVisitors.filter((v) => v.isActive).length
    const totalPageViews = filteredPageHistory.length

    // Top pages
    const pageViews = filteredPageHistory.reduce(
      (acc, page) => {
        acc[page.page] = (acc[page.page] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topPages = Object.entries(pageViews)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([page, views]) => ({ page, views }))

    // Traffic sources
    const sources = filteredVisitors.reduce(
      (acc, visitor) => {
        const source = visitor.referrer ? new URL(visitor.referrer).hostname : "Direct"
        acc[source] = (acc[source] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topSources = Object.entries(sources)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([source, visits]) => ({ source, visits }))

    // Countries
    const countries = filteredVisitors.reduce(
      (acc, visitor) => {
        const country = visitor.location?.country || "Unknown"
        acc[country] = (acc[country] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topCountries = Object.entries(countries)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, visits]) => ({ country, visits }))

    // Calculate bounce rate (visitors who viewed only one page)
    const sessionsWithMultiplePages = new Set(
      filteredPageHistory.reduce(
        (acc, page) => {
          acc[page.sessionId] = (acc[page.sessionId] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    )

    const totalSessions = new Set(filteredVisitors.map((v) => v.sessionId)).size
    const bounceRate =
      totalSessions > 0 ? Math.round(((totalSessions - sessionsWithMultiplePages.size) / totalSessions) * 100) : 0

    // Average pages per session
    const avgPagesPerSession = totalSessions > 0 ? Math.round((totalPageViews / totalSessions) * 10) / 10 : 0

    return {
      totalVisitors,
      uniqueVisitors,
      activeVisitors,
      totalPageViews,
      topPages,
      topSources,
      topCountries,
      bounceRate,
      avgPagesPerSession,
    }
  }

  // Initial load
  useEffect(() => {
    loadData()
  }, [])

  const analytics = calculateAnalytics()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mb-6">
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/visitors")}>
              <Users className="w-4 h-4 mr-2" />
              Visitor Tracking
            </Button>
            <Button variant="default" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics Dashboard
            </Button>
          </div>

          {/* Time Range Filter */}
          <div className="flex gap-2">
            {["1h", "24h", "7d", "30d", "all"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === "all" ? "All Time" : `Last ${range}`}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalVisitors}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                  <p className="text-2xl font-bold text-green-600">{analytics.uniqueVisitors}</p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-purple-600">{analytics.totalPageViews}</p>
                </div>
                <MousePointer className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                  <p className="text-2xl font-bold text-orange-600">{analytics.bounceRate}%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topPages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No page data available</p>
              ) : (
                <div className="space-y-4">
                  {analytics.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <Badge variant="secondary">{page.views} views</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topSources.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No traffic source data available</p>
              ) : (
                <div className="space-y-4">
                  {analytics.topSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <Badge variant="secondary">{source.visits} visits</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Top Countries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topCountries.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No location data available</p>
              ) : (
                <div className="space-y-4">
                  {analytics.topCountries.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <Badge variant="secondary">{country.visits} visits</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Session Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Active Visitors</span>
                  <Badge variant="default">{analytics.activeVisitors}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Avg. Pages/Session</span>
                  <Badge variant="secondary">{analytics.avgPagesPerSession}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Bounce Rate</span>
                  <Badge variant={analytics.bounceRate > 70 ? "destructive" : "secondary"}>
                    {analytics.bounceRate}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        {analytics.totalVisitors === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-12">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data</h3>
              <p className="text-gray-500 mb-4">
                No visitor data has been collected yet. Analytics will appear here once visitors start using your site.
              </p>
              <Button variant="outline" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
