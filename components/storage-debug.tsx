"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bug, Database, Download, Trash2, RefreshCw } from "lucide-react"
import { storage } from "../utils/storage"

export function StorageDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refreshDebugInfo = () => {
    setIsLoading(true)
    try {
      const health = storage.checkHealth()
      const info = storage.getStorageInfo()
      const categories = storage.getCategories()
      const users = storage.getUsers()
      const auditLog = storage.getAuditLog()
      const pageVisits = storage.getPageVisits()

      // Calculate article counts
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

      const categoryBreakdown = categories.map((category) => ({
        name: category.name,
        id: category.id,
        articleCount: Array.isArray(category.articles) ? category.articles.length : 0,
        subcategoryCount: Array.isArray(category.subcategories) ? category.subcategories.length : 0,
        subcategories: Array.isArray(category.subcategories)
          ? category.subcategories.map((sub) => ({
              name: sub.name,
              id: sub.id,
              articleCount: Array.isArray(sub.articles) ? sub.articles.length : 0,
            }))
          : [],
      }))

      setDebugInfo({
        health,
        info,
        counts: {
          categories: categories.length,
          users: users.length,
          auditEntries: auditLog.length,
          pageVisits,
          totalArticles,
        },
        categoryBreakdown,
        rawData: {
          categories: categories.slice(0, 2), // Show first 2 categories for inspection
          users: users.map((u) => ({ ...u, password: "[HIDDEN]" })), // Hide passwords
          auditLog: auditLog.slice(0, 5), // Show first 5 audit entries
        },
        localStorage: {
          keys: Object.keys(localStorage).filter((key) => key.startsWith("kuhlekt_kb_")),
          totalKeys: localStorage.length,
        },
      })
    } catch (error) {
      console.error("Debug info error:", error)
      setDebugInfo({ error: error instanceof Error ? error.message : "Unknown error" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportData = () => {
    try {
      const data = storage.exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      try {
        storage.clearAll()
        refreshDebugInfo()
        alert("All data cleared successfully")
      } catch (error) {
        console.error("Clear data failed:", error)
        alert("Failed to clear data")
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 right-4 z-50 bg-transparent"
          onClick={refreshDebugInfo}
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug Storage
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Debug Information
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button onClick={refreshDebugInfo} disabled={isLoading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleExportData} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={handleClearData} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </div>

        <ScrollArea className="h-[60vh]">
          {debugInfo?.error ? (
            <Alert variant="destructive">
              <AlertDescription>{debugInfo.error}</AlertDescription>
            </Alert>
          ) : debugInfo ? (
            <div className="space-y-4">
              {/* Health Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Storage Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span>Available:</span>
                    <Badge variant={debugInfo.health.isAvailable ? "default" : "destructive"}>
                      {debugInfo.health.isAvailable ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Has Data:</span>
                    <Badge variant={debugInfo.health.hasData ? "default" : "secondary"}>
                      {debugInfo.health.hasData ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Data Integrity:</span>
                    <Badge variant={debugInfo.health.dataIntegrity ? "default" : "destructive"}>
                      {debugInfo.health.dataIntegrity ? "Good" : "Corrupted"}
                    </Badge>
                  </div>
                  {debugInfo.health.lastError && (
                    <div className="text-sm text-red-600">Last Error: {debugInfo.health.lastError}</div>
                  )}
                </CardContent>
              </Card>

              {/* Storage Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Storage Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>Total Size: {formatBytes(debugInfo.info.totalSize)}</div>
                  <div>Categories: {formatBytes(debugInfo.info.categoriesSize)}</div>
                  <div>Users: {formatBytes(debugInfo.info.usersSize)}</div>
                  <div>Audit Log: {formatBytes(debugInfo.info.auditLogSize)}</div>
                  <div>Page Visits: {formatBytes(debugInfo.info.pageVisitsSize)}</div>
                  <div>Available Space: {formatBytes(debugInfo.info.availableSpace)}</div>
                </CardContent>
              </Card>

              {/* Data Counts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Counts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>Categories: {debugInfo.counts.categories}</div>
                  <div>Total Articles: {debugInfo.counts.totalArticles}</div>
                  <div>Users: {debugInfo.counts.users}</div>
                  <div>Audit Entries: {debugInfo.counts.auditEntries}</div>
                  <div>Page Visits: {debugInfo.counts.pageVisits}</div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {debugInfo.categoryBreakdown.map((category: any, index: number) => (
                      <div key={category.id} className="border rounded p-3">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-gray-600">
                          ID: {category.id} | Articles: {category.articleCount} | Subcategories:{" "}
                          {category.subcategoryCount}
                        </div>
                        {category.subcategories.length > 0 && (
                          <div className="mt-2 ml-4 space-y-1">
                            {category.subcategories.map((sub: any) => (
                              <div key={sub.id} className="text-sm">
                                └ {sub.name} ({sub.articleCount} articles)
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* LocalStorage Keys */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">LocalStorage Keys</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <div>Total Keys: {debugInfo.localStorage.totalKeys}</div>
                    <div>Kuhlekt KB Keys:</div>
                    <ul className="list-disc list-inside ml-4">
                      {debugInfo.localStorage.keys.map((key: string) => (
                        <li key={key}>{key}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Raw Data Sample */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Raw Data Sample</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-40">
                    {JSON.stringify(debugInfo.rawData, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Loading debug information...</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
