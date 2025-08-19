"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Calendar, User, FileText, Settings, Trash2, Edit, Plus, Eye } from "lucide-react"
import type { AuditLogEntry } from "@/types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all")

  const uniqueUsers = Array.from(new Set(auditLog.map((entry) => entry.user)))
  const uniqueActions = Array.from(new Set(auditLog.map((entry) => entry.action.split(" ")[0])))

  const filteredLog = auditLog
    .filter((entry) => {
      const matchesSearch =
        entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.details && entry.details.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesAction = actionFilter === "all" || entry.action.toLowerCase().includes(actionFilter.toLowerCase())
      const matchesUser = userFilter === "all" || entry.user === userFilter

      return matchesSearch && matchesAction && matchesUser
    })
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const getActionIcon = (action: string) => {
    if (action.includes("Created") || action.includes("Added")) return <Plus className="h-4 w-4 text-green-600" />
    if (action.includes("Updated") || action.includes("Modified")) return <Edit className="h-4 w-4 text-blue-600" />
    if (action.includes("Deleted") || action.includes("Removed")) return <Trash2 className="h-4 w-4 text-red-600" />
    if (action.includes("Viewed") || action.includes("Accessed")) return <Eye className="h-4 w-4 text-gray-600" />
    if (action.includes("Login") || action.includes("Logout")) return <User className="h-4 w-4 text-purple-600" />
    return <FileText className="h-4 w-4 text-gray-600" />
  }

  const getActionBadge = (action: string) => {
    if (action.includes("Created") || action.includes("Added")) return "default"
    if (action.includes("Updated") || action.includes("Modified")) return "secondary"
    if (action.includes("Deleted") || action.includes("Removed")) return "destructive"
    return "outline"
  }

  const exportLog = () => {
    const csvContent = [
      ["Timestamp", "User", "Action", "Details"].join(","),
      ...filteredLog.map((entry) =>
        [new Date(entry.timestamp).toISOString(), entry.user, `"${entry.action}"`, `"${entry.details || ""}"`].join(
          ",",
        ),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Log</h2>
          <p className="text-muted-foreground">Track all activities and changes in your knowledge base</p>
        </div>
        <Button onClick={exportLog} variant="outline" className="flex items-center gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Log
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLog.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueUsers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                auditLog.filter((entry) => new Date(entry.timestamp).toDateString() === new Date().toDateString())
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                auditLog.filter((entry) => {
                  const entryDate = new Date(entry.timestamp)
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return entryDate >= weekAgo
                }).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Activity Log
          </CardTitle>
          <CardDescription>View and filter all system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center space-x-2 flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action.toLowerCase()}>
                    {action}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Activity Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(entry.action)}
                      <Badge variant={getActionBadge(entry.action) as any}>{entry.action}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {entry.user}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{entry.details || "No additional details"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(entry.timestamp).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLog.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No activities found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
