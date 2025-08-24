"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Search } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog = [] }: AuditLogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"timestamp" | "action" | "user">("timestamp")

  const safeAuditLog = Array.isArray(auditLog) ? auditLog : []

  // Get unique actions for filter
  const uniqueActions = Array.from(new Set(safeAuditLog.map((entry) => entry.action)))

  // Filter and sort entries
  const filteredEntries = safeAuditLog
    .filter((entry) => {
      const matchesSearch =
        searchTerm === "" ||
        entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.performedBy.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesAction = filterAction === "all" || entry.action === filterAction

      return matchesSearch && matchesAction
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "timestamp":
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        case "action":
          return a.action.localeCompare(b.action)
        case "user":
          return a.performedBy.localeCompare(b.performedBy)
        default:
          return 0
      }
    })

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getActionBadge = (action: string) => {
    const actionColors = {
      user_login: "default",
      user_logout: "secondary",
      create_article: "default",
      update_article: "default",
      delete_article: "destructive",
      create_category: "default",
      update_category: "default",
      delete_category: "destructive",
      create_user: "default",
      update_user: "default",
      delete_user: "destructive",
      export_data: "secondary",
      import_data: "secondary",
      clear_all_data: "destructive",
    } as const

    const variant = actionColors[action as keyof typeof actionColors] || "outline"

    return (
      <Badge variant={variant} className="text-xs">
        {action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Activity className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <Badge variant="outline">{filteredEntries.length} entries</Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search audit log..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value: "timestamp" | "action" | "user") => setSortBy(value)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Latest First</SelectItem>
                <SelectItem value="action">Action</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardContent className="pt-6">
          {filteredEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">{formatTimestamp(entry.timestamp)}</TableCell>
                    <TableCell>{getActionBadge(entry.action)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{entry.performedBy}</div>
                      {entry.username && entry.username !== entry.performedBy && (
                        <div className="text-sm text-gray-500">({entry.username})</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">{entry.details}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No audit entries found</h3>
              <p className="text-gray-600">
                {searchTerm || filterAction !== "all"
                  ? "Try adjusting your search or filters"
                  : "System activity will appear here"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
