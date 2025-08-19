"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, Search, Download, Trash2, Filter, Calendar, User, CheckCircle, AlertTriangle } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function AuditLog({ auditLog, onAuditLogUpdate }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterEntityType, setFilterEntityType] = useState("all")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  const filteredLogs = auditLog.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = filterAction === "all" || entry.action === filterAction
    const matchesEntityType = filterEntityType === "all" || entry.entityType === filterEntityType

    return matchesSearch && matchesAction && matchesEntityType
  })

  const handleExportLogs = () => {
    try {
      const data = {
        auditLog: filteredLogs,
        exportDate: new Date().toISOString(),
        totalEntries: filteredLogs.length,
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit-log-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showMessage("success", "Audit log exported successfully!")
    } catch (error) {
      showMessage("error", "Failed to export audit log")
    }
  }

  const handleClearLogs = () => {
    if (!window.confirm("Are you sure you want to clear all audit log entries? This action cannot be undone.")) {
      return
    }

    onAuditLogUpdate([])
    showMessage("success", "Audit log cleared successfully!")
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("created")) return "default"
    if (action.includes("updated")) return "secondary"
    if (action.includes("deleted")) return "destructive"
    if (action.includes("login")) return "outline"
    return "outline"
  }

  const getEntityTypeBadgeVariant = (entityType: string) => {
    switch (entityType) {
      case "user":
        return "default"
      case "article":
        return "secondary"
      case "category":
        return "outline"
      case "system":
        return "destructive"
      default:
        return "outline"
    }
  }

  const uniqueActions = [...new Set(auditLog.map((entry) => entry.action))].sort()
  const uniqueEntityTypes = [...new Set(auditLog.map((entry) => entry.entityType))].sort()

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Audit Log ({filteredLogs.length} entries)</span>
            </CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleExportLogs} disabled={filteredLogs.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="destructive" onClick={handleClearLogs} disabled={auditLog.length === 0}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterEntityType} onValueChange={setFilterEntityType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {uniqueEntityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterAction("all")
                setFilterEntityType("all")
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>

          {/* Log Entries */}
          <div className="space-y-3">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((entry) => (
                <div key={entry.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getActionBadgeVariant(entry.action)}>{entry.action.replace("_", " ")}</Badge>
                        <Badge variant={getEntityTypeBadgeVariant(entry.entityType)}>{entry.entityType}</Badge>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{entry.details}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{entry.performedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No audit log entries found</p>
                {(searchQuery || filterAction !== "all" || filterEntityType !== "all") && (
                  <p className="text-sm">Try adjusting your filters</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
