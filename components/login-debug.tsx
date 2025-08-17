"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Bug, Shield, FileEdit, Eye, Database, CheckCircle, AlertTriangle, RefreshCw, LogOut } from "lucide-react"
import { storage } from "../utils/storage"
import type { KnowledgeBaseUser } from "../types/knowledge-base"

interface LoginDebugProps {
  currentUser: KnowledgeBaseUser | null
  onLogout: () => void
}

export function LoginDebug({ currentUser, onLogout }: LoginDebugProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshDebugInfo = async () => {
    setIsRefreshing(true)
    try {
      const users = storage.getUsers()
      const categories = storage.getCategories()
      const auditLog = storage.getAuditLog()
      const pageVisits = storage.getPageVisits()
      const storageHealth = storage.checkHealth()

      setDebugInfo({
        users: users.length,
        categories: categories.length,
        auditEntries: auditLog.length,
        pageVisits,
        storageHealth,
      })
    } catch (error) {
      console.error("Debug info error:", error)
      setDebugInfo({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsRefreshing(false)
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-3 w-3" />
      case "editor":
        return <FileEdit className="h-3 w-3" />
      case "viewer":
        return <Eye className="h-3 w-3" />
      default:
        return <Eye className="h-3 w-3" />
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "editor":
        return "default"
      case "viewer":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-orange-800">
          <Bug className="h-5 w-5" />
          <span>Debug Panel</span>
        </CardTitle>
        <CardDescription className="text-orange-700">System information and diagnostics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Status */}
        <div className="space-y-2">
          <h4 className="font-medium text-orange-800">Current User</h4>
          {currentUser ? (
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{currentUser.username}</span>
                <Badge variant={getRoleBadgeVariant(currentUser.role)} className="flex items-center space-x-1">
                  {getRoleIcon(currentUser.role)}
                  <span className="capitalize">{currentUser.role}</span>
                </Badge>
              </div>
              <Button size="sm" variant="outline" onClick={onLogout}>
                <LogOut className="h-3 w-3 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <Alert className="border-orange-200 bg-orange-100">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                No user logged in - use login form to authenticate
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* System Information */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-orange-800">System Information</h4>
            <Button size="sm" variant="outline" onClick={refreshDebugInfo} disabled={isRefreshing}>
              <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {debugInfo ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Users</span>
                  <Badge variant="outline">{debugInfo.users || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Categories</span>
                  <Badge variant="outline">{debugInfo.categories || 0}</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Audit Entries</span>
                  <Badge variant="outline">{debugInfo.auditEntries || 0}</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Page Visits</span>
                  <Badge variant="outline">{debugInfo.pageVisits || 0}</Badge>
                </div>
              </div>
            </div>
          ) : (
            <Button variant="outline" onClick={refreshDebugInfo} disabled={isRefreshing}>
              <Database className="h-3 w-3 mr-1" />
              Load System Info
            </Button>
          )}
        </div>

        {/* Storage Health */}
        {debugInfo?.storageHealth && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-orange-800">Storage Health</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Available</span>
                  {debugInfo.storageHealth.isAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Has Data</span>
                  {debugInfo.storageHealth.hasData ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  )}
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm">Data Integrity</span>
                  {debugInfo.storageHealth.dataIntegrity ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
              {debugInfo.storageHealth.lastError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800 text-xs">
                    {debugInfo.storageHealth.lastError}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </>
        )}

        {debugInfo?.error && (
          <>
            <Separator />
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">Debug Error: {debugInfo.error}</AlertDescription>
            </Alert>
          </>
        )}

        <Separator />

        <Alert className="border-blue-200 bg-blue-50">
          <AlertDescription className="text-blue-800 text-xs">
            Debug panel provides system diagnostics only. Use the login form for secure authentication.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
