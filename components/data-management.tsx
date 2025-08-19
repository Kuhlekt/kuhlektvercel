"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, AlertCircle, CheckCircle, Database } from "lucide-react"
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
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleExport = () => {
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
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setImportStatus({ type: "error", message: "Please paste JSON data to import" })
      return
    }

    setIsImporting(true)
    setImportStatus(null)

    try {
      const data = JSON.parse(importData)

      // Validate data structure
      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error("Invalid data format: categories array is required")
      }

      // Import categories
      if (data.categories) {
        storage.saveCategories(data.categories)
      }

      // Import users (but keep existing admin if no users in import)
      if (data.users && Array.isArray(data.users) && data.users.length > 0) {
        storage.saveUsers(data.users)
      }

      // Import audit log
      if (data.auditLog && Array.isArray(data.auditLog)) {
        storage.saveAuditLog(data.auditLog)
      }

      setImportStatus({
        type: "success",
        message: `Successfully imported ${data.categories.length} categories, ${data.users?.length || 0} users, and ${data.auditLog?.length || 0} audit entries`,
      })

      setImportData("")

      // Notify parent to reload data
      setTimeout(() => {
        onDataImported()
      }, 1000)
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to import data. Please check the JSON format.",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      storage.clearAll()
      setImportStatus({ type: "success", message: "All data cleared successfully" })
      onDataImported()
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
      {/* Data Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalArticles()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Audit Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLog.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="manage">Manage Data</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Import Knowledge Base Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {importStatus && (
                <Alert variant={importStatus.type === "error" ? "destructive" : "default"}>
                  {importStatus.type === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{importStatus.message}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="import-data" className="text-sm font-medium">
                  Paste JSON Data
                </label>
                <Textarea
                  id="import-data"
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your exported JSON data here..."
                  className="min-h-[200px] font-mono text-sm"
                  disabled={isImporting}
                />
              </div>

              <Button onClick={handleImport} disabled={isImporting || !importData.trim()}>
                {isImporting ? "Importing..." : "Import Data"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Knowledge Base Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Export all your knowledge base data including categories, articles, users, and audit logs as a JSON file
                that can be imported later.
              </p>

              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Danger Zone</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Clear all data from the knowledge base. This action cannot be undone.
                  </p>
                  <Button variant="destructive" onClick={handleClearData}>
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
