"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, AlertCircle, CheckCircle, FileText, Users, Activity } from "lucide-react"
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
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleExport = () => {
    const exportData = {
      categories,
      users,
      auditLog,
      exportDate: new Date().toISOString(),
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

    // Add audit log entry
    storage.addAuditEntry({
      action: "data_exported",
      performedBy: "admin",
      timestamp: new Date(),
      details: "Knowledge base data exported",
    })
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setImportStatus({
        type: "error",
        message: "Please paste the backup data to import",
      })
      return
    }

    setIsImporting(true)
    setImportStatus({ type: null, message: "" })

    try {
      console.log("Starting import process...")
      const parsedData = JSON.parse(importData)
      console.log("Parsed data:", parsedData)

      // Validate data structure
      if (!parsedData.categories || !Array.isArray(parsedData.categories)) {
        throw new Error("Invalid data format: categories array is required")
      }

      if (!parsedData.users || !Array.isArray(parsedData.users)) {
        throw new Error("Invalid data format: users array is required")
      }

      // Convert date strings back to Date objects
      const processedCategories = parsedData.categories.map((category: any) => ({
        ...category,
        articles: (category.articles || []).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        })),
        subcategories: (category.subcategories || []).map((subcategory: any) => ({
          ...subcategory,
          articles: (subcategory.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
          })),
        })),
      }))

      const processedUsers = parsedData.users.map((user: any) => ({
        ...user,
        createdAt: user.createdAt ? new Date(user.createdAt) : new Date(),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      }))

      const processedAuditLog = (parsedData.auditLog || []).map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))

      // Save to storage
      storage.saveCategories(processedCategories)
      storage.saveUsers(processedUsers)
      storage.saveAuditLog(processedAuditLog)

      // Update state
      onCategoriesUpdate(processedCategories)
      onUsersUpdate(processedUsers)
      onAuditLogUpdate(processedAuditLog)

      // Count imported items
      const articleCount = processedCategories.reduce((total: number, category: Category) => {
        const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
        const subcategoryArticles = Array.isArray(category.subcategories)
          ? category.subcategories.reduce(
              (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
              0,
            )
          : 0
        return total + categoryArticles + subcategoryArticles
      }, 0)

      setImportStatus({
        type: "success",
        message: `Successfully imported ${articleCount} articles, ${processedCategories.length} categories, and ${processedUsers.length} users`,
      })

      // Add audit log entry
      storage.addAuditEntry({
        action: "data_imported",
        performedBy: "admin",
        timestamp: new Date(),
        details: `Imported ${articleCount} articles, ${processedCategories.length} categories, ${processedUsers.length} users`,
      })

      setImportData("")
      console.log("Import completed successfully")
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus({
        type: "error",
        message: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsImporting(false)
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
        <p className="text-gray-600">Export and import knowledge base data</p>
      </div>

      {/* Current Data Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalArticles()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Entries</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLog.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
            <CardDescription>Download a complete backup of your knowledge base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                This will export all articles, categories, users, and audit log entries as a JSON file.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{getTotalArticles()} articles</Badge>
                <Badge variant="outline">{categories.length} categories</Badge>
                <Badge variant="outline">{users.length} users</Badge>
                <Badge variant="outline">{auditLog.length} audit entries</Badge>
              </div>
            </div>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Backup
            </Button>
          </CardContent>
        </Card>

        {/* Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Import Data</span>
            </CardTitle>
            <CardDescription>Restore from a backup file or paste JSON data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="file-upload" className="text-sm font-medium">
                Upload File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="import-data" className="text-sm font-medium">
                Or Paste JSON Data
              </label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your backup JSON data here..."
                className="min-h-[120px] font-mono text-xs"
              />
            </div>

            {importStatus.type && (
              <Alert variant={importStatus.type === "error" ? "destructive" : "default"}>
                {importStatus.type === "error" ? (
                  <AlertCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <AlertDescription>{importStatus.message}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleImport} disabled={isImporting || !importData.trim()} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
