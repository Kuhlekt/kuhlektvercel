'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './ui/card'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { getAuditLog } from '../utils/storage'
import { AuditLogEntry } from '../types/knowledge-base'
import { Search, Activity } from 'lucide-react'

export function AuditLog() {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAction, setSelectedAction] = useState('')

  useEffect(() => {
    setAuditLog(getAuditLog())
  }, [])

  const filteredLog = auditLog.filter(entry => {
    const matchesSearch = entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = !selectedAction || entry.action === selectedAction
    return matchesSearch && matchesAction
  })

  const uniqueActions = Array.from(new Set(auditLog.map(entry => entry.action)))

  const getActionBadgeVariant = (action: string) => {
    if (action.includes('Created')) return 'default'
    if (action.includes('Updated')) return 'secondary'
    if (action.includes('Deleted')) return 'destructive'
    if (action.includes('Login')) return 'outline'
    return 'secondary'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Audit Log</h2>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search audit log..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      </div>

      {/* Audit Log Entries */}
      <div className="space-y-3">
        {filteredLog.map(entry => (
          <Card key={entry.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={getActionBadgeVariant(entry.action) as any}>
                      {entry.action}
                    </Badge>
                    <span className="font-medium">{entry.username}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{entry.details}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLog.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No audit log entries found matching your criteria.
        </div>
      )}
    </div>
  )
}
