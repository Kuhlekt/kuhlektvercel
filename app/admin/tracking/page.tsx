"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart,
  Bar,
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
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Activity,
  MousePointer,
  Calendar,
} from "lucide-react"
import Link from "next/link"

interface PageVisit {
  page: string
  timestamp: number
  referrer: string
  userAgent: string
  ip: string
}

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
  device: {
    type: "desktop" | "mobile" | "tablet"
    browser: string
    os: string
  }
  sessionId: string
  isActive: boolean
  pageViews: number
  timeOnSite: number
}

// Function to get all visitors from localStorage
function getAllVisitors(): Visitor[] {
  if (typeof window === "undefined") return []

  try {
    const visitors = localStorage.getItem("visitors")
    return visitors ? JSON.parse(visitors) : []
  } catch {
    return []
  }
}

// Function to get page history from localStorage
function getPageHistory(): PageVisit[] {
  if (typeof window === "undefined") return []

  try {
    const history = localStorage.getItem("pageHistory")
    return history ? JSON.parse(history) : []
  } catch {
    return []
  }
}

export default function TrackingPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [pageHistory, setPageHistory] = useState<PageVisit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      const allVisitors = getAllVisitors()
      const allPageHistory = getPageHistory()
      setVisitors(allVisitors)
      setPageHistory(allPageHistory)
      setLoading(false)
    }

    loadData()
  }, [])

  // Calculate analytics data
  const analytics = {
    totalVisitors: visitors.length,
    totalPageViews: pageHistory.length,
    activeVisitors: visitors.filter((v) => v.isActive).length,
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
    (acc, visit) => {
      acc[visit.page] = (acc[visit.page] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topPagesData = Object.entries(topPages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([page, views]) => ({ page, views }))

  // Device breakdown
  const deviceBreakdown = visitors.reduce(
    (acc, visitor) => {
      acc[visitor.device.type] = (acc[visitor.device.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const deviceData = Object.entries(deviceBreakdown).map(([device, count]) => ({
    device: device.charAt(0).toUpperCase() + device.slice(1),
    count,
    percentage: visitors.length > 0 ? Math.round((count / visitors.length) * 100) : 0,
  }))

  // Traffic sources
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
      acc[source] = (acc[source] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const trafficSourcesData = Object.entries(trafficSources).map(([source, count]) => ({
    source,
    count,
    percentage: visitors.length > 0 ? Math.round((count / visitors.length) * 100) : 0,
  }))

  // Hourly traffic data (last 24 hours)
  const now = Date.now()
  const last24Hours = now - 24 * 60 * 60 * 1000
  const recentVisitors = visitors.filter((v) => v.timestamp >= last24Hours)

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = new Date(now - (23 - i) * 60 * 60 * 1000).getHours()
    const hourStart = now - (23 - i) * 60 * 60 * 1000
    const hourEnd = hourStart + 60 * 60 * 1000
    const count = recentVisitors.filter((v) => v.timestamp >= hourStart && v.timestamp < hourEnd).length
    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      visitors: count,
    }
  })

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <Activity className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading analytics...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive website analytics and visitor insights</p>
        </div>
        <Link href="/admin/visitors">
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Visitor Details
          </Button>
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
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
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPageViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeVisitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgTimeOnSite}s</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
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

      {/* Charts and Data */}
      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Traffic Overview</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Traffic (Last 24 Hours)</CardTitle>
              <CardDescription>Visitor activity throughout the day</CardDescription>
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
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No traffic data available</p>
                    <p className="text-sm">Traffic will appear here as visitors browse your site</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              {topPagesData.length > 0 ? (
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topPagesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="page" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                  <ScrollArea className="h-[200px]">
                    <div className="space-y-2">
                      {topPagesData.map((page, index) => (
                        <div key={page.page} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{index + 1}</Badge>
                            <span className="font-medium">{page.page}</span>
                          </div>
                          <span className="text-muted-foreground">{page.views} views</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No page data available</p>
                    <p className="text-sm">Page views will appear here as visitors browse your site</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Breakdown</CardTitle>
                <CardDescription>Visitor device types</CardDescription>
              </CardHeader>
              <CardContent>
                {deviceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ device, percentage }) => `${device} ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    <div className="text-center">
                      <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No device data available</p>
                      <p className="text-sm">Device information will appear here as visitors browse your site</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Details</CardTitle>
                <CardDescription>Detailed device statistics</CardDescription>
              </CardHeader>
              <CardContent>
                {deviceData.length > 0 ? (
                  <div className="space-y-4">
                    {deviceData.map((device, index) => (
                      <div key={device.device} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-3">
                          {device.device === "Desktop" && <Monitor className="h-5 w-5" />}
                          {device.device === "Mobile" && <Smartphone className="h-5 w-5" />}
                          {device.device === "Tablet" && <Smartphone className="h-5 w-5" />}
                          <span className="font-medium">{device.device}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{device.count}</div>
                          <div className="text-sm text-muted-foreground">{device.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                    <p>No device data to display</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              {trafficSourcesData.length > 0 ? (
                <div className="space-y-4">
                  {trafficSourcesData.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5" />
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{source.count}</div>
                        <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  <div className="text-center">
                    <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No traffic source data available</p>
                    <p className="text-sm">Traffic sources will appear here as visitors browse your site</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
