'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Activity, Search, Calendar, User, FileText, Folder, Trash2, Edit, Plus } from 'lucide-react'
import { useState } from 'react'
import type { AuditLogEntry } from '@/types/knowledge-base'
import { formatDate } from '@/utils/article-utils'

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState<string>('all')

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create_article':
      case 'update_article':
        return <FileText className="h-4 w-4" />
      case 'delete_article':
        return <Trash2 className="h-4 w-4" />
      case 'create_category':
      case 'update_category':
        return <Folder className="h-4 w-4" />
      case 'delete_category':
        return <Trash2 className="h-4 w-4" />
      case 'login':
      case 'logout':
        return <User className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'text-green-600'
    if (action.includes('delete')) return 'text-red-600'
    if (action.includes('update')) return 'text-blue-600'
    return 'text-gray-600'
  }

  const getActionLabel = (action: string) => {
    return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const filteredLog = auditLog.filter(entry => {
    const matchesSearch = entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.userName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = actionFilter === 'all' || entry.action === actionFilter
    
    return matchesSearch && matchesAction
  })

  const uniqueActions = Array.from(new Set(auditLog.map(entry => entry.action)))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <p className="text-gray-600">Track all activities in the knowledge base</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log ({filteredLog.length} entries)
          </CardTitle>
          <CardDescription>
            Monitor user actions and system changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>
                    {getActionLabel(action)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredLog.map((entry) => (
              <div key={entry.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`flex-shrink-0 mt-1 ${getActionColor(entry.action)}`}>
                  {getActionIcon(entry.action)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{entry.userName}</span>
                    <Badge variant="outline" className="text-xs">
                      {getActionLabel(entry.action)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {entry.details}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(entry.timestamp)}</span>
                    {entry.targetId && (
                      <>
                        <span>•</span>
                        <span>ID: {entry.targetId}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLog.length === 0 && (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No activities found</h3>
              <p className="text-gray-500">
                {auditLog.length === 0 
                  ? "No activities have been logged yet."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
