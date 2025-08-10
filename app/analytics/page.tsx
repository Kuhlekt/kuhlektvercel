"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  TrendingUp,
  Clock,
  MapPin,
  ExternalLink,
} from "lucide-react"

interface VisitorStats {
  totalVisitors: number
  uniqueVisitors24h: number
  uniqueVisitors7d: number
  pageViews24h: number
  pageViews7d: number
  totalPageViews: number
  activeSessions: number
  topPages: Array<{ page: string; views: number }>
  deviceBreakdown: Record<string, number>
  browserBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
  referrerBreakdown: Record<string, number>
  recentVisitors: Array<{
    id: string
    timestamp: string
    ip: string
    country?: string
    city?: string
    page: string
    deviceType: string
    browser: string
    referrer?: string
  }>
}

interface RealtimeData {
  activeVisitors: number
  activeSessions: Array<{
    sessionId: string
    startTime: string
    lastActivity: string
    pagesVisited: number
    currentPage: string
  }>
  recentPageViews: Array<{
    page: string
    timestamp: string
    sessionId: string
  }>
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchStats = async () => {
    try {
      const [statsResponse, realtimeResponse] = await Promise.all([
        fetch("/api/visitor-stats"),
        fetch("/api/realtime-visitors"),
      ])

      if (statsResponse.ok && realtimeResponse.ok) {
        const statsData = await statsResponse.json()
        const realtimeData = await realtimeResponse.json()

        setStats(statsData)
        setRealtimeData(realtimeData)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />
      case "tablet":
        return <Tablet className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!stats || !realtimeData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-gray-600">Failed to load analytics data. Please try again.</p>
          <Button onClick={fetchStats} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">Real-time visitor tracking and website analytics for Kuhlekt</p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <Button onClick={fetchStats} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{realtimeData.activeVisitors}</div>
              <p className="text-xs text-muted-foreground">Currently browsing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Visitors (24h)</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.uniqueVisitors24h}</div>
              <p className="text-xs text-muted-foreground">Unique visitors today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views (24h)</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pageViews24h}</div>
              <p className="text-xs text-muted-foreground">Pages viewed today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSessions}</div>
              <p className="text-xs text-muted-foreground">All time sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Device Types (7 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.deviceBreakdown).map(([device, count]) => (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device)}
                          <span className="capitalize">{device}</span>
                        </div>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Browser Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Browsers (7 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.browserBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([browser, count]) => (
                        <div key={browser} className="flex items-center justify-between">
                          <span>{browser}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Country Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Countries (7 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.countryBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([country, count]) => (
                        <div key={country} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{country}</span>
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Referrer Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Referrers (7 days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.referrerBreakdown)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([referrer, count]) => (
                        <div key={referrer} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ExternalLink className="w-4 h-4" />
                            <span>{referrer}</span>
                          </div>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Visitors currently browsing the site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {realtimeData.activeSessions.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No active sessions</p>
                    ) : (
                      realtimeData.activeSessions.map((session) => (
                        <div key={session.sessionId} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-sm font-medium">Session {session.sessionId.slice(-8)}</div>
                            <Badge variant="outline" className="text-xs">
                              {session.pagesVisited} pages
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>Current: {session.currentPage}</div>
                            <div>Started: {formatTime(session.startTime)}</div>
                            <div>Last activity: {formatTime(session.lastActivity)}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Page Views */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Page Views</CardTitle>
                  <CardDescription>Latest page views in real-time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {realtimeData.recentPageViews.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No recent page views</p>
                    ) : (
                      realtimeData.recentPageViews.map((pageView, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="font-medium">{pageView.page}</span>
                          <span className="text-gray-500">{formatTime(pageView.timestamp)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Pages (7 days)</CardTitle>
                <CardDescription>Most visited pages on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <Badge variant="secondary">{page.views} views</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Visitors</CardTitle>
                <CardDescription>Latest visitors to your website</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentVisitors.map((visitor) => (
                    <div key={visitor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(visitor.deviceType)}
                          <span className="font-medium">{visitor.browser}</span>
                          <Badge variant="outline" className="text-xs">
                            {visitor.deviceType}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">{formatTime(visitor.timestamp)}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Page: {visitor.page}</div>
                        <div className="flex items-center gap-4">
                          <span>IP: {visitor.ip}</span>
                          {visitor.country && (
                            <span>
                              Location: {visitor.city}, {visitor.country}
                            </span>
                          )}
                        </div>
                        {visitor.referrer && <div>Referrer: {visitor.referrer}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
