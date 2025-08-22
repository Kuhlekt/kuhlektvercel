"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Search, Filter, Calendar, User, FileText, Trash2 } from "lucide-react"
import { apiDatabase } from "../utils/api-database"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
  onAuditLogUpdate: () => void
}

export function AuditLog({ auditLog, onAuditLogUpdate }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Get unique actions and users for filters
  const uniqueActions = [...new Set(auditLog.map((entry) => entry.action))].sort()
  const uniqueUsers = [...new Set(auditLog.map((entry) => entry.performedBy))].sort()

  // Filter audit log entries
  const filteredEntries = auditLog.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.articleTitle && entry.articleTitle.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesAction = actionFilter === "all" || entry.action === actionFilter
    const matchesUser = userFilter === "all" || entry.performedBy === userFilter

    return matchesSearch && matchesAction && matchesUser
  })

  const handleClearLog = async () => {
    if (!window.confirm("Are you sure you want to clear the entire audit log? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      await apiDatabase.saveData({ auditLog: [] })
      await onAuditLogUpdate()
    } catch (error) {
      console.error("Error clearing audit log:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("create")) return "default"
    if (action.includes("update") || action.includes("edit")) return "secondary"
    if (action.includes("delete")) return "destructive"
    if (action.includes("login")) return "outline"
    return "secondary"
  }

  const getActionIcon = (action: string) => {
    if (action.includes("article")) return <FileText className="h-3 w-3" />
    if (action.includes("user") || action.includes("login")) return <User className="h-3 w-3" />
    return <Activity className="h-3 w-3" />
  }

  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString()
  }

  const formatAction = (action: string): string => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium mb-2">Audit Log</h3>
          <p className="text-sm text-gray-600">Track all system activities and changes made by users.</p>
        </div>
        <Button variant="destructive" onClick={handleClearLog} disabled={isLoading || auditLog.length === 0}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Log
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map((action) => (
                    <SelectItem key={action} value={action}>
                      {formatAction(action)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
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
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter className="h-4 w-4" />
            <span>
              Showing {filteredEntries.length} of {auditLog.length} entries
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>Detailed record of all system activities and changes.</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Article</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDateTime(entry.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(entry.action)} className="flex items-center w-fit">
                        {getActionIcon(entry.action)}
                        <span className="ml-1">{formatAction(entry.action)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="font-medium">{entry.performedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="text-sm text-gray-900 line-clamp-2">{entry.details}</p>
                    </TableCell>
                    <TableCell>
                      {entry.articleTitle ? (
                        <div className="flex items-center">
                          <FileText className="h-3 w-3 mr-1 text-blue-500" />
                          <span className="text-sm truncate max-w-xs">{entry.articleTitle}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Found</h3>
              <p className="text-gray-500 mb-4">
                {auditLog.length === 0
                  ? "No activities have been logged yet."
                  : "No activities match the current filters."}
              </p>
              {searchQuery || actionFilter !== "all" || userFilter !== "all" ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setActionFilter("all")
                    setUserFilter("all")
                  }}
                >
                  Clear Filters
                </Button>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
