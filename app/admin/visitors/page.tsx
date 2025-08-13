"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Search, Filter } from "lucide-react"
import { getAllVisitors } from "@/components/visitor-tracker"

interface VisitorData {
  sessionId: string
  visitorId: string
  timestamp: string
  page: string
  userAgent: string
  referrer: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
  affiliate?: string
}

export default function VisitorsPage() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [filteredVisitors, setFilteredVisitors] = useState<VisitorData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState("all")

  useEffect(() => {
    loadVisitorData()
  }, [])

  useEffect(() => {
    filterVisitors()
  }, [visitors, searchTerm, filterBy])

  const loadVisitorData = () => {
    setLoading(true)

    try {
      const visitorData = getAllVisitors()
      setVisitors(visitorData)
    } catch (error) {
      console.error("Error loading visitor data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterVisitors = () => {
    let filtered = visitors

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (visitor) =>
          visitor.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          visitor.userAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          filtered = filtered.filter((visitor) => visitor.referrer === "direct")
          break
        case "organic":
          filtered = filtered.filter(
            (visitor) => visitor.referrer !== "direct" && !visitor.utmSource && !visitor.affiliate,
          )
          break
      }
    }

    // Sort by timestamp (most recent first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setFilteredVisitors(filtered)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getBrowserFromUserAgent = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return "Chrome"
    if (userAgent.includes("Firefox")) return "Firefox"
    if (userAgent.includes("Safari")) return "Safari"
    if (userAgent.includes("Edge")) return "Edge"
    return "Unknown"
  }

  const getTrafficSource = (visitor: VisitorData) => {
    if (visitor.affiliate) return { type: "Affiliate", value: visitor.affiliate }
    if (visitor.utmSource) return { type: "UTM", value: visitor.utmSource }
    if (visitor.referrer === "direct") return { type: "Direct", value: "Direct" }
    return { type: "Organic", value: visitor.referrer }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="divide-y">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
        <Button onClick={loadVisitorData} disabled={loading} size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search visitors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visitors</SelectItem>
                <SelectItem value="utm">UTM Traffic</SelectItem>
                <SelectItem value="affiliate">Affiliate Traffic</SelectItem>
                <SelectItem value="direct">Direct Traffic</SelectItem>
                <SelectItem value="organic">Organic Traffic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{visitors.length}</div>
            <div className="text-sm text-gray-600">Total Visitors</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{new Set(visitors.map((v) => v.visitorId)).size}</div>
            <div className="text-sm text-gray-600">Unique Visitors</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{visitors.filter((v) => v.affiliate).length}</div>
            <div className="text-sm text-gray-600">Affiliate Visits</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-900">{filteredVisitors.length}</div>
            <div className="text-sm text-gray-600">Filtered Results</div>
          </CardContent>
        </Card>
      </div>

      {/* Visitors List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Visitors ({filteredVisitors.length})
          </CardTitle>
          <CardDescription>Detailed visitor information and tracking data</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y max-h-96 overflow-y-auto">
            {filteredVisitors.length > 0 ? (
              filteredVisitors.map((visitor, index) => {
                const trafficSource = getTrafficSource(visitor)
                const browser = getBrowserFromUserAgent(visitor.userAgent)

                return (
                  <div key={`${visitor.sessionId}-${index}`} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{visitor.page}</Badge>
                          <Badge variant="secondary">{browser}</Badge>
                          <Badge
                            variant={
                              trafficSource.type === "Affiliate"
                                ? "default"
                                : trafficSource.type === "UTM"
                                  ? "destructive"
                                  : trafficSource.type === "Direct"
                                    ? "secondary"
                                    : "outline"
                            }
                          >
                            {trafficSource.type}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <strong>Visitor ID:</strong> {visitor.visitorId.slice(0, 20)}...
                          </p>
                          <p>
                            <strong>Source:</strong> {trafficSource.value}
                          </p>

                          {visitor.utmCampaign && (
                            <p>
                              <strong>UTM Campaign:</strong> {visitor.utmCampaign}
                            </p>
                          )}

                          {visitor.utmMedium && (
                            <p>
                              <strong>UTM Medium:</strong> {visitor.utmMedium}
                            </p>
                          )}

                          {visitor.utmTerm && (
                            <p>
                              <strong>UTM Term:</strong> {visitor.utmTerm}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="text-right text-sm text-gray-500">{formatTimestamp(visitor.timestamp)}</div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                {visitors.length === 0 ? (
                  <div>
                    <p className="mb-2">No visitors tracked yet</p>
                    <p className="text-sm">Visitor data will appear here once people visit your site</p>
                  </div>
                ) : (
                  <div>
                    <p className="mb-2">No visitors match your current filters</p>
                    <p className="text-sm">Try adjusting your search terms or filter settings</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
