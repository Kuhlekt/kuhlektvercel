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
  Clock,
  Eye,
  MousePointer,
  BarChart3,
  ExternalLink,
  Globe,
  Calendar,
  Activity,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { getAllVisitors } from "@/components/visitor-tracker"

interface VisitorData {
  visitorId: string
  sessionId: string
  firstVisit: string
  lastVisit: string
  pageViews: number
  referrer: string
  userAgent: string
  currentPage: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  affiliate?: string
}

export default function VisitorTracking() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const [isRealTimeActive, setIsRealTimeActive] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [advancedFilters, setAdvancedFilters] = useState({
    search: "",
    status: "all",
    country: "all",
    deviceType: "all",
    trafficSource: "all",
    hasAffiliate: "all",
  })
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load visitor data from localStorage
  useEffect(() => {
    const loadVisitorData = () => {
      try {
        const visitorData = getAllVisitors()
        setVisitors(visitorData)
        setFilteredVisitors(visitorData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading visitor data:", error)
        setIsLoading(false)
      }
    }

    loadVisitorData()
  }, [])

  // Real-time updates
  useEffect(() => {
    if (isRealTimeActive) {
      intervalRef.current = setInterval(() => {
        const visitorData = getAllVisitors()
        setVisitors(visitorData)
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
          visitor.visitorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.sessionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (visitor.affiliate && visitor.affiliate.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (visitor.utmSource && visitor.utmSource.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredVisitors(filtered)
  }, [visitors, searchTerm, statusFilter, countryFilter])

  // Apply advanced filters
  const applyAdvancedFilters = () => {
    let filtered = visitors

    if (advancedFilters.search) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.visitorId.toLowerCase().includes(advancedFilters.search.toLowerCase()) ||
          visitor.sessionId.toLowerCase().includes(advancedFilters.search.toLowerCase()) ||
          visitor.referrer.toLowerCase().includes(advancedFilters.search.toLowerCase()) ||
          (visitor.affiliate && visitor.affiliate.toLowerCase().includes(advancedFilters.search.toLowerCase())) ||
          (visitor.utmSource && visitor.utmSource.toLowerCase().includes(advancedFilters.search.toLowerCase())),
      )
    }

    if (advancedFilters.trafficSource !== "all") {
      filtered = filtered.filter((visitor) => visitor.utmSource === advancedFilters.trafficSource)
    }

    if (advancedFilters.hasAffiliate !== "all") {
      if (advancedFilters.hasAffiliate === "yes") {
        filtered = filtered.filter((visitor) => visitor.affiliate && visitor.affiliate !== "")
      } else {
        filtered = filtered.filter((visitor) => !visitor.affiliate || visitor.affiliate === "")
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
    if (filteredVisitors.length === 0) {
      alert("No visitor data to export")
      return
    }

    const csvHeaders = [
      "Visitor ID",
      "Session ID",
      "First Visit",
      "Last Visit",
      "Page Views",
      "Current Page",
      "Referrer",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "UTM Term",
      "UTM Content",
      "Affiliate Code",
      "User Agent",
    ]

    const csvData = filteredVisitors.map((visitor) => [
      `"${visitor.visitorId}"`,
      `"${visitor.sessionId}"`,
      `"${visitor.firstVisit}"`,
      `"${visitor.lastVisit}"`,
      visitor.pageViews,
      `"${visitor.currentPage}"`,
      `"${visitor.referrer}"`,
      `"${visitor.utmSource || ""}"`,
      `"${visitor.utmMedium || ""}"`,
      `"${visitor.utmCampaign || ""}"`,
      `"${visitor.utmTerm || ""}"`,
      `"${visitor.utmContent || ""}"`,
      `"${visitor.affiliate || ""}"`,
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

  // Get unique traffic sources
  const uniqueTrafficSources = [...new Set(visitors.map((v) => v.utmSource))].filter(Boolean).sort()

  // Calculate active visitors (visited in last 30 minutes)
  const activeVisitors = filteredVisitors.filter((visitor) => {
    const lastVisit = new Date(visitor.lastVisit)
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
    return lastVisit > thirtyMinutesAgo
  }).length

  // Calculate visitors with conversions (those who visited demo or contact pages)
  const convertedVisitors = filteredVisitors.filter(
    (visitor) => visitor.currentPage.includes("/demo") || visitor.currentPage.includes("/contact"),
  ).length

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading visitor data...</p>
            </div>
          </div>
        </div>
      </div>
    )
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
              <div className="text-2xl font-bold">{activeVisitors}</div>
              <p className="text-xs text-muted-foreground">Last 30 minutes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversions</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{convertedVisitors}</div>
              <p className="text-xs text-muted-foreground">
                {filteredVisitors.length > 0
                  ? `${Math.round((convertedVisitors / filteredVisitors.length) * 100)}% rate`
                  : "0% rate"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {filteredVisitors.reduce((sum, visitor) => sum + visitor.pageViews, 0)}
              </div>
              <p className="text-xs text-muted-foreground">Total page views</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search visitors, referrers, affiliate codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex gap-2">
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

            <Button onClick={exportVisitorData} variant="outline" disabled={filteredVisitors.length === 0}>
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
              {filteredVisitors.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Visitor Data Available</h3>
                  <p className="mb-4">
                    {visitors.length === 0
                      ? "No visitors have been tracked yet. Visitor data will appear here as people browse your website."
                      : "No visitors found matching your current filters."}
                  </p>
                  {visitors.length > 0 && (
                    <Button variant="outline" onClick={clearFilters} className="bg-transparent">
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                filteredVisitors.map((visitor) => (
                  <div key={visitor.visitorId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Visitor Info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-lg">{visitor.visitorId}</span>
                          <Badge variant="outline">Active</Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>Session: {visitor.sessionId}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="h-3 w-3" />
                            <span>{visitor.pageViews} page views</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span>First visit: {new Date(visitor.firstVisit).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="h-3 w-3" />
                            <span>Last activity: {new Date(visitor.lastVisit).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Current Page & Navigation */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-blue-600">
                          <Globe className="h-4 w-4" />
                          <span className="font-medium">Current Session</span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 bg-blue-50 p-3 rounded-md">
                          <div>
                            <strong>Current Page:</strong> {visitor.currentPage}
                          </div>
                          <div>
                            <strong>Referrer:</strong>{" "}
                            {visitor.referrer.length > 50
                              ? visitor.referrer.substring(0, 50) + "..."
                              : visitor.referrer}
                          </div>
                          {visitor.utmSource && (
                            <div>
                              <strong>UTM Source:</strong> {visitor.utmSource}
                            </div>
                          )}
                          {visitor.utmMedium && (
                            <div>
                              <strong>UTM Medium:</strong> {visitor.utmMedium}
                            </div>
                          )}
                          {visitor.utmCampaign && (
                            <div>
                              <strong>Campaign:</strong> {visitor.utmCampaign}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Data */}
                      <div className="space-y-2">
                        <div className="text-sm text-gray-600 space-y-1">
                          {visitor.affiliate && (
                            <div>
                              <strong>Affiliate:</strong> <Badge variant="secondary">{visitor.affiliate}</Badge>
                            </div>
                          )}
                          {visitor.utmTerm && (
                            <div>
                              <strong>UTM Term:</strong> {visitor.utmTerm}
                            </div>
                          )}
                          {visitor.utmContent && (
                            <div>
                              <strong>UTM Content:</strong> {visitor.utmContent}
                            </div>
                          )}
                          <div className="pt-2 border-t">
                            <strong>User Agent:</strong>
                            <div className="text-xs text-gray-500 mt-1 break-all">
                              {visitor.userAgent.length > 100
                                ? visitor.userAgent.substring(0, 100) + "..."
                                : visitor.userAgent}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
