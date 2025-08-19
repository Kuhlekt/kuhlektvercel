"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Search, Filter, Calendar, User, FileText, Database, Trash2, Download } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function AuditLog({ auditLog, onAuditLogUpdate }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const getActionIcon = (action: string) => {
    if (action.includes("article")) return <FileText className="h-4 w-4" />
    if (action.includes("user")) return <User className="h-4 w-4" />
    if (action.includes("category")) return <Database className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const getActionColor = (action: string) => {
    if (action.includes("created")) return "text-green-600"
    if (action.includes("updated")) return "text-blue-600"
    if (action.includes("deleted")) return "text-red-600"
    return "text-gray-600"
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("created")) return "default"
    if (action.includes("updated")) return "secondary"
    if (action.includes("deleted")) return "destructive"
    return "outline"
  }

  const filteredEntries = auditLog.filter((entry) => {
    const matchesSearch =
      entry.details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = actionFilter === "all" || entry.action.includes(actionFilter)

    const matchesDate = (() => {
      if (dateFilter === "all") return true
      const entryDate = new Date(entry.timestamp)
      const now = new Date()

      switch (dateFilter) {
        case "today":
          return entryDate.toDateString() === now.toDateString()
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return entryDate >= weekAgo
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return entryDate >= monthAgo
        default:
          return true
      }
    })()

    return matchesSearch && matchesAction && matchesDate
  })

  const handleExportLog = () => {
    const exportData = {
      auditLog: filteredEntries,
      exportedAt: new Date().toISOString(),
      totalEntries: filteredEntries.length,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClearLog = () => {
    if (!window.confirm("Are you sure you want to clear the entire audit log? This cannot be undone!")) {
      return
    }
    onAuditLogUpdate([])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Audit Log</h3>
          <p className="text-gray-600">Track all system activities and changes</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportLog}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleClearLog} className="text-red-600 bg-transparent">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Log
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="article">Article Actions</SelectItem>
                  <SelectItem value="user">User Actions</SelectItem>
                  <SelectItem value="category">Category Actions</SelectItem>
                  <SelectItem value="created">Created</SelectItem>
                  <SelectItem value="updated">Updated</SelectItem>
                  <SelectItem value="deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Period</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredEntries.length} of {auditLog.length} entries
        </p>
        <Badge variant="outline">
          <Activity className="h-3 w-3 mr-1" />
          {filteredEntries.length} activities
        </Badge>
      </div>

      {/* Audit Entries */}
      <div className="space-y-3">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 ${getActionColor(entry.action)}`}>{getActionIcon(entry.action)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant={getActionBadgeVariant(entry.action)} className="text-xs">
                          {entry.action.replace(/_/g, " ").toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-500">by {entry.performedBy}</span>
                      </div>
                      <p className="text-sm font-medium">{entry.details || entry.action}</p>
                      {entry.articleTitle && (
                        <p className="text-xs text-gray-500 mt-1">Article: {entry.articleTitle}</p>
                      )}
                      {entry.categoryName && (
                        <p className="text-xs text-gray-500 mt-1">Category: {entry.categoryName}</p>
                      )}
                      {entry.username && <p className="text-xs text-gray-500 mt-1">User: {entry.username}</p>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{entry.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No audit entries found</p>
            <p className="text-sm text-gray-500 mt-1">
              {searchQuery || actionFilter !== "all" || dateFilter !== "all"
                ? "Try adjusting your filters"
                : "System activities will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
