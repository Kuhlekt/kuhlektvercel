"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Database, Trash2, AlertCircle, CheckCircle, BarChart3 } from "lucide-react"
import { storage } from "../utils/storage"
import { initialCategories } from "../data/initial-data"
import { initialUsers } from "../data/initial-users"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")

  const handleExportData = () => {
    const data = {
      categories,
      users,
      auditLog,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-kb-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.categories && Array.isArray(data.categories)) {
          storage.saveCategories(data.categories)
        }
        if (data.users && Array.isArray(data.users)) {
          storage.saveUsers(data.users)
        }
        if (data.auditLog && Array.isArray(data.auditLog)) {
          storage.saveAuditLog(data.auditLog)
        }

        setImportStatus("success")
        setImportMessage("Data imported successfully!")
        onDataImported()
      } catch (error) {
        setImportStatus("error")
        setImportMessage("Failed to import data. Please check the file format.")
        console.error("Import error:", error)
      }
    }
    reader.readAsText(file)
    event.target.value = ""
  }

  const handleLoadDemoData = () => {
    try {
      storage.saveCategories(initialCategories)
      storage.saveUsers(initialUsers)
      storage.saveAuditLog([])

      setImportStatus("success")
      setImportMessage("Demo data loaded successfully!")
      onDataImported()
    } catch (error) {
      setImportStatus("error")
      setImportMessage("Failed to load demo data.")
      console.error("Demo data error:", error)
    }
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      try {
        storage.clearAll()
        setImportStatus("success")
        setImportMessage("All data cleared successfully!")
        onDataImported()
      } catch (error) {
        setImportStatus("error")
        setImportMessage("Failed to clear data.")
        console.error("Clear data error:", error)
      }
    }
  }

  const getStorageStats = () => {
    const totalArticles = categories.reduce((total, category) => {
      const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
      const subcategoryArticles = Array.isArray(category.subcategories)
        ? category.subcategories.reduce(
            (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
            0,
          )
        : 0
      return total + categoryArticles + subcategoryArticles
    }, 0)

    const totalSubcategories = categories.reduce(
      (total, category) => total + (Array.isArray(category.subcategories) ? category.subcategories.length : 0),
      0,
    )

    return {
      categories: categories.length,
      subcategories: totalSubcategories,
      articles: totalArticles,
      users: users.length,
      auditEntries: auditLog.length,
    }
  }

  const stats = getStorageStats()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.categories}</p>
                <p className="text-sm text-gray-500">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.subcategories}</p>
                <p className="text-sm text-gray-500">Subcategories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.articles}</p>
                <p className="text-sm text-gray-500">Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.users}</p>
                <p className="text-sm text-gray-500">Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.auditEntries}</p>
                <p className="text-sm text-gray-500">Audit Entries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {importStatus !== "idle" && (
        <Alert variant={importStatus === "success" ? "default" : "destructive"}>
          {importStatus === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{importMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="import-export" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="import-export">Import/Export</TabsTrigger>
          <TabsTrigger value="demo-data">Demo Data</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="import-export" className="space-y-4">
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
              <Button onClick={handleExportData} className="w-full">
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
                Import data from a previously exported JSON file. This will replace existing data.
              </p>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demo-data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Load Demo Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Load sample categories, articles, and users to get started quickly. This will replace existing data.
              </p>
              <div className="space-y-2">
                <h4 className="font-medium">Demo data includes:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Getting Started category with welcome articles</li>
                  <li>• Technical Documentation with API guides</li>
                  <li>• Troubleshooting section with common issues</li>
                  <li>• Sample users (admin, editor, viewer)</li>
                </ul>
              </div>
              <Button onClick={handleLoadDemoData} className="w-full">
                <Database className="h-4 w-4 mr-2" />
                Load Demo Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                <span>Clear All Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This action will permanently delete all categories, articles, users, and audit logs. This cannot be
                  undone.
                </AlertDescription>
              </Alert>
              <Button variant="destructive" onClick={handleClearAllData} className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
