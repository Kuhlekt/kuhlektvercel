"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Filter, Calendar, User, FileText, FolderOpen, Activity, Trash2 } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function AuditLog({ auditLog, onAuditLogUpdate }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  const getActionIcon = (action: string) => {
    if (action.includes("user")) return <User className="h-4 w-4 text-blue-500" />
    if (action.includes("article")) return <FileText className="h-4 w-4 text-green-500" />
    if (action.includes("category")) return <FolderOpen className="h-4 w-4 text-purple-500" />
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getActionColor = (action: string) => {
    if (action.includes("created")) return "bg-green-100 text-green-800"
    if (action.includes("updated")) return "bg-blue-100 text-blue-800"
    if (action.includes("deleted")) return "bg-red-100 text-red-800"
    if (action.includes("login")) return "bg-purple-100 text-purple-800"
    return "bg-gray-100 text-gray-800"
  }

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = filterAction === "all" || entry.action === filterAction
    const matchesUser = filterUser === "all" || entry.performedBy === filterUser

    return matchesSearch && matchesAction && matchesUser
  })

  const uniqueActions = [...new Set(auditLog.map((entry) => entry.action))]
  const uniqueUsers = [...new Set(auditLog.map((entry) => entry.performedBy))]

  const exportAuditLog = () => {
    const csvContent = [
      ["Timestamp", "Action", "Entity Type", "Entity ID", "Performed By", "Details"].join(","),
      ...filteredLog.map((entry) =>
        [
          new Date(entry.timestamp).toISOString(),
          entry.action,
          entry.entityType,
          entry.entityId,
          entry.performedBy,
          `"${entry.details.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `audit-log-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const clearAuditLog = () => {
    if (window.confirm("Are you sure you want to clear the entire audit log? This action cannot be undone.")) {
      onAuditLogUpdate([])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h3 className="text-lg font-semibold">Audit Log ({filteredLog.length} entries)</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportAuditLog} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={clearAuditLog}
            size="sm"
            className="text-red-600 hover:text-red-700 bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Log
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Filter className="h-4 w-4" />
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
                  placeholder="Search details or user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Action</label>
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger>
                  <SelectValue />
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
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">User</label>
              <Select value={filterUser} onValueChange={setFilterUser}>
                <SelectTrigger>
                  <SelectValue />
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
        </CardContent>
      </Card>

      {/* Audit Log Entries */}
      <div className="space-y-3">
        {filteredLog.length > 0 ? (
          filteredLog.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{getActionIcon(entry.action)}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge className={getActionColor(entry.action)}>
                          {entry.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                        <span className="text-sm text-gray-500">by {entry.performedBy}</span>
                      </div>
                      <p className="text-sm font-medium">{entry.details}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                        <span>Entity: {entry.entityType}</span>
                        <span>ID: {entry.entityId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">
                {searchQuery || filterAction !== "all" || filterUser !== "all"
                  ? "No audit entries match your filters"
                  : "No audit entries yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
