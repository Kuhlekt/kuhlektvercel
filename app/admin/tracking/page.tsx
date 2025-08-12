import { requireAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { logoutAdmin } from "../login/actions"
import Link from "next/link"
import { Users, Mail, TrendingUp, Calendar, Settings, LogOut, Eye, MessageSquare, Building, Tag } from "lucide-react"

export default async function AdminTrackingPage() {
  await requireAuth()

  // Mock data - in a real app, this would come from your database
  const stats = {
    totalVisitors: 1247,
    contactSubmissions: 89,
    demoRequests: 34,
    affiliateSubmissions: 12,
    conversionRate: 7.1,
    topAffiliateCode: "STARTUP50",
    recentActivity: [
      {
        type: "contact",
        name: "Sarah Johnson",
        email: "sarah@techcorp.com",
        company: "TechCorp Inc",
        affiliate: "DISCOUNT20",
        timestamp: "2 hours ago",
      },
      {
        type: "demo",
        name: "Michael Chen",
        email: "m.chen@manufacturing.com",
        company: "Chen Manufacturing",
        affiliate: null,
        timestamp: "4 hours ago",
      },
      {
        type: "contact",
        name: "Jessica Rodriguez",
        email: "j.rodriguez@healthcare.org",
        company: "Healthcare Solutions",
        affiliate: "HEALTHCARE",
        timestamp: "6 hours ago",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Monitor website activity and form submissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/change-password">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </Link>
              <form action={logoutAdmin}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisitors.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contactSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demo Requests</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.demoRequests}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Affiliate Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Affiliate Code Usage
              </CardTitle>
              <CardDescription>
                {stats.affiliateSubmissions} submissions with affiliate codes this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Top Performing Code</span>
                  <Badge variant="secondary">{stats.topAffiliateCode}</Badge>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {((stats.affiliateSubmissions / (stats.contactSubmissions + stats.demoRequests)) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Affiliate code usage rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your admin settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/admin/visitors" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  View Visitor Details
                </Button>
              </Link>
              <Link href="/admin/change-password" className="block">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest form submissions and interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {activity.type === "contact" ? (
                        <MessageSquare className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Calendar className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{activity.name}</p>
                        <Badge variant={activity.type === "contact" ? "default" : "secondary"}>
                          {activity.type === "contact" ? "Contact" : "Demo"}
                        </Badge>
                        {activity.affiliate && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {activity.affiliate}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {activity.email}
                        </span>
                        <span className="flex items-center">
                          <Building className="h-3 w-3 mr-1" />
                          {activity.company}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{activity.timestamp}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
