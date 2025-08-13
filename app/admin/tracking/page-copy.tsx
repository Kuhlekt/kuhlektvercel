"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Users, Eye, Globe, MousePointer } from "lucide-react"

interface TrackingData {
  totalVisitors: number
  uniqueVisitors: number
  pageViews: number
  topPages: Array<{ page: string; views: number }>
  recentActivity: Array<{
    id: string
    action: string
    page: string
    timestamp: string
    userAgent: string
  }>
}

export default function TrackingPageCopy() {
  const [trackingData, setTrackingData] = useState<TrackingData>({
    totalVisitors: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    topPages: [],
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTrackingData()
  }, [])

  const loadTrackingData = () => {
    setLoading(true)

    // Simulate loading data
    setTimeout(() => {
      setTrackingData({
        totalVisitors: 1247,
        uniqueVisitors: 892,
        pageViews: 3456,
        topPages: [
          { page: "/", views: 1234 },
          { page: "/demo", views: 567 },
          { page: "/contact", views: 345 },
          { page: "/about", views: 234 },
          { page: "/solutions", views: 189 },
        ],
        recentActivity: [
          {
            id: "1",
            action: "Page View",
            page: "/demo",
            timestamp: "2024-01-15T10:30:00Z",
            userAgent: "Mozilla/5.0...",
          },
          {
            id: "2",
            action: "Form Submit",
            page: "/contact",
            timestamp: "2024-01-15T10:25:00Z",
            userAgent: "Mozilla/5.0...",
          },
        ],
      })
      setLoading(false)
    }, 1000)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tracking Analytics</h1>
        <Button onClick={loadTrackingData} disabled={loading} size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{trackingData.totalVisitors.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{trackingData.uniqueVisitors.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{trackingData.pageViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MousePointer className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-2xl font-bold text-gray-900">23.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {index + 1}
                    </Badge>
                    <span className="font-medium">{page.page}</span>
                  </div>
                  <span className="text-gray-600">{page.views.toLocaleString()} views</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest visitor actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trackingData.recentActivity.map((activity) => (
                <div key={activity.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={activity.action === "Page View" ? "secondary" : "default"}>{activity.action}</Badge>
                    <span className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium">{activity.page}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.userAgent}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
