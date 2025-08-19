"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, User, FileText, FolderTree } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const getActionIcon = (action: string) => {
    if (action.includes("user")) return <User className="h-4 w-4" />
    if (action.includes("article")) return <FileText className="h-4 w-4" />
    if (action.includes("category")) return <FolderTree className="h-4 w-4" />
    return <Activity className="h-4 w-4" />
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("created") || action.includes("login")) return "default"
    if (action.includes("updated") || action.includes("edited")) return "secondary"
    if (action.includes("deleted") || action.includes("logout")) return "destructive"
    return "outline"
  }

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Audit Log</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {auditLog.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No audit log entries yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Performed By</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLog.slice(0, 50).map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getActionIcon(entry.action)}
                      <Badge variant={getActionBadgeVariant(entry.action)}>{entry.action.replace("_", " ")}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{entry.entityType}</TableCell>
                  <TableCell>{entry.performedBy}</TableCell>
                  <TableCell>{formatTimestamp(entry.timestamp)}</TableCell>
                  <TableCell className="max-w-xs truncate">{entry.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
