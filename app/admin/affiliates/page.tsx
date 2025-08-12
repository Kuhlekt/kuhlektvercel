"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { getAffiliates } from "@/app/admin/dashboard/actions"
import Link from "next/link"

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const loadAffiliates = async () => {
    try {
      setLoading(true)
      const result = await getAffiliates()
      if (result.success) {
        setAffiliates(result.data || [])
      }
    } catch (error) {
      console.error("Error loading affiliates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAffiliates()
  }, [])

  const filteredAffiliates = affiliates.filter(
    (affiliate) =>
      affiliate.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Management</h1>
          <p className="text-muted-foreground">Manage affiliate codes and partners</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
          <Button onClick={loadAffiliates} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search affiliates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Affiliates ({filteredAffiliates.length})</CardTitle>
          <CardDescription>All registered affiliate partners</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAffiliates.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No affiliates found</p>
          ) : (
            <div className="space-y-4">
              {filteredAffiliates.map((affiliate, index) => (
                <div key={affiliate.id || index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{affiliate.name}</h3>
                      <p className="text-sm text-muted-foreground">{affiliate.email}</p>
                      {affiliate.company && <p className="text-sm text-muted-foreground">{affiliate.company}</p>}
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="default" className="font-mono">
                        {affiliate.code}
                      </Badge>
                      <Badge variant={affiliate.is_active ? "default" : "secondary"} className="block">
                        {affiliate.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  {affiliate.description && (
                    <div>
                      <p className="text-sm font-medium">Description:</p>
                      <p className="text-sm text-muted-foreground">{affiliate.description}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Created: {new Date(affiliate.created_at).toLocaleDateString()}</span>
                    <span>Commission: {affiliate.commission_rate}%</span>
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
