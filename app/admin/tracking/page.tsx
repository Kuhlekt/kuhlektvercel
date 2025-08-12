import { requireAdminAuth } from "@/lib/admin-auth"
import { logoutAdmin } from "@/app/admin/login/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { LogOut, Settings, Users, Mail, BarChart3 } from "lucide-react"

export default async function AdminTrackingPage() {
  await requireAdminAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <Badge variant="secondary">Kuhlekt Analytics</Badge>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Forms</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demo Requests</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">+0.5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="visitors" className="space-y-6">
          <TabsList>
            <TabsTrigger value="visitors">Visitor Analytics</TabsTrigger>
            <TabsTrigger value="forms">Form Submissions</TabsTrigger>
            <TabsTrigger value="affiliates">Affiliate Codes</TabsTrigger>
            <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Analytics</CardTitle>
                <CardDescription>Track visitor behavior and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900">Page Views</h3>
                      <p className="text-2xl font-bold text-blue-700">5,678</p>
                      <p className="text-sm text-blue-600">This month</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900">Unique Visitors</h3>
                      <p className="text-2xl font-bold text-green-700">1,234</p>
                      <p className="text-sm text-green-600">This month</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900">Avg. Session Duration</h3>
                      <p className="text-2xl font-bold text-purple-700">4:32</p>
                      <p className="text-sm text-purple-600">Minutes</p>
                    </div>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    <p>Detailed visitor analytics charts would be displayed here</p>
                    <p className="text-sm">Integration with analytics service required</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Form Submissions</CardTitle>
                <CardDescription>Recent contact and demo form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-orange-900">Contact Forms</h3>
                      <p className="text-2xl font-bold text-orange-700">89</p>
                      <p className="text-sm text-orange-600">This month</p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-teal-900">Demo Requests</h3>
                      <p className="text-2xl font-bold text-teal-700">45</p>
                      <p className="text-sm text-teal-600">This month</p>
                    </div>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    <p>Recent form submissions would be listed here</p>
                    <p className="text-sm">Database integration required for detailed tracking</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="affiliates">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Code Usage</CardTitle>
                <CardDescription>Track affiliate code performance and usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-indigo-900">Active Codes</h3>
                      <p className="text-2xl font-bold text-indigo-700">23</p>
                      <p className="text-sm text-indigo-600">Available codes</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-pink-900">Code Usage</h3>
                      <p className="text-2xl font-bold text-pink-700">12</p>
                      <p className="text-sm text-pink-600">This month</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-yellow-900">Top Code</h3>
                      <p className="text-2xl font-bold text-yellow-700">STARTUP50</p>
                      <p className="text-sm text-yellow-600">Most used</p>
                    </div>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    <p>Detailed affiliate code analytics would be displayed here</p>
                    <p className="text-sm">Shows usage frequency, conversion rates, and performance metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="traffic">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Analyze where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-red-900">Direct</h3>
                      <p className="text-2xl font-bold text-red-700">45%</p>
                      <p className="text-sm text-red-600">556 visitors</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-blue-900">Search</h3>
                      <p className="text-2xl font-bold text-blue-700">32%</p>
                      <p className="text-sm text-blue-600">395 visitors</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-green-900">Social</h3>
                      <p className="text-2xl font-bold text-green-700">15%</p>
                      <p className="text-sm text-green-600">185 visitors</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-purple-900">Referral</h3>
                      <p className="text-2xl font-bold text-purple-700">8%</p>
                      <p className="text-sm text-purple-600">98 visitors</p>
                    </div>
                  </div>
                  <div className="text-center py-8 text-gray-500">
                    <p>Traffic source breakdown and trends would be displayed here</p>
                    <p className="text-sm">Shows detailed referrer information and UTM campaign data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
