"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2, AlertTriangle, CheckCircle, Database } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: (categories: Category[]) => void
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function DataManagement({
  categories,
  users,
  auditLog,
  onCategoriesUpdate,
  onUsersUpdate,
  onAuditLogUpdate,
}: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })
  const [isImporting, setIsImporting] = useState(false)

  const handleExportData = () => {
    try {
      const exportData = {
        categories,
        users: users.map((user) => ({
          ...user,
          createdAt: user.createdAt.toISOString(),
          lastLogin: user.lastLogin?.toISOString() || null,
        })),
        auditLog: auditLog.map((entry) => ({
          ...entry,
          timestamp: entry.timestamp.toISOString(),
        })),
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

      setImportStatus({
        type: "success",
        message: "Data exported successfully!",
      })
    } catch (error) {
      console.error("Export error:", error)
      setImportStatus({
        type: "error",
        message: "Failed to export data. Please try again.",
      })
    }
  }

  const handleImportData = async () => {
    if (!importData.trim()) {
      setImportStatus({
        type: "error",
        message: "Please paste the backup data to import.",
      })
      return
    }

    setIsImporting(true)
    setImportStatus({ type: "info", message: "Importing data..." })

    try {
      const parsedData = JSON.parse(importData)

      // Validate the data structure
      if (!parsedData.categories || !parsedData.users) {
        throw new Error("Invalid backup format. Missing required data.")
      }

      // Convert date strings back to Date objects
      const importedCategories = parsedData.categories
      const importedUsers = parsedData.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      }))
      const importedAuditLog = (parsedData.auditLog || []).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))

      // Save to storage
      storage.saveCategories(importedCategories)
      storage.saveUsers(importedUsers)
      storage.saveAuditLog(importedAuditLog)

      // Update state
      onCategoriesUpdate(importedCategories)
      onUsersUpdate(importedUsers)
      onAuditLogUpdate(importedAuditLog)

      // Add audit entry for the import
      const auditEntry: AuditLogEntry = {
        id: Date.now().toString(),
        action: "import_data",
        entityType: "system",
        entityId: "backup",
        timestamp: new Date(),
        performedBy: "admin",
        details: `Imported backup with ${importedCategories.length} categories, ${importedUsers.length} users`,
        articleTitle: undefined,
        categoryName: undefined,
        subcategoryName: undefined,
      }

      const updatedAuditLog = [auditEntry, ...importedAuditLog]
      storage.saveAuditLog(updatedAuditLog)
      onAuditLogUpdate(updatedAuditLog)

      setImportStatus({
        type: "success",
        message: `Successfully imported ${importedCategories.length} categories and ${importedUsers.length} users!`,
      })
      setImportData("")
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus({
        type: "error",
        message: `Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleClearAllData = () => {
    if (!confirm("Are you sure you want to clear ALL data? This action cannot be undone!")) {
      return
    }

    try {
      storage.clearAll()
      onCategoriesUpdate([])
      onUsersUpdate([])
      onAuditLogUpdate([])

      setImportStatus({
        type: "success",
        message: "All data cleared successfully!",
      })
    } catch (error) {
      console.error("Clear data error:", error)
      setImportStatus({
        type: "error",
        message: "Failed to clear data. Please try again.",
      })
    }
  }

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
      const subcategoryArticles = Array.isArray(category.subcategories)
        ? category.subcategories.reduce(
            (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
            0,
          )
        : 0
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Data Management</h2>
        <p className="text-gray-600">Export, import, and manage your knowledge base data</p>
      </div>

      {/* Current Data Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Articles</p>
                <p className="text-2xl font-bold">{getTotalArticles()}</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <Database className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Database className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Audit Entries</p>
                <p className="text-2xl font-bold">{auditLog.length}</p>
              </div>
              <Database className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Alert */}
      {importStatus.type && (
        <Alert
          className={
            importStatus.type === "success"
              ? "border-green-200 bg-green-50"
              : importStatus.type === "error"
                ? "border-red-200 bg-red-50"
                : "border-blue-200 bg-blue-50"
          }
        >
          {importStatus.type === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
          {importStatus.type === "error" && <AlertTriangle className="h-4 w-4 text-red-600" />}
          {importStatus.type === "info" && <Database className="h-4 w-4 text-blue-600" />}
          <AlertDescription
            className={
              importStatus.type === "success"
                ? "text-green-800"
                : importStatus.type === "error"
                  ? "text-red-800"
                  : "text-blue-800"
            }
          >
            {importStatus.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Download a complete backup of your knowledge base including all articles, categories, users, and audit
              logs.
            </p>
            <Button onClick={handleExportData} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
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
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="importData">Backup Data (JSON)</Label>
              <Textarea
                id="importData"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your backup JSON data here..."
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
            <Button onClick={handleImportData} disabled={isImporting || !importData.trim()} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
            <p className="text-xs text-gray-500">
              This will replace all existing data. Make sure to export your current data first!
            </p>
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
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Permanently delete all data from the knowledge base. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={handleClearAllData} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
