"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  TrendingUp,
  Eye,
  MousePointer,
  Globe,
  RefreshCw,
  Download,
  Trash2,
  Search,
  Filter,
  Calendar,
  Clock,
  ExternalLink,
  Play,
  Pause,
  AlertCircle,
} from "lucide-react"

interface Visitor {
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

interface PageHistory {
  page: string
  timestamp: string
  sessionId: string
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [pageHistory, setPageHistory] = useState<PageHistory[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<Visitor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("lastVisit")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(10) // seconds
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [dataChanged, setDataChanged] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const previousDataRef = useRef<string>("")

  // Get all visitors from localStorage
  const getAllVisitors = useCallback((): Visitor[] => {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("kuhlekt_all_visitors")
      if (stored) {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (error) {
      console.error("Error loading visitors:", error)
    }
    return []
  }, [])

  // Get page history from localStorage
  const getPageHistory = useCallback((): PageHistory[] => {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("kuhlekt_page_history")
      if (stored) {
        const parsed = JSON.parse(stored)
        return Array.isArray(parsed) ? parsed : []
      }
    } catch (error) {
      console.error("Error loading page history:", error)
    }
    return []
  }, [])

  // Load data and detect changes
  const loadData = useCallback(() => {
    setIsLoading(true)
    const allVisitors = getAllVisitors()
    const allPageHistory = getPageHistory()

    // Create a hash of the current data to detect changes
    const currentDataHash = JSON.stringify({
      visitors: allVisitors.length,
      pages: allPageHistory.length,
      lastVisitor: allVisitors[allVisitors.length - 1]?.lastVisit,
    })

    // Check if data has changed
    if (previousDataRef.current && previousDataRef.current !== currentDataHash) {
      setDataChanged(true)
      setTimeout(() => setDataChanged(false), 2000) // Clear indicator after 2 seconds
    }

    previousDataRef.current = currentDataHash

    setVisitors(allVisitors)
    setPageHistory(allPageHistory)
    setLastUpdated(new Date())
    setIsLoading(false)

    console.log("Data loaded:", {
      visitors: allVisitors.length,
      pageHistory: allPageHistory.length,
      timestamp: new Date().toISOString(),
    })
  }, [getAllVisitors, getPageHistory])

  // Setup auto-refresh
  const setupAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        loadData()
      }, refreshInterval * 1000)
    }
  }, [autoRefresh, refreshInterval, loadData])

  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh)
  }

  // Clear all data
  const clearAllData = () => {
    if (typeof window === "undefined") return

    if (confirm("Are you sure you want to clear all visitor data? This action cannot be undone.")) {
      localStorage.removeItem("kuhlekt_all_visitors")
      localStorage.removeItem("kuhlekt_page_history")
      localStorage.removeItem("kuhlekt_visitor_data")
      localStorage.removeItem("kuhlekt_visitor_id")
      sessionStorage.removeItem("kuhlekt_session_id")

      setVisitors([])
      setPageHistory([])
      setFilteredVisitors([])
      previousDataRef.current = ""

      alert("All visitor data has been cleared.")
    }
  }

  // Export data as CSV
  const exportData = () => {
    if (filteredVisitors.length === 0) {
      alert("No data to export")
      return
    }

    const csvHeaders = [
      "Visitor ID",
      "Session ID",
      "First Visit",
      "Last Visit",
      "Page Views",
      "Referrer",
      "Current Page",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "UTM Term",
      "UTM Content",
      "Affiliate",
      "User Agent",
    ]

    const csvData = filteredVisitors.map((visitor) => [
      visitor.visitorId,
      visitor.sessionId,
      visitor.firstVisit,
      visitor.lastVisit,
      visitor.pageViews,
      visitor.referrer,
      visitor.currentPage,
      visitor.utmSource || "",
      visitor.utmMedium || "",
      visitor.utmCampaign || "",
      visitor.utmTerm || "",
      visitor.utmContent || "",
      visitor.affiliate || "",
      visitor.userAgent,
    ])

    const csvContent = [csvHeaders, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-visitors-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Export page history as CSV
  const exportPageHistory = () => {
    if (pageHistory.length === 0) {
      alert("No page history to export")
      return
    }

    const csvHeaders = ["Page", "Timestamp", "Session ID"]
    const csvData = pageHistory.map((page) => [page.page, page.timestamp, page.sessionId])

    const csvContent = [csvHeaders, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-page-history-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  // Filter and sort visitors
  useEffect(() => {
    let filtered = [...visitors]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.visitorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.currentPage.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (visitor.utmSource && visitor.utmSource.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (visitor.utmCampaign && visitor.utmCampaign.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (visitor.affiliate && visitor.affiliate.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply category filter
    if (filterBy !== "all") {
      switch (filterBy) {
        case "utm":
          filtered = filtered.filter((visitor) => visitor.utmSource || visitor.utmCampaign)
          break
        case "affiliate":
          filtered = filtered.filter((visitor) => visitor.affiliate)
          break
        case "direct":
          filtered = filtered.filter((visitor) => visitor.referrer === "direct" || !visitor.referrer)
          break
        case "referral":
          filtered = filtered.filter(
            (visitor) => visitor.referrer && visitor.referrer !== "direct" && !visitor.utmSource,
          )
          break
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case "firstVisit":
          aValue = new Date(a.firstVisit).getTime()
          bValue = new Date(b.firstVisit).getTime()
          break
        case "lastVisit":
          aValue = new Date(a.lastVisit).getTime()
          bValue = new Date(b.lastVisit).getTime()
          break
        case "pageViews":
          aValue = a.pageViews
          bValue = b.pageViews
          break
        case "visitorId":
          aValue = a.visitorId
          bValue = b.visitorId
          break
        default:
          aValue = new Date(a.lastVisit).getTime()
          bValue = new Date(b.lastVisit).getTime()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredVisitors(filtered)
  }, [visitors, searchTerm, filterBy, sortBy, sortOrder])

  // Setup auto-refresh when settings change
  useEffect(() => {
    setupAutoRefresh()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [setupAutoRefresh])

  // Initial load
  useEffect(() => {
    loadData()
  }, [loadData])

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  // Get visitor session pages
  const getVisitorPages = (sessionId: string) => {
    return pageHistory.filter((page) => page.sessionId === sessionId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Visitor Tracking</h1>
              {dataChanged && (
                <div className="flex items-center gap-1 text-green-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">New Data</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportPageHistory} disabled={pageHistory.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export Pages
              </Button>
              <Button variant="outline" size="sm" onClick={exportData} disabled={filteredVisitors.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export Visitors
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllData}>
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </Button>
              <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
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

          {/* Auto-refresh Controls */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={autoRefresh} onCheckedChange={toggleAutoRefresh} />
                    <span className="text-sm font-medium">Auto Refresh</span>
                    {autoRefresh ? (
                      <div className="flex items-center gap-1">
                        <Play className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-green-600">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Pause className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-500">Paused</span>
                      </div>
                    )}
                  </div>
                  <Select
                    value={refreshInterval.toString()}
                    onValueChange={(value) => setRefreshInterval(Number.parseInt(value))}
                    disabled={!autoRefresh}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 seconds</SelectItem>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">1 minute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                  {dataChanged && <span className="ml-2 text-green-600 font-medium">• Updated</span>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visitors</SelectItem>
                <SelectItem value="utm">UTM Campaigns</SelectItem>
                <SelectItem value="affiliate">Affiliates</SelectItem>
                <SelectItem value="direct">Direct Traffic</SelectItem>
                <SelectItem value="referral">Referrals</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastVisit">Last Visit</SelectItem>
                <SelectItem value="firstVisit">First Visit</SelectItem>
                <SelectItem value="pageViews">Page Views</SelectItem>
                <SelectItem value="visitorId">Visitor ID</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                  <p className="text-2xl font-bold text-green-600">{filteredVisitors.length}</p>
                </div>
                <Filter className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Page Views</p>
                  <p className="text-2xl font-bold text-purple-600">{pageHistory.length}</p>
                </div>
                <Eye className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Sessions</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {visitors.length > 0 ? new Set(visitors.map((v) => v.sessionId)).size : 0}
                  </p>
                </div>
                <MousePointer className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visitors Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Visitor Details ({filteredVisitors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredVisitors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Visitors Found</h3>
                <p className="text-gray-500 mb-4">
                  {visitors.length === 0
                    ? "No visitor data has been collected yet. Visit the main site to generate tracking data."
                    : "No visitors match your current filters."}
                </p>
                <Button variant="outline" onClick={loadData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVisitors.map((visitor) => {
                  const visitorPages = getVisitorPages(visitor.sessionId)
                  return (
                    <div key={visitor.visitorId} className="border rounded-lg p-6 bg-white">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Visitor Info */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="font-semibold text-gray-900">Visitor ID:</h3>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                              {visitor.visitorId.slice(0, 16)}...
                            </code>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">First Visit:</span>
                              <span>{formatDate(visitor.firstVisit)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">Last Visit:</span>
                              <span>{formatDate(visitor.lastVisit)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">Page Views:</span>
                              <Badge variant="secondary">{visitor.pageViews}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">Referrer:</span>
                              <span className="truncate">{visitor.referrer}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">Current Page:</span>
                              <span className="truncate">{visitor.currentPage}</span>
                            </div>
                          </div>
                        </div>

                        {/* UTM & Affiliate Info */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Campaign Data</h4>
                          <div className="space-y-2 text-sm">
                            {visitor.utmSource && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">UTM Source:</span>
                                <Badge variant="outline">{visitor.utmSource}</Badge>
                              </div>
                            )}
                            {visitor.utmMedium && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">UTM Medium:</span>
                                <Badge variant="outline">{visitor.utmMedium}</Badge>
                              </div>
                            )}
                            {visitor.utmCampaign && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">UTM Campaign:</span>
                                <Badge variant="outline">{visitor.utmCampaign}</Badge>
                              </div>
                            )}
                            {visitor.utmTerm && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">UTM Term:</span>
                                <Badge variant="outline">{visitor.utmTerm}</Badge>
                              </div>
                            )}
                            {visitor.utmContent && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">UTM Content:</span>
                                <Badge variant="outline">{visitor.utmContent}</Badge>
                              </div>
                            )}
                            {visitor.affiliate && (
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Affiliate:</span>
                                <Badge variant="default">{visitor.affiliate}</Badge>
                              </div>
                            )}
                            {!visitor.utmSource && !visitor.utmCampaign && !visitor.affiliate && (
                              <p className="text-gray-500 italic">No campaign data</p>
                            )}
                          </div>

                          {/* Page History */}
                          {visitorPages.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-medium text-gray-900 mb-2">Page History ({visitorPages.length})</h5>
                              <div className="space-y-1 max-h-32 overflow-y-auto">
                                {visitorPages.slice(0, 5).map((page, index) => (
                                  <div key={index} className="text-xs text-gray-600 flex justify-between">
                                    <span className="truncate">{page.page}</span>
                                    <span className="ml-2 flex-shrink-0">
                                      {new Date(page.timestamp).toLocaleTimeString()}
                                    </span>
                                  </div>
                                ))}
                                {visitorPages.length > 5 && (
                                  <p className="text-xs text-gray-500 italic">+{visitorPages.length - 5} more pages</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* User Agent */}
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-start gap-2">
                          <span className="font-medium text-sm text-gray-600">User Agent:</span>
                          <span className="text-xs text-gray-500 break-all">{visitor.userAgent}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
