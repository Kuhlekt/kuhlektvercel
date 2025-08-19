"use client"

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

  const sortedLog = [...auditLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Audit Log</h3>

      <div className="border rounded-lg max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left">Timestamp</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedLog.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="px-4 py-2 text-sm">{new Date(entry.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{getUserName(entry.userId)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      entry.action.includes("DELETE")
                        ? "bg-red-100 text-red-800"
                        : entry.action.includes("CREATE")
                          ? "bg-green-100 text-green-800"
                          : entry.action.includes("UPDATE")
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {entry.action}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">{entry.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
