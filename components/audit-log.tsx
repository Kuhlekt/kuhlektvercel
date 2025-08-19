"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Activity, User, FileText, FolderTree } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterEntity, setFilterEntity] = useState("all")

  const getActionIcon = (action: string) => {
    if (action.includes("user")) return <User className="h-4 w-4" />
    if (action.includes("article")) return <FileText className="h-4 w-4" />
    if (action.includes("category")) return <FolderTree className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("created")) return "default"
    if (action.includes("updated")) return "secondary"
    if (action.includes("deleted")) return "destructive"
    if (action.includes("login")) return "outline"
    return "outline"
  }

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = filterAction === "all" || entry.action.includes(filterAction)
    const matchesEntity = filterEntity === "all" || entry.entityType === filterEntity

    return matchesSearch && matchesAction && matchesEntity
  })

  const uniqueActions = [
    ...new Set(
      auditLog.map((entry) => {
        if (entry.action.includes("created")) return "created"
        if (entry.action.includes("updated")) return "updated"
        if (entry.action.includes("deleted")) return "deleted"
        if (entry.action.includes("login")) return "login"
        return "other"
      }),
    ),
  ]

  const uniqueEntities = [...new Set(auditLog.map((entry) => entry.entityType))]

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
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
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map((action) => (
              <SelectItem key={action} value={action}>
                {action.charAt(0).toUpperCase() + action.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterEntity} onValueChange={setFilterEntity}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            {uniqueEntities.map((entity) => (
              <SelectItem key={entity} value={entity}>
                {entity.charAt(0).toUpperCase() + entity.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Audit Log ({filteredLog.length} entries)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLog.length > 0 ? (
            <div className="space-y-4">
              {filteredLog.map((entry) => (
                <div key={entry.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 mt-1">{getActionIcon(entry.action)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={getActionBadgeVariant(entry.action)}>
                        {entry.action.replace(/_/g, " ").toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{entry.entityType}</Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{entry.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>By: {entry.performedBy}</span>
                      <span>•</span>
                      <span>{formatTimestamp(entry.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit log entries found</p>
              {(searchQuery || filterAction !== "all" || filterEntity !== "all") && (
                <p className="text-sm mt-2">Try adjusting your search or filters</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
