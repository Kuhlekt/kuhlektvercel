"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Activity } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "default"
      case "LOGOUT":
        return "secondary"
      case "CREATE_ARTICLE":
      case "CREATE_USER":
      case "CREATE_CATEGORY":
        return "default"
      case "UPDATE_ARTICLE":
      case "UPDATE_USER":
      case "UPDATE_CATEGORY":
        return "outline"
      case "DELETE_ARTICLE":
      case "DELETE_USER":
      case "DELETE_CATEGORY":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const sortedLog = [...auditLog].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Activity className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Audit Log</h3>
        <Badge variant="outline">{auditLog.length} entries</Badge>
      </div>

      <ScrollArea className="h-96">
        <div className="space-y-2">
          {sortedLog.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No audit log entries yet</p>
            </div>
          ) : (
            sortedLog.map((entry) => (
              <div key={entry.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <Badge variant={getActionBadgeVariant(entry.action)}>{entry.action}</Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{entry.details}</p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span>User ID: {entry.performedBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{entry.timestamp.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
