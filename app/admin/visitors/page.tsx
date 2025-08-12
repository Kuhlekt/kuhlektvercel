"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Eye, Clock, MapPin, ExternalLink, BarChart3, Download, Filter, RefreshCw, Search } from "lucide-react"

// Mock visitor data - in a real app, this would come from your database
const allVisitorsData = [
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
  {
    id: 6,
    visitorId: "vis_jkl678",
    sessionId: "ses_mno901",
    firstVisit: "2024-01-15 14:25:33",
    lastActivity: "2024-01-15 14:39:18",
    pageViews: 8,
    sessionDuration: "13m 45s",
    pages: ["/", "/solutions", "/product", "/pricing", "/demo", "/contact", "/about", "/help"],
    referrer: "https://bing.com",
    utmSource: "bing",
    utmCampaign: "brand_search",
    location: {
      country: "France",
      countryCode: "FR",
      region: "Île-de-France",
      city: "Paris",
    },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ip: "203.0.113.75",
    status: "converted",
    conversion: "Demo Requested",
  },
  {
    id: 7,
    visitorId: "vis_pqr234",
    sessionId: "ses_stu567",
    firstVisit: "2024-01-15 14:24:12",
    lastActivity: "2024-01-15 14:26:45",
    pageViews: 2,
    sessionDuration: "2m 33s",
    pages: ["/", "/pricing"],
    referrer: "direct",
    location: {
      country: "Japan",
      countryCode: "JP",
      region: "Tokyo",
      city: "Tokyo",
    },
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    ip: "198.51.100.123",
    status: "bounced",
  },
  {
    id: 8,
    visitorId: "vis_vwx890",
    sessionId: "ses_yza123",
    firstVisit: "2024-01-15 14:22:55",
    lastActivity: "2024-01-15 14:44:22",
    pageViews: 9,
    sessionDuration: "21m 27s",
    pages: ["/", "/solutions", "/product", "/pricing", "/demo", "/contact", "/about", "/help", "/solutions"],
    referrer: "https://google.com",
    utmSource: "google",
    utmCampaign: "ar_software",
    affiliate: "PARTNER002",
    location: {
      country: "Brazil",
      countryCode: "BR",
      region: "São Paulo",
      city: "São Paulo",
    },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ip: "203.0.113.200",
    status: "converted",
    conversion: "Contact Form Submitted",
  },
]

export default function AdminVisitorsPage() {
  const [visitorsData, setVisitorsData] = useState(allVisitorsData)
  const [filteredVisitors, setFilteredVisitors] = useState(allVisitorsData)
  const [isRealTimeActive, setIsRealTimeActive] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Real-time simulation
  useEffect(() => {
    if (!isRealTimeActive) return

    const interval = setInterval(() => {
      // Simulate real-time updates
      setVisitorsData((prev) => {
        const updated = [...prev]
        // Randomly update last activity for active visitors
        updated.forEach((visitor) => {
          if (visitor.status === "active" && Math.random() > 0.7) {
            visitor.lastActivity = new Date().toLocaleString()
            visitor.pageViews += Math.floor(Math.random() * 2)
          }
        })
        return updated
      })
      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [isRealTimeActive])

  // Apply filters
  useEffect(() => {
    let filtered = visitorsData

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.visitorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (visitor.affiliate && visitor.affiliate.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.status === statusFilter)
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.location.country === countryFilter)
    }

    setFilteredVisitors(filtered)
  }, [visitorsData, searchTerm, statusFilter, countryFilter])

  const summaryStats = {
    totalVisitors: filteredVisitors.length,
    activeVisitors: filteredVisitors.filter((v) => v.status === "active").length,
    convertedVisitors: filteredVisitors.filter((v) => v.status === "converted").length,
    avgSessionDuration: "10m 29s",
    totalPageViews: filteredVisitors.reduce((sum, visitor) => sum + visitor.pageViews, 0),
  }

  const exportToCSV = () => {
    const headers = [
      "Visitor ID",
      "Session ID",
      "First Visit",
      "Last Activity",
      "Page Views",
      "Session Duration",
      "Status",
      "Conversion",
      "Country",
      "Region",
      "City",
      "IP Address",
      "Referrer",
      "UTM Source",
      "UTM Campaign",
      "Affiliate",
      "Pages Visited",
      "User Agent",
    ]

    const csvData = filteredVisitors.map((visitor) => [
      visitor.visitorId,
      visitor.sessionId,
      visitor.firstVisit,
      visitor.lastActivity,
      visitor.pageViews,
      visitor.sessionDuration,
      visitor.status,
      visitor.conversion || "",
      visitor.location.country,
      visitor.location.region,
      visitor.location.city,
      visitor.ip,
      visitor.referrer,
      visitor.utmSource || "",
      visitor.utmCampaign || "",
      visitor.affiliate || "",
      visitor.pages.join("; "),
      visitor.userAgent,
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `visitor-data-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCountryFilter("all")
    setIsFilterDialogOpen(false)
  }

  const uniqueCountries = [...new Set(allVisitorsData.map((v) => v.location.country))].sort()

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Tracking</h1>
            <p className="text-gray-600">Detailed view of individual visitor sessions and behavior</p>
            {isRealTimeActive && (
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-600">
                  Real-time active • Last update: {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            )}
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

        {/* Search and Quick Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-64">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search visitors, locations, referrers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="bounced">Bounced</SelectItem>
            </SelectContent>
          </Select>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {uniqueCountries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchTerm || statusFilter !== "all" || countryFilter !== "all") && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>

        {/* Visitors List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Visitors ({filteredVisitors.length})</CardTitle>
            <CardDescription>Individual visitor sessions and their activity details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {filteredVisitors.map((visitor) => (
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
            <Button onClick={exportToCSV} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Visitor Data (CSV)
            </Button>

            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Filter className="w-4 h-4" />
                  Advanced Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Filter Visitors</DialogTitle>
                  <DialogDescription>Apply advanced filters to narrow down the visitor list</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="search">Search</Label>
                    <Input
                      id="search"
                      placeholder="Visitor ID, location, referrer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="bounced">Bounced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={countryFilter} onValueChange={setCountryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        {uniqueCountries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={clearFilters} variant="outline" className="flex-1 bg-transparent">
                      Clear All
                    </Button>
                    <Button onClick={() => setIsFilterDialogOpen(false)} className="flex-1">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              variant={isRealTimeActive ? "default" : "outline"}
              onClick={() => setIsRealTimeActive(!isRealTimeActive)}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRealTimeActive ? "animate-spin" : ""}`} />
              {isRealTimeActive ? "Real-time Active" : "Enable Real-time"}
            </Button>
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
