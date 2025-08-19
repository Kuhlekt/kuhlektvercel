"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Activity } from "lucide-react"
import type { AuditLog as AuditLogType, User as UserType } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogType[]
  users: UserType[]
}

export function AuditLog({ auditLog, users }: AuditLogProps) {
  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.username : "Unknown User"
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "LOGIN":
        return "bg-green-100 text-green-800"
      case "LOGOUT":
        return "bg-gray-100 text-gray-800"
      case "CREATE_ARTICLE":
      case "CREATE_USER":
      case "CREATE_CATEGORY":
        return "bg-blue-100 text-blue-800"
      case "UPDATE_ARTICLE":
      case "UPDATE_USER":
      case "UPDATE_CATEGORY":
        return "bg-yellow-100 text-yellow-800"
      case "DELETE_ARTICLE":
      case "DELETE_USER":
      case "DELETE_CATEGORY":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const sortedLog = [...auditLog].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Audit Log</h3>
        <div className="text-sm text-gray-500">{auditLog.length} total entries</div>
      </div>

      <ScrollArea className="h-96 border rounded-lg">
        {sortedLog.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No audit entries yet</p>
            <p className="text-sm">User activities will appear here</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {sortedLog.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-3 bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getActionColor(entry.action)}>{entry.action}</Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{getUserName(entry.performedBy)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{entry.details}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{entry.timestamp.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
