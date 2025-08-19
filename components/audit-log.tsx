"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "user_login":
      case "user_logout":
        return "secondary"
      case "user_created":
      case "article_created":
        return "default"
      case "user_deleted":
      case "article_deleted":
        return "destructive"
      case "user_updated":
      case "article_updated":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatAction = (action: string) => {
    return action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Activity Log</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {auditLog.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity recorded yet</p>
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
              {auditLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(entry.action)}>{formatAction(entry.action)}</Badge>
                  </TableCell>
                  <TableCell className="capitalize">{entry.entityType}</TableCell>
                  <TableCell>{entry.performedBy}</TableCell>
                  <TableCell>{entry.timestamp.toLocaleString()}</TableCell>
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
