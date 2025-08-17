"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Bug, User, Shield, Eye, PenTool, CheckCircle, AlertTriangle, Database, Users, Activity } from "lucide-react"
import { storage } from "../utils/storage"
import type { User as UserType } from "../types/knowledge-base"

interface LoginDebugProps {
  onLogin: (user: UserType) => void
}

export function LoginDebug({ onLogin }: LoginDebugProps) {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkSystemHealth = () => {
    setIsLoading(true)
    try {
      const health = storage.checkHealth()
      const storageInfo = storage.getStorageInfo()
      const users = storage.getUsers()
      const categories = storage.getCategories()
      const auditLog = storage.getAuditLog()

      setDebugInfo({
        health,
        storageInfo,
        userCount: users.length,
        categoryCount: categories.length,
        auditLogCount: auditLog.length,
        users: users.map((u) => ({
          username: u.username,
          role: u.role,
          isActive: u.isActive,
          lastLogin: u.lastLogin,
        })),
      })
    } catch (error) {
      console.error("Debug check failed:", error)
      setDebugInfo({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  const createDemoUser = (role: "admin" | "editor" | "viewer") => {
    try {
      const users = storage.getUsers()
      const existingDemo = users.find((u) => u.username === `demo-${role}`)

      if (existingDemo) {
        existingDemo.lastLogin = new Date()
        storage.saveUsers(users)
        onLogin(existingDemo)
        return
      }

      const demoUser: UserType = {
        id: `demo-${role}-${Date.now()}`,
        username: `demo-${role}`,
        email: `demo-${role}@example.com`,
        role,
        isActive: true,
        createdAt: new Date(),
        lastLogin: new Date(),
      }

      users.push(demoUser)
      storage.saveUsers(users)

      storage.addAuditEntry({
        action: "demo_user_created",
        entityType: "user",
        entityId: demoUser.id,
        performedBy: "system",
        timestamp: new Date(),
        details: `Created demo ${role} user`,
      })

      onLogin(demoUser)
    } catch (error) {
      console.error("Failed to create demo user:", error)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Bug className="h-5 w-5" />
          <span>System Debug Panel</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Login */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Login</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={() => createDemoUser("admin")}
              className="flex items-center space-x-2"
              variant="destructive"
            >
              <Shield className="h-4 w-4" />
              <span>Login as Admin</span>
            </Button>
            <Button onClick={() => createDemoUser("editor")} className="flex items-center space-x-2" variant="default">
              <PenTool className="h-4 w-4" />
              <span>Login as Editor</span>
            </Button>
            <Button
              onClick={() => createDemoUser("viewer")}
              className="flex items-center space-x-2"
              variant="secondary"
            >
              <Eye className="h-4 w-4" />
              <span>Login as Viewer</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* System Health Check */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">System Health</h3>
            <Button onClick={checkSystemHealth} disabled={isLoading} variant="outline" size="sm">
              {isLoading ? "Checking..." : "Check System"}
            </Button>
          </div>

          {debugInfo && (
            <div className="space-y-4">
              {debugInfo.error ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{debugInfo.error}</AlertDescription>
                </Alert>
              ) : (
                <>
                  {/* Health Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Storage</span>
                        <Badge variant={debugInfo.health.isAvailable ? "default" : "destructive"}>
                          {debugInfo.health.isAvailable ? "Available" : "Error"}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Data</span>
                        <Badge variant={debugInfo.health.hasData ? "default" : "secondary"}>
                          {debugInfo.health.hasData ? "Present" : "Empty"}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Integrity</span>
                        <Badge variant={debugInfo.health.dataIntegrity ? "default" : "destructive"}>
                          {debugInfo.health.dataIntegrity ? "Good" : "Error"}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Space</span>
                        <span className="text-sm text-gray-600">
                          {formatBytes(debugInfo.storageInfo.availableSpace)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Data Counts */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Users className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">{debugInfo.userCount}</div>
                        <div className="text-sm text-gray-600">Users</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Database className="h-8 w-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">{debugInfo.categoryCount}</div>
                        <div className="text-sm text-gray-600">Categories</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Activity className="h-8 w-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold">{debugInfo.auditLogCount}</div>
                        <div className="text-sm text-gray-600">Audit Entries</div>
                      </div>
                    </div>
                  </div>

                  {/* Users List */}
                  {debugInfo.users && debugInfo.users.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Existing Users</h4>
                      <div className="space-y-2">
                        {debugInfo.users.map((user: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">{user.username}</span>
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={user.isActive ? "default" : "secondary"} className="text-xs">
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                              {user.lastLogin && (
                                <span className="text-xs text-gray-500">
                                  {new Date(user.lastLogin).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Storage Details */}
                  <div>
                    <h4 className="font-medium mb-2">Storage Usage</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">Categories</div>
                        <div className="text-gray-600">{formatBytes(debugInfo.storageInfo.categoriesSize)}</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">Users</div>
                        <div className="text-gray-600">{formatBytes(debugInfo.storageInfo.usersSize)}</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">Audit Log</div>
                        <div className="text-gray-600">{formatBytes(debugInfo.storageInfo.auditLogSize)}</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="font-medium">Total</div>
                        <div className="text-gray-600">{formatBytes(debugInfo.storageInfo.totalSize)}</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Use the quick login buttons above to test different user roles, or check system health to debug storage
            issues. This panel is for development and testing purposes only.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
