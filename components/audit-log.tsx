"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Search, Calendar, User } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

  // Get unique actions for filter
  const uniqueActions = Array.from(new Set(auditLog.map((entry) => entry.action)))

  // Filter audit log entries
  const filteredEntries = auditLog.filter((entry) => {
    const matchesSearch =
      !searchQuery ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.details?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = actionFilter === "all" || entry.action === actionFilter

    return matchesSearch && matchesAction
  })

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("created")) return "default"
    if (action.includes("updated")) return "secondary"
    if (action.includes("deleted")) return "destructive"
    if (action.includes("login")) return "outline"
    return "secondary"
  }

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <p className="text-gray-600">Track all system activities and changes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by user or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-full sm:w-48">
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

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredEntries.length} of {auditLog.length} entries
      </div>

      {/* Audit Log Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Activity</span>
          </CardTitle>
          <CardDescription>Chronological log of all system activities</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEntries.length > 0 ? (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getActionBadgeVariant(entry.action)} className="text-xs">
                          {formatAction(entry.action)}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          <span>{entry.performedBy}</span>
                        </div>
                      </div>
                      {entry.details && <p className="text-sm text-gray-700">{entry.details}</p>}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No audit entries found</h3>
              <p className="text-gray-600">
                {searchQuery || actionFilter !== "all"
                  ? "No entries match your current filters."
                  : "System activities will appear here as they occur."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
