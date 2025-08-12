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
  Clock,
  TrendingUp,
  Globe,
  Smartphone,
  Download,
  FileText,
  Activity,
  MapPin,
  ExternalLink,
} from "lucide-react"

// Mock analytics data
const analyticsData = {
  summary: {
    totalVisitors: 1247,
    pageViews: 3891,
    avgSessionDuration: "4m 32s",
    bounceRate: "42.3%",
    conversionRate: "3.2%",
    newVisitors: 892,
    returningVisitors: 355,
  },
  topPages: [
    { page: "/", views: 1234, percentage: 31.7 },
    { page: "/solutions", views: 567, percentage: 14.6 },
    { page: "/pricing", views: 432, percentage: 11.1 },
    { page: "/demo", views: 321, percentage: 8.2 },
    { page: "/contact", views: 298, percentage: 7.7 },
  ],
  trafficSources: [
    { source: "Direct", visitors: 456, percentage: 36.6 },
    { source: "Google", visitors: 389, percentage: 31.2 },
    { source: "LinkedIn", visitors: 234, percentage: 18.8 },
    { source: "Facebook", visitors: 98, percentage: 7.9 },
    { source: "Other", visitors: 70, percentage: 5.6 },
  ],
  deviceTypes: [
    { device: "Desktop", users: 723, percentage: 58.0 },
    { device: "Mobile", users: 398, percentage: 31.9 },
    { device: "Tablet", users: 126, percentage: 10.1 },
  ],
  topCountries: [
    { country: "United States", visitors: 456, percentage: 36.6 },
    { country: "Canada", visitors: 234, percentage: 18.8 },
    { country: "United Kingdom", visitors: 187, percentage: 15.0 },
    { country: "Germany", visitors: 123, percentage: 9.9 },
    { country: "Australia", visitors: 89, percentage: 7.1 },
  ],
}

// Mock detailed logs data
const detailedLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 14:45:22",
    event: "Page View",
    visitorId: "vis_abc123",
    sessionId: "ses_def456",
    page: "/demo",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    referrer: "https://google.com",
    utmSource: "google",
    utmCampaign: "search_ads",
    location: {
      country: "United States",
      countryCode: "US",
      region: "California",
      city: "San Francisco",
      timezone: "America/Los_Angeles",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    affiliate: null,
  },
  {
    id: 2,
    timestamp: "2024-01-15 14:44:18",
    event: "Form Submission",
    visitorId: "vis_xyz789",
    sessionId: "ses_ghi012",
    page: "/contact",
    ip: "10.0.0.50",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    referrer: "direct",
    location: {
      country: "Canada",
      countryCode: "CA",
      region: "Ontario",
      city: "Toronto",
      timezone: "America/Toronto",
      coordinates: { lat: 43.6532, lng: -79.3832 },
    },
    formType: "Contact Form",
    affiliate: null,
  },
  {
    id: 3,
    timestamp: "2024-01-15 14:43:55",
    event: "Demo Request",
    visitorId: "vis_mno345",
    sessionId: "ses_pqr678",
    page: "/demo",
    ip: "172.16.0.25",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    referrer: "https://linkedin.com",
    location: {
      country: "United Kingdom",
      countryCode: "GB",
      region: "England",
      city: "London",
      timezone: "Europe/London",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    affiliate: "PARTNER001",
  },
  {
    id: 4,
    timestamp: "2024-01-15 14:42:33",
    event: "Page View",
    visitorId: "vis_stu901",
    sessionId: "ses_vwx234",
    page: "/pricing",
    ip: "203.0.113.15",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    referrer: "https://facebook.com",
    location: {
      country: "Australia",
      countryCode: "AU",
      region: "New South Wales",
      city: "Sydney",
      timezone: "Australia/Sydney",
      coordinates: { lat: -33.8688, lng: 151.2093 },
    },
    affiliate: null,
  },
  {
    id: 5,
    timestamp: "2024-01-15 14:41:12",
    event: "Page View",
    visitorId: "vis_def567",
    sessionId: "ses_abc890",
    page: "/solutions",
    ip: "198.51.100.42",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    referrer: "https://twitter.com",
    location: {
      country: "Germany",
      countryCode: "DE",
      region: "Bavaria",
      city: "Munich",
      timezone: "Europe/Berlin",
      coordinates: { lat: 48.1351, lng: 11.582 },
    },
    affiliate: null,
  },
  {
    id: 6,
    timestamp: "2024-01-15 14:40:45",
    event: "Form Submission",
    visitorId: "vis_jkl678",
    sessionId: "ses_mno901",
    page: "/contact",
    ip: "203.0.113.75",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    referrer: "https://bing.com",
    utmSource: "bing",
    utmCampaign: "brand_search",
    location: {
      country: "France",
      countryCode: "FR",
      region: "Île-de-France",
      city: "Paris",
      timezone: "Europe/Paris",
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    formType: "Contact Form",
    affiliate: null,
  },
  {
    id: 7,
    timestamp: "2024-01-15 14:39:28",
    event: "Page View",
    visitorId: "vis_pqr234",
    sessionId: "ses_stu567",
    page: "/",
    ip: "198.51.100.123",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    referrer: "direct",
    location: {
      country: "Japan",
      countryCode: "JP",
      region: "Tokyo",
      city: "Tokyo",
      timezone: "Asia/Tokyo",
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    affiliate: null,
  },
  {
    id: 8,
    timestamp: "2024-01-15 14:38:15",
    event: "Demo Request",
    visitorId: "vis_vwx890",
    sessionId: "ses_yza123",
    page: "/demo",
    ip: "203.0.113.200",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    referrer: "https://google.com",
    utmSource: "google",
    utmCampaign: "ar_software",
    location: {
      country: "Brazil",
      countryCode: "BR",
      region: "São Paulo",
      city: "São Paulo",
      timezone: "America/Sao_Paulo",
      coordinates: { lat: -23.5505, lng: -46.6333 },
    },
    affiliate: "PARTNER002",
  },
]

export default function AdminTrackingPage() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false)

  const generateReport = async () => {
    setIsGeneratingReport(true)

    // Simulate report generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: analyticsData.summary,
      topPages: analyticsData.topPages,
      trafficSources: analyticsData.trafficSources,
      deviceTypes: analyticsData.deviceTypes,
      topCountries: analyticsData.topCountries,
      conversionMetrics: {
        totalConversions: 40,
        demoRequests: 25,
        contactForms: 15,
        conversionsBySource: [
          { source: "Google", conversions: 15 },
          { source: "Direct", conversions: 12 },
          { source: "LinkedIn", conversions: 8 },
          { source: "Facebook", conversions: 3 },
          { source: "Other", conversions: 2 },
        ],
      },
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `analytics-report-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
    setIsGeneratingReport(false)
  }

  const exportAnalytics = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      summary: analyticsData.summary,
      detailedLogs: detailedLogs,
      analytics: analyticsData,
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `complete-analytics-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive website analytics and visitor insights</p>
          </div>
          <Button asChild>
            <a href="/admin/visitors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Visitor Tracking
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.summary.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {analyticsData.summary.newVisitors} new, {analyticsData.summary.returningVisitors} returning
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.summary.pageViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Avg. {(analyticsData.summary.pageViews / analyticsData.summary.totalVisitors).toFixed(1)} per visitor
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.summary.avgSessionDuration}</div>
              <p className="text-xs text-muted-foreground">Bounce rate: {analyticsData.summary.bounceRate}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.summary.conversionRate}</div>
              <p className="text-xs text-muted-foreground">40 total conversions</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{page.page}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{page.views} views</span>
                      <Badge variant="outline">{page.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{source.visitors} visitors</span>
                      <Badge variant="outline">{source.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Types */}
          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
              <CardDescription>Devices used by your visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.deviceTypes.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{device.users} users</span>
                      <Badge variant="outline">{device.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Geographic distribution of visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{country.visitors} visitors</span>
                      <Badge variant="outline">{country.percentage}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-4">
            <Button onClick={generateReport} disabled={isGeneratingReport} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {isGeneratingReport ? "Generating..." : "Generate Report"}
            </Button>

            <Dialog open={isLogsModalOpen} onOpenChange={setIsLogsModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Activity className="w-4 h-4" />
                  View Detailed Logs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Detailed Activity Logs</DialogTitle>
                  <DialogDescription>Comprehensive log of all visitor activities and events</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] w-full">
                  <div className="space-y-4">
                    {detailedLogs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={
                                log.event === "Page View"
                                  ? "outline"
                                  : log.event === "Form Submission"
                                    ? "secondary"
                                    : log.event === "Demo Request"
                                      ? "default"
                                      : "outline"
                              }
                            >
                              {log.event}
                            </Badge>
                            <span className="text-sm text-gray-600">{log.timestamp}</span>
                          </div>
                          <div className="text-sm text-gray-500">{log.page}</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="mb-2">
                              <span className="font-medium">Visitor:</span> {log.visitorId}
                            </div>
                            <div className="mb-2">
                              <span className="font-medium">Session:</span> {log.sessionId}
                            </div>
                            <div className="mb-2">
                              <span className="font-medium">IP:</span> {log.ip}
                            </div>
                            <div className="mb-2">
                              <span className="font-medium">Referrer:</span> {log.referrer}
                            </div>
                            {log.utmSource && (
                              <div className="mb-2">
                                <span className="font-medium">UTM Source:</span> {log.utmSource}
                              </div>
                            )}
                            {log.utmCampaign && (
                              <div className="mb-2">
                                <span className="font-medium">UTM Campaign:</span> {log.utmCampaign}
                              </div>
                            )}
                            {log.affiliate && (
                              <div className="mb-2">
                                <span className="font-medium">Affiliate:</span>
                                <Badge variant="secondary" className="ml-2">
                                  {log.affiliate}
                                </Badge>
                              </div>
                            )}
                            {log.formType && (
                              <div className="mb-2">
                                <span className="font-medium">Form Type:</span> {log.formType}
                              </div>
                            )}
                          </div>

                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-blue-800">Location</span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div>
                                <span className="font-medium">Country:</span> {log.location.country} (
                                {log.location.countryCode})
                              </div>
                              <div>
                                <span className="font-medium">Region:</span> {log.location.region}
                              </div>
                              <div>
                                <span className="font-medium">City:</span> {log.location.city}
                              </div>
                              <div>
                                <span className="font-medium">Timezone:</span> {log.location.timezone}
                              </div>
                              <div>
                                <span className="font-medium">Coordinates:</span>{" "}
                                {log.location.coordinates.lat.toFixed(4)}, {log.location.coordinates.lng.toFixed(4)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-gray-500 truncate">
                          <span className="font-medium">User Agent:</span> {log.userAgent}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <Button onClick={exportAnalytics} variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              Export Analytics
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <a href="/admin/visitors">View All Visitors</a>
            </Button>
            <Button asChild variant="outline">
              <a href="/admin/change-password">Change Password</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
