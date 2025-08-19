"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Download, Upload, AlertCircle, CheckCircle, Trash2 } from "lucide-react"
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
      link.download = `knowledge-base-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Data exported successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
    }
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setMessage({ type: "error", text: "Please paste the import data first." })
      return
    }

    setIsLoading(true)
    try {
      const parsedData = JSON.parse(importData)

      // Validate the data structure
      if (!parsedData.categories || !Array.isArray(parsedData.categories)) {
        throw new Error("Invalid data format: categories array is required")
      }
      if (!parsedData.users || !Array.isArray(parsedData.users)) {
        throw new Error("Invalid data format: users array is required")
      }

      // Save the imported data
      storage.saveCategories(parsedData.categories)
      storage.saveUsers(parsedData.users)

      if (parsedData.auditLog && Array.isArray(parsedData.auditLog)) {
        storage.saveAuditLog(parsedData.auditLog)
      }

      setMessage({ type: "success", text: "Data imported successfully!" })
      setImportData("")
      onDataImported()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid JSON format"
      setMessage({ type: "error", text: `Import failed: ${errorMessage}` })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      storage.clearAll()
      setMessage({ type: "success", text: "All data cleared successfully!" })
      onDataImported()
    }
  }

  const getDataStats = () => {
    const totalArticles = categories.reduce((total, category) => {
      const categoryArticles = category.articles?.length || 0
      const subcategoryArticles =
        category.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
      return total + categoryArticles + subcategoryArticles
    }, 0)

    return {
      categories: categories.length,
      articles: totalArticles,
      users: users.length,
      auditEntries: auditLog.length,
    }
  }

  const stats = getDataStats()

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.categories}</div>
            <div className="text-sm text-gray-500">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.articles}</div>
            <div className="text-sm text-gray-500">Articles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.users}</div>
            <div className="text-sm text-gray-500">Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.auditEntries}</div>
            <div className="text-sm text-gray-500">Audit Entries</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Export all your knowledge base data including categories, articles, users, and audit logs.
            </p>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Import Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-data">Paste exported JSON data:</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your exported JSON data here..."
                rows={6}
                className="resize-none font-mono text-sm"
              />
            </div>
            <Button onClick={handleImport} disabled={!importData.trim() || isLoading} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? "Importing..." : "Import Data"}
            </Button>
            <p className="text-xs text-gray-500">Warning: This will replace all existing data.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">Clear all data from the knowledge base. This action cannot be undone.</p>
          <Button variant="destructive" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
