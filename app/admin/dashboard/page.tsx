"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  MousePointer,
  Clock,
  Search,
  Download,
  RefreshCw,
  Mail,
  Building,
  Phone,
  User,
  TrendingUp,
  Database,
  CheckCircle,
  XCircle,
} from "lucide-react"

interface DatabaseVisitor {
  id: string
  session_id: string
  ip_address: string
  user_agent: string
  referrer: string
  landing_page: string
  country: string
  city: string
  device_type: string
  browser: string
  os: string
  first_visit: string
  last_visit: string
  page_views: number
  session_duration: number
  created_at: string
  updated_at: string
}

interface DatabaseAffiliate {
  id: string
  affiliate_code: string
  affiliate_name: string
  email: string
  phone: string
  company: string
  commission_rate: number
  status: string
  notes: string
  created_at: string
  updated_at: string
}

interface DatabaseFormSubmission {
  id: string
  visitor_id: string
  affiliate_id: string
  form_type: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  message: string
  subject: string
  affiliate_reference: string
  source_page: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_content: string
  ip_address: string
  user_agent: string
  status: string
  submitted_at: string
  created_at: string
  updated_at: string
  visitors?: DatabaseVisitor
  affiliates?: DatabaseAffiliate
}

export default function AdminDashboardPage() {
  const [visitors, setVisitors] = useState<DatabaseVisitor[]>([])
  const [affiliates, setAffiliates] = useState<DatabaseAffiliate[]>([])
  const [formSubmissions, setFormSubmissions] = useState<DatabaseFormSubmission[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [formTypeFilter, setFormTypeFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // In a real implementation, these would be API calls to your database
      // For now, we'll simulate the data structure
      console.log("Loading dashboard data from database...")

      // Simulate API calls
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data - in real app this would come from your database API
      setVisitors([])
      setAffiliates([])
      setFormSubmissions([])
    } catch (err) {
      console.error("Error loading dashboard data:", err)
      setError("Failed to load dashboard data. Please check your database connection.")
    }

    setIsLoading(false)
  }

  const refreshData = () => {
    loadDashboardData()
  }

  const exportData = () => {
    const exportData = {
      visitors,
      affiliates,
      formSubmissions,
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `kuhlekt-dashboard-data-${new Date().toISOString().split("T")[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  const filteredSubmissions = formSubmissions.filter((submission) => {
    const matchesSearch =
      submission.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.affiliate_reference?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    const matchesFormType = formTypeFilter === "all" || submission.form_type === formTypeFilter

    return matchesSearch && matchesStatus && matchesFormType
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      new: { variant: "default" as const, icon: Clock },
      contacted: { variant: "secondary" as const, icon: Phone },
      qualified: { variant: "default" as const, icon: CheckCircle },
      converted: { variant: "default" as const, icon: TrendingUp },
      closed: { variant: "outline" as const, icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-500" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Database className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={refreshData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
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
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Monitor visitors, affiliates, and form submissions</p>
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
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-cyan-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{visitors.length}</p>
                    <p className="text-sm text-gray-600">Total Visitors</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Mail className="w-8 h-8 text-green-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{formSubmissions.length}</p>
                    <p className="text-sm text-gray-600">Form Submissions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MousePointer className="w-8 h-8 text-blue-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">{affiliates.filter((a) => a.status === "active").length}</p>
                    <p className="text-sm text-gray-600">Active Affiliates</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
                  <div>
                    <p className="text-2xl font-bold">
                      {formSubmissions.filter((s) => s.status === "converted").length}
                    </p>
                    <p className="text-sm text-gray-600">Conversions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="submissions">Form Submissions</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Form Submissions Tab */}
          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <CardTitle>Form Submissions</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-500" />
                      <Input
                        placeholder="Search submissions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={formTypeFilter} onValueChange={setFormTypeFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Forms</SelectItem>
                        <SelectItem value="contact">Contact</SelectItem>
                        <SelectItem value="demo">Demo</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredSubmissions.map((submission) => (
                      <div key={submission.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-semibold">
                                {submission.first_name} {submission.last_name}
                              </span>
                              <Badge variant="outline">{submission.form_type}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{submission.email}</span>
                              {submission.company && (
                                <>
                                  <Building className="w-4 h-4 ml-2" />
                                  <span>{submission.company}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {getStatusBadge(submission.status)}
                            <span className="text-xs text-gray-500">
                              {new Date(submission.submitted_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {submission.message && (
                          <div className="mb-3">
                            <Label className="text-sm font-medium text-gray-500">Message</Label>
                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{submission.message}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Source:</span>
                            <p className="truncate">{submission.utm_source || "Direct"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Campaign:</span>
                            <p className="truncate">{submission.utm_campaign || "None"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Affiliate:</span>
                            <p className="truncate">
                              {submission.affiliate_reference || "None"}
                              {submission.affiliates && (
                                <Badge variant="secondary" className="ml-1 text-xs">
                                  {submission.affiliates.affiliate_name}
                                </Badge>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No form submissions found</p>
                    <p className="text-sm text-gray-500">Submissions will appear here once forms are filled out</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visitors Tab */}
          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>Website Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                {visitors.length > 0 ? (
                  <div className="space-y-4">
                    {visitors.map((visitor) => (
                      <div key={visitor.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-mono text-sm text-gray-600">{visitor.session_id}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(visitor.first_visit).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Badge>{visitor.page_views} views</Badge>
                            {visitor.country && <Badge variant="outline">{visitor.country}</Badge>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Landing Page:</span>
                            <p className="truncate">{visitor.landing_page || "Unknown"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Referrer:</span>
                            <p className="truncate">{visitor.referrer || "Direct"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Device:</span>
                            <p>
                              {visitor.device_type} - {visitor.browser}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <p>
                              {visitor.city}, {visitor.country}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No visitors tracked yet</p>
                    <p className="text-sm text-gray-500">Visitor data will appear here once tracking is active</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Affiliates Tab */}
          <TabsContent value="affiliates">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Partners</CardTitle>
              </CardHeader>
              <CardContent>
                {affiliates.length > 0 ? (
                  <div className="space-y-4">
                    {affiliates.map((affiliate) => (
                      <div key={affiliate.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{affiliate.affiliate_name}</span>
                              <Badge variant={affiliate.status === "active" ? "default" : "secondary"}>
                                {affiliate.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">Code: {affiliate.affiliate_code}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">{affiliate.commission_rate}% commission</p>
                            <p className="text-xs text-gray-500">
                              {new Date(affiliate.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Email:</span>
                            <p>{affiliate.email || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Company:</span>
                            <p>{affiliate.company || "Not provided"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Phone:</span>
                            <p>{affiliate.phone || "Not provided"}</p>
                          </div>
                        </div>

                        {affiliate.notes && (
                          <div className="mt-3">
                            <span className="text-gray-500 text-sm">Notes:</span>
                            <p className="text-sm bg-gray-50 p-2 rounded mt-1">{affiliate.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MousePointer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No affiliates registered</p>
                    <p className="text-sm text-gray-500">Affiliate partners will appear here once registered</p>
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
                  <CardTitle>Form Conversion Rates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["contact", "demo", "newsletter", "support"].map((formType) => {
                      const total = formSubmissions.filter((s) => s.form_type === formType).length
                      const converted = formSubmissions.filter(
                        (s) => s.form_type === formType && s.status === "converted",
                      ).length
                      const rate = total > 0 ? ((converted / total) * 100).toFixed(1) : "0.0"

                      return (
                        <div key={formType} className="flex justify-between items-center">
                          <span className="capitalize">{formType}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                              {converted}/{total}
                            </span>
                            <Badge>{rate}%</Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Affiliates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      formSubmissions
                        .filter((s) => s.affiliate_reference)
                        .reduce(
                          (acc, submission) => {
                            const code = submission.affiliate_reference!
                            acc[code] = (acc[code] || 0) + 1
                            return acc
                          },
                          {} as Record<string, number>,
                        ),
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([code, count]) => (
                        <div key={code} className="flex justify-between items-center">
                          <span>{code}</span>
                          <Badge>{count} referrals</Badge>
                        </div>
                      ))}
                    {formSubmissions.filter((s) => s.affiliate_reference).length === 0 && (
                      <p className="text-gray-500 text-sm">No affiliate referrals yet</p>
                    )}
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
