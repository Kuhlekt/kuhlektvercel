import { requireAdminAuth } from "@/lib/admin-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { logoutAdmin } from "../login/actions"

export default async function AdminTrackingPage() {
  await requireAdminAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor website activity and user interactions</p>
          </div>
          <form action={logoutAdmin}>
            <Button variant="outline" type="submit">
              Logout
            </Button>
          </form>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="forms">Form Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Visitors</CardTitle>
                  <CardDescription>Unique visitors today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">247</div>
                  <Badge variant="secondary" className="mt-2">
                    +12% from yesterday
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demo Requests</CardTitle>
                  <CardDescription>New demo requests today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">18</div>
                  <Badge variant="secondary" className="mt-2">
                    +5 from yesterday
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Forms</CardTitle>
                  <CardDescription>Contact submissions today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12</div>
                  <Badge variant="secondary" className="mt-2">
                    +3 from yesterday
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Demo request from john@company.com</p>
                      <p className="text-sm text-gray-600">2 minutes ago</p>
                    </div>
                    <Badge>Demo</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">Contact form from sarah@startup.io</p>
                      <p className="text-sm text-gray-600">15 minutes ago</p>
                    </div>
                    <Badge variant="secondary">Contact</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">New visitor from San Francisco</p>
                      <p className="text-sm text-gray-600">23 minutes ago</p>
                    </div>
                    <Badge variant="outline">Visitor</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visitors">
            <Card>
              <CardHeader>
                <CardTitle>Visitor Analytics</CardTitle>
                <CardDescription>Detailed visitor information and tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Visitor tracking data would be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms">
            <Card>
              <CardHeader>
                <CardTitle>Form Submissions</CardTitle>
                <CardDescription>All contact and demo form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Form submission data would be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
