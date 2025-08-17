"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Download, Database, AlertCircle, CheckCircle, Eye, Trash2, RefreshCw } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, KnowledgeBaseUser, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  onDataImported: () => void
}

interface ImportData {
  categories?: Category[]
  users?: KnowledgeBaseUser[]
  auditLog?: AuditLogEntry[]
  pageVisits?: number
}

interface ImportStats {
  categories: number
  articles: number
  users: number
  auditEntries: number
  pageVisits: number
}

export function DataManagement({ onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<string>("")
  const [importError, setImportError] = useState<string>("")
  const [importSuccess, setImportSuccess] = useState<string>("")
  const [previewData, setPreviewData] = useState<ImportData | null>(null)
  const [previewStats, setPreviewStats] = useState<ImportStats | null>(null)

  const getCurrentStats = (): ImportStats => {
    try {
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

      return {
        categories: categories.length,
        articles: totalArticles,
        users: users.length,
        auditEntries: auditLog.length,
        pageVisits,
      }
    } catch (error) {
      console.error("Error getting current stats:", error)
      return {
        categories: 0,
        articles: 0,
        users: 0,
        auditEntries: 0,
        pageVisits: 0,
      }
    }
  }

  const parseImportData = (jsonString: string): ImportData | null => {
    try {
      const parsed = JSON.parse(jsonString)

      // Handle different JSON structures
      if (Array.isArray(parsed)) {
        // If it's an array, assume it's categories
        return { categories: parsed }
      } else if (parsed.categories || parsed.users || parsed.auditLog) {
        // If it has expected properties, use it directly
        return parsed
      } else {
        // Try to find nested data
        const result: ImportData = {}

        // Look for categories in various places
        if (parsed.categories) result.categories = parsed.categories
        if (parsed.users) result.users = parsed.users
        if (parsed.auditLog) result.auditLog = parsed.auditLog
        if (parsed.pageVisits) result.pageVisits = parsed.pageVisits

        return Object.keys(result).length > 0 ? result : null
      }
    } catch (error) {
      console.error("Error parsing import data:", error)
      return null
    }
  }

  const calculateStats = (data: ImportData): ImportStats => {
    const categories = data.categories || []
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
      users: (data.users || []).length,
      auditEntries: (data.auditLog || []).length,
      pageVisits: data.pageVisits || 0,
    }
  }

  const handlePreview = () => {
    setImportError("")
    setImportSuccess("")
    setPreviewData(null)
    setPreviewStats(null)

    if (!importData.trim()) {
      setImportError("Please enter JSON data to preview")
      return
    }

    const parsed = parseImportData(importData.trim())
    if (!parsed) {
      setImportError("Invalid JSON format. Please check your data.")
      return
    }

    const stats = calculateStats(parsed)
    setPreviewData(parsed)
    setPreviewStats(stats)
    setImportSuccess("Data preview loaded successfully!")
  }

  const handleImport = async () => {
    if (!previewData) {
      setImportError("Please preview the data first")
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportError("")
    setImportSuccess("")
    setImportStatus("Starting import...")

    try {
      // Convert date strings to Date objects
      const processData = (data: any): any => {
        if (Array.isArray(data)) {
          return data.map(processData)
        } else if (data && typeof data === "object") {
          const processed = { ...data }

          // Convert date fields
          if (processed.createdAt && typeof processed.createdAt === "string") {
            processed.createdAt = new Date(processed.createdAt)
          }
          if (processed.updatedAt && typeof processed.updatedAt === "string") {
            processed.updatedAt = new Date(processed.updatedAt)
          }
          if (processed.lastLogin && typeof processed.lastLogin === "string") {
            processed.lastLogin = new Date(processed.lastLogin)
          }
          if (processed.timestamp && typeof processed.timestamp === "string") {
            processed.timestamp = new Date(processed.timestamp)
          }

          // Process nested objects and arrays
          Object.keys(processed).forEach((key) => {
            if (processed[key] && (typeof processed[key] === "object" || Array.isArray(processed[key]))) {
              processed[key] = processData(processed[key])
            }
          })

          return processed
        }
        return data
      }

      // Import categories
      if (previewData.categories) {
        setImportStatus("Importing categories...")
        setImportProgress(25)
        const processedCategories = processData(previewData.categories)
        storage.saveCategories(processedCategories)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Import users
      if (previewData.users) {
        setImportStatus("Importing users...")
        setImportProgress(50)
        const processedUsers = processData(previewData.users)
        storage.saveUsers(processedUsers)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Import audit log
      if (previewData.auditLog) {
        setImportStatus("Importing audit log...")
        setImportProgress(75)
        const processedAuditLog = processData(previewData.auditLog)
        storage.saveAuditLog(processedAuditLog)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Import page visits
      if (previewData.pageVisits) {
        setImportStatus("Importing page visits...")
        localStorage.setItem("kuhlekt_kb_page_visits", previewData.pageVisits.toString())
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      setImportProgress(100)
      setImportStatus("Import completed successfully!")
      setImportSuccess("Data imported successfully! The application will refresh to show the new data.")

      // Clear form
      setImportData("")
      setPreviewData(null)
      setPreviewStats(null)

      // Notify parent component
      setTimeout(() => {
        onDataImported()
      }, 1000)
    } catch (error) {
      console.error("Import error:", error)
      setImportError(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setImportStatus("")
    } finally {
      setIsImporting(false)
      setTimeout(() => {
        setImportProgress(0)
        setImportStatus("")
      }, 3000)
    }
  }

  const handleExport = () => {
    try {
      const categories = storage.getCategories()
      const users = storage.getUsers()
      const auditLog = storage.getAuditLog()
      const pageVisits = storage.getPageVisits()

      const exportData = {
        categories,
        users,
        auditLog,
        pageVisits,
        exportedAt: new Date().toISOString(),
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

      setImportSuccess("Data exported successfully!")
    } catch (error) {
      console.error("Export error:", error)
      setImportError(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setImportError("Please select a JSON file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
      setImportError("")
      setImportSuccess("File loaded successfully! Click Preview to validate the data.")
    }
    reader.onerror = () => {
      setImportError("Error reading file")
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      try {
        storage.clearAll()
        setImportSuccess("All data cleared successfully! The application will refresh.")
        setTimeout(() => {
          onDataImported()
        }, 1000)
      } catch (error) {
        console.error("Clear error:", error)
        setImportError(`Clear failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }
  }

  const currentStats = getCurrentStats()

  return (
    <div className="space-y-6">
      {/* Current Data Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Current Data Overview</span>
          </CardTitle>
          <CardDescription>Overview of data currently stored in the knowledge base</CardDescription>
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

      {/* Import/Export */}
      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Import Data</span>
              </CardTitle>
              <CardDescription>Import categories, articles, users, and audit log from JSON data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Upload */}
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                  Upload JSON File
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isImporting}
                />
              </div>

              {/* Manual JSON Input */}
              <div>
                <label htmlFor="json-input" className="block text-sm font-medium mb-2">
                  Or Paste JSON Data
                </label>
                <Textarea
                  id="json-input"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your JSON data here..."
                  className="min-h-[200px] font-mono text-sm"
                  disabled={isImporting}
                />
              </div>

              {/* Preview Section */}
              {previewData && previewStats && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center space-x-2">
                      <Eye className="h-4 w-4" />
                      <span>Data Preview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{previewStats.categories}</div>
                        <div className="text-gray-600">Categories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{previewStats.articles}</div>
                        <div className="text-gray-600">Articles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">{previewStats.users}</div>
                        <div className="text-gray-600">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">{previewStats.auditEntries}</div>
                        <div className="text-gray-600">Audit Entries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-600">{previewStats.pageVisits}</div>
                        <div className="text-gray-600">Page Visits</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Progress */}
              {isImporting && (
                <div className="space-y-2">
                  <Progress value={importProgress} className="w-full" />
                  <p className="text-sm text-gray-600 flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{importStatus}</span>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2">
                <Button
                  onClick={handlePreview}
                  disabled={!importData.trim() || isImporting}
                  variant="outline"
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!previewData || isImporting}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isImporting ? "Importing..." : "Import"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Data</span>
              </CardTitle>
              <CardDescription>Export all knowledge base data as JSON for backup or migration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  This will export all categories, articles, users, audit log entries, and page visit statistics.
                </p>
                <Button onClick={handleExport} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export All Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                <span>Danger Zone</span>
              </CardTitle>
              <CardDescription>Irreversible actions that will permanently delete data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Clear all data from the knowledge base. This action cannot be undone.
                </p>
                <Button onClick={handleClearAll} variant="destructive" className="flex items-center space-x-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Clear All Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Messages */}
      {importError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{importError}</AlertDescription>
        </Alert>
      )}

      {importSuccess && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{importSuccess}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
