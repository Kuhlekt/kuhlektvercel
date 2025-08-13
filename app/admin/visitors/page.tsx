"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
  const [activeTab, setActiveTab] = useState("current")

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

      // Load all visitors
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
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tracking data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visitor Tracking</h1>
          <p className="text-gray-600">Monitor and analyze visitor behavior</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={refreshData} variant="outline">
            🔄 Refresh
          </Button>
          <Button onClick={exportData} variant="outline">
            📥 Export
          </Button>
          <Button onClick={clearAllData} variant="destructive">
            Clear All Data
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <span className="text-2xl mr-3">👥</span>
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
              <span className="text-2xl mr-3">👁️</span>
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
              <span className="text-2xl mr-3">🎯</span>
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
              <span className="text-2xl mr-3">⏰</span>
              <div>
                <p className="text-2xl font-bold">{visitorData ? visitorData.pageViews : 0}</p>
                <p className="text-sm text-gray-600">Current Session</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {["current", "history", "all", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab === "current" && "Current Visitor"}
              {tab === "history" && "Page History"}
              {tab === "all" && "All Visitors"}
              {tab === "analytics" && "Analytics"}
            </button>
          ))}
        </div>

        {/* Current Visitor Tab */}
        {activeTab === "current" && (
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
                      <p className="text-xs text-gray-600 bg-gray-100 p-2 rounded break-all">{visitorData.userAgent}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <span className="text-6xl">👥</span>
                  <p className="text-gray-600 mt-4">No visitor data available</p>
                  <p className="text-sm text-gray-500">Visit some pages to generate tracking data</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Visitors Tab */}
        {activeTab === "all" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>All Visitors</CardTitle>
                <div className="flex items-center gap-2">
                  <span>🔍</span>
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
                  <span className="text-6xl">👥</span>
                  <p className="text-gray-600 mt-4">No visitors found</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
