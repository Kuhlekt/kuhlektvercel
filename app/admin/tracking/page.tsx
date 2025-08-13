"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  MousePointer,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  Clock,
  Target,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface VisitorData {
  id: string
  timestamp: number
  page: string
  referrer: string
  userAgent: string
  ip: string
  country?: string
  city?: string
  device: string
  browser: string
  sessionId: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  isActive: boolean
  pageViews: number
  sessionDuration: number
}

interface PageHistory {
  page: string
  timestamp: number
  sessionId: string
}

export default function TrackingPage() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [pageHistory, setPageHistory] = useState<PageHistory[]>([])
  const [loading, setLoading] = useState(true)

  // Load data from localStorage
  const loadData = () => {
    try {
      const storedVisitors = localStorage.getItem("kuhlekt_visitors")
      const storedPageHistory = localStorage.getItem("kuhlekt_page_history")

      if (storedVisitors) {
        setVisitors(JSON.parse(storedVisitors))
      } else {
        setVisitors([])
      }

      if (storedPageHistory) {
        setPageHistory(JSON.parse(storedPageHistory))
      } else {
        setPageHistory([])
      }
    } catch (error) {
      console.error("Error loading tracking data:", error)
      setVisitors([])
      setPageHistory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate analytics data
  const analytics = {
    totalVisitors: visitors.length,
    activeVisitors: visitors.filter((v) => v.isActive).length,
    totalPageViews: visitors.reduce((sum, v) => sum + v.pageViews, 0) + pageHistory.length,
    avgSessionDuration:
      visitors.length > 0
        ? Math.round(visitors.reduce((sum, v) => sum + v.sessionDuration, 0) / visitors.length / 1000)
        : 0,
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
  const topPages =
    pageHistory.length > 0
      ? (() => {
          const pageCounts = pageHistory.reduce(
            (acc, visit) => {
              acc[visit.page] = (acc[visit.page] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          )

          return Object.entries(pageCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([page, views]) => ({ page, views }))
        })()
      : [{ page: "No data available", views: 0 }]

  // Device breakdown
  const deviceData =
    visitors.length > 0
      ? (() => {
          const deviceCounts = visitors.reduce(
            (acc, visitor) => {
              acc[visitor.device] = (acc[visitor.device] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          )

          return Object.entries(deviceCounts).map(([device, count]) => ({
            name: device,
            value: count,
            percentage: Math.round((count / visitors.length) * 100),
          }))
        })()
      : [{ name: "No data", value: 0, percentage: 0 }]

  // Traffic sources
  const trafficSources =
    visitors.length > 0
      ? (() => {
          const sourceCounts = visitors.reduce(
            (acc, visitor) => {
              const source = visitor.utmSource || (visitor.referrer ? "Referral" : "Direct")
              acc[source] = (acc[source] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          )

          return Object.entries(sourceCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([source, visitors]) => ({ source, visitors }))
        })()
      : [{ source: "No data available", visitors: 0 }]

  // Hourly traffic (last 24 hours)
  const hourlyTraffic = (() => {
    const now = new Date()
    const last24Hours = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000)
      return {
        hour: hour.getHours(),
        label: hour.toLocaleTimeString("en-US", { hour: "numeric", hour12: true }),
        visitors: 0,
      }
    })

    if (visitors.length > 0) {
      const cutoff = now.getTime() - 24 * 60 * 60 * 1000
      visitors
        .filter((v) => v.timestamp > cutoff)
        .forEach((visitor) => {
          const visitorHour = new Date(visitor.timestamp).getHours()
          const hourData = last24Hours.find((h) => h.hour === visitorHour)
          if (hourData) {
            hourData.visitors++
          }
        })
    }

    return last24Hours
  })()

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#FF7C7C"]

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive website analytics and visitor insights</p>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Link href="/admin/visitors">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Visitor Details
            </Button>
          </Link>
        </div>
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
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.activeVisitors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPageViews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgSessionDuration}s</div>
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
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Data */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hourly Traffic */}
            <Card>
              <CardHeader>
                <CardTitle>Traffic by Hour (Last 24h)</CardTitle>
                <CardDescription>Visitor activity throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={hourlyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visitors" stroke="#0088FE" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Visitor device distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topPages} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="page" type="category" width={150} />
                  <Tooltip />
                  <Bar dataKey="views" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={trafficSources}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deviceData.map((device, index) => (
              <Card key={device.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {getDeviceIcon(device.name)}
                    {device.name}
                  </CardTitle>
                  <Badge variant="secondary">{device.percentage}%</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{device.value}</div>
                  <p className="text-xs text-muted-foreground">visitors</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State Message */}
      {visitors.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Yet</h3>
            <p className="text-gray-600 mb-4">
              Start collecting visitor data by having people visit your website. Analytics will appear here as traffic
              grows.
            </p>
            <Link href="/admin/visitors">
              <Button>
                <Users className="h-4 w-4 mr-2" />
                View Visitor Details
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
