"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getDashboardStats, getVisitors, getFormSubmissions } from "@/app/admin/dashboard/actions"
import Link from "next/link"

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [visitors, setVisitors] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const [statsResult, visitorsResult, submissionsResult] = await Promise.all([
        getDashboardStats(),
        getVisitors(50),
        getFormSubmissions(50),
      ])

      if (statsResult.success) setStats(statsResult.data)
      if (visitorsResult.success) setVisitors(visitorsResult.data || [])
      if (submissionsResult.success) setSubmissions(submissionsResult.data || [])
    } catch (error) {
      console.error("Error loading analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  // Calculate analytics
  const deviceTypes = visitors.reduce((acc, visitor) => {
    const device = visitor.device_type || "Unknown"
    acc[device] = (acc[device] || 0) + 1
    return acc
  }, {})

  const countries = visitors.reduce((acc, visitor) => {
    const country = visitor.country || "Unknown"
    acc[country] = (acc[country] || 0) + 1
    return acc
  }, {})

  const formTypes = submissions.reduce((acc, submission) => {
    const type = submission.form_type || "Unknown"
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Detailed visitor and conversion analytics</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
          <Button onClick={loadAnalytics} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalVisitors > 0
                      ? ((stats.totalFormSubmissions / stats.totalVisitors) * 100).toFixed(1)
                      : 0}
                    %
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.totalFormSubmissions} / {stats?.totalVisitors} visitors
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats?.totalVisitors > 0 ? (stats.totalPageViews / stats.totalVisitors).toFixed(1) : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">Per visitor</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.todayVisitors || 0}</div>
                  <p className="text-xs text-muted-foreground">{stats?.todaySubmissions || 0} submissions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Affiliates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalAffiliates || 0}</div>
                  <p className="text-xs text-muted-foreground">Partners</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Visitor device breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(deviceTypes).map(([device, count]) => (
                    <div key={device} className="flex items-center justify-between">
                      <span className="font-medium">{device}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{count as number}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {(((count as number) / visitors.length) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Visitor locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(countries).map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between">
                      <span className="font-medium">{country}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{count as number}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {(((count as number) / visitors.length) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <CardTitle>Form Submissions</CardTitle>
                <CardDescription>Conversion breakdown by form type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(formTypes).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="font-medium capitalize">{type}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{count as number}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {(((count as number) / submissions.length) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
