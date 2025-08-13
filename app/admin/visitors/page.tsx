"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Eye, MousePointer, Download, RefreshCw, Search, Filter } from "lucide-react"

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
  sessionId: string
  isActive: boolean
  pageViews: number
  timeOnSite: number
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Get all visitors from localStorage
  const getAllVisitors = (): Visitor[] => {
    try {
      const stored = localStorage.getItem("kuhlekt_visitors")
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading visitors:", error)
      return []
    }
  }

  // Load visitors data
  const loadVisitors = () => {
    setIsLoading(true)
    const allVisitors = getAllVisitors()
    setVisitors(allVisitors)
    setFilteredVisitors(allVisitors)
    setIsLoading(false)
  }

  // Filter visitors based on search and filter type
  useEffect(() => {
    let filtered = visitors

    // Apply search filter
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

    // Apply type filter
    if (filterType !== "all") {
      switch (filterType) {
        case "active":
          filtered = filtered.filter((visitor) => visitor.isActive)
          break
        case "returning":
          filtered = filtered.filter((visitor) => visitor.pageViews > 1)
          break
        case "new":
          filtered = filtered.filter((visitor) => visitor.pageViews === 1)
          break
      }
    }

    setFilteredVisitors(filtered)
  }, [visitors, searchTerm, filterType])

  // Auto refresh functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(loadVisitors, 5000) // Refresh every 5 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [autoRefresh])

  // Load data on component mount
  useEffect(() => {
    loadVisitors()
  }, [])

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "IP",
      "Page",
      "Referrer",
      "Country",
      "City",
      "Page Views",
      "Time on Site",
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
      visitor.pageViews,
      Math.round(visitor.timeOnSite / 1000),
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
    a.click()
    URL.revokeObjectURL(url)
  }

  // Calculate stats
  const activeVisitors = visitors.filter((v) => v.isActive).length
  const totalPageViews = visitors.reduce((sum, v) => sum + v.pageViews, 0)
  const avgTimeOnSite =
    visitors.length > 0 ? Math.round(visitors.reduce((sum, v) => sum + v.timeOnSite, 0) / visitors.length / 1000) : 0

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

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Visitor Tracking</h1>
          <p className="text-gray-600">Monitor and analyze website visitors in real-time</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Now</p>
                  <p className="text-2xl font-bold text-green-600">{activeVisitors}</p>
                </div>
                <Eye className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-2xl font-bold text-purple-600">{totalPageViews}</p>
                </div>
                <MousePointer className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                  <p className="text-2xl font-bold text-orange-600">{avgTimeOnSite}s</p>
                </div>
                <RefreshCw className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search visitors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Visitors</SelectItem>
                    <SelectItem value="active">Active Now</SelectItem>
                    <SelectItem value="returning">Returning</SelectItem>
                    <SelectItem value="new">New Visitors</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={autoRefresh ? "bg-green-50 border-green-200" : ""}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
                  {autoRefresh ? "Auto Refresh On" : "Auto Refresh Off"}
                </Button>
                <Button onClick={loadVisitors} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={exportToCSV} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Visitors ({filteredVisitors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Loading visitors...</p>
              </div>
            ) : filteredVisitors.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No visitors found</h3>
                <p className="text-gray-500">
                  {visitors.length === 0
                    ? "No visitors have been tracked yet. Visitors will appear here once they visit your site."
                    : "No visitors match your current filters. Try adjusting your search or filter criteria."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Visitor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Location</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Page</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Referrer</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Activity</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.map((visitor) => (
                      <tr key={visitor.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{visitor.ip}</p>
                            <p className="text-sm text-gray-500">{formatTimeAgo(visitor.timestamp)}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-gray-900">{visitor.location?.city || "Unknown"}</p>
                            <p className="text-sm text-gray-500">{visitor.location?.country || "Unknown"}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900 truncate max-w-xs">{visitor.page}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-gray-900 truncate max-w-xs">
                            {visitor.referrer === "(direct)" ? "Direct" : visitor.referrer}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-gray-900">{visitor.pageViews} pages</p>
                            <p className="text-sm text-gray-500">{formatDuration(visitor.timeOnSite)}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
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
