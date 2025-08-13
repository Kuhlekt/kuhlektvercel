"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Users, Eye, Globe, MousePointer } from "lucide-react"
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

export default function TrackingPage() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVisitorData()
  }, [])

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

  const getUniqueVisitors = () => {
    const uniqueVisitorIds = new Set(visitors.map((v) => v.visitorId))
    return uniqueVisitorIds.size
  }

  const getTopPages = () => {
    const pageCounts: { [key: string]: number } = {}
    visitors.forEach((visitor) => {
      pageCounts[visitor.page] = (pageCounts[visitor.page] || 0) + 1
    })

    return Object.entries(pageCounts)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5)
  }

  const getUTMCampaigns = () => {
    const campaignCounts: { [key: string]: number } = {}
    visitors.forEach((visitor) => {
      if (visitor.utmCampaign) {
        campaignCounts[visitor.utmCampaign] = (campaignCounts[visitor.utmCampaign] || 0) + 1
      }
    })

    return Object.entries(campaignCounts)
      .map(([campaign, count]) => ({ campaign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const getAffiliateData = () => {
    const affiliateCounts: { [key: string]: number } = {}
    visitors.forEach((visitor) => {
      if (visitor.affiliate) {
        affiliateCounts[visitor.affiliate] = (affiliateCounts[visitor.affiliate] || 0) + 1
      }
    })

    return Object.entries(affiliateCounts)
      .map(([affiliate, count]) => ({ affiliate, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

  const topPages = getTopPages()
  const utmCampaigns = getUTMCampaigns()
  const affiliateData = getAffiliateData()

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tracking Analytics</h1>
        <Button onClick={loadVisitorData} disabled={loading} size="sm">
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
                <p className="text-sm font-medium text-gray-600">Total Visits</p>
                <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
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
                <p className="text-2xl font-bold text-gray-900">{getUniqueVisitors()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">UTM Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{utmCampaigns.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MousePointer className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Affiliates</p>
                <p className="text-2xl font-bold text-gray-900">{affiliateData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages on your site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.length > 0 ? (
                topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{page.page}</span>
                    </div>
                    <span className="text-gray-600">{page.views} visits</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No page data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* UTM Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>UTM Campaigns</CardTitle>
            <CardDescription>Traffic from marketing campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {utmCampaigns.length > 0 ? (
                utmCampaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-2">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{campaign.campaign}</span>
                    </div>
                    <span className="text-gray-600">{campaign.count} visits</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No UTM campaign data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Affiliate Data */}
        <Card>
          <CardHeader>
            <CardTitle>Affiliate Traffic</CardTitle>
            <CardDescription>Visitors from affiliate partners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {affiliateData.length > 0 ? (
                affiliateData.map((affiliate, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Badge variant="default" className="mr-2">
                        {index + 1}
                      </Badge>
                      <span className="font-medium">{affiliate.affiliate}</span>
                    </div>
                    <span className="text-gray-600">{affiliate.count} visits</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No affiliate data available</p>
              )}
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
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {visitors.length > 0 ? (
                visitors
                  .slice()
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 10)
                  .map((visitor, index) => (
                    <div key={`${visitor.sessionId}-${index}`} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">Page View</Badge>
                        <span className="text-sm text-gray-500">{formatTimestamp(visitor.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-900 font-medium">{visitor.page}</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>Referrer: {visitor.referrer}</p>
                        {visitor.utmSource && <p>UTM Source: {visitor.utmSource}</p>}
                        {visitor.utmCampaign && <p>UTM Campaign: {visitor.utmCampaign}</p>}
                        {visitor.affiliate && <p>Affiliate: {visitor.affiliate}</p>}
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
