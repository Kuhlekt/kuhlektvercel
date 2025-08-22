"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Trash2, Database, AlertTriangle, CheckCircle, FileText, Users, Activity } from "lucide-react"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"
import { database } from "../utils/database"
import { calculateTotalArticles } from "../utils/article-utils"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataUpdate: () => void
}

export function DataManagement({ categories, users, auditLog, onDataUpdate }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [importPreview, setImportPreview] = useState<any>(null)
  const [showImportPreview, setShowImportPreview] = useState(false)

  // Calculate current statistics
  const totalArticles = calculateTotalArticles(categories)
  const totalCategories = categories.length
  const totalSubcategories = categories.reduce((sum, cat) => sum + (cat.subcategories?.length || 0), 0)
  const totalUsers = users.length
  const totalAuditEntries = auditLog.length

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setMessage(null)

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

      setMessage({ type: "success", text: "Data exported successfully!" })
    } catch (error) {
      console.error("Export error:", error)
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
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
        const data = JSON.parse(e.target?.result as string)

        // Validate the data structure
        if (!data || typeof data !== "object") {
          throw new Error("Invalid file format")
        }

        // Calculate preview statistics
        const previewStats = {
          categories: Array.isArray(data.categories) ? data.categories.length : 0,
          subcategories: Array.isArray(data.categories)
            ? data.categories.reduce(
                (sum: number, cat: any) => sum + (Array.isArray(cat.subcategories) ? cat.subcategories.length : 0),
                0,
              )
            : 0,
          articles: Array.isArray(data.categories)
            ? data.categories.reduce((sum: number, cat: any) => {
                const catArticles = Array.isArray(cat.articles) ? cat.articles.length : 0
                const subArticles = Array.isArray(cat.subcategories)
                  ? cat.subcategories.reduce(
                      (subSum: number, sub: any) => subSum + (Array.isArray(sub.articles) ? sub.articles.length : 0),
                      0,
                    )
                  : 0
                return sum + catArticles + subArticles
              }, 0)
            : 0,
          users: Array.isArray(data.users) ? data.users.length : 0,
          auditEntries: Array.isArray(data.auditLog) ? data.auditLog.length : 0,
          pageVisits: data.settings?.pageVisits || data.pageVisits || 0,
        }

        setImportPreview({ data, stats: previewStats })
        setShowImportPreview(true)
        setMessage(null)
      } catch (error) {
        console.error("File parsing error:", error)
        setMessage({ type: "error", text: "Invalid backup file format. Please select a valid JSON backup file." })
      }
    }
    reader.readAsText(file)

    // Reset the input
    event.target.value = ""
  }

  const confirmImport = async () => {
    if (!importPreview) return

    try {
      setIsImporting(true)
      setImportProgress(0)
      setMessage(null)
      setShowImportPreview(false)

      // Simulate progress steps
      setImportProgress(25)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setImportProgress(50)
      await database.importData(importPreview.data)

      setImportProgress(75)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Trigger UI refresh
      setImportProgress(90)
      onDataUpdate()

      setImportProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setMessage({
        type: "success",
        text: `Data imported successfully! Imported ${importPreview.stats.categories} categories, ${importPreview.stats.articles} articles, and ${importPreview.stats.users} users.`,
      })
      setImportPreview(null)
    } catch (error) {
      console.error("Import error:", error)
      setMessage({ type: "error", text: "Failed to import data. Please check the file format and try again." })
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  const cancelImport = () => {
    setShowImportPreview(false)
    setImportPreview(null)
    setMessage(null)
  }

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear ALL data? This action cannot be undone!")) {
      return
    }

    if (
      !window.confirm(
        "This will permanently delete all articles, categories, users, and audit logs. Type 'DELETE' to confirm.",
      )
    ) {
      return
    }

    try {
      setIsClearing(true)
      setMessage(null)

      await database.clearAllData()
      onDataUpdate()

      setMessage({ type: "success", text: "All data cleared successfully!" })
    } catch (error) {
      console.error("Clear error:", error)
      setMessage({ type: "error", text: "Failed to clear data. Please try again." })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Current Database Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{totalArticles}</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Database className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{totalCategories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Database className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{totalSubcategories}</div>
              <div className="text-sm text-gray-600">Subcategories</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{totalUsers}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{totalAuditEntries}</div>
              <div className="text-sm text-gray-600">Audit Entries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Messages */}
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Import Progress */}
      {isImporting && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing data...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Preview */}
      {showImportPreview && importPreview && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Import Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-blue-700">The following data will be imported:</p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  {importPreview.stats.articles}
                </Badge>
                <div className="text-sm">Articles</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  {importPreview.stats.categories}
                </Badge>
                <div className="text-sm">Categories</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  {importPreview.stats.subcategories}
                </Badge>
                <div className="text-sm">Subcategories</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  {importPreview.stats.users}
                </Badge>
                <div className="text-sm">Users</div>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">
                  {importPreview.stats.auditEntries}
                </Badge>
                <div className="text-sm">Audit Entries</div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This will replace all existing data. Make sure to export your current data first if you want to keep it.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-2">
              <Button onClick={confirmImport} className="flex-1">
                Confirm Import
              </Button>
              <Button variant="outline" onClick={cancelImport} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Download a complete backup of all your knowledge base data including articles, categories, users, and
              audit logs.
            </p>
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              {isExporting ? "Exporting..." : "Export Backup"}
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
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Upload a backup file to restore your knowledge base data. This will replace all existing data.
            </p>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Button disabled={isImporting} className="w-full">
                {isImporting ? "Importing..." : "Select Backup File"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Clear All Data */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Trash2 className="h-5 w-5 mr-2" />
              Clear All Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Permanently delete all data from the knowledge base. This action cannot be undone.
            </p>
            <Button variant="destructive" onClick={handleClearAll} disabled={isClearing} className="w-full">
              {isClearing ? "Clearing..." : "Clear All Data"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data Management Tips */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">💡 Data Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>• Export your data regularly to create backups</p>
          <p>• Import files must be in JSON format from a previous export</p>
          <p>• Importing data will completely replace existing data</p>
          <p>• All actions are logged in the audit trail</p>
          <p>• Use the clear function only when starting fresh</p>
        </CardContent>
      </Card>
    </div>
  )
}
