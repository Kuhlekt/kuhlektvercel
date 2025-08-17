"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bug, Database, HardDrive, FileText, Activity } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface StorageDebugProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
}

export function StorageDebug({ categories, users, auditLog }: StorageDebugProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const runDiagnostics = () => {
    const health = storage.checkHealth()
    const storageInfo = storage.getStorageInfo()

    // Count articles
    const totalArticles = categories.reduce((total, category) => {
      const categoryArticles = category.articles.length
      const subcategoryArticles = category.subcategories.reduce((subTotal, sub) => subTotal + sub.articles.length, 0)
      return total + categoryArticles + subcategoryArticles
    }, 0)

    // Get localStorage keys
    const localStorageKeys = Object.keys(localStorage).filter(
      (key) => key.startsWith("kuhlekt_kb_") || key.startsWith("kb_"),
    )

    // Get raw data sizes
    const rawData = {
      categories: localStorage.getItem("kuhlekt_kb_categories") || localStorage.getItem("kb_categories"),
      users: localStorage.getItem("kuhlekt_kb_users") || localStorage.getItem("kb_users"),
      auditLog: localStorage.getItem("kuhlekt_kb_audit_log") || localStorage.getItem("kb_audit_log"),
      pageVisits: localStorage.getItem("kuhlekt_kb_page_visits") || localStorage.getItem("kb_page_visits"),
    }

    const info = {
      timestamp: new Date().toISOString(),
      health,
      storageInfo,
      counts: {
        categories: categories.length,
        totalArticles,
        users: users.length,
        auditEntries: auditLog.length,
      },
      localStorage: {
        keys: localStorageKeys,
        rawDataSizes: {
          categories: rawData.categories ? rawData.categories.length : 0,
          users: rawData.users ? rawData.users.length : 0,
          auditLog: rawData.auditLog ? rawData.auditLog.length : 0,
          pageVisits: rawData.pageVisits ? rawData.pageVisits.length : 0,
        },
        hasData: {
          categories: !!rawData.categories,
          users: !!rawData.users,
          auditLog: !!rawData.auditLog,
          pageVisits: !!rawData.pageVisits,
        },
      },
      categoryBreakdown: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        articles: cat.articles.length,
        subcategories: cat.subcategories.length,
        subcategoryArticles: cat.subcategories.reduce((total, sub) => total + sub.articles.length, 0),
      })),
    }

    setDebugInfo(info)
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
        onClick={runDiagnostics}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-transparent"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug Storage
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Storage Debug Information</span>
            </DialogTitle>
            <DialogDescription>Detailed information about the knowledge base storage system</DialogDescription>
          </DialogHeader>

          {debugInfo && (
            <div className="space-y-6">
              {/* Health Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-4 w-4" />
                    <span>Health Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
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
                      <Alert variant="destructive">
                        <AlertDescription>{debugInfo.health.lastError}</AlertDescription>
                      </Alert>
                    )}
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{debugInfo.counts.categories}</div>
                      <div className="text-sm text-gray-600">Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{debugInfo.counts.totalArticles}</div>
                      <div className="text-sm text-gray-600">Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{debugInfo.counts.users}</div>
                      <div className="text-sm text-gray-600">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{debugInfo.counts.auditEntries}</div>
                      <div className="text-sm text-gray-600">Audit Entries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Storage Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HardDrive className="h-4 w-4" />
                    <span>Storage Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Total Size</div>
                        <div className="font-mono">{formatBytes(debugInfo.storageInfo.totalSize)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Categories</div>
                        <div className="font-mono">{formatBytes(debugInfo.storageInfo.categoriesSize)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Users</div>
                        <div className="font-mono">{formatBytes(debugInfo.storageInfo.usersSize)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Audit Log</div>
                        <div className="font-mono">{formatBytes(debugInfo.storageInfo.auditLogSize)}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600 mb-2">localStorage Keys:</div>
                      <div className="flex flex-wrap gap-1">
                        {debugInfo.localStorage.keys.map((key: string) => (
                          <Badge key={key} variant="outline" className="text-xs">
                            {key}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {debugInfo.categoryBreakdown.map((cat: any) => (
                      <div key={cat.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium">{cat.name}</div>
                          <div className="text-sm text-gray-600">ID: {cat.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm">
                            {cat.articles} articles, {cat.subcategories} subcategories
                          </div>
                          <div className="text-xs text-gray-600">{cat.subcategoryArticles} in subcategories</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Raw Data Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Raw Data Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(debugInfo.localStorage.hasData).map(([key, hasData]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="capitalize">{key}</span>
                        <Badge variant={hasData ? "default" : "secondary"}>{hasData ? "Present" : "Missing"}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="text-xs text-gray-500 text-center">Debug run at: {debugInfo.timestamp}</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
