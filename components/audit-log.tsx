"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { AuditLogEntry, User } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
  users: User[]
}

export function AuditLogComponent({ auditLog, users }: AuditLogProps) {
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.username : "Unknown User"
  }

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "LOGIN":
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
      <h3 className="text-lg font-semibold">Audit Log</h3>

      <ScrollArea className="h-96">
        <div className="space-y-2">
          {sortedLog.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No audit entries found</p>
          ) : (
            sortedLog.map((entry) => (
              <div key={entry.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={getActionBadgeVariant(entry.action)}>{entry.action}</Badge>
                    <span className="text-sm font-medium">{getUserName(entry.userId)}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{entry.details}</p>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
