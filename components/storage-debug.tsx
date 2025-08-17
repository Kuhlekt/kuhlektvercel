"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Bug, Database, Users, FileText, Activity, HardDrive } from "lucide-react"
import { storage } from "../utils/storage"

export function StorageDebug() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const handleDebug = () => {
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
      sampleData: {
        firstCategory: categories[0]?.name || "None",
        firstUser: users[0]?.username || "None",
        lastAuditEntry: auditLog[0]?.action || "None",
      },
      rawData: {
        categories: categories.slice(0, 2), // First 2 categories for inspection
        users: users.map((u) => ({ username: u.username, role: u.role })),
      },
    })
    setIsOpen(true)
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
      <Button
        onClick={handleDebug}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-white shadow-lg"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug Storage
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Storage Debug Information
            </DialogTitle>
            <DialogDescription>Detailed information about the knowledge base storage state</DialogDescription>
          </DialogHeader>

          {debugInfo && (
            <div className="space-y-6">
              {/* Health Status */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Health Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <span>Storage Available:</span>
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
                    <div className="col-span-2">
                      <span className="text-red-600">Last Error: {debugInfo.health.lastError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Storage Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Storage Usage
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Total Size: {formatBytes(debugInfo.info.totalSize)}</div>
                  <div>Available: {formatBytes(debugInfo.info.availableSpace)}</div>
                  <div>Categories: {formatBytes(debugInfo.info.categoriesSize)}</div>
                  <div>Users: {formatBytes(debugInfo.info.usersSize)}</div>
                  <div>Audit Log: {formatBytes(debugInfo.info.auditLogSize)}</div>
                  <div>Page Visits: {formatBytes(debugInfo.info.pageVisitsSize)}</div>
                </div>
              </div>

              {/* Data Counts */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Data Counts
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{debugInfo.counts.categories}</div>
                    <div className="text-sm text-blue-800">Categories</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{debugInfo.counts.articles}</div>
                    <div className="text-sm text-green-800">Articles</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{debugInfo.counts.users}</div>
                    <div className="text-sm text-purple-800">Users</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{debugInfo.counts.auditEntries}</div>
                    <div className="text-sm text-orange-800">Audit Entries</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">{debugInfo.counts.pageVisits}</div>
                    <div className="text-sm text-gray-800">Page Visits</div>
                  </div>
                </div>
              </div>

              {/* Sample Data */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Sample Data
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>First Category: {debugInfo.sampleData.firstCategory}</div>
                  <div>First User: {debugInfo.sampleData.firstUser}</div>
                  <div>Last Audit Entry: {debugInfo.sampleData.lastAuditEntry}</div>
                </div>
              </div>

              {/* Raw Data Preview */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Raw Data Preview</h3>
                <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-xs">{JSON.stringify(debugInfo.rawData, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
