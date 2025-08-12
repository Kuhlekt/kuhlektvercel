"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { getVisitors, getFormSubmissions, getDashboardStats } from "@/app/admin/dashboard/actions"

interface DashboardStats {
  totalVisitors: number
  totalPageViews: number
  totalFormSubmissions: number
  totalAffiliates: number
  todayVisitors: number
  todaySubmissions: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentVisitors, setRecentVisitors] = useState<any[]>([])
  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [statsResult, visitorsResult, submissionsResult] = await Promise.all([
        getDashboardStats(),
        getVisitors(10), // Get last 10 visitors
        getFormSubmissions(10), // Get last 10 submissions
      ])

      if (statsResult.success) {
        setStats(statsResult.data)
      }

      if (visitorsResult.success) {
        setRecentVisitors(visitorsResult.data || [])
      }

      if (submissionsResult.success) {
        setRecentSubmissions(submissionsResult.data || [])
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive visitor tracking and analytics</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline">
          Refresh Data
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVisitors || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.todayVisitors || 0} today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPageViews || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Form Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalFormSubmissions || 0}</div>
            <p className="text-xs text-muted-foreground">{stats?.todaySubmissions || 0} today</p>
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

      {/* Quick Access Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Navigate to detailed views</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/visitors">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <span className="font-semibold">Visitors</span>
                <span className="text-sm text-muted-foreground">View all visitor data</span>
              </Button>
            </Link>

            <Link href="/admin/submissions">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <span className="font-semibold">Form Submissions</span>
                <span className="text-sm text-muted-foreground">Contact & demo requests</span>
              </Button>
            </Link>

            <Link href="/admin/affiliates">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <span className="font-semibold">Affiliates</span>
                <span className="text-sm text-muted-foreground">Manage affiliate codes</span>
              </Button>
            </Link>

            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
                <span className="font-semibold">Analytics</span>
                <span className="text-sm text-muted-foreground">Detailed reports</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">Recent Visitors</TabsTrigger>
          <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <CardTitle>Recent Visitors</CardTitle>
              <CardDescription>Latest visitor activity</CardDescription>
            </CardHeader>
            <CardContent>
              {recentVisitors.length === 0 ? (
                <p className="text-muted-foreground">No recent visitors found</p>
              ) : (
                <div className="space-y-4">
                  {recentVisitors.map((visitor, index) => (
                    <div key={visitor.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium">Session: {visitor.session_id?.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {visitor.page_views} page views • {visitor.country || "Unknown location"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(visitor.first_visit).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{visitor.device_type || "Unknown"}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Form Submissions</CardTitle>
              <CardDescription>Latest contact and demo requests</CardDescription>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length === 0 ? (
                <p className="text-muted-foreground">No recent submissions found</p>
              ) : (
                <div className="space-y-4">
                  {recentSubmissions.map((submission, index) => (
                    <div
                      key={submission.id || index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">
                          {submission.first_name} {submission.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{submission.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.submitted_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={submission.form_type === "contact" ? "default" : "secondary"}>
                          {submission.form_type}
                        </Badge>
                        {submission.affiliate_reference && (
                          <Badge variant="outline" className="block">
                            {submission.affiliate_reference}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
