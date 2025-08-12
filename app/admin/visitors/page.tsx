import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Eye, Clock, MapPin, ExternalLink, BarChart3 } from "lucide-react"

// Mock visitor data - in a real app, this would come from your database
const visitorsData = [
  {
    id: 1,
    visitorId: "vis_abc123",
    sessionId: "ses_def456",
    firstVisit: "2024-01-15 14:32:15",
    lastActivity: "2024-01-15 14:45:22",
    pageViews: 5,
    sessionDuration: "13m 7s",
    pages: ["/", "/solutions", "/pricing", "/demo", "/contact"],
    referrer: "https://google.com",
    utmSource: "google",
    utmCampaign: "search_ads",
    location: {
      country: "United States",
      countryCode: "US",
      region: "California",
      city: "San Francisco",
    },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ip: "192.168.1.100",
    status: "active",
  },
  {
    id: 2,
    visitorId: "vis_xyz789",
    sessionId: "ses_ghi012",
    firstVisit: "2024-01-15 14:31:45",
    lastActivity: "2024-01-15 14:38:12",
    pageViews: 3,
    sessionDuration: "6m 27s",
    pages: ["/", "/contact", "/about"],
    referrer: "direct",
    location: {
      country: "Canada",
      countryCode: "CA",
      region: "Ontario",
      city: "Toronto",
    },
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    ip: "10.0.0.50",
    status: "converted",
    conversion: "Contact Form Submitted",
  },
  {
    id: 3,
    visitorId: "vis_mno345",
    sessionId: "ses_pqr678",
    firstVisit: "2024-01-15 14:30:22",
    lastActivity: "2024-01-15 14:42:55",
    pageViews: 7,
    sessionDuration: "12m 33s",
    pages: ["/", "/solutions", "/product", "/pricing", "/demo", "/about", "/contact"],
    referrer: "https://linkedin.com",
    affiliate: "PARTNER001",
    location: {
      country: "United Kingdom",
      countryCode: "GB",
      region: "England",
      city: "London",
    },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    ip: "172.16.0.25",
    status: "converted",
    conversion: "Demo Requested",
  },
  {
    id: 4,
    visitorId: "vis_stu901",
    sessionId: "ses_vwx234",
    firstVisit: "2024-01-15 14:29:10",
    lastActivity: "2024-01-15 14:35:45",
    pageViews: 4,
    sessionDuration: "6m 35s",
    pages: ["/", "/solutions", "/demo", "/pricing"],
    referrer: "https://facebook.com",
    location: {
      country: "Australia",
      countryCode: "AU",
      region: "New South Wales",
      city: "Sydney",
    },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ip: "203.0.113.15",
    status: "bounced",
  },
  {
    id: 5,
    visitorId: "vis_def567",
    sessionId: "ses_abc890",
    firstVisit: "2024-01-15 14:27:18",
    lastActivity: "2024-01-15 14:41:02",
    pageViews: 6,
    sessionDuration: "13m 44s",
    pages: ["/", "/about", "/solutions", "/product", "/pricing", "/contact"],
    referrer: "https://twitter.com",
    location: {
      country: "Germany",
      countryCode: "DE",
      region: "Bavaria",
      city: "Munich",
    },
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
    ip: "198.51.100.42",
    status: "active",
  },
]

const summaryStats = {
  totalVisitors: visitorsData.length,
  activeVisitors: visitorsData.filter((v) => v.status === "active").length,
  convertedVisitors: visitorsData.filter((v) => v.status === "converted").length,
  avgSessionDuration: "10m 29s",
  totalPageViews: visitorsData.reduce((sum, visitor) => sum + visitor.pageViews, 0),
}

export default function AdminVisitorsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Tracking</h1>
            <p className="text-gray-600">Detailed view of individual visitor sessions and behavior</p>
          </div>
          <Button asChild>
            <a href="/admin/tracking" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics Dashboard
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.activeVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Converted</CardTitle>
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.convertedVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.avgSessionDuration}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalPageViews}</div>
            </CardContent>
          </Card>
        </div>

        {/* Visitors List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Visitors</CardTitle>
            <CardDescription>Individual visitor sessions and their activity details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {visitorsData.map((visitor) => (
                <div key={visitor.id} className="border rounded-lg p-4 bg-white">
                  {/* Visitor Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Visitor {visitor.visitorId}</p>
                        <p className="text-sm text-gray-500">Session: {visitor.sessionId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          visitor.status === "active"
                            ? "default"
                            : visitor.status === "converted"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {visitor.status === "active" && "🟢 Active"}
                        {visitor.status === "converted" && "✅ Converted"}
                        {visitor.status === "bounced" && "⚪ Bounced"}
                      </Badge>
                      {visitor.conversion && <Badge variant="destructive">{visitor.conversion}</Badge>}
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">First Visit:</span>
                      <p className="font-medium">{visitor.firstVisit}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Activity:</span>
                      <p className="font-medium">{visitor.lastActivity}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Session Duration:</span>
                      <p className="font-medium">{visitor.sessionDuration}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Page Views:</span>
                      <p className="font-medium">{visitor.pageViews} pages</p>
                    </div>
                  </div>

                  {/* Location & Technical Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {visitor.location.city}, {visitor.location.region}, {visitor.location.country}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {visitor.location.countryCode}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">IP:</span> {visitor.ip}
                    </div>
                  </div>

                  {/* Traffic Source */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">Traffic Source:</span>
                      <span className="font-medium">{visitor.referrer}</span>
                    </div>
                    <div className="flex gap-2">
                      {visitor.utmSource && <Badge variant="outline">UTM: {visitor.utmSource}</Badge>}
                      {visitor.utmCampaign && <Badge variant="outline">Campaign: {visitor.utmCampaign}</Badge>}
                      {visitor.affiliate && <Badge variant="secondary">Affiliate: {visitor.affiliate}</Badge>}
                    </div>
                  </div>

                  {/* Pages Visited */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 mb-2 block">Pages Visited:</span>
                    <div className="flex flex-wrap gap-1">
                      {visitor.pages.map((page, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {page}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* User Agent */}
                  <div className="text-xs text-gray-500 truncate">
                    <span className="font-medium">User Agent:</span> {visitor.userAgent}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">Export Visitor Data</Button>
            <Button variant="outline">Filter Visitors</Button>
            <Button variant="outline">Real-time View</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <a href="/admin/change-password">Change Password</a>
            </Button>
            <Button asChild>
              <a href="/admin/tracking">Back to Analytics</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
