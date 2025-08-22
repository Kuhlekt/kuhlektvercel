"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Trash2, FileText, AlertTriangle, CheckCircle } from "lucide-react"
import { database } from "@/utils/database"

interface ImportStats {
  categories: number
  users: number
  auditLog: number
  articles: number
  pageVisits: number
}

interface DataManagementProps {
  onDataUpdate: () => void
}

export function DataManagement({ onDataUpdate }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [importProgress, setImportProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importStats, setImportStats] = useState<ImportStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [importData, setImportData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setExportProgress(0)
      setError(null)
      setSuccess(null)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

      // Export data
      const data = await database.exportData()

      clearInterval(progressInterval)
      setExportProgress(100)

      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess("Data exported successfully!")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export data")
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 2000)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        setError("Please select a valid JSON file")
        return
      }
      setSelectedFile(file)
      setError(null)

      // Read and preview the file
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setImportData(data)

          // Calculate preview statistics
          const stats: ImportStats = {
            categories: data.categories?.length || 0,
            users: data.users?.length || 0,
            auditLog: data.auditLog?.length || 0,
            articles: 0,
            pageVisits: data.settings?.pageVisits || data.pageVisits || 0,
          }

          // Count total articles
          if (data.categories) {
            stats.articles = data.categories.reduce((total: number, cat: any) => {
              const categoryArticles = cat.articles?.length || 0
              const subcategoryArticles =
                cat.subcategories?.reduce((subTotal: number, sub: any) => subTotal + (sub.articles?.length || 0), 0) ||
                0
              return total + categoryArticles + subcategoryArticles
            }, 0)
          }

          setImportStats(stats)
        } catch (error) {
          setError("Invalid JSON file format")
          setImportData(null)
          setImportStats(null)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleImport = async () => {
    if (!importData) {
      setError("No data to import")
      return
    }

    try {
      setIsImporting(true)
      setImportProgress(0)
      setError(null)
      setSuccess(null)

      console.log("Starting import process...")

      // Simulate progress steps
      setImportProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("Importing data via API...")
      setImportProgress(50)

      // Import via API (this will save to the server)
      await database.importData(importData)

      setImportProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("Triggering UI refresh...")
      setImportProgress(90)

      // Force a complete data refresh
      onDataUpdate()

      setImportProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setSuccess("Data imported successfully! The page will refresh to show the new data.")

      // Clear import state
      setSelectedFile(null)
      setImportData(null)
      setImportStats(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Force page refresh after a short delay to ensure UI updates
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (err) {
      console.error("Import failed:", err)
      setError(err instanceof Error ? err.message : "Failed to import data")
    } finally {
      setIsImporting(false)
      setTimeout(() => setImportProgress(0), 2000)
    }
  }

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear ALL data? This action cannot be undone.")) {
      return
    }

    if (
      !confirm("This will permanently delete all categories, articles, users, and audit logs. Are you absolutely sure?")
    ) {
      return
    }

    try {
      setIsClearing(true)
      setError(null)
      setSuccess(null)

      await database.clearAllData()
      onDataUpdate()
      setSuccess("All data cleared successfully!")
      setImportStats(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear data")
    } finally {
      setIsClearing(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    setImportData(null)
    setImportStats(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Export all knowledge base data including categories, articles, users, and audit logs as a JSON backup file.
          </p>

          {isExporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Exporting data...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="w-full" />
            </div>
          )}

          <Button onClick={handleExport} disabled={isExporting} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export Data"}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>Import Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">Import data from a backup file. This will replace all existing data.</p>

          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
                id="backup-file-input"
              />
              <label
                htmlFor="backup-file-input"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
              >
                <FileText className="h-4 w-4 mr-2" />
                Choose Backup File
              </label>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)} • Modified{" "}
                      {selectedFile.lastModified ? new Date(selectedFile.lastModified).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">JSON</Badge>
                  <Button variant="ghost" size="sm" onClick={clearFile}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
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

            {importStats && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800">Import Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{importStats.categories}</div>
                      <div className="text-sm text-gray-600">Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{importStats.articles}</div>
                      <div className="text-sm text-gray-600">Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{importStats.users}</div>
                      <div className="text-sm text-gray-600">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{importStats.auditLog}</div>
                      <div className="text-sm text-gray-600">Audit Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{importStats.pageVisits}</div>
                      <div className="text-sm text-gray-600">Page Visits</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button onClick={handleImport} disabled={!selectedFile || isImporting} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear Data Section */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Permanently delete all data from the knowledge base. This action cannot be undone.
          </p>

          <Button variant="destructive" onClick={handleClearData} disabled={isClearing} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            {isClearing ? "Clearing..." : "Clear All Data"}
          </Button>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
