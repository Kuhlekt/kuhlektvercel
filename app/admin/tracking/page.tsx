"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  Users,
  Eye,
  MousePointer,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  FileText,
  Search,
  MapPin,
} from "lucide-react"

// Mock data - in a real app, this would come from your analytics service
const analyticsData = {
  totalVisitors: 1247,
  pageViews: 3891,
  avgSessionDuration: "3m 42s",
  bounceRate: "34.2%",
  topPages: [
    { path: "/", views: 892, title: "Home" },
    { path: "/solutions", views: 456, title: "Solutions" },
    { path: "/pricing", views: 234, title: "Pricing" },
    { path: "/about", views: 189, title: "About" },
    { path: "/contact", views: 167, title: "Contact" },
  ],
  recentActivity: [
    { page: "/demo", visitors: 23, timestamp: "2 min ago" },
    { page: "/contact", visitors: 15, timestamp: "5 min ago" },
    { page: "/solutions", visitors: 31, timestamp: "8 min ago" },
    { page: "/pricing", visitors: 18, timestamp: "12 min ago" },
  ],
}

// Mock detailed logs data with location information
const detailedLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:32:15",
    event: "Page View",
    page: "/demo",
    visitorId: "vis_abc123",
    sessionId: "ses_def456",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ip: "192.168.1.100",
    referrer: "https://google.com",
    utmSource: "google",
    utmCampaign: "search_ads",
    location: {
      country: "United States",
      countryCode: "US",
      region: "California",
      city: "San Francisco",
      timezone: "America/Los_Angeles",
      latitude: 37.7749,
      longitude: -122.4194,
    },
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:31:45",
    event: "Form Submission",
    page: "/contact",
    visitorId: "vis_xyz789",
    sessionId: "ses_ghi012",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    ip: "10.0.0.50",
    referrer: "direct",
    details: "Contact form submitted - john@example.com",
    location: {
      country: "Canada",
      countryCode: "CA",
      region: "Ontario",
      city: "Toronto",
      timezone: "America/Toronto",
      latitude: 43.6532,
      longitude: -79.3832,
    },
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:30:22",
    event: "Page View",
    page: "/solutions",
    visitorId: "vis_mno345",
    sessionId: "ses_pqr678",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    ip: "172.16.0.25",
    referrer: "https://linkedin.com",
    affiliate: "PARTNER001",
    location: {
      country: "United Kingdom",
      countryCode: "GB",
      region: "England",
      city: "London",
      timezone: "Europe/London",
      latitude: 51.5074,
      longitude: -0.1278,
    },
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:29:10",
    event: "Demo Request",
    page: "/demo",
    visitorId: "vis_stu901",
    sessionId: "ses_vwx234",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ip: "203.0.113.15",
    referrer: "https://facebook.com",
    details: "Demo requested - sarah@company.com",
    location: {
      country: "Australia",
      countryCode: "AU",
      region: "New South Wales",
      city: "Sydney",
      timezone: "Australia/Sydney",
      latitude: -33.8688,
      longitude: 151.2093,
    },
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:28:33",
    event: "Page View",
    page: "/pricing",
    visitorId: "vis_abc123",
    sessionId: "ses_def456",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ip: "192.168.1.100",
    referrer: "internal",
    utmSource: "email",
    utmCampaign: "newsletter",
    location: {
      country: "Germany",
      countryCode: "DE",
      region: "Bavaria",
      city: "Munich",
      timezone: "Europe/Berlin",
      latitude: 48.1351,
      longitude: 11.582,
    },
  },
  {
    id: 6,
    timestamp: "2024-01-15 14:27:18",
    event: "Page View",
    page: "/about",
    visitorId: "vis_def567",
    sessionId: "ses_abc890",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    ip: "198.51.100.42",
    referrer: "https://twitter.com",
    location: {
      country: "Japan",
      countryCode: "JP",
      region: "Tokyo",
      city: "Tokyo",
      timezone: "Asia/Tokyo",
      latitude: 35.6762,
      longitude: 139.6503,
    },
  },
  {
    id: 7,
    timestamp: "2024-01-15 14:26:05",
    event: "Form Submission",
    page: "/demo",
    visitorId: "vis_ghi123",
    sessionId: "ses_jkl456",
    userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    ip: "203.0.113.89",
    referrer: "https://bing.com",
    details: "Demo form submitted - mike@techcorp.com",
    location: {
      country: "France",
      countryCode: "FR",
      region: "Île-de-France",
      city: "Paris",
      timezone: "Europe/Paris",
      latitude: 48.8566,
      longitude: 2.3522,
    },
  },
  {
    id: 8,
    timestamp: "2024-01-15 14:25:42",
    event: "Page View",
    page: "/product",
    visitorId: "vis_mno789",
    sessionId: "ses_pqr012",
    userAgent: "Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/111.0 Firefox/115.0",
    ip: "192.0.2.156",
    referrer: "direct",
    utmSource: "newsletter",
    location: {
      country: "Brazil",
      countryCode: "BR",
      region: "São Paulo",
      city: "São Paulo",
      timezone: "America/Sao_Paulo",
      latitude: -23.5505,
      longitude: -46.6333,
    },
  },
]

export default function AdminTrackingPage() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const generateReport = async () => {
    setIsGeneratingReport(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create report data
    const reportData = {
      generatedAt: new Date().toISOString(),
      period: "Last 7 days",
      summary: {
        totalVisitors: analyticsData.totalVisitors,
        pageViews: analyticsData.pageViews,
        avgSessionDuration: analyticsData.avgSessionDuration,
        bounceRate: analyticsData.bounceRate,
      },
      topPages: analyticsData.topPages,
      trafficSources: {
        direct: "45%",
        search: "32%",
        social: "15%",
        referral: "8%",
      },
      deviceTypes: {
        desktop: "65%",
        mobile: "30%",
        tablet: "5%",
      },
      conversionMetrics: {
        demoRequests: 12,
        contactForms: 8,
        conversionRate: "1.6%",
      },
      topCountries: {
        "United States": "35%",
        Canada: "18%",
        "United Kingdom": "12%",
        Germany: "8%",
        Australia: "7%",
        Other: "20%",
      },
    }

    // Convert to JSON and download
    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `kuhlekt-analytics-report-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
    setIsGeneratingReport(false)
  }

  const exportAnalytics = () => {
    const exportData = {
      summary: analyticsData,
      detailedLogs: detailedLogs,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `kuhlekt-analytics-export-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Monitor your website performance and visitor behavior</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +12.5% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                +8.2% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.avgSessionDuration}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                -2.1% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.bounceRate}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                -5.3% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{page.title}</p>
                        <p className="text-sm text-gray-500">{page.path}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{page.views.toLocaleString()} views</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Activity</CardTitle>
              <CardDescription>Current visitor activity on your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.page}</p>
                        <p className="text-sm text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{activity.visitors} active</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={exportAnalytics}>
              <Download className="w-4 h-4 mr-2" />
              Export Analytics
            </Button>
            <Button variant="outline" onClick={generateReport} disabled={isGeneratingReport}>
              <FileText className="w-4 h-4 mr-2" />
              {isGeneratingReport ? "Generating..." : "Generate Report"}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  View Detailed Logs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Detailed Activity Logs</DialogTitle>
                  <DialogDescription>
                    Comprehensive view of all visitor activities and events with location data
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] w-full">
                  <div className="space-y-4">
                    {detailedLogs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                log.event === "Page View"
                                  ? "default"
                                  : log.event === "Form Submission"
                                    ? "secondary"
                                    : log.event === "Demo Request"
                                      ? "destructive"
                                      : "outline"
                              }
                            >
                              {log.event}
                            </Badge>
                            <span className="text-sm text-gray-600">{log.timestamp}</span>
                          </div>
                          <span className="text-sm font-mono text-gray-500">{log.page}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Visitor ID:</span>
                            <span className="ml-2 font-mono">{log.visitorId}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Session ID:</span>
                            <span className="ml-2 font-mono">{log.sessionId}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">IP Address:</span>
                            <span className="ml-2 font-mono">{log.ip}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Referrer:</span>
                            <span className="ml-2">{log.referrer}</span>
                          </div>
                        </div>

                        {/* Location Information */}
                        {log.location && (
                          <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Location Information</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="text-gray-600">Country:</span>
                                <span className="ml-2 font-medium">
                                  {log.location.country} ({log.location.countryCode})
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Region:</span>
                                <span className="ml-2 font-medium">{log.location.region}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">City:</span>
                                <span className="ml-2 font-medium">{log.location.city}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Timezone:</span>
                                <span className="ml-2 font-medium">{log.location.timezone}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-600">Coordinates:</span>
                                <span className="ml-2 font-mono text-xs">
                                  {log.location.latitude.toFixed(4)}, {log.location.longitude.toFixed(4)}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {(log.utmSource || log.utmCampaign || log.affiliate) && (
                          <div className="mb-2 flex gap-2">
                            {log.utmSource && <Badge variant="outline">UTM: {log.utmSource}</Badge>}
                            {log.utmCampaign && <Badge variant="outline">Campaign: {log.utmCampaign}</Badge>}
                            {log.affiliate && <Badge variant="secondary">Affiliate: {log.affiliate}</Badge>}
                          </div>
                        )}

                        {log.details && (
                          <div className="mb-2 p-2 bg-white rounded border">
                            <span className="text-sm text-gray-700">{log.details}</span>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 truncate">
                          <span className="font-medium">User Agent:</span> {log.userAgent}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href="/admin/visitors">View All Visitors</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/change-password">Change Password</a>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Highlights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">New Visitors:</span>
                  <span className="font-medium">234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Returning Visitors:</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Demo Requests:</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contact Forms:</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Direct:</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Search:</span>
                  <span className="font-medium">32%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Social:</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Referral:</span>
                  <span className="font-medium">8%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg. Load Time:</span>
                  <span className="font-medium">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Server Uptime:</span>
                  <span className="font-medium">99.9%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Error Rate:</span>
                  <span className="font-medium">0.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cache Hit Rate:</span>
                  <span className="font-medium">94%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
