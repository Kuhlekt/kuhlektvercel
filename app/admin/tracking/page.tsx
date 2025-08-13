"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  TrendingUp,
  MapPin,
  Eye,
  MousePointer,
  Globe,
  RefreshCw,
  BarChart3,
  PieChart,
  Download,
  Trash2,
  Pause,
  Activity,
  AlertCircle,
} from "lucide-react"

interface Visitor {
  visitorId: string
  sessionId: string
  firstVisit: string
  lastVisit: string
  pageViews: number
  referrer: string
  userAgent: string
  currentPage: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  affiliate?: string
}

interface PageHistory {
  page: string
  timestamp: string
  sessionId: string
}

export default function TrackingPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [pageHistory, setPageHistory] = useState<PageHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("24h")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(10) // seconds
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [dataChanged, setDataChanged] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const previousDataRef = useRef<string>("")

  // Get all visitors from localStorage
  const getAllVisitors = useCallback((): Visitor[] => {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("kuhlekt_all_visitors")
      if (stored) {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (error) {
      console.error("Error loading visitors:", error)
    }
    return []
  }, [])

  // Get page history from localStorage
  const getPageHistory = useCallback((): PageHistory[] => {
    if (typeof window === "undefined") return []

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
  }, [])

  // Load data and detect changes
  const loadData = useCallback(() => {
    setIsLoading(true)
    const allVisitors = getAllVisitors()
    const allPageHistory = getPageHistory()

    // Create a hash of the current data to detect changes
    const currentDataHash = JSON.stringify({
      visitors: allVisitors.length,
      pages: allPageHistory.length,
      lastVisitor: allVisitors[allVisitors.length - 1]?.lastVisit,
    })

    // Check if data has changed
    if (previousDataRef.current && previousDataRef.current !== currentDataHash) {
      setDataChanged(true)
      setTimeout(() => setDataChanged(false), 2000) // Clear indicator after 2 seconds
    }

    previousDataRef.current = currentDataHash

    setVisitors(allVisitors)
    setPageHistory(allPageHistory)
    setLastUpdated(new Date())
    setIsLoading(false)

    console.log("Analytics data loaded:", {
      visitors: allVisitors.length,
      pageHistory: allPageHistory.length,
      timestamp: new Date().toISOString(),
    })
  }, [getAllVisitors, getPageHistory])

  // Setup auto-refresh
  const setupAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        loadData()
      }, refreshInterval * 1000)
    }
  }, [autoRefresh, refreshInterval, loadData])

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  // Clear all data
  const clearAllData = () => {
    if (typeof window === "undefined") return

    if (confirm("Are you sure you want to clear all tracking data? This action cannot be undone.")) {
      localStorage.removeItem("kuhlekt_all_visitors")
      localStorage.removeItem("kuhlekt_page_history")
      localStorage.removeItem("kuhlekt_visitor_data")
      localStorage.removeItem("kuhlekt_visitor_id")
      sessionStorage.removeItem("kuhlekt_session_id")

      setVisitors([])
      setPageHistory([])
      previousDataRef.current = ""

      alert("All tracking data has been cleared.")
    }
  }

  // Export analytics data as CSV
  const exportAnalyticsData = () => {
    const analytics = calculateAnalytics()

    if (analytics.totalVisitors === 0) {
      alert("No analytics data to export")
      return
    }

    // Create comprehensive analytics report
    const reportData = [
      ["Kuhlekt Analytics Report", ""],
      ["Generated", new Date().toISOString()],
      ["Time Range", timeRange === "all" ? "All Time" : `Last ${timeRange}`],
      ["", ""],
      ["OVERVIEW METRICS", ""],
      ["Total Visitors", analytics.totalVisitors],
      ["Unique Visitors", analytics.uniqueVisitors],
      ["Total Page Views", analytics.totalPageViews],
      ["Bounce Rate", `${analytics.bounceRate}%`],
      ["Avg Pages/Session", analytics.avgPagesPerSession],
      ["", ""],
      ["TOP PAGES", "Views"],
      ...analytics.topPages.map((page) => [page.page, page.views]),
      ["", ""],
      ["TRAFFIC SOURCES", "Visits"],
      ...analytics.topSources.map((source) => [source.source, source.visits]),
      ["", ""],
      ["UTM CAMPAIGNS", "Visits"],
      ...analytics.topCampaigns.map((campaign) => [campaign.campaign, campaign.visits]),
    ]

    const csvContent = reportData.map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-analytics-report-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Export raw visitor data as CSV
  const exportVisitorData = () => {
    if (visitors.length === 0) {
      alert("No visitor data to export")
      return
    }

    const csvHeaders = [
      "Visitor ID",
      "Session ID",
      "First Visit",
      "Last Visit",
      "Page Views",
      "Referrer",
      "Current Page",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "UTM Term",
      "UTM Content",
      "Affiliate",
      "User Agent",
    ]

    const csvData = visitors.map((visitor) => [
      visitor.visitorId,
      visitor.sessionId,
      visitor.firstVisit,
      visitor.lastVisit,
      visitor.pageViews,
      visitor.referrer,
      visitor.currentPage,
      visitor.utmSource || "",
      visitor.utmMedium || "",
      visitor.utmCampaign || "",
      visitor.utmTerm || "",
      visitor.utmContent || "",
      visitor.affiliate || "",
      visitor.userAgent,
    ])

    const csvContent = [csvHeaders, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-visitor-data-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Filter data by time range
  const getFilteredData = () => {
    const now = new Date().getTime()
    const timeRanges = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      all: Number.POSITIVE_INFINITY,
    }

    const timeRange_ms = timeRanges[timeRange as keyof typeof timeRanges] || timeRanges["24h"]

    const filteredVisitors = visitors.filter((visitor) => {
      if (timeRange_ms === Number.POSITIVE_INFINITY) return true
      const visitTime = new Date(visitor.lastVisit).getTime()
      return now - visitTime <= timeRange_ms
    })

    const filteredPageHistory = pageHistory.filter((page) => {
      if (timeRange_ms === Number.POSITIVE_INFINITY) return true
      const pageTime = new Date(page.timestamp).getTime()
      return now - pageTime <= timeRange_ms
    })

    return { filteredVisitors, filteredPageHistory }
  }

  // Calculate analytics
  const calculateAnalytics = () => {
    const { filteredVisitors, filteredPageHistory } = getFilteredData()

    // Basic stats
    const totalVisitors = filteredVisitors.length
    const uniqueVisitors = filteredVisitors.length > 0 ? new Set(filteredVisitors.map((v) => v.visitorId)).size : 0
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
        let source = "Direct"
        if (visitor.referrer && visitor.referrer !== "direct" && visitor.referrer !== "(direct)") {
          try {
            source = new URL(visitor.referrer).hostname
          } catch {
            source = "Referral"
          }
        }
        acc[source] = (acc[source] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topSources = Object.entries(sources)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([source, visits]) => ({ source, visits }))

    // UTM campaigns
    const campaigns = filteredVisitors.reduce(
      (acc, visitor) => {
        const campaign = visitor.utmCampaign || "None"
        acc[campaign] = (acc[campaign] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const topCampaigns = Object.entries(campaigns)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([campaign, visits]) => ({ campaign, visits }))

    // Calculate bounce rate (visitors who viewed only one page)
    const sessionPageCounts = filteredPageHistory.reduce(
      (acc, page) => {
        acc[page.sessionId] = (acc[page.sessionId] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const totalSessions = filteredVisitors.length > 0 ? new Set(filteredVisitors.map((v) => v.sessionId)).size : 0
    const sessionsWithMultiplePages = Object.values(sessionPageCounts).filter((count) => count > 1).length
    const bounceRate =
      totalSessions > 0 ? Math.round(((totalSessions - sessionsWithMultiplePages) / totalSessions) * 100) : 0

    // Average pages per session
    const avgPagesPerSession = totalSessions > 0 ? Math.round((totalPageViews / totalSessions) * 10) / 10 : 0

    return {
      totalVisitors,
      uniqueVisitors,
      totalPageViews,
      topPages,
      topSources,
      topCampaigns,
      bounceRate,
      avgPagesPerSession,
    }
  }

  // Setup auto-refresh when settings change
  useEffect(() => {
    setupAutoRefresh()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [setupAutoRefresh])

  // Initial load
  useEffect(() => {
    loadData()
  }, [loadData])

  const analytics = calculateAnalytics()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              {dataChanged && (
                <div className="flex items-center gap-1 text-green-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">New Data</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportAnalyticsData}
                disabled={analytics.totalVisitors === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button variant="outline" size="sm" onClick={exportVisitorData} disabled={visitors.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllData}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </Button>
              <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
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

          {/* Auto-refresh Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={autoRefresh} onCheckedChange={toggleAutoRefresh} />
                    <span className="text-sm font-medium">Auto Refresh</span>
                    {autoRefresh ? (
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Pause className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Paused</span>
                      </div>
                    )}
                  </div>
                  <Select
                    value={refreshInterval.toString()}
                    onValueChange={(value) => setRefreshInterval(Number.parseInt(value))}
                    disabled={!autoRefresh}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                  {dataChanged && <span className="ml-2 text-green-600 font-medium">• Updated</span>}
                </div>
              </div>
            </CardContent>
          </Card>

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
          {/* UTM Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                UTM Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.topCampaigns.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No campaign data available</p>
              ) : (
                <div className="space-y-4">
                  {analytics.topCampaigns.map((campaign, index) => (
                    <div key={campaign.campaign} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <span className="font-medium">{campaign.campaign}</span>
                      </div>
                      <Badge variant="secondary">{campaign.visits} visits</Badge>
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
                  <span className="font-medium">Total Sessions</span>
                  <Badge variant="default">
                    {visitors.length > 0 ? new Set(visitors.map((v) => v.sessionId)).size : 0}
                  </Badge>
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
                No visitor data has been collected yet. Visit the main site to generate tracking data.
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
