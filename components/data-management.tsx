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
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setMessage(null)

    try {
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
      link.download = `kuhlekt-kb-export-${new Date().toISOString().split("T")[0]}.json`
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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setMessage(null)

    try {
      const text = await file.text()
      const importData = JSON.parse(text)

      // Validate the imported data structure
      if (!importData.categories || !importData.users || !importData.auditLog) {
        throw new Error("Invalid data format")
      }

      // Save imported data to localStorage
      storage.saveCategories(importData.categories)
      storage.saveUsers(importData.users)
      storage.saveAuditLog(importData.auditLog)

      setMessage({ type: "success", text: "Data imported successfully!" })
      onDataImported()
    } catch (error) {
      console.error("Import error:", error)
      setMessage({ type: "error", text: "Failed to import data. Please check the file format." })
    } finally {
      setIsImporting(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const handleClearData = () => {
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
      <Card>
        <CardHeader>
          <CardTitle>Data Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.categories}</div>
              <div className="text-sm text-gray-500">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.articles}</div>
              <div className="text-sm text-gray-500">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.users}</div>
              <div className="text-sm text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.auditEntries}</div>
              <div className="text-sm text-gray-500">Audit Entries</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Download all your knowledge base data as a JSON file for backup or migration.
            </p>
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              {isExporting ? "Exporting..." : "Export Data"}
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
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button disabled={isImporting} className="w-full">
                {isImporting ? "Importing..." : "Import Data"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5" />
              <span>Clear Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Remove all data from the knowledge base. This action cannot be undone.
            </p>
            <Button onClick={handleClearData} variant="destructive" className="w-full">
              Clear All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
