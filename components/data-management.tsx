"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleExportData = () => {
    try {
      const data = {
        categories,
        users,
        auditLog,
        exportDate: new Date().toISOString(),
        version: "1.0",
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
    } catch (error) {
      console.error("Export error:", error)
      setMessage({ type: "error", text: "Failed to export data" })
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.categories) {
          storage.saveCategories(data.categories)
        }
        if (data.users) {
          storage.saveUsers(data.users)
        }
        if (data.auditLog) {
          storage.saveAuditLog(data.auditLog)
        }

        setMessage({ type: "success", text: "Data imported successfully!" })
        onDataImported()
      } catch (error) {
        console.error("Import error:", error)
        setMessage({ type: "error", text: "Failed to import data. Please check the file format." })
      } finally {
        setIsLoading(false)
      }
    }

    reader.readAsText(file)
    event.target.value = ""
  }

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      try {
        storage.clearAll()
        setMessage({ type: "success", text: "All data cleared successfully!" })
        onDataImported()
      } catch (error) {
        console.error("Clear data error:", error)
        setMessage({ type: "error", text: "Failed to clear data" })
      }
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.categories}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.articles}</div>
            <div className="text-sm text-gray-600">Articles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.users}</div>
            <div className="text-sm text-gray-600">Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.auditEntries}</div>
            <div className="text-sm text-gray-600">Audit Entries</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Export all knowledge base data including categories, articles, users, and audit logs.
            </p>
            <Button onClick={handleExportData} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Data
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
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Import knowledge base data from a previously exported JSON file.
            </p>
            <div className="space-y-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                id="import-file"
                disabled={isLoading}
              />
              <Button
                onClick={() => document.getElementById("import-file")?.click()}
                className="w-full"
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? "Importing..." : "Import Data"}
              </Button>
            </div>
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
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Clear all data from the knowledge base. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={handleClearAllData}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
