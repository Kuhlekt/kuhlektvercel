"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, Database, FileText, AlertCircle, CheckCircle, Trash2 } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

export function DataManagement({ categories = [], users = [], auditLog = [], onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const [previewData, setPreviewData] = useState<any>(null)

  const getCurrentStats = () => {
    const totalArticles = (categories || []).reduce((total, category) => {
      const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
      const subcategoryArticles = Array.isArray(category.subcategories)
        ? category.subcategories.reduce(
            (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
            0,
          )
        : 0
      return total + categoryArticles + subcategoryArticles
    }, 0)

    const totalSubcategories = (categories || []).reduce(
      (total, category) => total + (Array.isArray(category.subcategories) ? category.subcategories.length : 0),
      0,
    )

    return {
      categories: (categories || []).length,
      subcategories: totalSubcategories,
      articles: totalArticles,
      users: (users || []).length,
      auditEntries: (auditLog || []).length,
    }
  }

  const stats = getCurrentStats()

  const handleExport = () => {
    const exportData = {
      categories: categories || [],
      users: users || [],
      auditLog: auditLog || [],
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
  }

  const handlePreview = () => {
    try {
      if (!importData.trim()) {
        setImportMessage("Please enter JSON data to preview")
        setImportStatus("error")
        return
      }

      const parsed = JSON.parse(importData)
      setPreviewData(parsed)
      setImportStatus("idle")
      setImportMessage("")
    } catch (error) {
      setImportMessage("Invalid JSON format")
      setImportStatus("error")
      setPreviewData(null)
    }
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setImportMessage("Please enter JSON data to import")
      setImportStatus("error")
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportStatus("idle")

    try {
      // Parse JSON
      setImportProgress(20)
      const parsed = JSON.parse(importData)

      // Validate structure
      setImportProgress(40)
      if (!parsed.categories || !Array.isArray(parsed.categories)) {
        throw new Error("Invalid data structure: categories array required")
      }

      // Save categories
      setImportProgress(60)
      if (parsed.categories.length > 0) {
        storage.saveCategories(parsed.categories)
      }

      // Save users if present
      setImportProgress(80)
      if (parsed.users && Array.isArray(parsed.users) && parsed.users.length > 0) {
        storage.saveUsers(parsed.users)
      }

      // Save audit log if present
      if (parsed.auditLog && Array.isArray(parsed.auditLog)) {
        storage.saveAuditLog(parsed.auditLog)
      }

      setImportProgress(100)
      setImportStatus("success")
      setImportMessage(`Successfully imported ${parsed.categories.length} categories`)

      // Clear form and refresh data
      setTimeout(() => {
        setImportData("")
        setPreviewData(null)
        onDataImported()
      }, 2000)
    } catch (error) {
      setImportStatus("error")
      setImportMessage(error instanceof Error ? error.message : "Import failed")
    } finally {
      setIsImporting(false)
      setTimeout(() => setImportProgress(0), 3000)
    }
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      storage.clearAll()
      onDataImported()
      setImportMessage("All data cleared successfully")
      setImportStatus("success")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setImportData(content)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Data Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Current Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.subcategories}</div>
              <div className="text-sm text-gray-500">Subcategories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.articles}</div>
              <div className="text-sm text-gray-500">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.users}</div>
              <div className="text-sm text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.auditEntries}</div>
              <div className="text-sm text-gray-500">Audit Entries</div>
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
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">Download all your knowledge base data as a JSON backup file.</p>
          <Button onClick={handleExport} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Backup</span>
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
          <p className="text-sm text-gray-600">
            Import knowledge base data from a JSON backup file or paste JSON directly.
          </p>

          {/* File Upload */}
          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* JSON Input */}
          <div>
            <Textarea
              placeholder="Paste your JSON backup data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>

          {/* Import Progress */}
          {isImporting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Importing data...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>
          )}

          {/* Status Messages */}
          {importMessage && (
            <Alert variant={importStatus === "error" ? "destructive" : "default"}>
              {importStatus === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>{importMessage}</AlertDescription>
            </Alert>
          )}

          {/* Preview Data */}
          {previewData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <Badge variant="outline">{previewData.categories?.length || 0} Categories</Badge>
                  </div>
                  <div>
                    <Badge variant="outline">
                      {previewData.categories?.reduce(
                        (total: number, cat: any) => total + (cat.subcategories?.length || 0),
                        0,
                      ) || 0}{" "}
                      Subcategories
                    </Badge>
                  </div>
                  <div>
                    <Badge variant="outline">
                      {previewData.categories?.reduce((total: number, cat: any) => {
                        const catArticles = cat.articles?.length || 0
                        const subArticles =
                          cat.subcategories?.reduce(
                            (subTotal: number, sub: any) => subTotal + (sub.articles?.length || 0),
                            0,
                          ) || 0
                        return total + catArticles + subArticles
                      }, 0) || 0}{" "}
                      Articles
                    </Badge>
                  </div>
                  <div>
                    <Badge variant="outline">{previewData.users?.length || 0} Users</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handlePreview} variant="outline" disabled={isImporting}>
              <FileText className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleImport} disabled={isImporting || !importData.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importing..." : "Import"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete all data from the knowledge base. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
