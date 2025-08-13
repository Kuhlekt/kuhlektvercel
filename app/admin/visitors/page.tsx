"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, Download, RefreshCw, Users, TrendingUp, MapPin } from "lucide-react"

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
  }
  sessionId: string
  isActive: boolean
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPage, setFilterPage] = useState("all")
  const [filterTimeRange, setFilterTimeRange] = useState("24h")
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Get all visitors from localStorage
  const getAllVisitors = (): Visitor[] => {
    try {
      const stored = localStorage.getItem("kuhlekt_visitors")
      if (stored) {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (error) {
      console.error("Error loading visitors:", error)
    }
    return []
  }

  // Load visitors data
  const loadVisitors = () => {
    setIsLoading(true)
    const allVisitors = getAllVisitors()
    setVisitors(allVisitors)
    setIsLoading(false)
  }

  // Filter visitors based on search and filters
  useEffect(() => {
    let filtered = [...visitors]

    // Time range filter
    const now = Date.now()
    const timeRanges = {
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      all: Number.POSITIVE_INFINITY,
    }

    const timeRange = timeRanges[filterTimeRange as keyof typeof timeRanges] || timeRanges["24h"]
    if (timeRange !== Number.POSITIVE_INFINITY) {
      filtered = filtered.filter((visitor) => now - visitor.timestamp <= timeRange)
    }

    // Page filter
    if (filterPage !== "all") {
      filtered = filtered.filter((visitor) => visitor.page === filterPage)
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (visitor) =>
          visitor.ip.toLowerCase().includes(search) ||
          visitor.page.toLowerCase().includes(search) ||
          visitor.referrer.toLowerCase().includes(search) ||
          visitor.location?.country.toLowerCase().includes(search) ||
          visitor.location?.city.toLowerCase().includes(search),
      )
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => b.timestamp - a.timestamp)

    setFilteredVisitors(filtered)
  }, [visitors, searchTerm, filterPage, filterTimeRange])

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(loadVisitors, 5000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  // Initial load
  useEffect(() => {
    loadVisitors()
  }, [])

  // Get unique pages for filter
  const uniquePages = Array.from(new Set(visitors.map((v) => v.page)))

  // Calculate stats
  const stats = {
    total: filteredVisitors.length,
    active: filteredVisitors.filter((v) => v.isActive).length,
    uniqueIPs: new Set(filteredVisitors.map((v) => v.ip)).size,
    topPage: uniquePages.reduce((top, page) => {
      const count = filteredVisitors.filter((v) => v.page === page).length
      return count > (filteredVisitors.filter((v) => v.page === top).length || 0) ? page : top
    }, uniquePages[0] || "/"),
  }

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Timestamp", "IP", "Page", "Referrer", "Country", "City", "User Agent"]
    const csvData = [
      headers.join(","),
      ...filteredVisitors.map((visitor) =>
        [
          new Date(visitor.timestamp).toISOString(),
          visitor.ip,
          visitor.page,
          visitor.referrer,
          visitor.location?.country || "",
          visitor.location?.city || "",
          `"${visitor.userAgent}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `visitors-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Visitor Tracking</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "bg-green-50 border-green-200" : ""}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
                {autoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
              </Button>
              <Button variant="outline" size="sm" onClick={loadVisitors}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex gap-4 mb-6">
            <Button variant="default" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Visitor Tracking
            </Button>
            <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/tracking")}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics Dashboard
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Now</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <Eye className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique IPs</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.uniqueIPs}</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Page</p>
                  <p className="text-lg font-bold text-orange-600 truncate">{stats.topPage}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <Input
                  placeholder="Search by IP, page, referrer, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterPage} onValueChange={setFilterPage}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pages</SelectItem>
                  {uniquePages.map((page) => (
                    <SelectItem key={page} value={page}>
                      {page}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterTimeRange} onValueChange={setFilterTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Visitors ({filteredVisitors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Loading visitors...</p>
              </div>
            ) : filteredVisitors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500 mb-2">No visitors found</p>
                <p className="text-sm text-gray-400">
                  {visitors.length === 0
                    ? "No visitor data has been collected yet."
                    : "Try adjusting your filters to see more results."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-600">Time</th>
                      <th className="text-left p-3 font-medium text-gray-600">IP Address</th>
                      <th className="text-left p-3 font-medium text-gray-600">Page</th>
                      <th className="text-left p-3 font-medium text-gray-600">Location</th>
                      <th className="text-left p-3 font-medium text-gray-600">Referrer</th>
                      <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.map((visitor) => (
                      <tr key={visitor.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="text-sm">
                            <div className="font-medium">{new Date(visitor.timestamp).toLocaleTimeString()}</div>
                            <div className="text-gray-500">{new Date(visitor.timestamp).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="p-3">
                          <code className="text-sm bg-gray-100 px-2 py-1 rounded">{visitor.ip}</code>
                        </td>
                        <td className="p-3">
                          <span className="text-sm font-medium">{visitor.page}</span>
                        </td>
                        <td className="p-3">
                          <div className="text-sm">
                            {visitor.location ? (
                              <>
                                <div className="font-medium">{visitor.location.city}</div>
                                <div className="text-gray-500">{visitor.location.country}</div>
                              </>
                            ) : (
                              <span className="text-gray-400">Unknown</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="text-sm text-gray-600 truncate max-w-32 block">
                            {visitor.referrer || "Direct"}
                          </span>
                        </td>
                        <td className="p-3">
                          <Badge variant={visitor.isActive ? "default" : "secondary"}>
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
