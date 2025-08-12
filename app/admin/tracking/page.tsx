"use client"

import { useState } from "react"
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
  Smartphone,
  Monitor,
  Tablet,
  ExternalLink,
  MapPin,
  Clock,
} from "lucide-react"
import Link from "next/link"

// Mock analytics data
const mockAnalyticsData = {
  summary: {
    totalVisitors: 1247,
    pageViews: 3891,
    bounceRate: 34.2,
    avgSessionDuration: "3m 42s",
    conversionRate: 12.8,
    newVisitors: 892,
    returningVisitors: 355,
  },
  topPages: [
    { page: "/", views: 1234, uniqueVisitors: 892, bounceRate: 28.5 },
    { page: "/product", views: 567, uniqueVisitors: 445, bounceRate: 31.2 },
    { page: "/demo", views: 445, uniqueVisitors: 334, bounceRate: 22.1 },
    { page: "/pricing-table", views: 334, uniqueVisitors: 267, bounceRate: 35.8 },
    { page: "/contact", views: 223, uniqueVisitors: 189, bounceRate: 18.9 },
  ],
  trafficSources: [
    { source: "Organic Search", visitors: 567, percentage: 45.5 },
    { source: "Direct", visitors: 334, percentage: 26.8 },
    { source: "Social Media", visitors: 223, percentage: 17.9 },
    { source: "Referral", visitors: 89, percentage: 7.1 },
    { source: "Email", visitors: 34, percentage: 2.7 },
  ],
  deviceTypes: [
    { type: "Desktop", count: 723, percentage: 58.0 },
    { type: "Mobile", count: 445, percentage: 35.7 },
    { type: "Tablet", count: 79, percentage: 6.3 },
  ],
  topCountries: [
    { country: "United States", visitors: 445, percentage: 35.7 },
    { country: "Canada", visitors: 223, percentage: 17.9 },
    { country: "United Kingdom", visitors: 156, percentage: 12.5 },
    { country: "Germany", visitors: 134, percentage: 10.7 },
    { country: "Australia", visitors: 89, percentage: 7.1 },
  ],
}

// Mock detailed logs data with location information
const mockDetailedLogs = [
  {
    id: "LOG001",
    timestamp: "2024-01-15T14:32:15Z",
    event: "page_view",
    visitorId: "V001",
    sessionId: "S001",
    page: "/product",
    referrer: "https://google.com/search?q=accounts+receivable+software",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ipAddress: "192.168.1.100",
    location: {
      country: "United States",
      countryCode: "US",
      region: "California",
      city: "San Francisco",
      timezone: "America/Los_Angeles",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    utmSource: "google",
    utmMedium: "organic",
    utmCampaign: "",
    affiliateCode: "",
    deviceType: "Desktop",
    browser: "Chrome",
    os: "Windows 10",
  },
  {
    id: "LOG002",
    timestamp: "2024-01-15T14:35:22Z",
    event: "form_submission",
    visitorId: "V001",
    sessionId: "S001",
    page: "/demo",
    referrer: "/product",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ipAddress: "192.168.1.100",
    location: {
      country: "United States",
      countryCode: "US",
      region: "California",
      city: "San Francisco",
      timezone: "America/Los_Angeles",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    utmSource: "google",
    utmMedium: "organic",
    utmCampaign: "",
    affiliateCode: "",
    deviceType: "Desktop",
    browser: "Chrome",
    os: "Windows 10",
    formData: { firstName: "John", lastName: "Doe", email: "john.doe@company.com", company: "Acme Inc" },
  },
  {
    id: "LOG003",
    timestamp: "2024-01-15T13:28:45Z",
    event: "page_view",
    visitorId: "V002",
    sessionId: "S002",
    page: "/",
    referrer: "https://linkedin.com",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    ipAddress: "10.0.0.50",
    location: {
      country: "Canada",
      countryCode: "CA",
      region: "Ontario",
      city: "Toronto",
      timezone: "America/Toronto",
      coordinates: { lat: 43.6532, lng: -79.3832 },
    },
    utmSource: "linkedin",
    utmMedium: "social",
    utmCampaign: "ar_automation",
    affiliateCode: "PARTNER123",
    deviceType: "Desktop",
    browser: "Safari",
    os: "macOS",
  },
  {
    id: "LOG004",
    timestamp: "2024-01-15T13:31:12Z",
    event: "contact_form",
    visitorId: "V002",
    sessionId: "S002",
    page: "/contact",
    referrer: "/solutions",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    ipAddress: "10.0.0.50",
    location: {
      country: "Canada",
      countryCode: "CA",
      region: "Ontario",
      city: "Toronto",
      timezone: "America/Toronto",
      coordinates: { lat: 43.6532, lng: -79.3832 },
    },
    utmSource: "linkedin",
    utmMedium: "social",
    utmCampaign: "ar_automation",
    affiliateCode: "PARTNER123",
    deviceType: "Desktop",
    browser: "Safari",
    os: "macOS",
    formData: { firstName: "Sarah", lastName: "Johnson", email: "sarah.j@techcorp.ca", company: "TechCorp" },
  },
  {
    id: "LOG005",
    timestamp: "2024-01-15T12:45:33Z",
    event: "demo_request",
    visitorId: "V003",
    sessionId: "S003",
    page: "/demo",
    referrer: "https://google.com/search?q=automated+accounts+receivable",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0",
    ipAddress: "203.0.113.200",
    location: {
      country: "France",
      countryCode: "FR",
      region: "Île-de-France",
      city: "Paris",
      timezone: "Europe/Paris",
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "ar_automation_paid",
    affiliateCode: "AGENCY789",
    deviceType: "Desktop",
    browser: "Edge",
    os: "Windows 10",
    formData: {
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie.dubois@entreprise.fr",
      company: "Entreprise SA",
      role: "Finance Manager",
    },
  },
  {
    id: "LOG006",
    timestamp: "2024-01-15T11:22:18Z",
    event: "page_view",
    visitorId: "V004",
    sessionId: "S004",
    page: "/pricing-table",
    referrer: "https://facebook.com",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    ipAddress: "172.16.0.25",
    location: {
      country: "United Kingdom",
      countryCode: "GB",
      region: "England",
      city: "London",
      timezone: "Europe/London",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    utmSource: "facebook",
    utmMedium: "social",
    utmCampaign: "brand_awareness",
    affiliateCode: "",
    deviceType: "Mobile",
    browser: "Safari",
    os: "iOS",
  },
  {
    id: "LOG007",
    timestamp: "2024-01-15T10:15:44Z",
    event: "newsletter_signup",
    visitorId: "V005",
    sessionId: "S005",
    page: "/about",
    referrer: "https://duckduckgo.com/?q=receivables+management+platform",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
    ipAddress: "198.51.100.150",
    location: {
      country: "Brazil",
      countryCode: "BR",
      region: "São Paulo",
      city: "São Paulo",
      timezone: "America/Sao_Paulo",
      coordinates: { lat: -23.5505, lng: -46.6333 },
    },
    utmSource: "duckduckgo",
    utmMedium: "organic",
    utmCampaign: "",
    affiliateCode: "",
    deviceType: "Desktop",
    browser: "Safari",
    os: "macOS",
    formData: { email: "carlos.silva@empresa.com.br" },
  },
  {
    id: "LOG008",
    timestamp: "2024-01-15T09:33:27Z",
    event: "page_view",
    visitorId: "V006",
    sessionId: "S006",
    page: "/solutions",
    referrer: "https://bing.com/search?q=credit+management+software",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
    ipAddress: "203.0.113.45",
    location: {
      country: "Germany",
      countryCode: "DE",
      region: "Bavaria",
      city: "Munich",
      timezone: "Europe/Berlin",
      coordinates: { lat: 48.1351, lng: 11.582 },
    },
    utmSource: "bing",
    utmMedium: "organic",
    utmCampaign: "",
    affiliateCode: "CONSULTANT456",
    deviceType: "Desktop",
    browser: "Firefox",
    os: "Windows 10",
  },
  {
    id: "LOG009",
    timestamp: "2024-01-15T08:47:55Z",
    event: "pricing_inquiry",
    visitorId: "V007",
    sessionId: "S007",
    page: "/pricing-table",
    referrer: "/product",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ipAddress: "198.51.100.78",
    location: {
      country: "Australia",
      countryCode: "AU",
      region: "New South Wales",
      city: "Sydney",
      timezone: "Australia/Sydney",
      coordinates: { lat: -33.8688, lng: 151.2093 },
    },
    utmSource: "twitter",
    utmMedium: "social",
    utmCampaign: "fintech_discussion",
    affiliateCode: "",
    deviceType: "Desktop",
    browser: "Chrome",
    os: "Linux",
    formData: { company: "Sydney Finance Solutions", contactEmail: "info@sydneyfinance.com.au" },
  },
  {
    id: "LOG010",
    timestamp: "2024-01-15T07:52:11Z",
    event: "page_view",
    visitorId: "V008",
    sessionId: "S008",
    page: "/help",
    referrer: "https://reddit.com/r/accounting",
    userAgent: "Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/119.0 Firefox/119.0",
    ipAddress: "192.0.2.123",
    location: {
      country: "Japan",
      countryCode: "JP",
      region: "Tokyo",
      city: "Tokyo",
      timezone: "Asia/Tokyo",
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    utmSource: "reddit",
    utmMedium: "social",
    utmCampaign: "",
    affiliateCode: "",
    deviceType: "Mobile",
    browser: "Firefox",
    os: "Android",
  },
]

export default function AnalyticsDashboard() {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false)

  // Generate comprehensive report
  const generateReport = async () => {
    setIsGeneratingReport(true)

    // Simulate report generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const reportData = {
      generatedAt: new Date().toISOString(),
      summary: mockAnalyticsData.summary,
      topPages: mockAnalyticsData.topPages,
      trafficSources: mockAnalyticsData.trafficSources,
      deviceBreakdown: mockAnalyticsData.deviceTypes,
      topCountries: mockAnalyticsData.topCountries,
      conversionMetrics: {
        totalConversions: 159,
        conversionsByType: {
          demo_requests: 89,
          contact_forms: 45,
          newsletter_signups: 25,
        },
        conversionRate: mockAnalyticsData.summary.conversionRate,
        topConvertingPages: [
          { page: "/demo", conversions: 89, rate: 20.0 },
          { page: "/contact", conversions: 45, rate: 20.2 },
          { page: "/pricing-table", conversions: 25, rate: 7.5 },
        ],
      },
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
      summary: mockAnalyticsData,
      detailedLogs: mockDetailedLogs,
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

  const getEventBadgeColor = (event: string) => {
    switch (event) {
      case "page_view":
        return "bg-blue-100 text-blue-800"
      case "form_submission":
        return "bg-green-100 text-green-800"
      case "demo_request":
        return "bg-purple-100 text-purple-800"
      case "contact_form":
        return "bg-orange-100 text-orange-800"
      case "newsletter_signup":
        return "bg-cyan-100 text-cyan-800"
      case "pricing_inquiry":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "Desktop":
        return <Monitor className="h-4 w-4" />
      case "Mobile":
        return <Smartphone className="h-4 w-4" />
      case "Tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
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
              <div className="text-2xl font-bold">{mockAnalyticsData.summary.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalyticsData.summary.pageViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalyticsData.summary.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAnalyticsData.summary.bounceRate}%</div>
              <p className="text-xs text-muted-foreground">-3.4% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button onClick={generateReport} disabled={isGeneratingReport}>
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
              <Button variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                View Detailed Logs
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Detailed Activity Logs</DialogTitle>
                <DialogDescription>
                  Comprehensive visitor activity and event tracking with location data
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[60vh] w-full">
                <div className="space-y-4">
                  {mockDetailedLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getEventBadgeColor(log.event)}>{log.event.replace("_", " ")}</Badge>
                          <span className="font-mono text-sm text-gray-600">{log.id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <strong>Visitor:</strong> {log.visitorId} | <strong>Session:</strong> {log.sessionId}
                          </div>
                          <div className="text-sm">
                            <strong>Page:</strong> {log.page}
                          </div>
                          <div className="text-sm">
                            <strong>Referrer:</strong>{" "}
                            {log.referrer.length > 50 ? log.referrer.substring(0, 50) + "..." : log.referrer}
                          </div>
                          <div className="text-sm">
                            <strong>IP:</strong> {log.ipAddress}
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            {getDeviceIcon(log.deviceType)}
                            <span>
                              {log.deviceType} | {log.browser} | {log.os}
                            </span>
                          </div>
                          {log.utmSource && (
                            <div className="text-sm">
                              <strong>UTM:</strong> {log.utmSource} / {log.utmMedium}
                              {log.utmCampaign && ` / ${log.utmCampaign}`}
                            </div>
                          )}
                          {log.affiliateCode && (
                            <div className="text-sm">
                              <strong>Affiliate:</strong> <Badge variant="secondary">{log.affiliateCode}</Badge>
                            </div>
                          )}
                        </div>

                        <div className="bg-blue-50 p-3 rounded-md">
                          <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">Location</span>
                          </div>
                          <div className="text-sm space-y-1">
                            <div>
                              <strong>Country:</strong> {log.location.country} ({log.location.countryCode})
                            </div>
                            <div>
                              <strong>Region:</strong> {log.location.region}
                            </div>
                            <div>
                              <strong>City:</strong> {log.location.city}
                            </div>
                            <div>
                              <strong>Timezone:</strong> {log.location.timezone}
                            </div>
                            <div>
                              <strong>Coordinates:</strong> {log.location.coordinates.lat.toFixed(4)},{" "}
                              {log.location.coordinates.lng.toFixed(4)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {log.formData && (
                        <div className="bg-green-50 p-3 rounded-md">
                          <div className="font-medium text-green-800 mb-2">Form Data:</div>
                          <div className="text-sm space-y-1">
                            {Object.entries(log.formData).map(([key, value]) => (
                              <div key={key}>
                                <strong>{key}:</strong> {value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Button onClick={exportAnalytics} variant="outline">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Top Pages
              </CardTitle>
              <CardDescription>Most visited pages and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{page.page}</div>
                        <div className="text-sm text-gray-500">{page.uniqueVisitors} unique visitors</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{page.views.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{page.bounceRate}% bounce</div>
                    </div>
                  </div>
                ))}
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
                {mockAnalyticsData.trafficSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <div className="font-medium">{source.source}</div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">{source.percentage}%</div>
                      <div className="font-medium">{source.visitors.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Device Types */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Device Types
              </CardTitle>
              <CardDescription>Visitor device breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.deviceTypes.map((device) => (
                  <div key={device.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <span className="font-medium">{device.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">{device.percentage}%</div>
                      <div className="font-medium">{device.count.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Countries
              </CardTitle>
              <CardDescription>Geographic distribution of visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.topCountries.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-100 text-green-800 text-xs font-medium flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="font-medium">{country.country}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500">{country.percentage}%</div>
                      <div className="font-medium">{country.visitors.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockAnalyticsData.summary.avgSessionDuration}</div>
              <p className="text-sm text-gray-500 mt-2">Average time per session</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">New vs Returning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>New Visitors</span>
                  <span className="font-medium">{mockAnalyticsData.summary.newVisitors.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Returning</span>
                  <span className="font-medium">{mockAnalyticsData.summary.returningVisitors.toLocaleString()}</span>
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
                  <span>Bounce Rate</span>
                  <span className="font-medium">{mockAnalyticsData.summary.bounceRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate</span>
                  <span className="font-medium">{mockAnalyticsData.summary.conversionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
