"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAffiliateById, getAffiliateStats } from "@/lib/database/affiliates"
import Link from "next/link"
import { ArrowLeft, Mail, Building, Calendar, Percent, Activity } from "lucide-react"
import { useParams } from "next/navigation"

interface Affiliate {
  id: string
  affiliate_code: string
  affiliate_name: string
  email?: string
  company?: string
  description?: string
  commission_rate: number
  status: string
  created_at: string
  updated_at: string
}

interface AffiliateStats {
  totalSubmissions: number
  thisMonth: number
  lastActivity: string | null
}

export default function AffiliateDetailPage() {
  const params = useParams()
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null)
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [loading, setLoading] = useState(true)

  const loadAffiliateDetails = async () => {
    if (!params.id) return

    try {
      setLoading(true)
      const [affiliateResult, statsResult] = await Promise.all([
        getAffiliateById(params.id as string),
        getAffiliateStats(params.id as string),
      ])

      if (affiliateResult.success) {
        setAffiliate(affiliateResult.data)
      }

      if (statsResult.success) {
        setStats(statsResult.data)
      }
    } catch (error) {
      console.error("Error loading affiliate details:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAffiliateDetails()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!affiliate) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Affiliate Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested affiliate could not be found.</p>
          <Link href="/admin/affiliates">
            <Button>← Back to Affiliates</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/affiliates">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Affiliates
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{affiliate.affiliate_name}</h1>
            <p className="text-muted-foreground">Affiliate Code: {affiliate.affiliate_code}</p>
          </div>
        </div>
        <Badge
          variant={
            affiliate.status === "active" ? "default" : affiliate.status === "inactive" ? "secondary" : "outline"
          }
          className="text-sm px-3 py-1"
        >
          {affiliate.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Affiliate Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Affiliate Code</label>
                <p className="font-mono text-lg font-semibold">{affiliate.affiliate_code}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg">{affiliate.affiliate_name}</p>
              </div>

              {affiliate.company && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Company</label>
                  <p>{affiliate.company}</p>
                </div>
              )}

              {affiliate.email && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${affiliate.email}`} className="text-blue-600 hover:underline">
                      {affiliate.email}
                    </a>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-muted-foreground">Commission Rate</label>
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  <span className="text-lg font-semibold">{affiliate.commission_rate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalSubmissions}</div>
                    <div className="text-sm text-muted-foreground">Total Submissions</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats.thisMonth}</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                </div>

                {stats.lastActivity && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                    <p>{new Date(stats.lastActivity).toLocaleString()}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No performance data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {affiliate.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{affiliate.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="font-medium">Created</span>
              <span className="text-muted-foreground">{new Date(affiliate.created_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-medium">Last Updated</span>
              <span className="text-muted-foreground">{new Date(affiliate.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
