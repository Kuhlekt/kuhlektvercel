"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Download, Upload, Trash2, Database, FileText, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"
import { database } from "@/utils/database"

interface DataManagementProps {
  onDataUpdate?: () => void
}

export function DataManagement({ onDataUpdate }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [importPreview, setImportPreview] = useState<any>(null)

  const showMessage = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      showMessage("info", "Preparing export...")

      const data = await database.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showMessage("success", "Data exported successfully!")
    } catch (error) {
      console.error("Export error:", error)
      showMessage("error", "Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate the data structure
      if (!data || typeof data !== "object") {
        throw new Error("Invalid backup file format")
      }

      // Show preview of what will be imported
      const preview = {
        categories: data.categories?.length || 0,
        users: data.users?.length || 0,
        auditLog: data.auditLog?.length || 0,
        articles: 0,
        settings: data.settings || {},
      }

      // Count total articles
      if (data.categories) {
        preview.articles = data.categories.reduce((total: number, cat: any) => {
          const categoryArticles = cat.articles?.length || 0
          const subcategoryArticles =
            cat.subcategories?.reduce((subTotal: number, sub: any) => subTotal + (sub.articles?.length || 0), 0) || 0
          return total + categoryArticles + subcategoryArticles
        }, 0)
      }

      setImportPreview({ data, preview })
      showMessage("info", 'File loaded. Review the preview and click "Confirm Import" to proceed.')
    } catch (error) {
      console.error("File read error:", error)
      showMessage("error", "Failed to read backup file. Please check the file format.")
    }

    // Reset the input
    event.target.value = ""
  }

  const handleImport = async () => {
    if (!importPreview) return

    try {
      setIsImporting(true)
      setImportProgress(0)
      showMessage("info", "Starting import...")

      // Simulate progress updates
      const progressSteps = [
        { progress: 20, message: "Validating data..." },
        { progress: 40, message: "Importing categories..." },
        { progress: 60, message: "Importing users..." },
        { progress: 80, message: "Importing audit log..." },
        { progress: 90, message: "Finalizing..." },
        { progress: 100, message: "Import complete!" },
      ]

      for (const step of progressSteps) {
        setImportProgress(step.progress)
        showMessage("info", step.message)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Perform the actual import
      await database.importData(importPreview.data)

      // Trigger UI refresh
      if (onDataUpdate) {
        onDataUpdate()
      }

      setImportPreview(null)
      showMessage(
        "success",
        `Import completed! Imported ${importPreview.preview.categories} categories, ${importPreview.preview.articles} articles, ${importPreview.preview.users} users.`,
      )
    } catch (error) {
      console.error("Import error:", error)
      showMessage("error", `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear ALL data? This action cannot be undone!")) {
      return
    }

    if (
      !confirm(
        'This will permanently delete all categories, articles, users, and audit logs. Type "DELETE" to confirm.',
      )
    ) {
      return
    }

    try {
      setIsClearing(true)
      showMessage("info", "Clearing all data...")

      await database.clearAllData()

      // Trigger UI refresh
      if (onDataUpdate) {
        onDataUpdate()
      }

      showMessage("success", "All data has been cleared successfully")
    } catch (error) {
      console.error("Clear data error:", error)
      showMessage("error", "Failed to clear data")
    } finally {
      setIsClearing(false)
    }
  }

  const cancelImport = () => {
    setImportPreview(null)
    showMessage("info", "Import cancelled")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Data Management</h2>
        <p className="text-muted-foreground">Export, import, and manage your knowledge base data</p>
      </div>

      {/* Status Messages */}
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <div className="flex items-center space-x-2">
            {message.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
            {message.type === "error" && <AlertTriangle className="h-4 w-4" />}
            {message.type === "info" && <RefreshCw className="h-4 w-4" />}
            <AlertDescription>{message.text}</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Import Progress */}
      {isImporting && (
        <Card>
          <CardHeader>
            <CardTitle>Import Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={importProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">{importProgress}% complete</p>
          </CardContent>
        </Card>
      )}

      {/* Import Preview */}
      {importPreview && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Import Preview</span>
            </CardTitle>
            <CardDescription>Review what will be imported</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{importPreview.preview.categories}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{importPreview.preview.articles}</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{importPreview.preview.users}</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{importPreview.preview.auditLog}</div>
                <div className="text-sm text-muted-foreground">Audit Entries</div>
              </div>
            </div>

            <Separator />

            <div className="flex space-x-2">
              <Button onClick={handleImport} disabled={isImporting} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Confirm Import
              </Button>
              <Button variant="outline" onClick={cancelImport} disabled={isImporting}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
            <CardDescription>Download a complete backup of your knowledge base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              This will create a JSON file containing all your categories, articles, users, and audit logs.
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
                  Export Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Import Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Import Data</span>
            </CardTitle>
            <CardDescription>Restore data from a backup file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Select a JSON backup file to restore your knowledge base data.
            </div>
            <div>
              <Label htmlFor="import-file">Select Backup File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={isImporting}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>Irreversible actions that will permanently delete data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2">Clear All Data</h4>
            <p className="text-sm text-red-700 mb-4">
              This will permanently delete all categories, articles, users, and audit logs. This action cannot be
              undone.
            </p>
            <Button variant="destructive" onClick={handleClearData} disabled={isClearing}>
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
        </CardContent>
      </Card>

      {/* Data Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Current Data Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {JSON.parse(localStorage.getItem("kb_categories") || "[]").length}
              </div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {(() => {
                  const categories = JSON.parse(localStorage.getItem("kb_categories") || "[]")
                  return categories.reduce((total: number, cat: any) => {
                    const categoryArticles = cat.articles?.length || 0
                    const subcategoryArticles =
                      cat.subcategories?.reduce(
                        (subTotal: number, sub: any) => subTotal + (sub.articles?.length || 0),
                        0,
                      ) || 0
                    return total + categoryArticles + subcategoryArticles
                  }, 0)
                })()}
              </div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {JSON.parse(localStorage.getItem("kb_users") || "[]").length}
              </div>
              <div className="text-sm text-muted-foreground">Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {JSON.parse(localStorage.getItem("kb_auditLog") || "[]").length}
              </div>
              <div className="text-sm text-muted-foreground">Audit Entries</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
