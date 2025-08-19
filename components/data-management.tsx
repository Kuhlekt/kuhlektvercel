"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Download, Upload, Database, AlertCircle, CheckCircle, Trash2 } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [status, setStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleExport = () => {
    try {
      const exportData = {
        categories,
        users,
        auditLog,
        exportedAt: new Date().toISOString(),
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

      setStatus({ type: "success", message: "Data exported successfully!" })
      setTimeout(() => setStatus({ type: null, message: "" }), 3000)
    } catch (error) {
      console.error("Export error:", error)
      setStatus({ type: "error", message: "Failed to export data" })
    }
  }

  const handleImport = () => {
    if (!importData.trim()) {
      setStatus({ type: "error", message: "Please paste the JSON data to import" })
      return
    }

    setIsProcessing(true)

    try {
      const data = JSON.parse(importData)

      // Validate data structure
      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error("Invalid data format: categories array is required")
      }

      // Process categories with date conversion
      const processedCategories = data.categories.map((category: any) => ({
        ...category,
        articles: (category.articles || []).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
          tags: Array.isArray(article.tags) ? article.tags : [],
        })),
        subcategories: (category.subcategories || []).map((subcategory: any) => ({
          ...subcategory,
          articles: (subcategory.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
            tags: Array.isArray(article.tags) ? article.tags : [],
          })),
        })),
      }))

      // Process users if provided
      let processedUsers = users
      if (data.users && Array.isArray(data.users)) {
        processedUsers = data.users.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        }))
      }

      // Process audit log if provided
      let processedAuditLog = auditLog
      if (data.auditLog && Array.isArray(data.auditLog)) {
        processedAuditLog = data.auditLog.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))
      }

      // Save to storage
      storage.saveCategories(processedCategories)
      storage.saveUsers(processedUsers)
      storage.saveAuditLog(processedAuditLog)

      // Add audit entry for import
      storage.addAuditEntry({
        action: "data_imported",
        entityType: "system",
        entityId: "system",
        performedBy: "admin",
        timestamp: new Date(),
        details: `Imported ${processedCategories.length} categories with data`,
      })

      setStatus({ type: "success", message: "Data imported successfully!" })
      setImportData("")

      // Notify parent to reload data
      setTimeout(() => {
        onDataImported()
        setStatus({ type: null, message: "" })
      }, 1000)
    } catch (error) {
      console.error("Import error:", error)
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to import data. Please check the JSON format.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      try {
        storage.clearAll()
        setStatus({ type: "success", message: "All data cleared successfully!" })

        setTimeout(() => {
          onDataImported()
          setStatus({ type: null, message: "" })
        }, 1000)
      } catch (error) {
        console.error("Clear error:", error)
        setStatus({ type: "error", message: "Failed to clear data" })
      }
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
        <p className="text-gray-600">Import, export, and manage your knowledge base data</p>
      </div>

      {/* Status Alert */}
      {status.type && (
        <Alert className={status.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          {status.type === "error" ? (
            <AlertCircle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={status.type === "error" ? "text-red-800" : "text-green-800"}>
            {status.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Current Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Current Data</span>
          </CardTitle>
          <CardDescription>Overview of your current knowledge base</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{getTotalArticles()}</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{users.length}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Export Data</span>
          </CardTitle>
          <CardDescription>Download a backup of your knowledge base</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Knowledge Base
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
          <CardDescription>Import knowledge base data from a JSON backup file</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="import-data">JSON Data</Label>
            <Textarea
              id="import-data"
              placeholder="Paste your JSON backup data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
              disabled={isProcessing}
            />
          </div>
          <Button onClick={handleImport} disabled={!importData.trim() || isProcessing} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {isProcessing ? "Importing..." : "Import Data"}
          </Button>
        </CardContent>
      </Card>

      {/* Clear All Data */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>Permanently delete all knowledge base data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleClearAll} className="w-full">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
