"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Upload,
  Database,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  HardDrive,
  Users,
  FileText,
  Activity,
} from "lucide-react"

import { storage } from "../utils/storage"
import { initialData } from "../data/initial-data"
import { initialUsers } from "../data/initial-users"
import { initialAuditLog } from "../data/initial-audit-log"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [isLoadingInitial, setIsLoadingInitial] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)

  const storageInfo = storage.getStorageInfo()
  const storageHealth = storage.checkHealth()

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
      const subcategoryArticles = Array.isArray(category.subcategories)
        ? category.subcategories.reduce(
            (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
            0,
          )
        : 0
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  const handleExport = async () => {
    setIsExporting(true)
    setMessage(null)

    try {
      const exportData = storage.exportData()
      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Data exported successfully!" })
    } catch (error) {
      console.error("Export error:", error)
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setMessage({ type: "error", text: "Please paste the backup data first." })
      return
    }

    setIsImporting(true)
    setMessage(null)

    try {
      // Validate JSON
      const parsedData = JSON.parse(importData)

      if (!parsedData.categories && !parsedData.users && !parsedData.auditLog) {
        throw new Error("Invalid backup format")
      }

      // Import the data
      storage.importData(importData)

      setMessage({ type: "success", text: "Data imported successfully!" })
      setImportData("")

      // Notify parent to reload data
      setTimeout(() => {
        onDataImported()
      }, 1000)
    } catch (error) {
      console.error("Import error:", error)
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? `Import failed: ${error.message}`
            : "Failed to import data. Please check the format.",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleLoadInitialData = async () => {
    setIsLoadingInitial(true)
    setMessage(null)

    try {
      // Load initial data
      storage.saveCategories(initialData)
      storage.saveUsers(initialUsers)
      storage.saveAuditLog(initialAuditLog)

      setMessage({ type: "success", text: "Initial demo data loaded successfully!" })

      // Notify parent to reload data
      setTimeout(() => {
        onDataImported()
      }, 1000)
    } catch (error) {
      console.error("Load initial data error:", error)
      setMessage({ type: "error", text: "Failed to load initial data. Please try again." })
    } finally {
      setIsLoadingInitial(false)
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear ALL data? This cannot be undone!")) {
      return
    }

    setIsClearing(true)
    setMessage(null)

    try {
      storage.clearAll()
      setMessage({ type: "success", text: "All data cleared successfully!" })

      // Notify parent to reload data
      setTimeout(() => {
        onDataImported()
      }, 1000)
    } catch (error) {
      console.error("Clear data error:", error)
      setMessage({ type: "error", text: "Failed to clear data. Please try again." })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Status Message */}
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
          {message.type === "error" ? (
            <AlertTriangle className="h-4 w-4" />
          ) : message.type === "success" ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="storage">Storage Health</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{getTotalArticles()}</p>
                    <p className="text-sm text-gray-600">Articles</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{categories.length}</p>
                    <p className="text-sm text-gray-600">Categories</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{users.length}</p>
                    <p className="text-sm text-gray-600">Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{auditLog.length}</p>
                    <p className="text-sm text-gray-600">Audit Entries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Storage Used:</span>
                  <Badge variant="outline">{formatBytes(storageInfo.totalSize)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Categories Data:</span>
                  <Badge variant="outline">{formatBytes(storageInfo.categoriesSize)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Users Data:</span>
                  <Badge variant="outline">{formatBytes(storageInfo.usersSize)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Audit Log Data:</span>
                  <Badge variant="outline">{formatBytes(storageInfo.auditLogSize)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Download a complete backup of all your knowledge base data including articles, categories, users, and
                  audit logs.
                </p>
                <Button onClick={handleExport} disabled={isExporting} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Export All Data"}
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
                  Restore your knowledge base from a backup file. This will replace all current data.
                </p>
                <Textarea
                  placeholder="Paste your backup JSON data here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={6}
                />
                <Button onClick={handleImport} disabled={isImporting || !importData.trim()} className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? "Importing..." : "Import Data"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5" />
                <span>Storage Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Storage Available:</span>
                    <Badge variant={storageHealth.isAvailable ? "default" : "destructive"}>
                      {storageHealth.isAvailable ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Has Data:</span>
                    <Badge variant={storageHealth.hasData ? "default" : "secondary"}>
                      {storageHealth.hasData ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Data Integrity:</span>
                    <Badge variant={storageHealth.dataIntegrity ? "default" : "destructive"}>
                      {storageHealth.dataIntegrity ? "Good" : "Issues"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Available Space:</span>
                    <Badge variant="outline">{formatBytes(storageInfo.availableSpace)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Used:</span>
                    <Badge variant="outline">{formatBytes(storageInfo.totalSize)}</Badge>
                  </div>
                </div>
              </div>

              {storageHealth.lastError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Last Error:</strong> {storageHealth.lastError}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Load Demo Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Load the initial demo data with sample articles and categories. This will add to existing data.
                </p>
                <Button onClick={handleLoadInitialData} disabled={isLoadingInitial} className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  {isLoadingInitial ? "Loading..." : "Load Demo Data"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-600">
                  <Trash2 className="h-5 w-5" />
                  <span>Clear All Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Permanently delete all data including articles, categories, users, and audit logs. This cannot be
                  undone!
                </p>
                <Button onClick={handleClearAll} disabled={isClearing} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isClearing ? "Clearing..." : "Clear All Data"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
