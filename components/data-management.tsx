"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  Activity,
  Database,
  Info,
} from "lucide-react"
import { database } from "@/utils/database"

interface DataManagementProps {
  onDataUpdate?: () => void
}

export function DataManagement({ onDataUpdate }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [exportProgress, setExportProgress] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [importPreview, setImportPreview] = useState<{
    categories: number
    articles: number
    users: number
    auditEntries: number
  } | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)
    setMessage(null)

    try {
      // Simulate progress
      setExportProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const data = await database.exportData()

      setExportProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 300))

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExportProgress(100)
      setMessage({ type: "success", text: "Data exported successfully!" })
    } catch (error) {
      console.error("Export failed:", error)
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 2000)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Calculate preview statistics
      const categoriesCount = data.categories?.length || 0
      const articlesCount =
        data.categories?.reduce((total: number, cat: any) => {
          const categoryArticles = cat.articles?.length || 0
          const subcategoryArticles =
            cat.subcategories?.reduce((subTotal: number, sub: any) => subTotal + (sub.articles?.length || 0), 0) || 0
          return total + categoryArticles + subcategoryArticles
        }, 0) || 0
      const usersCount = data.users?.length || 0
      const auditEntriesCount = data.auditLog?.length || 0

      setImportPreview({
        categories: categoriesCount,
        articles: articlesCount,
        users: usersCount,
        auditEntries: auditEntriesCount,
      })

      setMessage({
        type: "info",
        text: `Preview: ${categoriesCount} categories, ${articlesCount} articles, ${usersCount} users, ${auditEntriesCount} audit entries`,
      })
    } catch (error) {
      console.error("Failed to parse file:", error)
      setMessage({ type: "error", text: "Invalid backup file format. Please select a valid JSON backup file." })
      setImportPreview(null)
    }

    // Reset file input
    event.target.value = ""
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportProgress(0)
    setMessage(null)

    try {
      setImportProgress(10)
      const text = await file.text()

      setImportProgress(25)
      const data = JSON.parse(text)

      setImportProgress(50)
      await database.importData(data)

      setImportProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Trigger UI update
      if (onDataUpdate) {
        onDataUpdate()
      }

      setImportProgress(100)
      setMessage({ type: "success", text: "Data imported successfully!" })
      setImportPreview(null)
    } catch (error) {
      console.error("Import failed:", error)
      setMessage({ type: "error", text: "Failed to import data. Please check the file format." })
    } finally {
      setIsImporting(false)
      setTimeout(() => setImportProgress(0), 2000)
    }

    // Reset file input
    event.target.value = ""
  }

  const handleClearData = async () => {
    if (!window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return
    }

    setIsClearing(true)
    setMessage(null)

    try {
      await database.clearAllData()

      // Trigger UI update
      if (onDataUpdate) {
        onDataUpdate()
      }

      setMessage({ type: "success", text: "All data cleared successfully!" })
    } catch (error) {
      console.error("Clear failed:", error)
      setMessage({ type: "error", text: "Failed to clear data. Please try again." })
    } finally {
      setIsClearing(false)
    }
  }

  const confirmImport = async () => {
    if (!importPreview) return

    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = ".json"
    fileInput.onchange = handleImport
    fileInput.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>Export, import, or clear your knowledge base data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Messages */}
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
              {message.type === "error" && <AlertTriangle className="h-4 w-4 text-red-600" />}
              {message.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
              {message.type === "info" && <Info className="h-4 w-4 text-blue-600" />}
              <AlertDescription
                className={
                  message.type === "error"
                    ? "text-red-800"
                    : message.type === "success"
                      ? "text-green-800"
                      : "text-blue-800"
                }
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Export Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export Data</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">Download a complete backup of your knowledge base data</p>
            </div>

            {exportProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Exporting...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleExport}
              disabled={isExporting || isImporting || isClearing}
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>

          <Separator />

          {/* Import Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Import Data</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">Upload a backup file to restore your knowledge base data</p>
            </div>

            {importProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="w-full" />
              </div>
            )}

            {importPreview && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Import Preview</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium">{importPreview.categories}</div>
                      <div className="text-xs text-blue-600">Categories</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-medium">{importPreview.articles}</div>
                      <div className="text-xs text-green-600">Articles</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium">{importPreview.users}</div>
                      <div className="text-xs text-purple-600">Users</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="font-medium">{importPreview.auditEntries}</div>
                      <div className="text-xs text-orange-600">Audit Entries</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button onClick={confirmImport} size="sm">
                    Confirm Import
                  </Button>
                  <Button onClick={() => setImportPreview(null)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="import-file">Select backup file</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={isExporting || isImporting || isClearing}
              />
            </div>
          </div>

          <Separator />

          {/* Clear Data Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium flex items-center space-x-2 text-red-600">
                <Trash2 className="h-4 w-4" />
                <span>Clear All Data</span>
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Permanently delete all knowledge base data. This action cannot be undone.
              </p>
            </div>

            <Button
              onClick={handleClearData}
              disabled={isExporting || isImporting || isClearing}
              variant="destructive"
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? "Clearing..." : "Clear All Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
