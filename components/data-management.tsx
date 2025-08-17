"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Download,
  FileText,
  Database,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

interface ImportData {
  categories?: Category[]
  users?: User[]
  auditLog?: AuditLogEntry[]
  pageVisits?: number
  version?: string
  exportedAt?: string
}

interface ImportStats {
  categories: number
  articles: number
  users: number
  auditEntries: number
  pageVisits: number
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<"idle" | "importing" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const [previewData, setPreviewData] = useState<ImportData | null>(null)
  const [previewStats, setPreviewStats] = useState<ImportStats | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const calculateStats = (data: ImportData): ImportStats => {
    const categoriesCount = Array.isArray(data.categories) ? data.categories.length : 0
    const articlesCount = Array.isArray(data.categories)
      ? data.categories.reduce((total, category) => {
          const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
          const subcategoryArticles = Array.isArray(category.subcategories)
            ? category.subcategories.reduce(
                (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
                0,
              )
            : 0
          return total + categoryArticles + subcategoryArticles
        }, 0)
      : 0

    return {
      categories: categoriesCount,
      articles: articlesCount,
      users: Array.isArray(data.users) ? data.users.length : 0,
      auditEntries: Array.isArray(data.auditLog) ? data.auditLog.length : 0,
      pageVisits: typeof data.pageVisits === "number" ? data.pageVisits : 0,
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
      handlePreview(content)
    }
    reader.readAsText(file)
  }

  const handlePreview = (jsonData: string = importData) => {
    try {
      if (!jsonData.trim()) {
        setImportMessage("Please provide JSON data to preview")
        setImportStatus("error")
        return
      }

      const parsed = JSON.parse(jsonData)

      // Handle different JSON structures
      let processedData: ImportData

      if (Array.isArray(parsed)) {
        // If it's an array, assume it's categories
        processedData = { categories: parsed }
      } else if (parsed.categories || parsed.users || parsed.auditLog) {
        // If it has expected properties, use as-is
        processedData = parsed
      } else {
        // Try to find nested data
        const keys = Object.keys(parsed)
        if (keys.length === 1 && typeof parsed[keys[0]] === "object") {
          processedData = parsed[keys[0]]
        } else {
          processedData = parsed
        }
      }

      const stats = calculateStats(processedData)

      setPreviewData(processedData)
      setPreviewStats(stats)
      setShowPreview(true)
      setImportStatus("idle")
      setImportMessage("")

      console.log("Preview data processed:", {
        structure: processedData,
        stats,
      })
    } catch (error) {
      console.error("Preview error:", error)
      setImportMessage(`Invalid JSON format: ${error instanceof Error ? error.message : "Unknown error"}`)
      setImportStatus("error")
      setPreviewData(null)
      setPreviewStats(null)
      setShowPreview(false)
    }
  }

  const handleImport = async () => {
    if (!previewData) {
      setImportMessage("Please preview the data first")
      setImportStatus("error")
      return
    }

    setImportStatus("importing")
    setImportProgress(0)
    setImportMessage("Starting import...")

    try {
      // Import categories
      if (Array.isArray(previewData.categories) && previewData.categories.length > 0) {
        setImportMessage("Importing categories...")
        setImportProgress(25)

        // Convert date strings to Date objects
        const categoriesWithDates = previewData.categories.map((category: any) => ({
          ...category,
          articles: (category.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
            editCount: article.editCount || 0,
          })),
          subcategories: (category.subcategories || []).map((subcategory: any) => ({
            ...subcategory,
            articles: (subcategory.articles || []).map((article: any) => ({
              ...article,
              createdAt: new Date(article.createdAt),
              updatedAt: new Date(article.updatedAt),
              editCount: article.editCount || 0,
            })),
          })),
        }))

        storage.saveCategories(categoriesWithDates)
        console.log("Categories imported successfully")
      }

      // Import users
      if (Array.isArray(previewData.users) && previewData.users.length > 0) {
        setImportMessage("Importing users...")
        setImportProgress(50)

        const usersWithDates = previewData.users.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        }))

        storage.saveUsers(usersWithDates)
        console.log("Users imported successfully")
      }

      // Import audit log
      if (Array.isArray(previewData.auditLog) && previewData.auditLog.length > 0) {
        setImportMessage("Importing audit log...")
        setImportProgress(75)

        const auditLogWithDates = previewData.auditLog.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))

        storage.saveAuditLog(auditLogWithDates)
        console.log("Audit log imported successfully")
      }

      // Import page visits
      if (typeof previewData.pageVisits === "number") {
        setImportMessage("Importing page visits...")
        localStorage.setItem("kuhlekt_kb_page_visits", previewData.pageVisits.toString())
        console.log("Page visits imported successfully")
      }

      setImportProgress(100)
      setImportMessage("Import completed successfully!")
      setImportStatus("success")

      // Clear form
      setImportData("")
      setPreviewData(null)
      setPreviewStats(null)
      setShowPreview(false)

      // Notify parent component
      onDataImported()

      console.log("Data import completed successfully")
    } catch (error) {
      console.error("Import error:", error)
      setImportMessage(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setImportStatus("error")
      setImportProgress(0)
    }
  }

  const handleExport = () => {
    try {
      const exportData = {
        categories,
        users,
        auditLog,
        pageVisits: storage.getPageVisits(),
        exportedAt: new Date().toISOString(),
        version: "1.2",
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log("Data exported successfully")
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      try {
        storage.clearAll()
        onDataImported() // Refresh the data
        console.log("All data cleared successfully")
      } catch (error) {
        console.error("Clear data error:", error)
      }
    }
  }

  const resetImport = () => {
    setImportData("")
    setImportStatus("idle")
    setImportMessage("")
    setImportProgress(0)
    setPreviewData(null)
    setPreviewStats(null)
    setShowPreview(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getCurrentStats = () => {
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
      pageVisits: storage.getPageVisits(),
    }
  }

  const currentStats = getCurrentStats()

  return (
    <div className="space-y-6">
      {/* Current System Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Current System Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentStats.categories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentStats.articles}</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentStats.users}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{currentStats.auditEntries}</div>
              <div className="text-sm text-gray-600">Audit Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{currentStats.pageVisits}</div>
              <div className="text-sm text-gray-600">Page Visits</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export & Backup</TabsTrigger>
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
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload JSON File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="text-center text-gray-500">or</div>

              {/* Paste Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paste JSON Data</label>
                <Textarea
                  placeholder="Paste your JSON backup data here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => handlePreview()}
                  disabled={!importData.trim() || importStatus === "importing"}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview Data</span>
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!previewData || importStatus === "importing"}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{importStatus === "importing" ? "Importing..." : "Import Data"}</span>
                </Button>
                <Button onClick={resetImport} variant="outline" className="flex items-center space-x-2 bg-transparent">
                  <RefreshCw className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
              </div>

              {/* Import Progress */}
              {importStatus === "importing" && (
                <div className="space-y-2">
                  <Progress value={importProgress} className="w-full" />
                  <div className="text-sm text-gray-600 text-center">{importMessage}</div>
                </div>
              )}

              {/* Import Status */}
              {importMessage && importStatus !== "importing" && (
                <div
                  className={`flex items-center space-x-2 p-3 rounded ${
                    importStatus === "success"
                      ? "bg-green-50 text-green-700"
                      : importStatus === "error"
                        ? "bg-red-50 text-red-700"
                        : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {importStatus === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : importStatus === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                  <span className="text-sm">{importMessage}</span>
                </div>
              )}

              {/* Preview Data */}
              {showPreview && previewStats && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>Data Preview</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                        <EyeOff className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{previewStats.categories}</div>
                        <div className="text-xs text-gray-600">Categories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">{previewStats.articles}</div>
                        <div className="text-xs text-gray-600">Articles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">{previewStats.users}</div>
                        <div className="text-xs text-gray-600">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">{previewStats.auditEntries}</div>
                        <div className="text-xs text-gray-600">Audit Entries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-gray-600">{previewStats.pageVisits}</div>
                        <div className="text-xs text-gray-600">Page Visits</div>
                      </div>
                    </div>

                    {previewData?.version && (
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                        <Badge variant="outline">Version {previewData.version}</Badge>
                        {previewData.exportedAt && (
                          <span>Exported: {new Date(previewData.exportedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export & Backup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Export all your knowledge base data including categories, articles, users, and audit logs.
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleExport} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export All Data</span>
                </Button>

                <Button onClick={handleClearData} variant="destructive" className="flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All Data</span>
                </Button>
              </div>

              <div className="text-xs text-gray-500 mt-4">
                <p>• Export creates a JSON file with all your data</p>
                <p>• Clear All Data will permanently delete all stored information</p>
                <p>• Always create a backup before clearing data</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
