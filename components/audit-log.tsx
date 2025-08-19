"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, FileText, Search, Activity, Plus, Trash2, Edit } from 'lucide-react'
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

export function AuditLog({ auditLog }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState<string>("all")
  const [filterUser, setFilterUser] = useState<string>("all")

  // Get unique users from audit log
  const uniqueUsers = Array.from(new Set(auditLog.map((entry) => entry.performedBy)))

  // Filter audit log entries
  const getFilteredEntries = () => {
    let filtered = [...auditLog]

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.articleTitle.toLowerCase().includes(query) ||
          entry.categoryName.toLowerCase().includes(query) ||
          (entry.subcategoryName && entry.subcategoryName.toLowerCase().includes(query)) ||
          entry.performedBy.toLowerCase().includes(query) ||
          (entry.details && entry.details.toLowerCase().includes(query)),
      )
    }

    // Filter by action
    if (filterAction !== "all") {
      filtered = filtered.filter((entry) => entry.action === filterAction)
    }

    // Filter by user
    if (filterUser !== "all") {
      filtered = filtered.filter((entry) => entry.performedBy === filterUser)
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const filteredEntries = getFilteredEntries()

  // Get statistics
  const stats = {
    total: auditLog.length,
    created: auditLog.filter((entry) => entry.action === "article_created").length,
    updated: auditLog.filter((entry) => entry.action === "article_updated").length,
    deleted: auditLog.filter((entry) => entry.action === "article_deleted").length,
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "article_created":
        return <Plus className="h-3 w-3" />
      case "article_updated":
        return <Edit className="h-3 w-3" />
      case "article_deleted":
        return <Trash2 className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "article_created":
        return "bg-green-100 text-green-800"
      case "article_updated":
        return "bg-blue-100 text-blue-800"
      case "article_deleted":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case "article_created":
        return "Created"
      case "article_updated":
        return "Updated"
      case "article_deleted":
        return "Deleted"
      default:
        return action
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Total Actions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plus className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-2xl font-bold text-green-600">{stats.created}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Updated</p>
                <p className="text-2xl font-bold text-blue-600">{stats.updated}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm font-medium">Deleted</p>
                <p className="text-2xl font-bold text-red-600">{stats.deleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Article Audit Log</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search audit log..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="article_created">Created</SelectItem>
                <SelectItem value="article_updated">Updated</SelectItem>
                <SelectItem value="article_deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-600">
            Showing {filteredEntries.length} of {auditLog.length} entries
          </div>

          {/* Audit Entries */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No audit entries match your filters.</div>
            ) : (
              filteredEntries.map((entry) => (
                <div key={entry.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      {/* Action and Article Title */}
                      <div className="flex items-center space-x-2">
                        <Badge className={`flex items-center space-x-1 ${getActionColor(entry.action)}`}>
                          {getActionIcon(entry.action)}
                          <span>{getActionLabel(entry.action)}</span>
                        </Badge>
                        <span className="font-medium">{entry.articleTitle}</span>
                      </div>

                      {/* Category and Subcategory */}
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>in</span>
                        <Badge variant="secondary">{entry.categoryName}</Badge>
                        {entry.subcategoryName && (
                          <>
                            <span>→</span>
                            <Badge variant="outline">{entry.subcategoryName}</Badge>
                          </>
                        )}
                      </div>

                      {/* Details */}
                      {entry.details && <p className="text-sm text-gray-600">{entry.details}</p>}

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>by {entry.performedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{entry.timestamp.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
