"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Download, Upload, AlertTriangle, CheckCircle, Database, Trash2 } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: (categories: Category[], users: User[], auditLog: AuditLogEntry[]) => void
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setMessage(null)

    try {
      const exportData = storage.exportData()
      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}-${Math.random().toString(36).substring(2, 15)}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      setMessage({ type: "success", text: "Data exported successfully!" })
    } catch (error) {
      console.error("Export error:", error)
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
    } finally {
      setIsExporting(false)
    }
  }

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await readFileAsText(file)
      setImportData(text)
    } catch (error) {
      console.error("File read error:", error)
      setMessage({ type: "error", text: "Failed to read file. Please try again." })
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === "string") {
          resolve(result)
        } else {
          reject(new Error("Failed to read file as text"))
        }
      }
      reader.onerror = () => reject(new Error("File reading failed"))
      reader.readAsText(file)
    })
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setMessage({ type: "error", text: "Please provide data to import." })
      return
    }

    setIsImporting(true)
    setMessage(null)

    try {
      const data = JSON.parse(importData)

      // Validate data structure
      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error("Invalid data format: categories must be an array")
      }

      if (!data.users || !Array.isArray(data.users)) {
        throw new Error("Invalid data format: users must be an array")
      }

      if (!data.auditLog || !Array.isArray(data.auditLog)) {
        throw new Error("Invalid data format: auditLog must be an array")
      }

      // Process categories with date conversion
      const processedCategories = data.categories.map((category: any) => ({
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

      // Process users with date conversion
      const processedUsers = data.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }))

      // Process audit log with date conversion
      const processedAuditLog = data.auditLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))

      // Save to storage
      storage.saveCategories(processedCategories)
      storage.saveUsers(processedUsers)
      storage.saveAuditLog(processedAuditLog)

      if (data.pageVisits) {
        // Update page visits if provided
        localStorage.setItem("kuhlekt_kb_page_visits", data.pageVisits.toString())
      }

      // Update parent component
      onDataImported(processedCategories, processedUsers, processedAuditLog)

      setMessage({ type: "success", text: "Data imported successfully!" })
      setImportData("")

      // Add audit entry for import
      storage.addAuditEntry({
        action: "data_imported",
        performedBy: "admin",
        timestamp: new Date(),
        details: `Imported ${processedCategories.length} categories, ${processedUsers.length} users, ${processedAuditLog.length} audit entries`,
      })
    } catch (error) {
      console.error("Import error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setMessage({ type: "error", text: `Import failed: ${errorMessage}` })
    } finally {
      setIsImporting(false)
    }
  }

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return
    }

    try {
      storage.clearAll()
      onDataImported([], [], [])
      setMessage({ type: "success", text: "All data cleared successfully!" })
    } catch (error) {
      console.error("Clear error:", error)
      setMessage({ type: "error", text: "Failed to clear data. Please try again." })
    }
  }

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = category.articles?.length || 0
      const subcategoryArticles =
        category.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Overview
          </CardTitle>
          <CardDescription>Current knowledge base statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getTotalArticles()}</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{users.length}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{auditLog.length}</div>
              <div className="text-sm text-gray-600">Audit Entries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>Download a backup of all knowledge base data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              {isExporting ? "Exporting..." : "Export All Data"}
            </Button>
          </CardContent>
        </Card>

        {/* Import Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
            <CardDescription>Upload a backup file or paste JSON data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-import">Upload Backup File</Label>
              <Input id="file-import" type="file" accept=".json" onChange={handleFileImport} className="mt-1" />
            </div>

            <div>
              <Label htmlFor="json-import">Or Paste JSON Data</Label>
              <Textarea
                id="json-import"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your JSON backup data here..."
                rows={6}
                className="mt-1 font-mono text-sm"
              />
            </div>

            <Button onClick={handleImport} disabled={isImporting || !importData.trim()} className="w-full">
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that will permanently delete data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleClearAll} variant="destructive" className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
