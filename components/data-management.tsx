"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2, AlertCircle, CheckCircle } from "lucide-react"
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

  const handleExport = () => {
    const data = {
      categories,
      users,
      auditLog,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `knowledge-base-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setMessage({ type: "success", text: "Data exported successfully!" })
    setTimeout(() => setMessage(null), 3000)
  }

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        setMessage({ type: "error", text: "Please paste the JSON data to import." })
        return
      }

      const data = JSON.parse(importData)

      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error("Invalid data format: categories array is required")
      }

      if (!data.users || !Array.isArray(data.users)) {
        throw new Error("Invalid data format: users array is required")
      }

      // Save imported data
      storage.saveCategories(data.categories)
      storage.saveUsers(data.users)
      if (data.auditLog && Array.isArray(data.auditLog)) {
        storage.saveAuditLog(data.auditLog)
      }

      setImportData("")
      setMessage({ type: "success", text: "Data imported successfully!" })
      setTimeout(() => setMessage(null), 3000)

      // Notify parent component to reload data
      onDataImported()
    } catch (error) {
      setMessage({
        type: "error",
        text: `Import failed: ${error instanceof Error ? error.message : "Invalid JSON format"}`,
      })
    }
  }

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      storage.clearAll()
      setMessage({ type: "success", text: "All data cleared successfully!" })
      setTimeout(() => setMessage(null), 3000)
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
              Export all knowledge base data including categories, articles, users, and audit logs as a JSON file.
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
            <p className="text-sm text-gray-600">
              Import knowledge base data from a previously exported JSON file. This will replace all existing data.
            </p>
            <Textarea
              placeholder="Paste your JSON data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="min-h-[100px]"
            />
            <Button onClick={handleImport} className="w-full" disabled={!importData.trim()}>
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
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
          <Button onClick={handleClearAll} variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
