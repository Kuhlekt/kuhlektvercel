"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Download,
  Upload,
  FileText,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Database,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { storage } from "../utils/storage"

interface DataManagementProps {
  onDataImported?: () => void
}

export function DataManagement({ onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })

  const handleExport = async () => {
    setIsExporting(true)
    setStatus({ type: "info", message: "Preparing export..." })

    try {
      const categories = storage.getCategories()
      const users = storage.getUsers()
      const auditLog = storage.getAuditLog()
      const pageVisits = storage.getPageVisits()

      const exportData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        data: {
          categories,
          users,
          auditLog,
          pageVisits,
        },
        stats: {
          totalCategories: categories.length,
          totalUsers: users.length,
          totalAuditEntries: auditLog.length,
          totalArticles: categories.reduce((total, category) => {
            const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
            const subcategoryArticles = Array.isArray(category.subcategories)
              ? category.subcategories.reduce(
                  (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
                  0,
                )
              : 0
            return total + categoryArticles + subcategoryArticles
          }, 0),
        },
      }

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setStatus({
        type: "success",
        message: `Export completed! Downloaded backup with ${exportData.stats.totalArticles} articles.`,
      })
    } catch (error) {
      console.error("Export error:", error)
      setStatus({
        type: "error",
        message: "Export failed. Please try again.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const validateImportData = (data: any): boolean => {
    if (!data || typeof data !== "object") {
      setStatus({ type: "error", message: "Invalid JSON format" })
      return false
    }

    if (!data.data) {
      setStatus({ type: "error", message: "Missing data section in backup" })
      return false
    }

    const { categories, users, auditLog } = data.data

    if (!Array.isArray(categories)) {
      setStatus({ type: "error", message: "Invalid categories data" })
      return false
    }

    if (!Array.isArray(users)) {
      setStatus({ type: "error", message: "Invalid users data" })
      return false
    }

    if (!Array.isArray(auditLog)) {
      setStatus({ type: "error", message: "Invalid audit log data" })
      return false
    }

    return true
  }

  const convertDates = (obj: any): any => {
    if (obj === null || obj === undefined) return obj
    if (typeof obj === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
      return new Date(obj)
    }
    if (Array.isArray(obj)) {
      return obj.map(convertDates)
    }
    if (typeof obj === "object") {
      const converted: any = {}
      for (const key in obj) {
        converted[key] = convertDates(obj[key])
      }
      return converted
    }
    return obj
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setStatus({ type: "error", message: "Please provide data to import" })
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setStatus({ type: "info", message: "Parsing import data..." })

    try {
      let parsedData
      try {
        parsedData = JSON.parse(importData)
      } catch (parseError) {
        setStatus({ type: "error", message: "Invalid JSON format. Please check your data." })
        return
      }

      setImportProgress(20)

      if (!validateImportData(parsedData)) {
        return
      }

      setImportProgress(40)
      setStatus({ type: "info", message: "Converting date formats..." })

      const convertedData = convertDates(parsedData.data)
      setImportProgress(60)

      setStatus({ type: "info", message: "Saving data to storage..." })

      // Save all data
      storage.saveCategories(convertedData.categories)
      storage.saveUsers(convertedData.users)
      storage.saveAuditLog(convertedData.auditLog)

      if (convertedData.pageVisits) {
        localStorage.setItem("kb_page_visits", convertedData.pageVisits.toString())
      }

      setImportProgress(80)

      // Add import audit entry
      storage.addAuditEntry({
        action: "data_imported",
        articleId: undefined,
        articleTitle: undefined,
        categoryName: undefined,
        subcategoryName: undefined,
        performedBy: "admin",
        timestamp: new Date(),
        details: `Imported ${parsedData.stats?.totalArticles || "unknown"} articles`,
      })

      setImportProgress(100)

      const totalArticles = parsedData.stats?.totalArticles || 0
      setStatus({
        type: "success",
        message: `Import completed successfully! Imported ${totalArticles} articles, ${convertedData.users.length} users, and ${convertedData.auditLog.length} audit entries.`,
      })

      setImportData("")

      // Notify parent component
      if (onDataImported) {
        onDataImported()
      }

      // Refresh the page after a short delay to ensure all components reload
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error("Import error:", error)
      setStatus({
        type: "error",
        message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setStatus({ type: "error", message: "Please select a JSON file" })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
      setStatus({ type: "info", message: "File loaded successfully. Click Import to proceed." })
    }
    reader.onerror = () => {
      setStatus({ type: "error", message: "Failed to read file" })
    }
    reader.readAsText(file)
  }

  const handleClearAllData = async () => {
    if (!confirm("Are you sure you want to clear ALL data? This action cannot be undone!")) {
      return
    }

    if (!confirm("This will delete all articles, users, and audit logs. Are you absolutely sure?")) {
      return
    }

    try {
      storage.clearAllData()
      setStatus({
        type: "success",
        message: "All data cleared successfully. The page will reload.",
      })

      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error("Clear data error:", error)
      setStatus({
        type: "error",
        message: "Failed to clear data. Please try again.",
      })
    }
  }

  const getCurrentStats = () => {
    try {
      const categories = storage.getCategories()
      const users = storage.getUsers()
      const auditLog = storage.getAuditLog()

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

      return {
        categories: categories.length,
        articles: totalArticles,
        users: users.length,
        auditEntries: auditLog.length,
      }
    } catch (error) {
      return {
        categories: 0,
        articles: 0,
        users: 0,
        auditEntries: 0,
      }
    }
  }

  const stats = getCurrentStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Data Management</h2>
        <p className="text-gray-600">Import and export your knowledge base data</p>
      </div>

      {/* Status Alert */}
      {status.type && (
        <Alert
          className={
            status.type === "success"
              ? "border-green-200 bg-green-50"
              : status.type === "error"
                ? "border-red-200 bg-red-50"
                : "border-blue-200 bg-blue-50"
          }
        >
          {status.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : status.type === "error" ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <Database className="h-4 w-4 text-blue-600" />
          )}
          <AlertDescription
            className={
              status.type === "success" ? "text-green-800" : status.type === "error" ? "text-red-800" : "text-blue-800"
            }
          >
            {status.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Progress Bar */}
      {isImporting && importProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Import Progress</span>
            <span>{importProgress}%</span>
          </div>
          <Progress value={importProgress} className="w-full" />
        </div>
      )}

      {/* Current Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Current Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.articles}</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.categories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.users}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.auditEntries}</div>
              <div className="text-sm text-gray-600">Audit Entries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="manage">Manage Data</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Import Knowledge Base Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Upload JSON File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  disabled={isImporting}
                />
                <p className="text-sm text-gray-600">Select a JSON backup file to upload</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or paste data directly</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="import-textarea">Paste JSON Data</Label>
                <Textarea
                  id="import-textarea"
                  placeholder="Paste your JSON backup data here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={10}
                  disabled={isImporting}
                  className="font-mono text-sm"
                />
              </div>

              <Button onClick={handleImport} disabled={isImporting || !importData.trim()} className="w-full">
                {isImporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Knowledge Base Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Export all your knowledge base data including articles, categories, users, and audit logs as a JSON
                backup file.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Badge variant="outline" className="mb-1">
                    <FileText className="h-3 w-3 mr-1" />
                    Articles
                  </Badge>
                  <div className="text-lg font-semibold">{stats.articles}</div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-1">
                    <Database className="h-3 w-3 mr-1" />
                    Categories
                  </Badge>
                  <div className="text-lg font-semibold">{stats.categories}</div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-1">
                    <Users className="h-3 w-3 mr-1" />
                    Users
                  </Badge>
                  <div className="text-lg font-semibold">{stats.users}</div>
                </div>
                <div className="text-center">
                  <Badge variant="outline" className="mb-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Audit Logs
                  </Badge>
                  <div className="text-lg font-semibold">{stats.auditEntries}</div>
                </div>
              </div>

              <Button onClick={handleExport} disabled={isExporting} className="w-full">
                {isExporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Warning:</strong> The following actions are irreversible and will permanently delete data.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-900 mb-2">Clear All Data</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    This will permanently delete all articles, categories, users, and audit logs. Make sure to export
                    your data first if you want to keep a backup.
                  </p>
                  <Button variant="destructive" onClick={handleClearAllData}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All Data
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
