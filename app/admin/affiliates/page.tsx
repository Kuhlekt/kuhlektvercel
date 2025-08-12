"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllAffiliates, createAffiliate, updateAffiliate, deleteAffiliate } from "@/lib/database/affiliates"
import Link from "next/link"
import { Pencil, Trash2, Plus, Eye } from "lucide-react"

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

export default function AffiliatesPage() {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingAffiliate, setEditingAffiliate] = useState<Affiliate | null>(null)
  const [formData, setFormData] = useState({
    affiliate_code: "",
    affiliate_name: "",
    email: "",
    company: "",
    description: "",
    commission_rate: 0,
    status: "active",
  })

  const loadAffiliates = async () => {
    try {
      setLoading(true)
      const result = await getAllAffiliates()
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
      affiliate.affiliate_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.affiliate_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affiliate.company?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreate = async () => {
    try {
      const result = await createAffiliate(formData)
      if (result.success) {
        setShowCreateDialog(false)
        setFormData({
          affiliate_code: "",
          affiliate_name: "",
          email: "",
          company: "",
          description: "",
          commission_rate: 0,
          status: "active",
        })
        loadAffiliates()
      }
    } catch (error) {
      console.error("Error creating affiliate:", error)
    }
  }

  const handleEdit = async () => {
    if (!editingAffiliate) return

    try {
      const result = await updateAffiliate(editingAffiliate.id, formData)
      if (result.success) {
        setShowEditDialog(false)
        setEditingAffiliate(null)
        loadAffiliates()
      }
    } catch (error) {
      console.error("Error updating affiliate:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this affiliate?")) return

    try {
      const result = await deleteAffiliate(id)
      if (result.success) {
        loadAffiliates()
      }
    } catch (error) {
      console.error("Error deleting affiliate:", error)
    }
  }

  const openEditDialog = (affiliate: Affiliate) => {
    setEditingAffiliate(affiliate)
    setFormData({
      affiliate_code: affiliate.affiliate_code,
      affiliate_name: affiliate.affiliate_name,
      email: affiliate.email || "",
      company: affiliate.company || "",
      description: affiliate.description || "",
      commission_rate: affiliate.commission_rate,
      status: affiliate.status,
    })
    setShowEditDialog(true)
  }

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
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Affiliate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Affiliate</DialogTitle>
                <DialogDescription>Add a new affiliate partner to the system</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Affiliate Code *</Label>
                    <Input
                      id="code"
                      value={formData.affiliate_code}
                      onChange={(e) => setFormData({ ...formData, affiliate_code: e.target.value })}
                      placeholder="PARTNER001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Affiliate Name *</Label>
                    <Input
                      id="name"
                      value={formData.affiliate_name}
                      onChange={(e) => setFormData({ ...formData, affiliate_name: e.target.value })}
                      placeholder="Partner Company"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@partner.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Partner Company Inc."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commission">Commission Rate (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.commission_rate}
                      onChange={(e) =>
                        setFormData({ ...formData, commission_rate: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description of the affiliate partnership..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create Affiliate</Button>
              </div>
            </DialogContent>
          </Dialog>
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
          <CardTitle>All Affiliates ({filteredAffiliates.length})</CardTitle>
          <CardDescription>Manage all affiliate partners and their details</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredAffiliates.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No affiliates found</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAffiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell className="font-mono font-medium">{affiliate.affiliate_code}</TableCell>
                      <TableCell className="font-medium">{affiliate.affiliate_name}</TableCell>
                      <TableCell>{affiliate.company || "-"}</TableCell>
                      <TableCell>{affiliate.email || "-"}</TableCell>
                      <TableCell>{affiliate.commission_rate}%</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            affiliate.status === "active"
                              ? "default"
                              : affiliate.status === "inactive"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {affiliate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(affiliate.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/affiliates/${affiliate.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(affiliate)}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(affiliate.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Affiliate</DialogTitle>
            <DialogDescription>Update affiliate partner information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Affiliate Code *</Label>
                <Input
                  id="edit-code"
                  value={formData.affiliate_code}
                  onChange={(e) => setFormData({ ...formData, affiliate_code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Affiliate Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.affiliate_name}
                  onChange={(e) => setFormData({ ...formData, affiliate_name: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-commission">Commission Rate (%)</Label>
                <Input
                  id="edit-commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formData.commission_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, commission_rate: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Update Affiliate</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
