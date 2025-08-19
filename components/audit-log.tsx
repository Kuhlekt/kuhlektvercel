"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Activity, User, FileText, FolderTree } from "lucide-react"
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
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = filterAction === "all" || entry.action === filterAction
    const matchesEntityType = filterEntityType === "all" || entry.entityType === filterEntityType

    return matchesSearch && matchesAction && matchesEntityType
  })

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("created")) return "default"
    if (action.includes("updated")) return "secondary"
    if (action.includes("deleted")) return "destructive"
    if (action.includes("login")) return "outline"
    return "secondary"
  }

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case "user":
        return <User className="h-4 w-4" />
      case "article":
        return <FileText className="h-4 w-4" />
      case "category":
        return <FolderTree className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const uniqueActions = Array.from(new Set(auditLog.map((entry) => entry.action)))

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Audit Log</h3>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
            <SelectTrigger className="w-full sm:w-48">
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

          <Select value={filterEntityType} onValueChange={setFilterEntityType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="category">Categories</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Activity Log ({filteredLog.length} entries)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLog.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit log entries found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Performed By</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-sm">{new Date(entry.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(entry.action)}>{entry.action.replace(/_/g, " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getEntityIcon(entry.entityType)}
                        <span className="capitalize">{entry.entityType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{entry.performedBy}</TableCell>
                    <TableCell className="max-w-md truncate">{entry.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
