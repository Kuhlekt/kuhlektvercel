"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storage } from "../utils/storage"
import { Bug, X, RefreshCw, Download, Trash2 } from "lucide-react"

export function StorageDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const refreshDebugInfo = () => {
    const health = storage.checkHealth()
    const info = storage.getStorageInfo()
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
      rawData: {
        categories: categories.slice(0, 2), // Show first 2 categories for debugging
        users: users.map((u) => ({ ...u, password: "***" })), // Hide passwords
        auditLog: auditLog.slice(0, 3), // Show first 3 audit entries
      },
    })
  }

  const handleExport = () => {
    try {
      const data = storage.exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kuhlekt-kb-debug-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      storage.clearAll()
      refreshDebugInfo()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => {
            setIsOpen(true)
            refreshDebugInfo()
          }}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          <Bug className="h-4 w-4 mr-2" />
          Debug Storage
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Storage Debug Information
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={refreshDebugInfo} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            <Button onClick={handleClearAll} variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {debugInfo && (
            <>
              {/* Health Status */}
              <div>
                <h3 className="font-semibold mb-2">Health Status</h3>
                <div className="flex gap-2 mb-2">
                  <Badge variant={debugInfo.health.isAvailable ? "default" : "destructive"}>
                    {debugInfo.health.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                  <Badge variant={debugInfo.health.hasData ? "default" : "secondary"}>
                    {debugInfo.health.hasData ? "Has Data" : "No Data"}
                  </Badge>
                  <Badge variant={debugInfo.health.dataIntegrity ? "default" : "destructive"}>
                    {debugInfo.health.dataIntegrity ? "Integrity OK" : "Integrity Issues"}
                  </Badge>
                </div>
                {debugInfo.health.lastError && (
                  <p className="text-sm text-red-600">Last Error: {debugInfo.health.lastError}</p>
                )}
              </div>

              {/* Storage Info */}
              <div>
                <h3 className="font-semibold mb-2">Storage Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <strong>Total Size:</strong> {Math.round(debugInfo.info.totalSize / 1024)} KB
                  </div>
                  <div>
                    <strong>Categories:</strong> {Math.round(debugInfo.info.categoriesSize / 1024)} KB
                  </div>
                  <div>
                    <strong>Users:</strong> {Math.round(debugInfo.info.usersSize / 1024)} KB
                  </div>
                  <div>
                    <strong>Audit Log:</strong> {Math.round(debugInfo.info.auditLogSize / 1024)} KB
                  </div>
                  <div>
                    <strong>Available:</strong> {Math.round(debugInfo.info.availableSpace / 1024)} KB
                  </div>
                </div>
              </div>

              {/* Data Counts */}
              <div>
                <h3 className="font-semibold mb-2">Data Counts</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <strong>Categories:</strong> {debugInfo.counts.categories}
                  </div>
                  <div>
                    <strong>Articles:</strong> {debugInfo.counts.articles}
                  </div>
                  <div>
                    <strong>Users:</strong> {debugInfo.counts.users}
                  </div>
                  <div>
                    <strong>Audit Entries:</strong> {debugInfo.counts.auditEntries}
                  </div>
                  <div>
                    <strong>Page Visits:</strong> {debugInfo.counts.pageVisits}
                  </div>
                </div>
              </div>

              {/* Sample Data */}
              <div>
                <h3 className="font-semibold mb-2">Sample Data</h3>
                <div className="space-y-2">
                  <details>
                    <summary className="cursor-pointer text-sm font-medium">Categories (first 2)</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
                      {JSON.stringify(debugInfo.rawData.categories, null, 2)}
                    </pre>
                  </details>
                  <details>
                    <summary className="cursor-pointer text-sm font-medium">Users</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
                      {JSON.stringify(debugInfo.rawData.users, null, 2)}
                    </pre>
                  </details>
                  <details>
                    <summary className="cursor-pointer text-sm font-medium">Audit Log (first 3)</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
                      {JSON.stringify(debugInfo.rawData.auditLog, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
