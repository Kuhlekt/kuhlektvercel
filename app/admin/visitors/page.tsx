"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Users,
  Download,
  Filter,
  RefreshCw,
  Search,
  MapPin,
  Clock,
  Eye,
  MousePointer,
  BarChart3,
  ExternalLink,
  Globe,
  Calendar,
  Activity,
} from "lucide-react"
import Link from "next/link"

// Mock visitor data with comprehensive information
const mockVisitors = [
  {
    id: "V001",
    sessionId: "S001",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    firstVisit: "2024-01-15T10:30:00Z",
    lastActivity: "2024-01-15T11:45:00Z",
    pageViews: 8,
    timeOnSite: "1h 15m",
    status: "Active",
    referrer: "https://google.com/search?q=accounts+receivable+software",
    utmSource: "google",
    utmMedium: "organic",
    utmCampaign: "",
    affiliateCode: "",
    location: {
      country: "United States",
      countryCode: "US",
      region: "California",
      city: "San Francisco",
      timezone: "America/Los_Angeles",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    pagesVisited: ["/product", "/pricing-table", "/demo", "/contact"],
    deviceType: "Desktop",
    browser: "Chrome",
    os: "Windows 10",
    conversionEvents: ["demo_request"],
    totalSessions: 3,
    bounceRate: 0,
  },
  {
    id: "V002",
    sessionId: "S002",
    ipAddress: "10.0.0.50",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    firstVisit: "2024-01-15T09:15:00Z",
    lastActivity: "2024-01-15T09:45:00Z",
    pageViews: 3,
    timeOnSite: "30m",
    status: "Converted",
    referrer: "https://linkedin.com",
    utmSource: "linkedin",
    utmMedium: "social",
    utmCampaign: "ar_automation",
    affiliateCode: "PARTNER123",
    location: {
      country: "Canada",
      countryCode: "CA",
      region: "Ontario",
      city: "Toronto",
      timezone: "America/Toronto",
      coordinates: { lat: 43.6532, lng: -79.3832 },
    },
    pagesVisited: ["/", "/solutions", "/contact"],
    deviceType: "Desktop",
    browser: "Safari",
    os: "macOS",
    conversionEvents: ["contact_form", "demo_request"],
    totalSessions: 1,
    bounceRate: 0,
  },
  {
    id: "V003",
    sessionId: "S003",
    ipAddress: "172.16.0.25",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
    firstVisit: "2024-01-15T14:20:00Z",
    lastActivity: "2024-01-15T14:22:00Z",
    pageViews: 1,
    timeOnSite: "2m",
    status: "Bounced",
    referrer: "https://facebook.com",
    utmSource: "facebook",
    utmMedium: "social",
    utmCampaign: "brand_awareness",
    affiliateCode: "",
    location: {
      country: "United Kingdom",
      countryCode: "GB",
      region: "England",
      city: "London",
      timezone: "Europe/London",
      coordinates: { lat: 51.5074, lng: -0.1278 },
    },
    pagesVisited: ["/"],
    deviceType: "Mobile",
    browser: "Safari",
    os: "iOS",
    conversionEvents: [],
    totalSessions: 1,
    bounceRate: 1,
  },
  {
    id: "V004",
    sessionId: "S004",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
    firstVisit: "2024-01-15T16:10:00Z",
    lastActivity: "2024-01-15T17:30:00Z",
    pageViews: 12,
    timeOnSite: "1h 20m",
    status: "Active",
    referrer: "https://bing.com/search?q=credit+management+software",
    utmSource: "bing",
    utmMedium: "organic",
    utmCampaign: "",
    affiliateCode: "CONSULTANT456",
    location: {
      country: "Germany",
      countryCode: "DE",
      region: "Bavaria",
      city: "Munich",
      timezone: "Europe/Berlin",
      coordinates: { lat: 48.1351, lng: 11.582 },
    },
    pagesVisited: ["/", "/product", "/solutions", "/pricing-table", "/about", "/demo"],
    deviceType: "Desktop",
    browser: "Firefox",
    os: "Windows 10",
    conversionEvents: ["demo_request", "newsletter_signup"],
    totalSessions: 2,
    bounceRate: 0,
  },
  {
    id: "V005",
    sessionId: "S005",
    ipAddress: "198.51.100.78",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    firstVisit: "2024-01-15T12:45:00Z",
    lastActivity: "2024-01-15T13:15:00Z",
    pageViews: 5,
    timeOnSite: "30m",
    status: "Active",
    referrer: "https://twitter.com",
    utmSource: "twitter",
    utmMedium: "social",
    utmCampaign: "fintech_discussion",
    affiliateCode: "",
    location: {
      country: "Australia",
      countryCode: "AU",
      region: "New South Wales",
      city: "Sydney",
      timezone: "Australia/Sydney",
      coordinates: { lat: -33.8688, lng: 151.2093 },
    },
    pagesVisited: ["/", "/product", "/help", "/contact", "/about"],
    deviceType: "Desktop",
    browser: "Chrome",
    os: "Linux",
    conversionEvents: ["contact_form"],
    totalSessions: 1,
    bounceRate: 0,
  },
  {
    id: "V006",
    sessionId: "S006",
    ipAddress: "192.0.2.123",
    userAgent: "Mozilla/5.0 (Android 14; Mobile; rv:109.0) Gecko/119.0 Firefox/119.0",
    firstVisit: "2024-01-15T08:30:00Z",
    lastActivity: "2024-01-15T08:35:00Z",
    pageViews: 2,
    timeOnSite: "5m",
    status: "Bounced",
    referrer: "https://reddit.com/r/accounting",
    utmSource: "reddit",
    utmMedium: "social",
    utmCampaign: "",
    affiliateCode: "",
    location: {
      country: "Japan",
      countryCode: "JP",
      region: "Tokyo",
      city: "Tokyo",
      timezone: "Asia/Tokyo",
      coordinates: { lat: 35.6762, lng: 139.6503 },
    },
    pagesVisited: ["/", "/product"],
    deviceType: "Mobile",
    browser: "Firefox",
    os: "Android",
    conversionEvents: [],
    totalSessions: 1,
    bounceRate: 1,
  },
  {
    id: "V007",
    sessionId: "S007",
    ipAddress: "203.0.113.200",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/120.0.0.0 Safari/537.36",
    firstVisit: "2024-01-15T15:20:00Z",
    lastActivity: "2024-01-15T16:45:00Z",
    pageViews: 9,
    timeOnSite: "1h 25m",
    status: "Converted",
    referrer: "https://google.com/search?q=automated+accounts+receivable",
    utmSource: "google",
    utmMedium: "cpc",
    utmCampaign: "ar_automation_paid",
    affiliateCode: "AGENCY789",
    location: {
      country: "France",
      countryCode: "FR",
      region: "Île-de-France",
      city: "Paris",
      timezone: "Europe/Paris",
      coordinates: { lat: 48.8566, lng: 2.3522 },
    },
    pagesVisited: ["/", "/product", "/solutions", "/pricing-table", "/demo", "/contact", "/about"],
    deviceType: "Desktop",
    browser: "Edge",
    os: "Windows 10",
    conversionEvents: ["demo_request", "contact_form", "pricing_inquiry"],
    totalSessions: 4,
    bounceRate: 0,
  },
  {
    id: "V008",
    sessionId: "S008",
    ipAddress: "198.51.100.150",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
    firstVisit: "2024-01-15T11:00:00Z",
    lastActivity: "2024-01-15T11:40:00Z",
    pageViews: 6,
    timeOnSite: "40m",
    status: "Active",
    referrer: "https://duckduckgo.com/?q=receivables+management+platform",
    utmSource: "duckduckgo",
    utmMedium: "organic",
    utmCampaign: "",
    affiliateCode: "",
    location: {
      country: "Brazil",
      countryCode: "BR",
      region: "São Paulo",
      city: "São Paulo",
      timezone: "America/Sao_Paulo",
      coordinates: { lat: -23.5505, lng: -46.6333 },
    },
    pagesVisited: ["/", "/solutions", "/product", "/pricing-table", "/help", "/about"],
    deviceType: "Desktop",
    browser: "Safari",
    os: "macOS",
    conversionEvents: ["newsletter_signup"],
    totalSessions: 2,
    bounceRate: 0,
  },
]

export default function VisitorTracking() {
  const [visitors, setVisitors] = useState(mockVisitors)
  const [filteredVisitors, setFilteredVisitors] = useState(mockVisitors)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [isRealTimeActive, setIsRealTimeActive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState({
    search: "",
    status: "all",
    country: "all",
    deviceType: "all",
    trafficSource: "all",
    hasAffiliate: "all",
  })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Real-time updates
  useEffect(() => {
    if (isRealTimeActive) {
      intervalRef.current = setInterval(() => {
        setVisitors((prevVisitors) => {
          const updatedVisitors = prevVisitors.map((visitor) => {
            // Simulate real-time updates for active visitors
            if (visitor.status === "Active" && Math.random() > 0.7) {
              return {
                ...visitor,
                pageViews: visitor.pageViews + Math.floor(Math.random() * 3) + 1,
                lastActivity: new Date().toISOString(),
                timeOnSite: `${Math.floor(Math.random() * 60) + 30}m`,
              }
            }
            return visitor
          })
          return updatedVisitors
        })
        setLastUpdate(new Date())
      }, 5000) // Update every 5 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRealTimeActive])

  // Filter visitors based on search and filters
  useEffect(() => {
    let filtered = visitors

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.affiliateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.utmSource.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.status === statusFilter)
    }

    // Apply country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.location.country === countryFilter)
    }

    setFilteredVisitors(filtered)
  }, [visitors, searchTerm, statusFilter, countryFilter])

  // Apply advanced filters
  const applyAdvancedFilters = () => {
    let filtered = visitors

    if (advancedFilters.search) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.id.toLowerCase().includes(advancedFilters.search.toLowerCase()) ||
          visitor.location.country.toLowerCase().includes(advancedFilters.search.toLowerCase()) ||
          visitor.location.city.toLowerCase().includes(advancedFilters.search.toLowerCase()) ||
          visitor.referrer.toLowerCase().includes(advancedFilters.search.toLowerCase()) ||
          visitor.affiliateCode.toLowerCase().includes(advancedFilters.search.toLowerCase()) ||
          visitor.utmSource.toLowerCase().includes(advancedFilters.search.toLowerCase()),
      )
    }

    if (advancedFilters.status !== "all") {
      filtered = filtered.filter((visitor) => visitor.status === advancedFilters.status)
    }

    if (advancedFilters.country !== "all") {
      filtered = filtered.filter((visitor) => visitor.location.country === advancedFilters.country)
    }

    if (advancedFilters.deviceType !== "all") {
      filtered = filtered.filter((visitor) => visitor.deviceType === advancedFilters.deviceType)
    }

    if (advancedFilters.trafficSource !== "all") {
      filtered = filtered.filter((visitor) => visitor.utmSource === advancedFilters.trafficSource)
    }

    if (advancedFilters.hasAffiliate !== "all") {
      if (advancedFilters.hasAffiliate === "yes") {
        filtered = filtered.filter((visitor) => visitor.affiliateCode !== "")
      } else {
        filtered = filtered.filter((visitor) => visitor.affiliateCode === "")
      }
    }

    setFilteredVisitors(filtered)
    setIsFilterDialogOpen(false)
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCountryFilter("all")
    setAdvancedFilters({
      search: "",
      status: "all",
      country: "all",
      deviceType: "all",
      trafficSource: "all",
      hasAffiliate: "all",
    })
    setFilteredVisitors(visitors)
  }

  // Export visitor data as CSV
  const exportVisitorData = () => {
    const csvHeaders = [
      "Visitor ID",
      "Session ID",
      "IP Address",
      "First Visit",
      "Last Activity",
      "Page Views",
      "Time on Site",
      "Status",
      "Country",
      "Region",
      "City",
      "Timezone",
      "Latitude",
      "Longitude",
      "Device Type",
      "Browser",
      "OS",
      "Referrer",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "Affiliate Code",
      "Pages Visited",
      "Conversion Events",
      "Total Sessions",
      "Bounce Rate",
      "User Agent",
    ]

    const csvData = filteredVisitors.map((visitor) => [
      `"${visitor.id}"`,
      `"${visitor.sessionId}"`,
      `"${visitor.ipAddress}"`,
      `"${visitor.firstVisit}"`,
      `"${visitor.lastActivity}"`,
      visitor.pageViews,
      `"${visitor.timeOnSite}"`,
      `"${visitor.status}"`,
      `"${visitor.location.country}"`,
      `"${visitor.location.region}"`,
      `"${visitor.location.city}"`,
      `"${visitor.location.timezone}"`,
      visitor.location.coordinates.lat,
      visitor.location.coordinates.lng,
      `"${visitor.deviceType}"`,
      `"${visitor.browser}"`,
      `"${visitor.os}"`,
      `"${visitor.referrer}"`,
      `"${visitor.utmSource}"`,
      `"${visitor.utmMedium}"`,
      `"${visitor.utmCampaign}"`,
      `"${visitor.affiliateCode}"`,
      `"${visitor.pagesVisited.join("; ")}"`,
      `"${visitor.conversionEvents.join("; ")}"`,
      visitor.totalSessions,
      visitor.bounceRate,
      `"${visitor.userAgent}"`,
    ])

    const csvContent = [csvHeaders.join(","), ...csvData.map((row) => row.join(","))].join("\n")

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

  // Get unique countries for filter dropdown
  const uniqueCountries = [...new Set(visitors.map((v) => v.location.country))].sort()

  // Get unique traffic sources
  const uniqueTrafficSources = [...new Set(visitors.map((v) => v.utmSource))].filter(Boolean).sort()

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Converted":
        return "bg-blue-100 text-blue-800"
      case "Bounced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visitor Tracking</h1>
            <p className="text-gray-600 mt-2">Monitor and analyze website visitor behavior in real-time</p>
          </div>
          <Link href="/admin/tracking">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <BarChart3 className="h-4 w-4" />
              Analytics Dashboard
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
              <div className="text-2xl font-bold">{filteredVisitors.length}</div>
              <p className="text-xs text-muted-foreground">
                {filteredVisitors.length !== visitors.length ? `Filtered from ${visitors.length}` : "All visitors"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredVisitors.filter((v) => v.status === "Active").length}</div>
              <p className="text-xs text-muted-foreground">Currently browsing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredVisitors.filter((v) => v.status === "Converted").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {filteredVisitors.length > 0
                  ? `${Math.round((filteredVisitors.filter((v) => v.status === "Converted").length / filteredVisitors.length) * 100)}% rate`
                  : "0% rate"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(filteredVisitors.map((v) => v.location.country)).size}</div>
              <p className="text-xs text-muted-foreground">Unique locations</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search visitors, locations, referrers, affiliate codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Bounced">Bounced</SelectItem>
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

            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Advanced Filters</DialogTitle>
                  <DialogDescription>Apply detailed filters to find specific visitor segments</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="advanced-search">Search</Label>
                    <Input
                      id="advanced-search"
                      placeholder="Search across all fields..."
                      value={advancedFilters.search}
                      onChange={(e) => setAdvancedFilters((prev) => ({ ...prev, search: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="advanced-status">Status</Label>
                    <Select
                      value={advancedFilters.status}
                      onValueChange={(value) => setAdvancedFilters((prev) => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Converted">Converted</SelectItem>
                        <SelectItem value="Bounced">Bounced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="advanced-country">Country</Label>
                    <Select
                      value={advancedFilters.country}
                      onValueChange={(value) => setAdvancedFilters((prev) => ({ ...prev, country: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
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

                  <div>
                    <Label htmlFor="advanced-device">Device Type</Label>
                    <Select
                      value={advancedFilters.deviceType}
                      onValueChange={(value) => setAdvancedFilters((prev) => ({ ...prev, deviceType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Devices</SelectItem>
                        <SelectItem value="Desktop">Desktop</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                        <SelectItem value="Tablet">Tablet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="advanced-traffic">Traffic Source</Label>
                    <Select
                      value={advancedFilters.trafficSource}
                      onValueChange={(value) => setAdvancedFilters((prev) => ({ ...prev, trafficSource: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        {uniqueTrafficSources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="advanced-affiliate">Has Affiliate Code</Label>
                    <Select
                      value={advancedFilters.hasAffiliate}
                      onValueChange={(value) => setAdvancedFilters((prev) => ({ ...prev, hasAffiliate: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Visitors</SelectItem>
                        <SelectItem value="yes">With Affiliate</SelectItem>
                        <SelectItem value="no">Without Affiliate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={applyAdvancedFilters} className="flex-1">
                      Apply Filters
                    </Button>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={exportVisitorData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>

            <Button
              onClick={() => setIsRealTimeActive(!isRealTimeActive)}
              variant={isRealTimeActive ? "default" : "outline"}
              className={isRealTimeActive ? "animate-pulse" : ""}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRealTimeActive ? "animate-spin" : ""}`} />
              Real-time {isRealTimeActive ? "ON" : "OFF"}
            </Button>
          </div>
        </div>

        {/* Real-time indicator */}
        {isRealTimeActive && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Real-time monitoring active</span>
              <span className="text-xs text-green-600">Last updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Visitor Details ({filteredVisitors.length})
            </CardTitle>
            <CardDescription>Detailed information about website visitors and their behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredVisitors.map((visitor) => (
                <div key={visitor.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Visitor Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-lg">{visitor.id}</span>
                        <Badge className={getStatusBadgeColor(visitor.status)}>{visitor.status}</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Session: {visitor.sessionId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          <span>
                            {visitor.pageViews} page views • {visitor.timeOnSite}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>First visit: {new Date(visitor.firstVisit).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location & Device */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-blue-600">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">Location & Device</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1 bg-blue-50 p-3 rounded-md">
                        <div>
                          <strong>Country:</strong> {visitor.location.country} ({visitor.location.countryCode})
                        </div>
                        <div>
                          <strong>Region:</strong> {visitor.location.region}
                        </div>
                        <div>
                          <strong>City:</strong> {visitor.location.city}
                        </div>
                        <div>
                          <strong>Timezone:</strong> {visitor.location.timezone}
                        </div>
                        <div>
                          <strong>Coordinates:</strong> {visitor.location.coordinates.lat.toFixed(4)},{" "}
                          {visitor.location.coordinates.lng.toFixed(4)}
                        </div>
                        <div className="pt-2 border-t border-blue-200">
                          <div>
                            <strong>Device:</strong> {visitor.deviceType}
                          </div>
                          <div>
                            <strong>Browser:</strong> {visitor.browser}
                          </div>
                          <div>
                            <strong>OS:</strong> {visitor.os}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Traffic & Conversion */}
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>
                          <strong>Referrer:</strong>{" "}
                          {visitor.referrer.length > 50 ? visitor.referrer.substring(0, 50) + "..." : visitor.referrer}
                        </div>
                        <div>
                          <strong>UTM Source:</strong> {visitor.utmSource || "Direct"}
                        </div>
                        <div>
                          <strong>UTM Medium:</strong> {visitor.utmMedium || "None"}
                        </div>
                        {visitor.utmCampaign && (
                          <div>
                            <strong>Campaign:</strong> {visitor.utmCampaign}
                          </div>
                        )}
                        {visitor.affiliateCode && (
                          <div>
                            <strong>Affiliate:</strong> <Badge variant="secondary">{visitor.affiliateCode}</Badge>
                          </div>
                        )}
                        <div>
                          <strong>Pages:</strong> {visitor.pagesVisited.join(", ")}
                        </div>
                        {visitor.conversionEvents.length > 0 && (
                          <div>
                            <strong>Conversions:</strong>{" "}
                            {visitor.conversionEvents.map((event) => (
                              <Badge key={event} variant="outline" className="ml-1">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div>
                          <strong>Sessions:</strong> {visitor.totalSessions} • <strong>Bounce Rate:</strong>{" "}
                          {Math.round(visitor.bounceRate * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredVisitors.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No visitors found matching your filters.</p>
                  <Button variant="outline" onClick={clearFilters} className="mt-2 bg-transparent">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
