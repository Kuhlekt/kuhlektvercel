"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Database,
  Activity,
  RefreshCw,
} from "lucide-react"
import { database } from "@/utils/database"

interface DataManagementProps {
  onDataUpdate: () => void
}

interface ImportPreview {
  categories: number
  articles: number
  users: number
  auditEntries: number
  valid: boolean
  errors: string[]
}

export function DataManagement({ onDataUpdate }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [exportProgress, setExportProgress] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null)
  const [importData, setImportData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setExportProgress(0)
      setMessage(null)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => Math.min(prev + 10, 90))
      }, 100)

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

      showMessage("success", "Data exported successfully!")
    } catch (error) {
      console.error("Export failed:", error)
      showMessage("error", "Failed to export data. Please try again.")
    } finally {
      setIsExporting(false)
      setExportProgress(0)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        // Validate and preview the data
        const preview = validateImportData(data)
        setImportPreview(preview)
        setImportData(data)
      } catch (error) {
        console.error("Failed to parse import file:", error)
        showMessage("error", "Invalid file format. Please select a valid JSON backup file.")
        setImportPreview(null)
        setImportData(null)
      }
    }
    reader.readAsText(file)
  }

  const validateImportData = (data: any): ImportPreview => {
    const errors: string[] = []
    let categories = 0
    let articles = 0
    let users = 0
    let auditEntries = 0

    try {
      // Validate categories
      if (data.categories && Array.isArray(data.categories)) {
        categories = data.categories.length
        data.categories.forEach((cat: any) => {
          if (cat.articles && Array.isArray(cat.articles)) {
            articles += cat.articles.length
          }
          if (cat.subcategories && Array.isArray(cat.subcategories)) {
            cat.subcategories.forEach((sub: any) => {
              if (sub.articles && Array.isArray(sub.articles)) {
                articles += sub.articles.length
              }
            })
          }
        })
      } else {
        errors.push("No valid categories found")
      }

      // Validate users
      if (data.users && Array.isArray(data.users)) {
        users = data.users.length
      } else {
        errors.push("No valid users found")
      }

      // Validate audit log
      if (data.auditLog && Array.isArray(data.auditLog)) {
        auditEntries = data.auditLog.length
      }

      return {
        categories,
        articles,
        users,
        auditEntries,
        valid: errors.length === 0,
        errors,
      }
    } catch (error) {
      return {
        categories: 0,
        articles: 0,
        users: 0,
        auditEntries: 0,
        valid: false,
        errors: ["Failed to validate import data"],
      }
    }
  }

  const handleImport = async () => {
    if (!importData || !importPreview?.valid) return

    try {
      setIsImporting(true)
      setImportProgress(0)
      setMessage(null)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => Math.min(prev + 5, 90))
      }, 100)

      await database.importData(importData)

      clearInterval(progressInterval)
      setImportProgress(100)

      showMessage(
        "success",
        `Data imported successfully! ${importPreview.categories} categories, ${importPreview.articles} articles, ${importPreview.users} users imported.`,
      )

      // Clear import state
      setImportPreview(null)
      setImportData(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Trigger data refresh
      onDataUpdate()
    } catch (error) {
      console.error("Import failed:", error)
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

    try {
      setIsClearing(true)
      setMessage(null)

      await database.clearAllData()

      showMessage("success", "All data cleared successfully!")
      onDataUpdate()
    } catch (error) {
      console.error("Clear data failed:", error)
      showMessage("error", "Failed to clear data. Please try again.")
    } finally {
      setIsClearing(false)
    }
  }

  const cancelImport = () => {
    setImportPreview(null)
    setImportData(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
          <CardDescription>Export, import, and manage your knowledge base data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Messages */}
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              {message.type === "error" ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Export Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Download a complete backup of your knowledge base including all categories, articles, users, and audit
                logs.
              </p>
            </div>

            {isExporting && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Exporting data...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
            )}

            <Button onClick={handleExport} disabled={isExporting} className="w-full sm:w-auto">
              {isExporting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </div>

          <Separator />

          {/* Import Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Import Data</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a backup file to restore your knowledge base data. This will replace all existing data.
              </p>
            </div>

            {!importPreview && (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500">Select a JSON backup file to preview before importing.</p>
              </div>
            )}

            {importPreview && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Import Preview</CardTitle>
                    <CardDescription>Review the data that will be imported</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {importPreview.valid ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Database className="h-8 w-8 text-blue-500" />
                          </div>
                          <div className="text-2xl font-bold">{importPreview.categories}</div>
                          <div className="text-sm text-gray-600">Categories</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <FileText className="h-8 w-8 text-green-500" />
                          </div>
                          <div className="text-2xl font-bold">{importPreview.articles}</div>
                          <div className="text-sm text-gray-600">Articles</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Users className="h-8 w-8 text-purple-500" />
                          </div>
                          <div className="text-2xl font-bold">{importPreview.users}</div>
                          <div className="text-sm text-gray-600">Users</div>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <Activity className="h-8 w-8 text-orange-500" />
                          </div>
                          <div className="text-2xl font-bold">{importPreview.auditEntries}</div>
                          <div className="text-sm text-gray-600">Audit Entries</div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="font-semibold">Invalid Import Data</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                          {importPreview.errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {isImporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Importing data...</span>
                      <span>{importProgress}%</span>
                    </div>
                    <Progress value={importProgress} className="w-full" />
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button onClick={handleImport} disabled={!importPreview.valid || isImporting} className="flex-1">
                    {isImporting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    {isImporting ? "Importing..." : "Import Data"}
                  </Button>
                  <Button onClick={cancelImport} variant="outline" disabled={isImporting}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Clear Data Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-red-600">Danger Zone</h3>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete all data from the knowledge base. This action cannot be undone.
              </p>
            </div>

            <Button onClick={handleClearData} disabled={isClearing} variant="destructive" className="w-full sm:w-auto">
              {isClearing ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              {isClearing ? "Clearing..." : "Clear All Data"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
