"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Search, Trash2 } from "lucide-react"
import type { AuditLogEntry } from "../types/knowledge-base"

interface AuditLogProps {
  auditLog: AuditLogEntry[]
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function AuditLog({ auditLog, onAuditLogUpdate }: AuditLogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterUser, setFilterUser] = useState("all")

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case "user_login":
      case "user_logout":
        return "secondary"
      case "article_created":
      case "article_updated":
        return "default"
      case "article_deleted":
      case "user_deleted":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getUniqueActions = () => {
    const actions = new Set(auditLog.map((entry) => entry.action))
    return Array.from(actions).sort()
  }

  const getUniqueUsers = () => {
    const users = new Set(auditLog.map((entry) => entry.performedBy))
    return Array.from(users).sort()
  }

  const filteredAuditLog = auditLog.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.performedBy.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesAction = filterAction === "all" || entry.action === filterAction
    const matchesUser = filterUser === "all" || entry.performedBy === filterUser

    return matchesSearch && matchesAction && matchesUser
  })

  const handleClearLog = () => {
    if (window.confirm("Are you sure you want to clear the entire audit log? This action cannot be undone.")) {
      onAuditLogUpdate([])
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>
                Audit Log ({filteredAuditLog.length} of {auditLog.length})
              </span>
            </CardTitle>
            <Button variant="destructive" onClick={handleClearLog} disabled={auditLog.length === 0}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search audit log..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {getUniqueActions().map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {getUniqueUsers().map((user) => (
                  <SelectItem key={user} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAuditLog.length > 0 ? (
                filteredAuditLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">{formatDate(entry.timestamp)}</TableCell>
                    <TableCell>
                      <Badge variant={getActionBadgeVariant(entry.action)}>
                        {entry.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.performedBy}</TableCell>
                    <TableCell>{entry.details}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    {auditLog.length === 0 ? "No audit log entries" : "No entries match your filters"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
