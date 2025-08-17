"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Bug, Database, FileText, Users, Activity, Trash2 } from "lucide-react"
import { storage } from "../utils/storage"

export function StorageDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleDebug = () => {
    try {
      const health = storage.checkHealth()
      const info = storage.getStorageInfo()
      const categories = storage.getCategories()
      const users = storage.getUsers()
      const auditLog = storage.getAuditLog()
      const pageVisits = storage.getPageVisits()

      // Count total articles
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

      setDebugInfo({
        health,
        info,
        counts: {
          categories: categories.length,
          articles: totalArticles,
          users: users.length,
          auditEntries: auditLog.length,
          pageVisits,
        },
        categories: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          articleCount: Array.isArray(cat.articles) ? cat.articles.length : 0,
          subcategoryCount: Array.isArray(cat.subcategories) ? cat.subcategories.length : 0,
          subcategories: Array.isArray(cat.subcategories)
            ? cat.subcategories.map((sub) => ({
                id: sub.id,
                name: sub.name,
                articleCount: Array.isArray(sub.articles) ? sub.articles.length : 0,
              }))
            : [],
        })),
        users: users.map((user) => ({
          id: user.id,
          username: user.username,
          role: user.role,
          hasPassword: !!user.password,
        })),
        recentAudit: auditLog.slice(0, 5),
      })
      setIsOpen(true)
    } catch (error) {
      console.error("Debug error:", error)
      setDebugInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      })
      setIsOpen(true)
    }
  }

  const handleClearStorage = () => {
    if (confirm("Are you sure you want to clear all storage data? This cannot be undone.")) {
      try {
        storage.clearAll()
        alert("Storage cleared successfully. Please refresh the page.")
      } catch (error) {
        alert("Failed to clear storage: " + (error instanceof Error ? error.message : "Unknown error"))
      }
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
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={handleDebug} variant="outline" size="sm" className="bg-white shadow-lg">
          <Bug className="h-4 w-4 mr-2" />
          Debug Storage
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Storage Debug Information</span>
            </DialogTitle>
            <DialogDescription>Detailed information about the knowledge base storage system</DialogDescription>
          </DialogHeader>

          {debugInfo?.error ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-600">{debugInfo.error}</p>
              </CardContent>
            </Card>
          ) : (
            debugInfo && (
              <div className="space-y-4">
                {/* Health Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-4 w-4" />
                      <span>Health Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Badge variant={debugInfo.health.isAvailable ? "default" : "destructive"}>
                          {debugInfo.health.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant={debugInfo.health.hasData ? "default" : "secondary"}>
                          {debugInfo.health.hasData ? "Has Data" : "No Data"}
                        </Badge>
                      </div>
                      <div>
                        <Badge variant={debugInfo.health.dataIntegrity ? "default" : "destructive"}>
                          {debugInfo.health.dataIntegrity ? "Data Intact" : "Data Corrupted"}
                        </Badge>
                      </div>
                      {debugInfo.health.lastError && (
                        <div className="col-span-2">
                          <p className="text-sm text-red-600">Last Error: {debugInfo.health.lastError}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Storage Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Database className="h-4 w-4" />
                      <span>Storage Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Total Size: {formatBytes(debugInfo.info.totalSize)}</div>
                      <div>Categories: {formatBytes(debugInfo.info.categoriesSize)}</div>
                      <div>Users: {formatBytes(debugInfo.info.usersSize)}</div>
                      <div>Audit Log: {formatBytes(debugInfo.info.auditLogSize)}</div>
                      <div>Page Visits: {formatBytes(debugInfo.info.pageVisitsSize)}</div>
                      <div>Available: {formatBytes(debugInfo.info.availableSpace)}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Counts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>Data Counts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">{debugInfo.counts.categories}</div>
                        <div className="text-sm text-gray-600">Categories</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{debugInfo.counts.articles}</div>
                        <div className="text-sm text-gray-600">Articles</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{debugInfo.counts.users}</div>
                        <div className="text-sm text-gray-600">Users</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Categories Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Categories Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {debugInfo.categories.map((cat: any) => (
                        <div key={cat.id} className="flex justify-between items-center text-sm">
                          <span>{cat.name}</span>
                          <div className="flex space-x-2">
                            <Badge variant="outline">{cat.articleCount} articles</Badge>
                            <Badge variant="outline">{cat.subcategoryCount} subcategories</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Users */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Users</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {debugInfo.users.map((user: any) => (
                        <div key={user.id} className="flex justify-between items-center text-sm">
                          <span>{user.username}</span>
                          <div className="flex space-x-2">
                            <Badge variant="outline">{user.role}</Badge>
                            <Badge variant={user.hasPassword ? "default" : "destructive"}>
                              {user.hasPassword ? "Has Password" : "No Password"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button onClick={handleClearStorage} variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
