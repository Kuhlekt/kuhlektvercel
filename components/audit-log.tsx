"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Search, FileText, Users, Settings, Trash2 } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  // Get unique actions and users for filters
  const uniqueActions = Array.from(new Set(auditLog.map((entry) => entry.action)))
  const uniqueUsers = Array.from(new Set(auditLog.map((entry) => entry.performedBy)))

  // Filter audit log entries
  const filteredEntries = auditLog.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = filterAction === "all" || entry.action === filterAction
    const matchesUser = filterUser === "all" || entry.performedBy === filterUser

    return matchesSearch && matchesAction && matchesUser
  })

  const getActionIcon = (action: string) => {
    if (action.includes("article")) return <FileText className="h-4 w-4" />
    if (action.includes("user")) return <Users className="h-4 w-4" />
    if (action.includes("category")) return <Settings className="h-4 w-4" />
    if (action.includes("delete")) return <Trash2 className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const getActionColor = (action: string) => {
    if (action.includes("created") || action.includes("added")) return "bg-green-100 text-green-800"
    if (action.includes("updated") || action.includes("modified")) return "bg-blue-100 text-blue-800"
    if (action.includes("deleted") || action.includes("removed")) return "bg-red-100 text-red-800"
    if (action.includes("login")) return "bg-purple-100 text-purple-800"
    return "bg-gray-100 text-gray-800"
  }

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search audit log..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full md:w-48">
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
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-full md:w-48">
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

          {/* Audit Log Entries */}
          <div className="space-y-3">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery || filterAction !== "all" || filterUser !== "all"
                  ? "No audit log entries match your filters."
                  : "No audit log entries yet."}
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-2 rounded-full ${getActionColor(entry.action)}`}>
                      {getActionIcon(entry.action)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getActionColor(entry.action)}>
                          {formatAction(entry.action)}
                        </Badge>
                        <span className="text-sm text-gray-600">by {entry.performedBy}</span>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                    {entry.details && <p className="mt-1 text-sm text-gray-700">{entry.details}</p>}
                    {entry.articleTitle && (
                      <p className="mt-1 text-xs text-gray-600">
                        Article: <span className="font-medium">{entry.articleTitle}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredEntries.length} of {auditLog.length} entries
              </span>
              <span>Total actions tracked: {auditLog.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
