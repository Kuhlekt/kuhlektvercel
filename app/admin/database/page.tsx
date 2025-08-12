"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  FileText,
  Eye,
  UserCheck,
  RefreshCw,
  Search,
  Calendar,
  Globe,
  Mail,
  Building,
  Phone,
} from "lucide-react"
import {
  getDashboardStats,
  getVisitorsData,
  getFormSubmissions,
  getAllActiveAffiliates,
  getPageViewsData,
} from "./actions"

interface DashboardStats {
  totalVisitors: number
  totalSubmissions: number
  totalPageViews: number
  activeAffiliates: number
  recentVisitors: number
  recentSubmissions: number
}

export default function DatabaseAdminPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [visitors, setVisitors] = useState<any[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [pageViews, setPageViews] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load dashboard stats
      const statsResult = await getDashboardStats()
      if (statsResult.success) {
        setStats(statsResult.data)
      }

      // Load visitors
      const visitorsResult = await getVisitorsData(100, 0)
      if (visitorsResult.success) {
        setVisitors(visitorsResult.data || [])
      }

      // Load form submissions
      const submissionsResult = await getFormSubmissions(100, 0)
      if (submissionsResult.success) {
        setSubmissions(submissionsResult.data || [])
      }

      // Load affiliates
      const affiliatesResult = await getAllActiveAffiliates()
      if (affiliatesResult.success) {
        setAffiliates(affiliatesResult.data || [])
      }

      // Load page views
      const pageViewsResult = await getPageViewsData(undefined, 100)
      if (pageViewsResult.success) {
        setPageViews(pageViewsResult.data || [])
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
    setIsLoading(false)
  }

  const getDeviceType = (userAgent: string) => {
    if (!userAgent) return "Unknown"
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) return "Mobile"
    if (/Tablet/.test(userAgent)) return "Tablet"
    return "Desktop"
  }

  const getBrowser = (userAgent: string) => {
    if (!userAgent) return "Unknown"
    if (userAgent.includes("Chrome")) return "Chrome"
    if (userAgent.includes("Firefox")) return "Firefox"
    if (userAgent.includes("Safari")) return "Safari"
    if (userAgent.includes("Edge")) return "Edge"
    return "Other"
  }

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.affiliate_reference?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredVisitors = visitors.filter(
    (visitor) =>
      visitor.session_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.referrer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      visitor.landing_page?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
          <p className="text-gray-600">Loading database data...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Database Admin</h1>
              <p className="text-gray-600">Manage visitor tracking, form submissions, and affiliates</p>
            </div>
            <Button onClick={loadData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Quick Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-cyan-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalVisitors}</p>
                      <p className="text-sm text-gray-600">Total Visitors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                      <p className="text-sm text-gray-600">Form Submissions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Eye className="w-8 h-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{stats.totalPageViews}</p>
                      <p className="text-sm text-gray-600">Page Views</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <UserCheck className="w-8 h-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{stats.activeAffiliates}</p>
                      <p className="text-sm text-gray-600">Active Affiliates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{stats.recentVisitors}</p>
                      <p className="text-sm text-gray-600">Recent Visitors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Mail className="w-8 h-8 text-red-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{stats.recentSubmissions}</p>
                      <p className="text-sm text-gray-600">Recent Submissions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="submissions">Form Submissions</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="pageviews">Page Views</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Form Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {submissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">
                            {submission.first_name} {submission.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{submission.email}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {submission.form_type}
                          </Badge>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {visitors.slice(0, 5).map((visitor) => (
                      <div key={visitor.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-mono text-sm">{visitor.session_id.split("-")[0]}...</p>
                          <p className="text-sm text-gray-600">{visitor.landing_page || "Direct"}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {visitor.page_views} views
                          </Badge>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          {new Date(visitor.first_visit).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Form Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Form Submissions</CardTitle>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredSubmissions.map((submission) => (
                    <div key={submission.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">
                            {submission.first_name} {submission.last_name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">{submission.email}</span>
                          </div>
                          {submission.company && (
                            <div className="flex items-center gap-2 mt-1">
                              <Building className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{submission.company}</span>
                            </div>
                          )}
                          {submission.phone && (
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{submission.phone}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge>{submission.form_type}</Badge>
                          {submission.affiliates && (
                            <Badge variant="secondary">{submission.affiliates.affiliate_code}</Badge>
                          )}
                          <span className="text-sm text-gray-500">
                            {new Date(submission.submitted_at).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {submission.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm">{submission.message}</p>
                        </div>
                      )}

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Source:</span> {submission.utm_source || "Direct"}
                        </div>
                        <div>
                          <span className="font-medium">Campaign:</span> {submission.utm_campaign || "None"}
                        </div>
                        <div>
                          <span className="font-medium">IP:</span> {submission.ip_address || "Unknown"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visitors Tab */}
          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Visitors</CardTitle>
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
                <div className="space-y-4">
                  {filteredVisitors.map((visitor) => (
                    <div key={visitor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-mono text-sm text-gray-600">{visitor.session_id}</p>
                          <p className="text-sm text-gray-500">
                            First visit: {new Date(visitor.first_visit).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Last visit: {new Date(visitor.last_visit).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge>{visitor.page_views} views</Badge>
                          <Badge variant="outline">{getDeviceType(visitor.user_agent)}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Landing Page:</span>
                          <p className="truncate">{visitor.landing_page || "Direct"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Referrer:</span>
                          <p className="truncate">{visitor.referrer || "Direct"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Browser:</span>
                          <p>{getBrowser(visitor.user_agent)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates">
            <Card>
              <CardHeader>
                <CardTitle>Active Affiliates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {affiliates.map((affiliate) => (
                    <div key={affiliate.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{affiliate.affiliate_name}</h3>
                          <p className="text-sm text-gray-600 font-mono">{affiliate.affiliate_code}</p>
                          {affiliate.email && <p className="text-sm text-gray-500">{affiliate.email}</p>}
                          {affiliate.company && <p className="text-sm text-gray-500">{affiliate.company}</p>}
                        </div>
                        <div className="text-right">
                          <Badge variant={affiliate.status === "active" ? "default" : "secondary"}>
                            {affiliate.status}
                          </Badge>
                          {affiliate.commission_rate && (
                            <p className="text-sm text-gray-500 mt-1">{affiliate.commission_rate}% commission</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Page Views Tab */}
          <TabsContent value="pageviews">
            <Card>
              <CardHeader>
                <CardTitle>Recent Page Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {pageViews.map((view) => (
                    <div key={view.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <div>
                          <span className="font-medium">{view.page_url}</span>
                          {view.page_title && <p className="text-sm text-gray-600">{view.page_title}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(view.viewed_at).toLocaleString()}</span>
                        {view.visitors && (
                          <Badge variant="outline" className="text-xs">
                            {view.visitors.session_id.split("-")[0]}...
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
