"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AuditLog as AuditLogType, User } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogType[]
  users: User[]
}

export function AuditLog({ auditLog, users }: AuditLogProps) {
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.username : "Unknown User"
  }

  const getActionColor = (action: string) => {
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
        return "secondary"
      case "DELETE_ARTICLE":
      case "DELETE_USER":
      case "DELETE_CATEGORY":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Audit Log</h3>
      <div className="border rounded-lg">
        <div className="grid grid-cols-4 gap-4 p-4 font-medium border-b bg-gray-50">
          <div>User</div>
          <div>Action</div>
          <div>Details</div>
          <div>Timestamp</div>
        </div>
        <ScrollArea className="max-h-96">
          {auditLog.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No audit log entries</div>
          ) : (
            auditLog.map((entry) => (
              <div key={entry.id} className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0">
                <div className="font-medium">{getUserName(entry.userId)}</div>
                <div>
                  <Badge variant={getActionColor(entry.action)}>{entry.action}</Badge>
                </div>
                <div className="text-gray-600">{entry.details}</div>
                <div className="text-gray-600">{entry.timestamp.toLocaleString()}</div>
              </div>
            ))
          )}
        </ScrollArea>
      </div>
    </div>
  )
}
