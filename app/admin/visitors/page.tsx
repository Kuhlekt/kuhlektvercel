"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, RefreshCw, Search, Users, MousePointer, Clock, TrendingUp } from "lucide-react"
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
  sessionDuration?: number
  pageViews?: number
  isActive?: boolean
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCountry, setFilterCountry] = useState("all")
  const [filterPage, setFilterPage] = useState("all")
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load visitor data
  useEffect(() => {
    const loadVisitors = () => {
      try {
        const storedVisitors = localStorage.getItem("kuhlekt_visitors")
        if (storedVisitors) {
          const parsedVisitors = JSON.parse(storedVisitors)
          setVisitors(parsedVisitors)
          setFilteredVisitors(parsedVisitors)
        }
      } catch (error) {
        console.error("Error loading visitors:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVisitors()

    // Set up real-time updates
    let interval: NodeJS.Timeout
    if (isRealTimeEnabled) {
      interval = setInterval(loadVisitors, 5000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRealTimeEnabled])

  // Filter visitors based on search and filters
  useEffect(() => {
    let filtered = visitors

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

    if (filterCountry !== "all") {
      filtered = filtered.filter((visitor) => visitor.location?.country === filterCountry)
    }

    if (filterPage !== "all") {
      filtered = filtered.filter((visitor) => visitor.page === filterPage)
    }

    setFilteredVisitors(filtered)
  }, [visitors, searchTerm, filterCountry, filterPage])

  // Calculate statistics
  const stats = {
    totalVisitors: visitors.length,
    activeVisitors: visitors.filter((v) => v.isActive).length,
    totalPageViews: visitors.reduce((sum, v) => sum + (v.pageViews || 1), 0),
    avgSessionDuration:
      visitors.length > 0
        ? Math.round(visitors.reduce((sum, v) => sum + (v.sessionDuration || 0), 0) / visitors.length)
        : 0,
  }

  // Get unique countries and pages for filters
  const uniqueCountries = Array.from(new Set(visitors.map((v) => v.location?.country).filter(Boolean)))
  const uniquePages = Array.from(new Set(visitors.map((v) => v.page)))

  const exportToCSV = () => {
    const headers = [
      "Timestamp",
      "IP Address",
      "Page",
      "Referrer",
      "Country",
      "City",
      "User Agent",
      "Session Duration",
      "Page Views",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredVisitors.map((visitor) =>
        [
          new Date(visitor.timestamp).toISOString(),
          visitor.ip,
          `"${visitor.page}"`,
          `"${visitor.referrer}"`,
          visitor.location?.country || "",
          visitor.location?.city || "",
          `"${visitor.userAgent}"`,
          visitor.sessionDuration || 0,
          visitor.pageViews || 1,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-visitors-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
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
            <p className="text-gray-600 mt-2">Monitor and analyze website visitor activity in real-time</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/tracking">
              <Button variant="outline">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics Dashboard
              </Button>
            </Link>
            <Button
              variant={isRealTimeEnabled ? "default" : "outline"}
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRealTimeEnabled ? "animate-spin" : ""}`} />
              {isRealTimeEnabled ? "Real-time On" : "Real-time Off"}
            </Button>
            <Button onClick={exportToCSV} disabled={filteredVisitors.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
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
                  <p className="text-3xl font-bold text-gray-900">{stats.totalVisitors}</p>
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
                  <p className="text-3xl font-bold text-green-600">{stats.activeVisitors}</p>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Page Views</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalPageViews}</p>
                </div>
                <MousePointer className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Session</p>
                  <p className="text-3xl font-bold text-gray-900">{formatDuration(stats.avgSessionDuration)}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by IP, page, referrer, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by country" />
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
            </div>
          </CardContent>
        </Card>

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Visitor Activity ({filteredVisitors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredVisitors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No visitors found</h3>
                <p className="text-gray-500">
                  {visitors.length === 0
                    ? "No visitor data has been collected yet. Visitors will appear here once they start browsing your site."
                    : "No visitors match your current filters. Try adjusting your search criteria."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-600">Timestamp</th>
                      <th className="text-left p-3 font-medium text-gray-600">IP Address</th>
                      <th className="text-left p-3 font-medium text-gray-600">Page</th>
                      <th className="text-left p-3 font-medium text-gray-600">Location</th>
                      <th className="text-left p-3 font-medium text-gray-600">Referrer</th>
                      <th className="text-left p-3 font-medium text-gray-600">Session</th>
                      <th className="text-left p-3 font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisitors.map((visitor) => (
                      <tr key={visitor.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-900">{new Date(visitor.timestamp).toLocaleString()}</td>
                        <td className="p-3 text-sm font-mono text-gray-900">{visitor.ip}</td>
                        <td className="p-3 text-sm text-blue-600 hover:text-blue-800">
                          <a href={visitor.page} target="_blank" rel="noopener noreferrer">
                            {visitor.page}
                          </a>
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {visitor.location?.country && visitor.location?.city
                            ? `${visitor.location.city}, ${visitor.location.country}`
                            : visitor.location?.country || "Unknown"}
                        </td>
                        <td className="p-3 text-sm text-gray-600 max-w-xs truncate">{visitor.referrer || "Direct"}</td>
                        <td className="p-3 text-sm text-gray-600">
                          <div className="flex flex-col">
                            <span>{formatDuration(visitor.sessionDuration || 0)}</span>
                            <span className="text-xs text-gray-400">{visitor.pageViews || 1} pages</span>
                          </div>
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
