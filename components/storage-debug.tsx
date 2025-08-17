"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { storage } from "../utils/storage"
import { Bug, X, Download, Trash2 } from "lucide-react"

export function StorageDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const refreshDebugInfo = () => {
    try {
      const categories = storage.getCategories()
      const users = storage.getUsers()
      const auditLog = storage.getAuditLog()
      const pageVisits = storage.getPageVisits()
      const storageInfo = storage.getStorageInfo()
      const healthCheck = storage.checkHealth()

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

      // Get detailed category breakdown
      const categoryBreakdown = categories.map((cat) => {
        const catArticles = Array.isArray(cat.articles) ? cat.articles.length : 0
        const subArticles = Array.isArray(cat.subcategories)
          ? cat.subcategories.reduce((total, sub) => total + (Array.isArray(sub.articles) ? sub.articles.length : 0), 0)
          : 0
        return {
          name: cat.name,
          id: cat.id,
          directArticles: catArticles,
          subcategoryArticles: subArticles,
          totalArticles: catArticles + subArticles,
          subcategories: Array.isArray(cat.subcategories)
            ? cat.subcategories.map((sub) => ({
                name: sub.name,
                id: sub.id,
                articles: Array.isArray(sub.articles) ? sub.articles.length : 0,
              }))
            : [],
        }
      })

      setDebugInfo({
        timestamp: new Date().toISOString(),
        healthCheck,
        storageInfo,
        summary: {
          categories: categories.length,
          totalArticles,
          users: users.length,
          auditLogEntries: auditLog.length,
          pageVisits,
        },
        categoryBreakdown,
        rawData: {
          categoriesLength: categories.length,
          usersLength: users.length,
          auditLogLength: auditLog.length,
        },
      })
    } catch (error) {
      console.error("Error getting debug info:", error)
      setDebugInfo({
        error: error.toString(),
        timestamp: new Date().toISOString(),
      })
    }
  }

  const handleExportData = () => {
    try {
      const data = {
        categories: storage.getCategories(),
        users: storage.getUsers(),
        auditLog: storage.getAuditLog(),
        pageVisits: storage.getPageVisits(),
        exportedAt: new Date().toISOString(),
        debugInfo,
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kb-debug-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export failed:", error)
      alert("Export failed: " + error)
    }
  }

  const handleClearStorage = () => {
    if (confirm("Are you sure you want to clear ALL storage data? This cannot be undone!")) {
      storage.clearAll(true)
      refreshDebugInfo()
      alert("Storage cleared! Refresh the page to see changes.")
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen(true)
          refreshDebugInfo()
        }}
        className="fixed bottom-4 right-4 z-50"
        size="sm"
        variant="outline"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug Storage
      </Button>
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
            <Button onClick={refreshDebugInfo} size="sm" variant="outline">
              Refresh
            </Button>
            <Button onClick={handleExportData} size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button onClick={handleClearStorage} size="sm" variant="destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
            <Button onClick={() => setIsOpen(false)} size="sm" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {debugInfo?.error ? (
            <div className="bg-red-50 border border-red-200 rounded p-4">
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-600">{debugInfo.error}</p>
            </div>
          ) : (
            <>
              {/* Health Check */}
              <div className="space-y-2">
                <h3 className="font-semibold">Storage Health</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={debugInfo?.healthCheck?.healthy ? "default" : "destructive"}>
                    {debugInfo?.healthCheck?.healthy ? "Healthy" : "Issues Detected"}
                  </Badge>
                  {debugInfo?.healthCheck?.issues?.length > 0 && (
                    <span className="text-sm text-red-600">Issues: {debugInfo.healthCheck.issues.join(", ")}</span>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <h3 className="font-semibold">Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-2xl font-bold text-blue-600">{debugInfo?.summary?.categories || 0}</div>
                    <div className="text-sm text-blue-800">Categories</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-2xl font-bold text-green-600">{debugInfo?.summary?.totalArticles || 0}</div>
                    <div className="text-sm text-green-800">Total Articles</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="text-2xl font-bold text-purple-600">{debugInfo?.summary?.users || 0}</div>
                    <div className="text-sm text-purple-800">Users</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded">
                    <div className="text-2xl font-bold text-orange-600">{debugInfo?.summary?.auditLogEntries || 0}</div>
                    <div className="text-sm text-orange-800">Audit Entries</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-2xl font-bold text-gray-600">{debugInfo?.summary?.pageVisits || 0}</div>
                    <div className="text-sm text-gray-800">Page Visits</div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-2">
                <h3 className="font-semibold">Category Breakdown</h3>
                <div className="space-y-2 max-h-60 overflow-auto">
                  {debugInfo?.categoryBreakdown?.map((cat: any) => (
                    <div key={cat.id} className="border rounded p-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{cat.name}</span>
                        <Badge variant="outline">
                          {cat.directArticles} + {cat.subcategoryArticles} = {cat.totalArticles} articles
                        </Badge>
                      </div>
                      {cat.subcategories?.length > 0 && (
                        <div className="mt-2 ml-4 space-y-1">
                          {cat.subcategories.map((sub: any) => (
                            <div key={sub.id} className="flex justify-between text-sm text-gray-600">
                              <span>└ {sub.name}</span>
                              <span>{sub.articles} articles</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Storage Info */}
              <div className="space-y-2">
                <h3 className="font-semibold">Storage Information</h3>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <div>Categories Data Size: {debugInfo?.storageInfo?.categoriesSize || 0} characters</div>
                  <div>Users Data Size: {debugInfo?.storageInfo?.usersSize || 0} characters</div>
                  <div>Audit Log Data Size: {debugInfo?.storageInfo?.auditLogSize || 0} characters</div>
                  <div>Total Storage Used: {debugInfo?.storageInfo?.totalStorageUsed || 0} characters</div>
                  <div>Data Version: {debugInfo?.storageInfo?.dataVersion || "Not set"}</div>
                  <div>Initialized: {debugInfo?.storageInfo?.hasInitialized ? "Yes" : "No"}</div>
                </div>
              </div>

              {/* Raw Data Preview */}
              <div className="space-y-2">
                <h3 className="font-semibold">Raw Data</h3>
                <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(debugInfo?.rawData, null, 2)}
                </pre>
              </div>

              <div className="text-xs text-gray-500">Last updated: {debugInfo?.timestamp}</div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
