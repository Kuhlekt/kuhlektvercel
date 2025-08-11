"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, MousePointer, Clock, Search, Download, RefreshCw, Calendar, Globe, Smartphone } from "lucide-react"

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

interface PageVisit {
  page: string
  timestamp: string
  sessionId: string
}

export default function TrackingAdminPage() {
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null)
  const [pageHistory, setPageHistory] = useState<PageVisit[]>([])
  const [allVisitors, setAllVisitors] = useState<VisitorData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTrackingData()
  }, [])

  const loadTrackingData = () => {
    setIsLoading(true)

    try {
      // Load current visitor data
      const currentVisitorStr = localStorage.getItem("kuhlekt_visitor_data")
      if (currentVisitorStr) {
        setVisitorData(JSON.parse(currentVisitorStr))
      }

      // Load page history
      const historyStr = localStorage.getItem("kuhlekt_page_history")
      if (historyStr) {
        setPageHistory(JSON.parse(historyStr))
      }

      // Load all visitors (simulate from localStorage - in real app this would be from API)
      const allVisitorsStr = localStorage.getItem("kuhlekt_all_visitors")
      if (allVisitorsStr) {
        setAllVisitors(JSON.parse(allVisitorsStr))
      } else {
        // If no stored visitors, create array with current visitor
        if (currentVisitorStr) {
          const currentVisitor = JSON.parse(currentVisitorStr)
          setAllVisitors([currentVisitor])
          localStorage.setItem("kuhlekt_all_visitors", JSON.stringify([currentVisitor]))
        }
      }
    } catch (error) {
      console.error("Error loading tracking data:", error)
    }

    setIsLoading(false)
  }

  const refreshData = () => {
    loadTrackingData()
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all tracking data? This cannot be undone.")) {
      localStorage.removeItem("kuhlekt_visitor_data")
      localStorage.removeItem("kuhlekt_page_history")
      localStorage.removeItem("kuhlekt_all_visitors")
      localStorage.removeItem("kuhlekt_visitor_id")
      sessionStorage.removeItem("kuhlekt_session_id")

      setVisitorData(null)
      setPageHistory([])
      setAllVisitors([])
    }
  }

  const exportData = () => {
    const exportData = {
      currentVisitor: visitorData,
      pageHistory: pageHistory,
      allVisitors: allVisitors,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `kuhlekt-tracking-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const filteredVisitors = allVisitors.filter(
    (visitor) =>
      visitor.visitorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.referrer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (visitor.utmSource && visitor.utmSource.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (visitor.affiliate && visitor.affiliate.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getDeviceType = (userAgent: string) => {
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return "Mobile"
    if (/Tablet/.test(userAgent)) return "Tablet"
    return "Desktop"
  }

  const getBrowser = (userAgent: string) => {
    if (userAgent.includes("Chrome")) return "Chrome"
    if (userAgent.includes("Firefox")) return "Firefox"
    if (userAgent.includes("Safari")) return "Safari"
    if (userAgent.includes("Edge")) return "Edge"
    return "Other"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
          <p className="text-gray-600">Loading tracking data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Visitor Tracking Admin</h1>
              <p className="text-gray-600">Monitor and analyze visitor behavior and tracking data</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={refreshData} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={exportData} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button onClick={clearAllData} variant="destructive">
                Clear All Data
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-cyan-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{allVisitors.length}</p>
                    <p className="text-sm text-gray-600">Total Visitors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{pageHistory.length}</p>
                    <p className="text-sm text-gray-600">Page Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MousePointer className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{allVisitors.filter((v) => v.affiliate).length}</p>
                    <p className="text-sm text-gray-600">Affiliate Visitors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{visitorData ? visitorData.pageViews : 0}</p>
                    <p className="text-sm text-gray-600">Current Session</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="current" className="space-y-6">
          <TabsList>
            <TabsTrigger value="current">Current Visitor</TabsTrigger>
            <TabsTrigger value="history">Page History</TabsTrigger>
            <TabsTrigger value="all">All Visitors</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Current Visitor Tab */}
          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle>Current Visitor Details</CardTitle>
              </CardHeader>
              <CardContent>
                {visitorData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Visitor ID</Label>
                        <p className="font-mono text-sm bg-gray-100 p-2 rounded">{visitorData.visitorId}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Session ID</Label>
                        <p className="font-mono text-sm bg-gray-100 p-2 rounded">{visitorData.sessionId}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">First Visit</Label>
                        <p className="text-sm">{new Date(visitorData.firstVisit).toLocaleString()}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Last Visit</Label>
                        <p className="text-sm">{new Date(visitorData.lastVisit).toLocaleString()}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Page Views</Label>
                        <p className="text-sm font-semibold">{visitorData.pageViews}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Current Page</Label>
                        <p className="text-sm">{visitorData.currentPage}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Referrer</Label>
                        <p className="text-sm break-all">{visitorData.referrer || "Direct"}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">Device</Label>
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          <span className="text-sm">{getDeviceType(visitorData.userAgent)}</span>
                          <Badge variant="outline">{getBrowser(visitorData.userAgent)}</Badge>
                        </div>
                      </div>

                      {visitorData.utmSource && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">UTM Source</Label>
                          <Badge className="ml-2">{visitorData.utmSource}</Badge>
                        </div>
                      )}

                      {visitorData.utmCampaign && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">UTM Campaign</Label>
                          <Badge className="ml-2">{visitorData.utmCampaign}</Badge>
                        </div>
                      )}

                      {visitorData.affiliate && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Affiliate</Label>
                          <Badge variant="secondary" className="ml-2">
                            {visitorData.affiliate}
                          </Badge>
                        </div>
                      )}

                      <div>
                        <Label className="text-sm font-medium text-gray-500">User Agent</Label>
                        <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded break-all">
                          {visitorData.userAgent}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No visitor data available</p>
                    <p className="text-sm text-gray-500">Visit some pages to generate tracking data</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Page Visit History</CardTitle>
              </CardHeader>
              <CardContent>
                {pageHistory.length > 0 ? (
                  <div className="space-y-2">
                    {pageHistory
                      .slice()
                      .reverse()
                      .map((visit, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{visit.page}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(visit.timestamp).toLocaleString()}</span>
                            <Badge variant="outline" className="text-xs">
                              {visit.sessionId.split("-")[0]}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No page history available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Visitors Tab */}
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>All Visitors</CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search visitors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredVisitors.length > 0 ? (
                  <div className="space-y-4">
                    {filteredVisitors.map((visitor, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-mono text-sm text-gray-600">{visitor.visitorId}</p>
                            <p className="text-sm text-gray-500">{new Date(visitor.firstVisit).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge>{visitor.pageViews} views</Badge>
                            {visitor.affiliate && <Badge variant="secondary">{visitor.affiliate}</Badge>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Referrer:</span>
                            <p className="truncate">{visitor.referrer || "Direct"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Device:</span>
                            <p>
                              {getDeviceType(visitor.userAgent)} - {getBrowser(visitor.userAgent)}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">UTM Source:</span>
                            <p>{visitor.utmSource || "None"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No visitors found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      allVisitors.reduce(
                        (acc, visitor) => {
                          const source =
                            visitor.referrer === ""
                              ? "Direct"
                              : visitor.referrer.includes("google")
                                ? "Google"
                                : visitor.referrer.includes("facebook")
                                  ? "Facebook"
                                  : visitor.referrer.includes("linkedin")
                                    ? "LinkedIn"
                                    : "Other"
                          acc[source] = (acc[source] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([source, count]) => (
                      <div key={source} className="flex justify-between items-center">
                        <span>{source}</span>
                        <Badge>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      allVisitors.reduce(
                        (acc, visitor) => {
                          const device = getDeviceType(visitor.userAgent)
                          acc[device] = (acc[device] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([device, count]) => (
                      <div key={device} className="flex justify-between items-center">
                        <span>{device}</span>
                        <Badge>{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
