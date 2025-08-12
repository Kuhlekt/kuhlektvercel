"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Users,
  Eye,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Download,
  RefreshCw,
  Search,
  Filter,
  Activity,
} from "lucide-react"
import Link from "next/link"

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

// Function to get all visitors from localStorage (this would be replaced with real API call)
function getAllVisitors(): Visitor[] {
  if (typeof window === "undefined") return []

  try {
    const visitors = localStorage.getItem("visitors")
    return visitors ? JSON.parse(visitors) : []
  } catch {
    return []
  }
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [deviceFilter, setDeviceFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load visitors data
  useEffect(() => {
    const loadVisitors = () => {
      const allVisitors = getAllVisitors()
      setVisitors(allVisitors)
      setLoading(false)
    }

    loadVisitors()

    // Auto-refresh every 5 seconds if enabled
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(loadVisitors, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  // Filter visitors based on search and filters
  useEffect(() => {
    let filtered = visitors

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.ip.includes(searchTerm) ||
          visitor.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.location?.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Device filter
    if (deviceFilter !== "all") {
      filtered = filtered.filter((visitor) => visitor.device.type === deviceFilter)
    }

    // Status filter
    if (statusFilter !== "all") {
      if (statusFilter === "active") {
        filtered = filtered.filter((visitor) => visitor.isActive)
      } else if (statusFilter === "inactive") {
        filtered = filtered.filter((visitor) => !visitor.isActive)
      }
    }

    setFilteredVisitors(filtered)
  }, [visitors, searchTerm, deviceFilter, statusFilter])

  // Calculate statistics
  const stats = {
    total: visitors.length,
    active: visitors.filter((v) => v.isActive).length,
    desktop: visitors.filter((v) => v.device.type === "desktop").length,
    mobile: visitors.filter((v) => v.device.type === "mobile").length,
    tablet: visitors.filter((v) => v.device.type === "tablet").length,
    totalPageViews: visitors.reduce((sum, v) => sum + v.pageViews, 0),
    avgTimeOnSite:
      visitors.length > 0 ? Math.round(visitors.reduce((sum, v) => sum + v.timeOnSite, 0) / visitors.length / 1000) : 0,
  }

  const handleExportCSV = () => {
    if (filteredVisitors.length === 0) return

    const headers = [
      "Timestamp",
      "IP",
      "Page",
      "Referrer",
      "Device",
      "Browser",
      "OS",
      "Country",
      "City",
      "Status",
      "Page Views",
      "Time on Site (s)",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredVisitors.map((visitor) =>
        [
          new Date(visitor.timestamp).toISOString(),
          visitor.ip,
          `"${visitor.page}"`,
          `"${visitor.referrer}"`,
          visitor.device.type,
          visitor.device.browser,
          visitor.device.os,
          visitor.location?.country || "",
          visitor.location?.city || "",
          visitor.isActive ? "Active" : "Inactive",
          visitor.pageViews,
          Math.round(visitor.timeOnSite / 1000),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `visitors-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading visitors...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Visitor Tracking</h1>
          <p className="text-muted-foreground">Monitor and analyze website visitors in real-time</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <Label htmlFor="auto-refresh">Auto-refresh</Label>
          </div>
          <Link href="/admin/tracking">
            <Button variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Analytics Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">{stats.active} currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round(stats.totalPageViews / stats.total) : 0} avg per visitor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time on Site</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTimeOnSite}s</div>
            <p className="text-xs text-muted-foreground">Average session duration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Device Split</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.desktop + stats.mobile + stats.tablet}</div>
            <p className="text-xs text-muted-foreground">
              {stats.desktop}D / {stats.mobile}M / {stats.tablet}T
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by IP, page, referrer, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={deviceFilter} onValueChange={setDeviceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportCSV} disabled={filteredVisitors.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visitors List */}
      <Card>
        <CardHeader>
          <CardTitle>Visitors ({filteredVisitors.length})</CardTitle>
          <CardDescription>
            {filteredVisitors.length === 0 && visitors.length === 0
              ? "No visitors tracked yet. Visitors will appear here as they browse your site."
              : `Showing ${filteredVisitors.length} of ${visitors.length} visitors`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredVisitors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {visitors.length === 0 ? (
                <div>
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No visitors tracked yet</p>
                  <p className="text-sm">Visitors will appear here as they browse your site</p>
                </div>
              ) : (
                <div>
                  <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No visitors match your current filters</p>
                  <p className="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredVisitors.map((visitor) => (
                  <div
                    key={visitor.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(visitor.device.type)}
                        <Badge variant={visitor.isActive ? "default" : "secondary"}>
                          {visitor.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium">{visitor.ip}</div>
                        <div className="text-sm text-muted-foreground">
                          {visitor.device.browser} on {visitor.device.os}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{visitor.page}</div>
                      <div className="text-sm text-muted-foreground">
                        {visitor.location?.city && visitor.location?.country
                          ? `${visitor.location.city}, ${visitor.location.country}`
                          : "Unknown location"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{visitor.pageViews} views</div>
                      <div className="text-sm text-muted-foreground">{formatTimeAgo(visitor.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
