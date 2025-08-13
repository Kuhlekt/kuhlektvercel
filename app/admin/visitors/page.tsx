"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  Download,
  Search,
  Filter,
  RefreshCw,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
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

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDevice, setFilterDevice] = useState("all")
  const [filterTimeRange, setFilterTimeRange] = useState("all")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load visitor data from localStorage
  const loadVisitorData = () => {
    try {
      const storedVisitors = localStorage.getItem("kuhlekt_visitors")
      if (storedVisitors) {
        const parsedVisitors = JSON.parse(storedVisitors)
        setVisitors(parsedVisitors)
        setFilteredVisitors(parsedVisitors)
      } else {
        setVisitors([])
        setFilteredVisitors([])
      }
    } catch (error) {
      console.error("Error loading visitor data:", error)
      setVisitors([])
      setFilteredVisitors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVisitorData()
  }, [])

  // Auto-refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        loadVisitorData()
      }, 5000) // Refresh every 5 seconds
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
          visitor.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.ip.includes(searchTerm),
      )
    }

    // Device filter
    if (filterDevice !== "all") {
      filtered = filtered.filter((visitor) => visitor.device.toLowerCase() === filterDevice)
    }

    // Time range filter
    if (filterTimeRange !== "all") {
      const now = Date.now()
      const timeRanges = {
        "1h": 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
      }
      const range = timeRanges[filterTimeRange as keyof typeof timeRanges]
      if (range) {
        filtered = filtered.filter((visitor) => now - visitor.timestamp <= range)
      }
    }

    setFilteredVisitors(filtered)
  }, [visitors, searchTerm, filterDevice, filterTimeRange])

  // Calculate statistics
  const stats = {
    totalVisitors: visitors.length,
    activeVisitors: visitors.filter((v) => v.isActive).length,
    totalPageViews: visitors.reduce((sum, v) => sum + v.pageViews, 0),
    avgSessionDuration:
      visitors.length > 0
        ? Math.round(visitors.reduce((sum, v) => sum + v.sessionDuration, 0) / visitors.length / 1000)
        : 0,
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "Page",
      "Referrer",
      "Country",
      "City",
      "Device",
      "Browser",
      "IP",
      "Page Views",
      "Session Duration (s)",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
    ]

    const csvData = filteredVisitors.map((visitor) => [
      new Date(visitor.timestamp).toISOString(),
      visitor.page,
      visitor.referrer,
      visitor.country || "",
      visitor.city || "",
      visitor.device,
      visitor.browser,
      visitor.ip,
      visitor.pageViews,
      Math.round(visitor.sessionDuration / 1000),
      visitor.utmSource || "",
      visitor.utmMedium || "",
      visitor.utmCampaign || "",
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-visitors-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
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
          <h1 className="text-3xl font-bold text-gray-900">Visitor Tracking</h1>
          <p className="text-gray-600">Monitor and analyze website visitor behavior</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="auto-refresh" checked={autoRefresh} onCheckedChange={setAutoRefresh} />
            <Label htmlFor="auto-refresh" className="text-sm">
              Auto-refresh
            </Label>
          </div>
          <Link href="/admin/tracking">
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors}</div>
            <p className="text-xs text-muted-foreground">All time visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeVisitors}</div>
            <p className="text-xs text-muted-foreground">Currently browsing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPageViews}</div>
            <p className="text-xs text-muted-foreground">Total page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSessionDuration}s</div>
            <p className="text-xs text-muted-foreground">Average duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by page, referrer, location, or IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterDevice} onValueChange={setFilterDevice}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Device type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Devices</SelectItem>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTimeRange} onValueChange={setFilterTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1h">Last Hour</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visitors Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Visitor Details</CardTitle>
              <CardDescription>
                Showing {filteredVisitors.length} of {visitors.length} visitors
              </CardDescription>
            </div>
            <Button onClick={loadVisitorData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVisitors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No visitors found</h3>
              <p className="text-gray-600">
                {visitors.length === 0
                  ? "No visitor data has been collected yet. Visitors will appear here as they browse your site."
                  : "No visitors match your current filters. Try adjusting your search criteria."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Time</th>
                    <th className="text-left p-2 font-medium">Page</th>
                    <th className="text-left p-2 font-medium">Location</th>
                    <th className="text-left p-2 font-medium">Device</th>
                    <th className="text-left p-2 font-medium">Source</th>
                    <th className="text-left p-2 font-medium">Duration</th>
                    <th className="text-left p-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisitors.map((visitor) => (
                    <tr key={visitor.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-sm text-gray-600">{new Date(visitor.timestamp).toLocaleString()}</td>
                      <td className="p-2">
                        <div className="font-medium text-sm">{visitor.page}</div>
                        <div className="text-xs text-gray-500 truncate max-w-[200px]">
                          {visitor.referrer || "Direct"}
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1 text-sm">
                          <Globe className="h-3 w-3 text-gray-400" />
                          {visitor.country || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500">{visitor.city || "Unknown City"}</div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(visitor.device)}
                          <div>
                            <div className="text-sm font-medium">{visitor.device}</div>
                            <div className="text-xs text-gray-500">{visitor.browser}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-sm">
                        {visitor.utmSource ? (
                          <div>
                            <div className="font-medium">{visitor.utmSource}</div>
                            <div className="text-xs text-gray-500">
                              {visitor.utmMedium} / {visitor.utmCampaign}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Direct</span>
                        )}
                      </td>
                      <td className="p-2 text-sm">
                        <div>{formatDuration(visitor.sessionDuration)}</div>
                        <div className="text-xs text-gray-500">
                          {visitor.pageViews} page{visitor.pageViews !== 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="p-2">
                        <Badge variant={visitor.isActive ? "default" : "secondary"}>
                          {visitor.isActive ? "Active" : "Left"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
