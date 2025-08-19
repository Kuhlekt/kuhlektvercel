"use client"

import { useState, useMemo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, Activity, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
}

const ITEMS_PER_PAGE = 20

export function AuditLog({ auditLog }: AuditLogProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")

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

  const filteredAndSortedLog = useMemo(() => {
    let filtered = [...auditLog]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.performedBy.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by action
    if (actionFilter !== "all") {
      filtered = filtered.filter((entry) => entry.action === actionFilter)
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [auditLog, searchTerm, actionFilter])

  const totalPages = Math.ceil(filteredAndSortedLog.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentEntries = filteredAndSortedLog.slice(startIndex, endIndex)

  const uniqueActions = useMemo(() => {
    const actions = new Set(auditLog.map((entry) => entry.action))
    return Array.from(actions).sort()
  }, [auditLog])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleActionFilterChange = (value: string) => {
    setActionFilter(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Audit Log</h3>
          <Badge variant="outline">{filteredAndSortedLog.length} entries</Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search audit log..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={actionFilter} onValueChange={handleActionFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {uniqueActions.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audit Log Entries */}
      <div className="border rounded-lg">
        <ScrollArea className="h-96">
          <div className="p-4">
            {currentEntries.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>
                  {filteredAndSortedLog.length === 0 && auditLog.length > 0
                    ? "No entries match your search criteria"
                    : "No audit log entries yet"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <Badge variant={getActionBadgeVariant(entry.action)}>{entry.action}</Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 break-words">{entry.details}</p>
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
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedLog.length)} of{" "}
            {filteredAndSortedLog.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
