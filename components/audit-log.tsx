"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Search } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterEntityType, setFilterEntityType] = useState("all")

  const filteredLog = auditLog.filter((entry) => {
    const matchesSearch =
      !searchQuery ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = filterAction === "all" || entry.action === filterAction
    const matchesEntityType = filterEntityType === "all" || entry.entityType === filterEntityType

    return matchesSearch && matchesAction && matchesEntityType
  })

  const getActionBadgeColor = (action: string) => {
    if (action.includes("created")) return "bg-green-100 text-green-800"
    if (action.includes("updated")) return "bg-blue-100 text-blue-800"
    if (action.includes("deleted")) return "bg-red-100 text-red-800"
    if (action.includes("login")) return "bg-purple-100 text-purple-800"
    return "bg-gray-100 text-gray-800"
  }

  const getEntityTypeBadgeColor = (entityType: string) => {
    switch (entityType) {
      case "user":
        return "bg-blue-100 text-blue-800"
      case "article":
        return "bg-green-100 text-green-800"
      case "category":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString()
  }

  const uniqueActions = [...new Set(auditLog.map((entry) => entry.action))]
  const uniqueEntityTypes = [...new Set(auditLog.map((entry) => entry.entityType))]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Audit Log</span>
            <Badge variant="outline">{filteredLog.length} entries</Badge>
          </CardTitle>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search audit log..."
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
                    {action.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterEntityType} onValueChange={setFilterEntityType}>
              <SelectTrigger className="w-40">
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
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity Type</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLog.length > 0 ? (
                filteredLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">{formatTimestamp(entry.timestamp)}</TableCell>
                    <TableCell>
                      <Badge className={getActionBadgeColor(entry.action)}>{entry.action.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEntityTypeBadgeColor(entry.entityType)}>{entry.entityType}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.performedBy}</TableCell>
                    <TableCell className="text-sm text-gray-600">{entry.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No audit log entries found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
