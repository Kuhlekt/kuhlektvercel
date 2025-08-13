import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  Eye,
  MousePointer,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react"

// Mock data for demonstration
const mockData = {
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
  recentVisitors: [
    {
      id: 1,
      ip: "192.168.1.1",
      location: "New York, US",
      device: "Desktop",
      browser: "Chrome",
      timestamp: "2 minutes ago",
      pages: 3,
    },
    {
      id: 2,
      ip: "10.0.0.1",
      location: "London, UK",
      device: "Mobile",
      browser: "Safari",
      timestamp: "5 minutes ago",
      pages: 1,
    },
    {
      id: 3,
      ip: "172.16.0.1",
      location: "Toronto, CA",
      device: "Tablet",
      browser: "Firefox",
      timestamp: "8 minutes ago",
      pages: 2,
    },
  ],
  deviceStats: {
    desktop: 65,
    mobile: 28,
    tablet: 7,
  },
  browserStats: {
    chrome: 45,
    safari: 23,
    firefox: 18,
    edge: 14,
  },
}

export default function TrackingPageCopy() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Website Analytics</h1>
          <p className="text-gray-600">Monitor your website traffic and visitor behavior in real-time</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockData.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
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
              <div className="text-2xl font-bold">{mockData.pageViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
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
              <div className="text-2xl font-bold">{mockData.avgSessionDuration}</div>
              <p className="text-xs text-muted-foreground flex items-center">
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
              <div className="text-2xl font-bold">{mockData.bounceRate}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                -5.3% from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Pages */}
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.topPages.map((page, index) => (
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
                    <Badge variant="secondary">{page.views} views</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Visitors */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Visitors</CardTitle>
              <CardDescription>Latest visitor activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockData.recentVisitors.map((visitor) => (
                  <div key={visitor.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{visitor.location}</p>
                        <p className="text-sm text-gray-500">
                          {visitor.device} • {visitor.browser}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{visitor.pages} pages</p>
                      <p className="text-xs text-gray-500">{visitor.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device and Browser Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
              <CardDescription>Visitor breakdown by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Monitor className="h-4 w-4 text-blue-600" />
                    <span>Desktop</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${mockData.deviceStats.desktop}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{mockData.deviceStats.desktop}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-4 w-4 text-green-600" />
                    <span>Mobile</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${mockData.deviceStats.mobile}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{mockData.deviceStats.mobile}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <span>Tablet</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${mockData.deviceStats.tablet}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{mockData.deviceStats.tablet}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browser Usage</CardTitle>
              <CardDescription>Visitor breakdown by browser</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(mockData.browserStats).map(([browser, percentage]) => (
                  <div key={browser} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span className="capitalize">{browser}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <Button variant="outline">Export Data</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
          <div className="flex space-x-2">
            <Button asChild>
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
