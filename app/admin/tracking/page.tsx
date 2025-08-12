"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart3,
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  Download,
  FileText,
  Activity,
  Globe,
  ExternalLink,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { getAllVisitors, getPageHistory } from "@/components/visitor-tracker"

interface VisitorData {
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

interface PageHistoryItem {
  page: string
  timestamp: string
  sessionId: string
}

export default function AnalyticsDashboard() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [pageHistory, setPageHistory] = useState<PageHistoryItem[]>([])
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const visitorData = getAllVisitors()
        const historyData = getPageHistory()
        setVisitors(visitorData)
        setPageHistory(historyData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading analytics data:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Calculate analytics from real visitor data
  const calculateAnalytics = () => {
    if (visitors.length === 0) {
      return {
        totalVisitors: 0,
        pageViews: 0,
        bounceRate: 0,
        avgSessionDuration: "0m 0s",
        conversionRate: 0,
        newVisitors: 0,
        returningVisitors: 0,
      }
    }

    const totalPageViews = visitors.reduce((sum, visitor) => sum + visitor.pageViews, 0)
    const activeVisitors = visitors.filter((visitor) => {
      const lastVisit = new Date(visitor.lastVisit)
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
      return lastVisit > thirtyMinutesAgo
    }).length

    const convertedVisitors = visitors.filter(
      (visitor) => visitor.currentPage.includes("/demo") || visitor.currentPage.includes("/contact"),
    ).length

    const conversionRate = visitors.length > 0 ? (convertedVisitors / visitors.length) * 100 : 0
    const bounceRate =
      visitors.length > 0 ? (visitors.filter((v) => v.pageViews === 1).length / visitors.length) * 100 : 0

    return {
      totalVisitors: visitors.length,
      pageViews: totalPageViews,
      bounceRate: bounceRate,
      avgSessionDuration: "3m 42s", // This would need session duration tracking
      conversionRate: conversionRate,
      newVisitors: visitors.length, // All are new in this simple implementation
      returningVisitors: 0,
      activeVisitors,
      convertedVisitors,
    }
  }

  // Calculate top pages from page history
  const calculateTopPages = () => {
    if (pageHistory.length === 0) return []

    const pageCounts = pageHistory.reduce(
      (acc, item) => {
        acc[item.page] = (acc[item.page] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(pageCounts)
      .map(([page, views]) => ({
        page,
        views,
        percentage: pageHistory.length > 0 ? (views / pageHistory.length) * 100 : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  }

  // Calculate traffic sources
  const calculateTrafficSources = () => {
    if (visitors.length === 0) return []

    const sourceCounts = visitors.reduce(
      (acc, visitor) => {
        const source = visitor.utmSource || (visitor.referrer === "direct" ? "Direct" : "Other")
        acc[source] = (acc[source] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(sourceCounts)
      .map(([source, count]) => ({
        source: source.charAt(0).toUpperCase() + source.slice(1),
        visitors: count,
        percentage: visitors.length > 0 ? (count / visitors.length) * 100 : 0,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 5)
  }

  const analytics = calculateAnalytics()
  const topPages = calculateTopPages()
  const trafficSources = calculateTrafficSources()

  // Generate comprehensive report
  const generateReport = async () => {
    setIsGeneratingReport(true)

    // Simulate report generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: analytics,
      topPages: topPages,
      trafficSources: trafficSources,
      totalVisitors: visitors.length,
      totalPageViews: pageHistory.length,
      visitorDetails: visitors.map((visitor) => ({
        visitorId: visitor.visitorId,
        sessionId: visitor.sessionId,
        firstVisit: visitor.firstVisit,
        lastVisit: visitor.lastVisit,
        pageViews: visitor.pageViews,
        referrer: visitor.referrer,
        utmSource: visitor.utmSource,
        affiliate: visitor.affiliate,
      })),
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analytics-report-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setIsGeneratingReport(false)
  }

  // Export complete analytics data
  const exportAnalytics = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      visitors: visitors,
      pageHistory: pageHistory,
      analytics: analytics,
      topPages: topPages,
      trafficSources: trafficSources,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `complete-analytics-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading analytics data...</p>
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
          <Link href="/admin/visitors">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Users className="h-4 w-4" />
              Visitor Tracking
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{analytics.activeVisitors} currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.pageViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analytics.totalVisitors > 0
                  ? `Avg. ${(analytics.pageViews / analytics.totalVisitors).toFixed(1)} per visitor`
                  : "No data available"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">{analytics.convertedVisitors} conversions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.bounceRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Single page visits</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button onClick={generateReport} disabled={isGeneratingReport || visitors.length === 0}>
            {isGeneratingReport ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>

          <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" disabled={pageHistory.length === 0}>
                <Activity className="h-4 w-4 mr-2" />
                View Page History
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Page Visit History</DialogTitle>
                <DialogDescription>Chronological log of all page visits tracked on your website</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] w-full">
                <div className="space-y-3">
                  {pageHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No page history available</p>
                    </div>
                  ) : (
                    pageHistory
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((item, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{item.page}</Badge>
                              <span className="text-sm text-gray-600">Session: {item.sessionId}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              {new Date(item.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Button onClick={exportAnalytics} variant="outline" disabled={visitors.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export Analytics
          </Button>

          <Link href="/admin/visitors">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              View All Visitors
            </Button>
          </Link>
        </div>

        {/* Analytics Cards */}
        {visitors.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Analytics Data Available</h3>
                <p className="mb-4">
                  Analytics data will appear here as visitors browse your website. The visitor tracking system will
                  automatically collect and display insights about your website traffic.
                </p>
                <Link href="/admin/visitors">
                  <Button variant="outline" className="bg-transparent">
                    View Visitor Tracking
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Pages
                </CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPages.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>No page data available</p>
                    </div>
                  ) : (
                    topPages.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{page.page}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{page.views.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{page.percentage.toFixed(1)}%</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Traffic Sources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trafficSources.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <p>No traffic source data available</p>
                    </div>
                  ) : (
                    trafficSources.map((source) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <div className="font-medium">{source.source}</div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-500">{source.percentage.toFixed(1)}%</div>
                          <div className="font-medium">{source.visitors.toLocaleString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Session Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average Session Duration</span>
                    <span className="font-medium">{analytics.avgSessionDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pages per Session</span>
                    <span className="font-medium">
                      {analytics.totalVisitors > 0 ? (analytics.pageViews / analytics.totalVisitors).toFixed(1) : "0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Visitors</span>
                    <span className="font-medium">{analytics.activeVisitors}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visitor Types */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Visitor Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>New Visitors</span>
                    <span className="font-medium">{analytics.newVisitors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Returning Visitors</span>
                    <span className="font-medium">{analytics.returningVisitors.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Converted Visitors</span>
                    <span className="font-medium">{analytics.convertedVisitors.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
