"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getFormSubmissions } from "@/app/admin/dashboard/actions"
import Link from "next/link"

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const result = await getFormSubmissions(100) // Get more submissions
      if (result.success) {
        setSubmissions(result.data || [])
      }
    } catch (error) {
      console.error("Error loading submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubmissions()
  }, [])

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.form_type?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Form Submissions</h1>
          <p className="text-muted-foreground">Contact and demo requests</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
          <Button onClick={loadSubmissions} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search submissions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Form Submissions ({filteredSubmissions.length})</CardTitle>
          <CardDescription>Complete list of contact and demo requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No submissions found</p>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((submission, index) => (
                <div key={submission.id || index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {submission.first_name} {submission.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{submission.email}</p>
                      {submission.phone && <p className="text-sm text-muted-foreground">{submission.phone}</p>}
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant={submission.form_type === "contact" ? "default" : "secondary"}>
                        {submission.form_type}
                      </Badge>
                      {submission.affiliate_reference && (
                        <Badge variant="outline" className="block">
                          Affiliate: {submission.affiliate_reference}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {submission.subject && (
                    <div>
                      <p className="text-sm font-medium">Subject:</p>
                      <p className="text-sm text-muted-foreground">{submission.subject}</p>
                    </div>
                  )}

                  {submission.message && (
                    <div>
                      <p className="text-sm font-medium">Message:</p>
                      <p className="text-sm text-muted-foreground">{submission.message}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Submitted: {new Date(submission.submitted_at).toLocaleString()}</span>
                    <span>Session: {submission.visitor_session_id?.slice(-8)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
