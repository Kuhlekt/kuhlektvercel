"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Download,
  Upload,
  Database,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  HardDrive,
} from "lucide-react"
import { storage } from "../utils/storage"
import { initialCategories } from "../data/initial-data"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)

  const showMessage = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const exportData = async () => {
    try {
      setIsExporting(true)

      const exportData = {
        categories,
        users: users.map((user) => ({ ...user, password: "[REDACTED]" })), // Don't export passwords
        auditLog,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })

      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      showMessage("success", "Data exported successfully!")
    } catch (error) {
      console.error("Export error:", error)
      showMessage("error", "Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      setImportProgress(0)

      const text = await file.text()
      setImportProgress(25)

      const importedData = JSON.parse(text)
      setImportProgress(50)

      // Validate the imported data structure
      if (!importedData.categories || !Array.isArray(importedData.categories)) {
        throw new Error("Invalid data format: missing or invalid categories")
      }

      // Import categories
      if (importedData.categories) {
        storage.saveCategories(importedData.categories)
        setImportProgress(75)
      }

      // Import users (but keep existing passwords)
      if (importedData.users && Array.isArray(importedData.users)) {
        const existingUsers = storage.getUsers() || []
        const mergedUsers = importedData.users.map((importedUser: User) => {
          const existingUser = existingUsers.find((u) => u.username === importedUser.username)
          return existingUser ? { ...importedUser, password: existingUser.password } : importedUser
        })
        storage.saveUsers(mergedUsers)
      }

      // Import audit log
      if (importedData.auditLog && Array.isArray(importedData.auditLog)) {
        storage.saveAuditLog(importedData.auditLog)
      }

      setImportProgress(100)
      showMessage("success", "Data imported successfully!")
      onDataImported()
    } catch (error) {
      console.error("Import error:", error)
      showMessage("error", `Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsImporting(false)
      setImportProgress(0)
      // Reset the file input
      event.target.value = ""
    }
  }

  const loadDemoData = async () => {
    try {
      setIsImporting(true)
      setImportProgress(0)

      // Load initial categories with demo data
      storage.saveCategories(initialCategories)
      setImportProgress(50)

      // Create demo audit entry
      const demoAuditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "data_import",
        entityType: "system",
        entityId: "demo",
        performedBy: "system",
        timestamp: new Date(),
        details: "Demo data loaded successfully",
      }

      const existingAuditLog = storage.getAuditLog() || []
      storage.saveAuditLog([demoAuditEntry, ...existingAuditLog])
      setImportProgress(100)

      showMessage("success", "Demo data loaded successfully!")
      onDataImported()
    } catch (error) {
      console.error("Demo data load error:", error)
      showMessage("error", "Failed to load demo data")
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  const clearAllData = async () => {
    if (!window.confirm("Are you sure you want to clear ALL data? This action cannot be undone!")) {
      return
    }

    try {
      setIsClearing(true)

      // Clear all storage
      storage.clearAll()

      showMessage("success", "All data cleared successfully!")
      onDataImported()
    } catch (error) {
      console.error("Clear data error:", error)
      showMessage("error", "Failed to clear data")
    } finally {
      setIsClearing(false)
    }
  }

  const getStorageStats = () => {
    const categoriesSize = JSON.stringify(categories).length
    const usersSize = JSON.stringify(users).length
    const auditLogSize = JSON.stringify(auditLog).length
    const totalSize = categoriesSize + usersSize + auditLogSize

    return {
      categories: {
        count: categories.length,
        size: categoriesSize,
        articles: categories.reduce((total, cat) => {
          const catArticles = cat.articles?.length || 0
          const subArticles =
            cat.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
          return total + catArticles + subArticles
        }, 0),
      },
      users: {
        count: users.length,
        size: usersSize,
      },
      auditLog: {
        count: auditLog.length,
        size: auditLogSize,
      },
      total: {
        size: totalSize,
        sizeFormatted: formatBytes(totalSize),
      },
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const stats = getStorageStats()

  return (
    <div className="space-y-6">
      {message && (
        <Alert
          className={
            message.type === "error"
              ? "border-red-200 bg-red-50"
              : message.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-blue-200 bg-blue-50"
          }
        >
          <div className="flex items-center">
            {message.type === "error" && <AlertTriangle className="h-4 w-4 text-red-600" />}
            {message.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
            {message.type === "info" && <Info className="h-4 w-4 text-blue-600" />}
            <AlertDescription className="ml-2">{message.text}</AlertDescription>
          </div>
        </Alert>
      )}

      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="storage">Storage Info</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Download a complete backup of your knowledge base data including articles, categories, and audit logs.
                </p>
                <Button onClick={exportData} disabled={isExporting} className="w-full">
                  {isExporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Backup
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Import Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Restore your knowledge base from a previously exported backup file.
                </p>
                {isImporting && (
                  <div className="space-y-2">
                    <Progress value={importProgress} className="w-full" />
                    <p className="text-sm text-center">{importProgress}% complete</p>
                  </div>
                )}
                <div className="space-y-2">
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    disabled={isImporting}
                    className="hidden"
                    id="import-file"
                  />
                  <Button
                    onClick={() => document.getElementById("import-file")?.click()}
                    disabled={isImporting}
                    className="w-full"
                    variant="outline"
                  >
                    {isImporting ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Import Backup
                      </>
                    )}
                  </Button>
                  <Button onClick={loadDemoData} disabled={isImporting} className="w-full" variant="secondary">
                    <Database className="h-4 w-4 mr-2" />
                    Load Demo Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5" />
                <span>Storage Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.categories.count}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                  <div className="text-xs text-gray-500">{stats.categories.articles} articles</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.users.count}</div>
                  <div className="text-sm text-gray-600">Users</div>
                  <div className="text-xs text-gray-500">{formatBytes(stats.users.size)}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.auditLog.count}</div>
                  <div className="text-sm text-gray-600">Audit Entries</div>
                  <div className="text-xs text-gray-500">{formatBytes(stats.auditLog.size)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Storage Used:</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    {stats.total.sizeFormatted}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  These actions are irreversible. Make sure you have a backup before proceeding.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="p-4 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">Clear All Data</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    This will permanently delete all articles, categories, users, and audit logs.
                  </p>
                  <Button onClick={clearAllData} disabled={isClearing} variant="destructive" size="sm">
                    {isClearing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Clearing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Data
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
