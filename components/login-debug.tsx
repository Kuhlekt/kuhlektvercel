"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Bug, ChevronDown, ChevronUp, Database, Users, FileText, Activity, User } from "lucide-react"

import type { Category, User as KBUser, AuditLogEntry } from "../types/knowledge-base"

interface LoginDebugProps {
  categories: Category[]
  users: KBUser[]
  auditLog: AuditLogEntry[]
  pageVisits: number
  currentUser: KBUser | null
}

export function LoginDebug({ categories, users, auditLog, pageVisits, currentUser }: LoginDebugProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getTotalArticles = () => {
    if (!Array.isArray(categories)) return 0

    return categories.reduce((total, category) => {
      const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
      const subcategoryArticles = Array.isArray(category.subcategories)
        ? category.subcategories.reduce(
            (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
            0,
          )
        : 0
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  const getStorageSize = () => {
    try {
      let total = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith("kuhlekt_kb_")) {
          total += localStorage[key].length
        }
      }
      return `${(total / 1024).toFixed(1)} KB`
    } catch {
      return "Unknown"
    }
  }

  const getRecentActivity = () => {
    if (!Array.isArray(auditLog)) return []
    return auditLog.slice(0, 3)
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white shadow-lg">
          <Bug className="h-4 w-4 mr-2" />
          Debug Panel
          {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-2">
        <Card className="w-80 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>System Diagnostics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current User */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Current User</span>
              </div>
              {currentUser ? (
                <div className="ml-6">
                  <Badge variant="secondary" className="text-xs">
                    {currentUser.name} ({currentUser.role})
                  </Badge>
                </div>
              ) : (
                <div className="ml-6 text-xs text-gray-500">Not logged in</div>
              )}
            </div>

            {/* Data Statistics */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Data Statistics</span>
              </div>
              <div className="ml-6 space-y-1 text-xs text-gray-600">
                <div>Categories: {Array.isArray(categories) ? categories.length : 0}</div>
                <div>Articles: {getTotalArticles()}</div>
                <div>Users: {Array.isArray(users) ? users.length : 0}</div>
                <div>Audit Entries: {Array.isArray(auditLog) ? auditLog.length : 0}</div>
                <div>Page Visits: {pageVisits}</div>
              </div>
            </div>

            {/* Storage Info */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Database className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Storage</span>
              </div>
              <div className="ml-6 text-xs text-gray-600">
                <div>Size: {getStorageSize()}</div>
                <div>Type: LocalStorage</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Recent Activity</span>
              </div>
              <div className="ml-6 space-y-1">
                {getRecentActivity().length > 0 ? (
                  getRecentActivity().map((entry, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      <div className="font-medium">{entry.action}</div>
                      <div className="text-gray-500">{entry.userName}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-500">No recent activity</div>
                )}
              </div>
            </div>

            {/* System Status */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">System Status</span>
              </div>
              <div className="ml-6 space-y-1 text-xs">
                <Badge variant="outline" className="text-xs">
                  {typeof window !== "undefined" && window.localStorage ? "Storage: OK" : "Storage: Error"}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Data: {Array.isArray(categories) && Array.isArray(users) ? "Loaded" : "Error"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
