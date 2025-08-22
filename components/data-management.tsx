"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
  Activity,
  Database,
  RefreshCw,
} from "lucide-react"
import { apiDatabase } from "../utils/api-database"

interface DataManagementProps {
  onDataUpdate: () => void
}

// Helper function to safely format dates
const formatDateTime = (date: any): string => {
  try {
    if (!date) return "Unknown"

    let dateObj: Date
    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === "string") {
      dateObj = new Date(date)
    } else {
      return "Invalid Date"
    }

    if (isNaN(dateObj.getTime())) {
      return "Invalid Date"
    }

    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString()
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Date Error"
  }
}

export function DataManagement({ onDataUpdate }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [importPreview, setImportPreview] = useState<any>(null)
  const [importProgress, setImportProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)

      console.log("Starting data export...")
      const data = await apiDatabase.exportData()

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      console.log("Data exported successfully")
      showMessage("success", "Data exported successfully!")
    } catch (error) {
      console.error("Export error:", error)
      showMessage("error", "Failed to export data. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        console.log("File parsed successfully:", {
          categories: data.categories?.length || 0,
          users: data.users?.length || 0,
          auditLog: data.auditLog?.length || 0,
        })

        setImportPreview(data)
      } catch (error) {
        console.error("File parsing error:", error)
        showMessage("error", "Invalid JSON file. Please select a valid backup file.")
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!importPreview) return

    try {
      setIsImporting(true)
      setImportProgress(0)

      console.log("Starting data import...")

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      await apiDatabase.importData(importPreview)

      clearInterval(progressInterval)
      setImportProgress(100)

      console.log("Data imported successfully")
      showMessage("success", "Data imported successfully! The page will refresh to show the new data.")

      // Clear preview and reset file input
      setImportPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Trigger data update and refresh
      onDataUpdate()

      // Force page refresh after a short delay to ensure UI updates
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Import error:", error)
      showMessage("error", "Failed to import data. Please check the file format and try again.")
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  const handleClearData = async () => {
    if (!window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return
    }

    if (!window.confirm("This will delete ALL categories, articles, users, and audit logs. Are you absolutely sure?")) {
      return
    }

    try {
      setIsClearing(true)

      console.log("Starting data clear...")
      await apiDatabase.clearAllData()

      console.log("Data cleared successfully")
      showMessage("success", "All data cleared successfully! The page will refresh.")

      // Trigger data update and refresh
      onDataUpdate()

      // Force page refresh after a short delay
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error("Clear data error:", error)
      showMessage("error", "Failed to clear data. Please try again.")
    } finally {
      setIsClearing(false)
    }
  }

  const getPreviewStats = () => {
    if (!importPreview) return null

    const categories = importPreview.categories || []
    const users = importPreview.users || []
    const auditLog = importPreview.auditLog || []

    let totalArticles = 0
    categories.forEach((cat: any) => {
      totalArticles += (cat.articles || []).length
      if (cat.subcategories) {
        cat.subcategories.forEach((sub: any) => {
          totalArticles += (sub.articles || []).length
        })
      }
    })

    return {
      categories: categories.length,
      articles: totalArticles,
      users: users.length,
      auditEntries: auditLog.length,
      exportedAt: importPreview.settings?.exportedAt || importPreview.exportedAt || "Unknown",
      version: importPreview.settings?.version || importPreview.version || "Unknown",
    }
  }

  const previewStats = getPreviewStats()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Data Management</h3>
        <p className="text-sm text-gray-600">
          Export, import, or clear all knowledge base data. Use this for backups and data migration.
        </p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Data
            </CardTitle>
            <CardDescription>Download a complete backup of all your knowledge base data</CardDescription>
          </CardHeader>
          <CardContent>
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

        {/* Import Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Import Data
            </CardTitle>
            <CardDescription>Upload a backup file to restore your knowledge base data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            {importPreview && previewStats && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Import Preview
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Database className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{previewStats.categories} Categories</span>
                  </div>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-green-500" />
                    <span>{previewStats.articles} Articles</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-purple-500" />
                    <span>{previewStats.users} Users</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-orange-500" />
                    <span>{previewStats.auditEntries} Audit Entries</span>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="text-xs text-gray-500">
                  <div>Exported: {formatDateTime(previewStats.exportedAt)}</div>
                  <div>Version: {previewStats.version}</div>
                </div>
              </div>
            )}

            {isImporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Importing data...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} className="w-full" />
              </div>
            )}

            <Button
              onClick={handleImport}
              disabled={!importPreview || isImporting}
              className="w-full"
              variant={importPreview ? "default" : "secondary"}
            >
              {isImporting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {importPreview ? "Import Data" : "Select File First"}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Clear Data */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Trash2 className="h-5 w-5 mr-2" />
            Clear All Data
          </CardTitle>
          <CardDescription>Permanently delete all knowledge base data. This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This will permanently delete all categories, articles, users, and audit logs.
              Make sure to export your data first if you want to keep a backup.
            </AlertDescription>
          </Alert>
          <Button onClick={handleClearData} disabled={isClearing} variant="destructive" className="w-full">
            {isClearing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Clearing Data...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
