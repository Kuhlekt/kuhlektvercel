"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Upload,
  Trash2,
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
  Database,
  Users,
  Activity,
} from "lucide-react"
import { database } from "../utils/database"

interface ImportStats {
  categories: number
  articles: number
  users: number
  auditLog: number
}

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [importProgress, setImportProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [importStats, setImportStats] = useState<ImportStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
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

      // Get all data
      const data = await database.exportData()

      clearInterval(progressInterval)
      setExportProgress(100)

      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess("Data exported successfully!")

      setTimeout(() => {
        setExportProgress(0)
        setIsExporting(false)
      }, 1000)
    } catch (err) {
      console.error("Export error:", err)
      setError("Failed to export data. Please try again.")
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        setSelectedFile(file)
        setError(null)
      } else {
        setError("Please select a valid JSON file.")
        setSelectedFile(null)
      }
    }
  }

  const clearFileSelection = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImport = async () => {
    if (!selectedFile) {
      setError("Please select a file to import.")
      return
    }

    try {
      setIsImporting(true)
      setImportProgress(0)
      setError(null)
      setSuccess(null)
      setImportStats(null)

      // Read file
      const text = await selectedFile.text()
      let data

      try {
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error("Invalid JSON file format.")
      }

      // Validate data structure
      if (!data.categories || !data.users || !data.auditLog) {
        throw new Error("Invalid backup file structure. Missing required data.")
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => Math.min(prev + 5, 90))
      }, 100)

      // Import data
      await database.importData(data)

      clearInterval(progressInterval)
      setImportProgress(100)

      // Calculate import stats
      const stats: ImportStats = {
        categories: data.categories?.length || 0,
        articles:
          data.categories?.reduce((total: number, cat: any) => {
            const catArticles = cat.articles?.length || 0
            const subArticles =
              cat.subcategories?.reduce((subTotal: number, sub: any) => subTotal + (sub.articles?.length || 0), 0) || 0
            return total + catArticles + subArticles
          }, 0) || 0,
        users: data.users?.length || 0,
        auditLog: data.auditLog?.length || 0,
      }

      setImportStats(stats)
      setSuccess("Data imported successfully!")
      clearFileSelection()

      setTimeout(() => {
        setImportProgress(0)
        setIsImporting(false)
      }, 1000)
    } catch (err) {
      console.error("Import error:", err)
      setError(err instanceof Error ? err.message : "Failed to import data. Please try again.")
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  const handleClearData = async () => {
    const confirmed = window.confirm("Are you sure you want to clear ALL data? This action cannot be undone.")

    if (!confirmed) return

    const doubleConfirmed = window.confirm(
      'This will permanently delete all categories, articles, users, and audit logs. Type "DELETE" to confirm.',
    )

    if (!doubleConfirmed) return

    try {
      setIsClearing(true)
      setError(null)
      setSuccess(null)

      await database.clearAllData()

      setSuccess("All data cleared successfully!")
      setImportStats(null)

      setTimeout(() => {
        setIsClearing(false)
        // Reload page to reflect changes
        window.location.reload()
      }, 2000)
    } catch (err) {
      console.error("Clear data error:", err)
      setError("Failed to clear data. Please try again.")
      setIsClearing(false)
    }
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
      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="flex items-center justify-between text-green-800">
            {success}
            <Button variant="ghost" size="sm" onClick={() => setSuccess(null)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>Download a complete backup of your knowledge base as a JSON file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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

      {/* Import Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Restore your knowledge base from a backup file. This will replace all existing data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Selection */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileSelect}
                className="hidden"
                id="backup-file"
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Choose Backup File
              </Button>
              {selectedFile && (
                <Button variant="ghost" size="sm" onClick={clearFileSelection}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {selectedFile && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(selectedFile.size)} • Modified{" "}
                      {selectedFile.lastModified ? new Date(selectedFile.lastModified).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                  <Badge variant="secondary">JSON</Badge>
                </div>
              </div>
            )}
          </div>

          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importing data...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}

          <Button onClick={handleImport} disabled={!selectedFile || isImporting} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {isImporting ? "Importing..." : "Import Data"}
          </Button>
        </CardContent>
      </Card>

      {/* Import Statistics */}
      {importStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Import Summary
            </CardTitle>
            <CardDescription>Data successfully imported from backup file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Database className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{importStats.categories}</p>
                  <p className="text-xs text-muted-foreground">Categories</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{importStats.articles}</p>
                  <p className="text-xs text-muted-foreground">Articles</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{importStats.users}</p>
                  <p className="text-xs text-muted-foreground">Users</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Activity className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{importStats.auditLog}</p>
                  <p className="text-xs text-muted-foreground">Audit Entries</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Clear All Data */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Clear All Data
          </CardTitle>
          <CardDescription>
            Permanently delete all data from the knowledge base. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleClearData} disabled={isClearing} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            {isClearing ? "Clearing Data..." : "Clear All Data"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
