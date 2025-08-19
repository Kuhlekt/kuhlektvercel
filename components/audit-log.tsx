"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "bg-green-100 text-green-800"
      case "LOGOUT":
        return "bg-gray-100 text-gray-800"
      case "CREATE_ARTICLE":
        return "bg-blue-100 text-blue-800"
      case "UPDATE_ARTICLE":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE_ARTICLE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Audit Log</h3>

      <ScrollArea className="h-96">
        <div className="space-y-2">
          {auditLog.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No audit entries found</div>
          ) : (
            auditLog.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Badge className={getActionBadgeColor(entry.action)}>{entry.action}</Badge>
                  <div>
                    <div className="font-medium">{getUserName(entry.userId)}</div>
                    <div className="text-sm text-gray-600">{entry.details}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">{entry.timestamp.toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
