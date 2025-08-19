"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Activity, Filter } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterEntity, setFilterEntity] = useState("all")

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = filterAction === "all" || entry.action === filterAction
    const matchesEntity = filterEntity === "all" || entry.entityType === filterEntity

    return matchesSearch && matchesAction && matchesEntity
  })

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "user_login":
      case "user_logout":
        return "secondary"
      case "user_created":
      case "article_created":
      case "category_created":
        return "default"
      case "user_updated":
      case "article_updated":
      case "category_updated":
        return "outline"
      case "user_deleted":
      case "article_deleted":
      case "category_deleted":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const uniqueActions = Array.from(new Set(auditLog.map((entry) => entry.action)))
  const uniqueEntities = Array.from(new Set(auditLog.map((entry) => entry.entityType)))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Audit Log</h3>
        <p className="text-sm text-gray-600">Track all system activities and changes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Activity ({filteredLog.length} entries)</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterAction} onValueChange={setFilterAction}>
                <SelectTrigger className="w-40">
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
              <Select value={filterEntity} onValueChange={setFilterEntity}>
                <SelectTrigger className="w-40">
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
          </div>
        </CardHeader>
        <CardContent>
          {filteredLog.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">{new Date(entry.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(entry.action)}>{formatAction(entry.action)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {entry.entityType.charAt(0).toUpperCase() + entry.entityType.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.performedBy}</TableCell>
                    <TableCell className="max-w-md truncate">{entry.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activities found matching your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
