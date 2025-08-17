"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Download,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Database,
  Trash2,
  RefreshCw,
  Clipboard,
} from "lucide-react"
import { storage } from "../utils/storage"
import { initialCategories } from "../data/initial-data"
import { initialUsers } from "../data/initial-users"
import { initialAuditLog } from "../data/initial-audit-log"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  onDataImported: () => void
}

interface BackupData {
  categories?: Category[]
  users?: User[]
  auditLog?: AuditLogEntry[]
  pageVisits?: number
  exportDate?: string
  version?: string
  data?: {
    categories?: Category[]
    users?: User[]
    auditLog?: AuditLogEntry[]
    pageVisits?: number
  }
}

export function DataManagement({ onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const [previewData, setPreviewData] = useState<BackupData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setImportStatus("success")
      setImportMessage("Data exported successfully!")
      setTimeout(() => setImportStatus("idle"), 3000)
    } catch (error) {
      console.error("Export error:", error)
      setImportStatus("error")
      setImportMessage("Failed to export data")
      setTimeout(() => setImportStatus("idle"), 3000)
    }
  }

  const validateImportData = (data: any): BackupData | null => {
    try {
      console.log("Validating import data:", data)

      // Handle both direct format and nested data format
      let actualData = data
      if (data.data && typeof data.data === "object") {
        console.log("Found nested data structure, extracting...")
        actualData = data.data
      }

      // Validate categories
      if (actualData.categories && Array.isArray(actualData.categories)) {
        console.log("Found categories:", actualData.categories.length)

        // Validate category structure
        for (const category of actualData.categories) {
          if (!category.id || !category.name) {
            throw new Error("Invalid category structure: missing id or name")
          }

          // Ensure articles array exists
          if (!Array.isArray(category.articles)) {
            category.articles = []
          }

          // Ensure subcategories array exists
          if (!Array.isArray(category.subcategories)) {
            category.subcategories = []
          }

          // Validate subcategories
          for (const subcategory of category.subcategories) {
            if (!subcategory.id || !subcategory.name) {
              throw new Error("Invalid subcategory structure: missing id or name")
            }
            if (!Array.isArray(subcategory.articles)) {
              subcategory.articles = []
            }
          }
        }
      } else {
        console.log("No valid categories found in import data")
        actualData.categories = []
      }

      // Validate users
      if (actualData.users && Array.isArray(actualData.users)) {
        console.log("Found users:", actualData.users.length)
        for (const user of actualData.users) {
          if (!user.id || !user.username) {
            throw new Error("Invalid user structure: missing id or username")
          }
        }
      } else {
        console.log("No valid users found in import data")
        actualData.users = []
      }

      // Validate audit log
      if (actualData.auditLog && Array.isArray(actualData.auditLog)) {
        console.log("Found audit log entries:", actualData.auditLog.length)
      } else {
        console.log("No valid audit log found in import data")
        actualData.auditLog = []
      }

      return {
        categories: actualData.categories || [],
        users: actualData.users || [],
        auditLog: actualData.auditLog || [],
        pageVisits: actualData.pageVisits || 0,
        exportDate: data.exportDate,
        version: data.version,
      }
    } catch (error) {
      console.error("Validation error:", error)
      throw error
    }
  }

  const handlePreview = () => {
    if (!importData.trim()) {
      setImportStatus("error")
      setImportMessage("Please enter data to preview")
      return
    }

    try {
      const parsedData = JSON.parse(importData)
      const validatedData = validateImportData(parsedData)

      if (validatedData) {
        setPreviewData(validatedData)
        setImportStatus("success")
        setImportMessage("Data preview loaded successfully!")
      }
    } catch (error) {
      console.error("Preview error:", error)
      setImportStatus("error")
      setImportMessage(`Preview failed: ${error instanceof Error ? error.message : "Invalid JSON format"}`)
      setPreviewData(null)
    }
  }

  const handleImport = async () => {
    if (!previewData) {
      setImportStatus("error")
      setImportMessage("Please preview data first")
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportStatus("idle")

    try {
      // Simulate progress steps
      const steps = [
        { message: "Validating data...", progress: 20 },
        { message: "Converting dates...", progress: 40 },
        { message: "Saving categories...", progress: 60 },
        { message: "Saving users...", progress: 80 },
        { message: "Finalizing import...", progress: 100 },
      ]

      for (const step of steps) {
        setImportMessage(step.message)
        setImportProgress(step.progress)
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      // Convert date strings to Date objects
      const processedCategories =
        previewData.categories?.map((category) => ({
          ...category,
          articles:
            category.articles?.map((article) => ({
              ...article,
              createdAt: new Date(article.createdAt),
              updatedAt: new Date(article.updatedAt),
              editCount: article.editCount || 0,
            })) || [],
          subcategories:
            category.subcategories?.map((subcategory) => ({
              ...subcategory,
              articles:
                subcategory.articles?.map((article) => ({
                  ...article,
                  createdAt: new Date(article.createdAt),
                  updatedAt: new Date(article.updatedAt),
                  editCount: article.editCount || 0,
                })) || [],
            })) || [],
        })) || []

      const processedUsers =
        previewData.users?.map((user) => ({
          ...user,
          createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        })) || []

      const processedAuditLog =
        previewData.auditLog?.map((entry) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        })) || []

      // Save to storage
      if (processedCategories.length > 0) {
        storage.saveCategories(processedCategories)
        console.log("Categories imported:", processedCategories.length)
      }

      if (processedUsers.length > 0) {
        storage.saveUsers(processedUsers)
        console.log("Users imported:", processedUsers.length)
      }

      if (processedAuditLog.length > 0) {
        storage.saveAuditLog(processedAuditLog)
        console.log("Audit log imported:", processedAuditLog.length)
      }

      if (previewData.pageVisits) {
        storage.setPageVisits(previewData.pageVisits)
        console.log("Page visits imported:", previewData.pageVisits)
      }

      setImportStatus("success")
      setImportMessage("Data imported successfully!")
      setImportData("")
      setPreviewData(null)

      // Notify parent component
      onDataImported()
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus("error")
      setImportMessage(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/json") {
      setImportStatus("error")
      setImportMessage("Please select a JSON file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
      setImportStatus("success")
      setImportMessage("File loaded successfully! Click Preview to validate.")
    }
    reader.onerror = () => {
      setImportStatus("error")
      setImportMessage("Failed to read file")
    }
    reader.readAsText(file)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setImportData(text)
      setImportStatus("success")
      setImportMessage("Data pasted from clipboard!")
    } catch (error) {
      setImportStatus("error")
      setImportMessage("Failed to paste from clipboard")
    }
  }

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all data? This will restore the initial sample data and cannot be undone.",
      )
    ) {
      try {
        // Reset to initial data
        storage.saveCategories(initialCategories)
        storage.saveUsers(initialUsers)
        storage.saveAuditLog(initialAuditLog)
        storage.setPageVisits(1)

        setImportStatus("success")
        setImportMessage("Data reset to initial state successfully!")

        // Notify parent component
        onDataImported()
      } catch (error) {
        console.error("Reset error:", error)
        setImportStatus("error")
        setImportMessage("Failed to reset data")
      }
    }
  }

  const handleClearStorage = () => {
    if (confirm("Are you sure you want to clear ALL data? This will delete everything and cannot be undone.")) {
      try {
        storage.clearAll()
        setImportStatus("success")
        setImportMessage("All data cleared successfully!")

        // Notify parent component
        onDataImported()
      } catch (error) {
        console.error("Clear error:", error)
        setImportStatus("error")
        setImportMessage("Failed to clear data")
      }
    }
  }

  const getStorageInfo = () => {
    try {
      return storage.getStorageInfo()
    } catch (error) {
      return {
        categories: 0,
        users: 0,
        auditLog: 0,
        pageVisits: 0,
        totalSize: "Unknown",
      }
    }
  }

  const storageInfo = getStorageInfo()

  return (
    <div className="space-y-6">
      {/* Storage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Storage Overview</span>
          </CardTitle>
          <CardDescription>Current data in local storage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{storageInfo.categories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{storageInfo.users}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{storageInfo.auditLog}</div>
              <div className="text-sm text-gray-600">Audit Entries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{storageInfo.pageVisits}</div>
              <div className="text-sm text-gray-600">Page Visits</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Data</span>
          </CardTitle>
          <CardDescription>Download a backup of all your knowledge base data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export All Data
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
          <CardDescription>Upload or paste JSON data to import</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload JSON File</label>
            <div className="flex space-x-2">
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Choose File
              </Button>
              <Button variant="outline" onClick={handlePaste}>
                <Clipboard className="h-4 w-4 mr-2" />
                Paste
              </Button>
            </div>
          </div>

          <Separator />

          {/* Manual Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Or Paste JSON Data</label>
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
              variant="outline"
              onClick={handlePreview}
              disabled={!importData.trim() || isImporting}
              className="flex-1 bg-transparent"
            >
              <FileText className="h-4 w-4 mr-2" />
              Preview Data
            </Button>
            <Button onClick={handleImport} disabled={!previewData || isImporting} className="flex-1">
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </div>

          {/* Progress Bar */}
          {isImporting && (
            <div className="space-y-2">
              <Progress value={importProgress} className="w-full" />
              <p className="text-sm text-gray-600 text-center">{importMessage}</p>
            </div>
          )}

          {/* Status Messages */}
          {importStatus !== "idle" && !isImporting && (
            <Alert className={importStatus === "error" ? "border-red-200" : "border-green-200"}>
              {importStatus === "error" ? (
                <AlertCircle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertDescription className={importStatus === "error" ? "text-red-800" : "text-green-800"}>
                {importMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Preview Data */}
          {previewData && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Data Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      Categories
                    </Badge>
                    <div className="text-xl font-bold">{previewData.categories?.length || 0}</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      Users
                    </Badge>
                    <div className="text-xl font-bold">{previewData.users?.length || 0}</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      Audit Log
                    </Badge>
                    <div className="text-xl font-bold">{previewData.auditLog?.length || 0}</div>
                  </div>
                  <div className="text-center">
                    <Badge variant="outline" className="mb-1">
                      Page Visits
                    </Badge>
                    <div className="text-xl font-bold">{previewData.pageVisits || 0}</div>
                  </div>
                </div>
                {previewData.exportDate && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Exported: {new Date(previewData.exportDate).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>Irreversible actions that affect all data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg">
            <div>
              <h4 className="font-medium">Reset to Sample Data</h4>
              <p className="text-sm text-gray-600">Replace all data with initial sample content</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
            <div>
              <h4 className="font-medium text-red-600">Clear All Data</h4>
              <p className="text-sm text-gray-600">Permanently delete all stored data</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleClearStorage}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
