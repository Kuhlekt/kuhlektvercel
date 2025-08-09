import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getAffiliates, getVisitors, getFormSubmissions } from "@/lib/actions"

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-muted animate-pulse rounded" />
      ))}
    </div>
  )
}

async function AffiliatesTable() {
  const affiliates = await getAffiliates()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Affiliate Records</CardTitle>
        <CardDescription>Manage your affiliate partners</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Affiliate #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Period</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {affiliates.map((affiliate) => (
              <TableRow key={affiliate.affiliate_number}>
                <TableCell className="font-mono">{affiliate.affiliate_number}</TableCell>
                <TableCell className="font-medium">{affiliate.name}</TableCell>
                <TableCell>{affiliate.company}</TableCell>
                <TableCell>{affiliate.phone}</TableCell>
                <TableCell>{affiliate.email}</TableCell>
                <TableCell>${affiliate.commission}%</TableCell>
                <TableCell>
                  <Badge variant="outline">{affiliate.period}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{affiliate.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

async function VisitorsTable() {
  const visitors = await getVisitors()

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Visitors</CardTitle>
        <CardDescription>Track all website visitors</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP Address</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Page Visited</TableHead>
              <TableHead>Referrer</TableHead>
              <TableHead>Visit Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitors.map((visitor) => (
              <TableRow key={visitor.id}>
                <TableCell className="font-mono">{visitor.ip_address}</TableCell>
                <TableCell>{visitor.country}</TableCell>
                <TableCell>{visitor.duration}s</TableCell>
                <TableCell>{visitor.page_visited}</TableCell>
                <TableCell className="max-w-xs truncate">{visitor.referrer}</TableCell>
                <TableCell>{visitor.visit_timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

async function FormSubmissionsTable() {
  const submissions = await getFormSubmissions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Submissions</CardTitle>
        <CardDescription>All contact and demo form submissions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Affiliate #</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  <Badge variant={submission.form_type === "demo" ? "default" : "secondary"}>
                    {submission.form_type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{submission.name}</TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.company}</TableCell>
                <TableCell className="font-mono">{submission.affiliate_number || "-"}</TableCell>
                <TableCell>{submission.country}</TableCell>
                <TableCell>{submission.submitted_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default function AdminDashboard() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="outline">Real-time Data</Badge>
      </div>

      <div className="grid gap-8">
        <Suspense fallback={<LoadingSkeleton />}>
          <AffiliatesTable />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <FormSubmissionsTable />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton />}>
          <VisitorsTable />
        </Suspense>
      </div>
    </div>
  )
}
