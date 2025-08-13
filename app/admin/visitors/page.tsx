"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Users,
  Eye,
  MousePointer,
  Download,
  Search,
  Filter,
  RefreshCw,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
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
    country: string
    city: string
    region: string
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
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

// Function to get all visitors from localStorage
function getAllVisitors(): Visitor[] {
  if (typeof window === "undefined") return []

  try {
    const visitors = localStorage.getItem("visitors")
    return visitors ? JSON.parse(visitors) : []
  } catch (error) {
    console.error("Error loading visitors:", error)
    return []
  }
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDevice, setFilterDevice] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load visitors data
  useEffect(() => {
    const loadVisitors = () => {
      const visitorData = getAllVisitors()
      setVisitors(visitorData)
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
          visitor.location?.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.location?.city.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Device filter
    if (filterDevice !== "all") {
      filtered = filtered.filter((visitor) => visitor.device.type === filterDevice)
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "active") {
        filtered = filtered.filter((visitor) => visitor.isActive)
      } else if (filterStatus === "inactive") {
        filtered = filtered.filter((visitor) => !visitor.isActive)
      }
    }

    setFilteredVisitors(filtered)
  }, [visitors, searchTerm, filterDevice, filterStatus])

  // Calculate stats
  const stats = {
    total: visitors.length,
    active: visitors.filter((v) => v.isActive).length,
    pageViews: visitors.reduce((sum, v) => sum + v.pageViews, 0),
    avgTimeOnSite:
      visitors.length > 0 ? Math.round(visitors.reduce((sum, v) => sum + v.timeOnSite, 0) / visitors.length / 1000) : 0,
  }

  const handleExportCSV = () => {
    if (filteredVisitors.length === 0) return

    const headers = [
      "Timestamp",
      "IP Address",
      "Page",
      "Referrer",
      "Country",
      "City",
      "Device Type",
      "Browser",
      "OS",
      "Page Views",
      "Time on Site (seconds)",
      "Status",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
    ]

    const csvData = filteredVisitors.map((visitor) => [
      new Date(visitor.timestamp).toISOString(),
      visitor.ip,
      visitor.page,
      visitor.referrer,
      visitor.location?.country || "",
      visitor.location?.city || "",
      visitor.device.type,
      visitor.device.browser,
      visitor.device.os,
      visitor.pageViews,
      Math.round(visitor.timeOnSite / 1000),
      visitor.isActive ? "Active" : "Inactive",
      visitor.utmSource || "",
      visitor.utmMedium || "",
      visitor.utmCampaign || "",
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `visitors-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visitor Tracking</h1>
            <p className="text-gray-600">Monitor and analyze website visitors in real-time</p>
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
                <Eye className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pageViews}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time on Site</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgTimeOnSite}s</div>
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by IP, page, referrer, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterDevice} onValueChange={setFilterDevice}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Devices</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visitors</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleExportCSV} disabled={filteredVisitors.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visitors ({filteredVisitors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredVisitors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No visitors found</h3>
                <p className="text-gray-600">
                  {visitors.length === 0
                    ? "No visitors have been tracked yet. Visitors will appear here once they visit your site."
                    : "No visitors match your current filters. Try adjusting your search criteria."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Visitor</th>
                      <th className="text-left p-4 font-medium">Location</th>
                      <th className="text-left p-4 font-medium">Device</th>
                      <th className="text-left p-4 font-medium">Activity</th>
                      <th className="text-left p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.map((visitor) => (
                      <tr key={visitor.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="font-medium">{visitor.ip}</div>
                            <div className="text-sm text-gray-600">{new Date(visitor.timestamp).toLocaleString()}</div>
                            <div className="text-sm text-blue-600">{visitor.page}</div>
                            {visitor.referrer && <div className="text-xs text-gray-500">From: {visitor.referrer}</div>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm">
                                {visitor.location?.city || "Unknown"}, {visitor.location?.country || "Unknown"}
                              </div>
                              {visitor.location?.region && (
                                <div className="text-xs text-gray-500">{visitor.location.region}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(visitor.device.type)}
                            <div>
                              <div className="text-sm capitalize">{visitor.device.type}</div>
                              <div className="text-xs text-gray-500">
                                {visitor.device.browser} • {visitor.device.os}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="text-sm">
                              {visitor.pageViews} page{visitor.pageViews !== 1 ? "s" : ""}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round(visitor.timeOnSite / 1000)}s on site
                            </div>
                            {(visitor.utmSource || visitor.utmMedium || visitor.utmCampaign) && (
                              <div className="flex gap-1 flex-wrap">
                                {visitor.utmSource && (
                                  <Badge variant="outline" className="text-xs">
                                    {visitor.utmSource}
                                  </Badge>
                                )}
                                {visitor.utmMedium && (
                                  <Badge variant="outline" className="text-xs">
                                    {visitor.utmMedium}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={visitor.isActive ? "default" : "secondary"}
                            className={visitor.isActive ? "bg-green-100 text-green-800" : ""}
                          >
                            {visitor.isActive ? "Active" : "Inactive"}
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
    </div>
  )
}
