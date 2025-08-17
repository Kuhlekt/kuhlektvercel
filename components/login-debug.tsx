"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, User, Database, Activity, Clock } from "lucide-react"
import { storage } from "../utils/storage"
import type { KnowledgeBaseUser } from "../types/knowledge-base"

interface LoginDebugProps {
  currentUser: KnowledgeBaseUser | null
  onLogout: () => void
}

export function LoginDebug({ currentUser, onLogout }: LoginDebugProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const getStorageInfo = () => {
    try {
      const categories = storage.getCategories()
      const users = storage.getUsers()
      const auditLog = storage.getAuditLog()
      const pageVisits = storage.getPageVisits()

      const totalArticles = categories.reduce((total, category) => {
        const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
        const subcategoryArticles = Array.isArray(category.subcategories)
          ? category.subcategories.reduce(
              (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
              0,
            )
          : 0
        return total + categoryArticles + subcategoryArticles
      }, 0)

      return {
        categories: categories.length,
        articles: totalArticles,
        users: users.length,
        auditEntries: auditLog.length,
        pageVisits,
        storageHealth: storage.checkHealth(),
      }
    } catch (error) {
      return {
        categories: 0,
        articles: 0,
        users: 0,
        auditEntries: 0,
        pageVisits: 0,
        storageHealth: { isHealthy: false, error: error instanceof Error ? error.message : "Unknown error" },
      }
    }
  }

  const storageInfo = getStorageInfo()

  return (
    <Card className="w-80 shadow-lg border-2 border-blue-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <span>Debug Panel</span>
            <Badge variant="outline" className="text-xs">
              DEV
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Current User Status */}
        <div className="mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-600">User:</span>
            </div>
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {currentUser.username}
                </Badge>
                <Badge variant={currentUser.role === "admin" ? "destructive" : "default"} className="text-xs">
                  {currentUser.role}
                </Badge>
              </div>
            ) : (
              <Badge variant="outline" className="text-xs">
                Not logged in
              </Badge>
            )}
          </div>
          {currentUser && (
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={onLogout} className="w-full text-xs bg-transparent">
                Logout
              </Button>
            </div>
          )}
        </div>

        {isExpanded && (
          <>
            {/* Storage Health */}
            <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Storage Health</span>
                <Badge variant={storageInfo.storageHealth.isHealthy ? "default" : "destructive"} className="text-xs">
                  {storageInfo.storageHealth.isHealthy ? "OK" : "ERROR"}
                </Badge>
              </div>
              {!storageInfo.storageHealth.isHealthy && (
                <div className="text-red-600 text-xs mt-1">{storageInfo.storageHealth.error}</div>
              )}
            </div>

            {/* Data Statistics */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Database className="h-3 w-3 text-gray-500" />
                  <span>Categories:</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {storageInfo.categories}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Database className="h-3 w-3 text-gray-500" />
                  <span>Articles:</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {storageInfo.articles}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <User className="h-3 w-3 text-gray-500" />
                  <span>Users:</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {storageInfo.users}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Activity className="h-3 w-3 text-gray-500" />
                  <span>Audit Entries:</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {storageInfo.auditEntries}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span>Page Visits:</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {storageInfo.pageVisits}
                </Badge>
              </div>
            </div>

            {/* System Actions */}
            <div className="mt-3 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="w-full text-xs">
                Refresh App
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
