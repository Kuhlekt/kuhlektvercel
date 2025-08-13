"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Users, Eye, MousePointer, TrendingUp, Globe, Clock, RefreshCw, ExternalLink } from "lucide-react"

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

export default function TrackingPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [pageHistory, setPageHistory] = useState<PageHistory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get all visitors from localStorage
  const getAllVisitors = (): Visitor[] => {
    try {
      const stored = localStorage.getItem("kuhlekt_visitors")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading visitors:", error)
      return []
    }
  }

  // Get page history from localStorage
  const getPageHistory = (): PageHistory[] => {
    try {
      const stored = localStorage.getItem("kuhlekt_page_history")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading page history:", error)
      return []
    }
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

  useEffect(() => {
    loadData()
  }, [])

  // Calculate analytics
  const totalVisitors = visitors.length
  const activeVisitors = visitors.filter((v) => v.isActive).length
  const totalPageViews = visitors.reduce((sum, v) => sum + v.pageViews, 0)
  const avgTimeOnSite =
    visitors.length > 0 ? Math.round(visitors.reduce((sum, v) => sum + v.timeOnSite, 0) / visitors.length / 1000) : 0

  // Calculate top pages
  const topPages = pageHistory.reduce(
    (acc, page) => {
      acc[page.page] = (acc[page.page] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topPagesArray = Object.entries(topPages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([page, views]) => ({ page, views }))

  // Calculate traffic sources
  const trafficSources = visitors.reduce(
    (acc, visitor) => {
      let source = "Direct"
      if (visitor.utmSource) {
        source = visitor.utmSource
      } else if (visitor.referrer && visitor.referrer !== "(direct)") {
        try {
          const domain = new URL(visitor.referrer).hostname
          source = domain.replace("www.", "")
        } catch {
          source = "Referral"
        }
      }
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const trafficSourcesArray = Object.entries(trafficSources)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([source, visitors]) => ({ source, visitors }))

  // Calculate conversion rate (demo page visits / total visitors)
  const demoPageVisits = pageHistory.filter((p) => p.page.includes("/demo")).length
  const conversionRate = totalVisitors > 0 ? ((demoPageVisits / totalVisitors) * 100).toFixed(1) : "0.0"

  // Calculate bounce rate (visitors with only 1 page view)
  const bounceRate =
    totalVisitors > 0 ? ((visitors.filter((v) => v.pageViews === 1).length / totalVisitors) * 100).toFixed(1) : "0.0"

  // Get recent activity
  const recentActivity = visitors.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive visitor analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Link href="/admin/visitors">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View All Visitors
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-3xl font-bold text-gray-900">{totalVisitors}</p>
                  <p className="text-sm text-gray-500 mt-1">All time</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Now</p>
                  <p className="text-3xl font-bold text-green-600">{activeVisitors}</p>
                  <p className="text-sm text-gray-500 mt-1">Currently browsing</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-3xl font-bold text-purple-600">{totalPageViews}</p>
                  <p className="text-sm text-gray-500 mt-1">Total interactions</p>
                </div>
                <MousePointer className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                  <p className="text-3xl font-bold text-orange-600">{avgTimeOnSite}s</p>
                  <p className="text-sm text-gray-500 mt-1">Time on site</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Conversion Rate</h3>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{conversionRate}%</div>
              <p className="text-sm text-gray-500">Demo page visits / Total visitors</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Bounce Rate</h3>
                <BarChart3 className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{bounceRate}%</div>
              <p className="text-sm text-gray-500">Single page visits</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {topPagesArray.length === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No page data available</h3>
                    <p className="text-gray-500">Page view data will appear here once visitors browse your site.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topPagesArray.map((page, index) => (
                      <div key={page.page} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{page.page}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{page.views} views</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trafficSourcesArray.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No traffic source data</h3>
                    <p className="text-gray-500">Traffic source information will appear here as visitors arrive.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trafficSourcesArray.map((source, index) => (
                      <div key={source.source} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-green-600">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{source.source}</p>
                          </div>
                        </div>
                        <Badge variant="secondary">{source.visitors} visitors</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                    <p className="text-gray-500">Recent visitor activity will be displayed here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((visitor) => (
                      <div key={visitor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">{visitor.ip}</p>
                            <p className="text-sm text-gray-500">
                              Visited {visitor.page} • {visitor.location?.city || "Unknown location"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{formatTimeAgo(visitor.timestamp)}</p>
                          <Badge variant={visitor.isActive ? "default" : "secondary"} className="mt-1">
                            {visitor.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
