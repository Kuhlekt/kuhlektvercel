"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Database,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Users,
  FolderOpen,
  FileText,
  Activity,
} from "lucide-react"
import { storage } from "../utils/storage"
import type { User, Category, Article, AuditLog } from "../types/knowledge-base"

interface DataManagementProps {
  users?: User[]
  categories?: Category[]
  articles?: Article[]
  auditLog?: AuditLog[]
  onDataChange?: () => void
}

export function DataManagement({
  users = [],
  categories = [],
  articles = [],
  auditLog = [],
  onDataChange,
}: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<string>("")
  const [showConfirmClear, setShowConfirmClear] = useState(false)

  // Get data from storage if props are empty
  const actualUsers = users.length > 0 ? users : storage.getUsers()
  const actualCategories = categories.length > 0 ? categories : storage.getCategories()
  const actualArticles = articles.length > 0 ? articles : storage.getArticles()
  const actualAuditLog = auditLog.length > 0 ? auditLog : storage.getAuditLog()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = storage.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setImportStatus("Data exported successfully!")
    } catch (error) {
      console.error("Export error:", error)
      setImportStatus("Export failed. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportStatus("")

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      console.log("Import data structure:", data)

      // More flexible validation - check if it's an object and has at least some expected properties
      if (typeof data !== "object" || data === null) {
        throw new Error("Invalid file format - not a valid JSON object")
      }

      // Check if it has at least one of the expected properties
      const hasValidStructure =
        data.users ||
        data.categories ||
        data.articles ||
        data.auditLog ||
        data.exportDate ||
        Array.isArray(data.users) ||
        Array.isArray(data.categories) ||
        Array.isArray(data.articles) ||
        Array.isArray(data.auditLog)

      if (!hasValidStructure) {
        throw new Error("Invalid backup file - missing expected data structure")
      }

      // Ensure arrays exist with defaults
      const importData = {
        users: Array.isArray(data.users) ? data.users : [],
        categories: Array.isArray(data.categories) ? data.categories : [],
        articles: Array.isArray(data.articles) ? data.articles : [],
        auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
        exportDate: data.exportDate || new Date().toISOString(),
      }

      console.log("Processed import data:", importData)

      storage.importData(importData)
      setImportStatus(
        `Data imported successfully! Imported ${importData.users.length} users, ${importData.categories.length} categories, ${importData.articles.length} articles, and ${importData.auditLog.length} audit entries.`,
      )

      // Refresh the parent component
      if (onDataChange) {
        setTimeout(() => {
          onDataChange()
        }, 100)
      }
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsImporting(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const handleClearData = () => {
    storage.clearArticlesAndCategories()
    setImportStatus("Articles and categories cleared successfully!")
    setShowConfirmClear(false)

    if (onDataChange) {
      onDataChange()
    }
  }

  const handleResetAll = () => {
    storage.resetToDefaults()
    setImportStatus("All data reset to defaults!")
    setShowConfirmClear(false)

    if (onDataChange) {
      onDataChange()
    }
  }

  const getStorageSize = () => {
    try {
      let total = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith("kb_")) {
          total += localStorage[key].length
        }
      }
      return (total / 1024).toFixed(2) + " KB"
    } catch (error) {
      return "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{actualUsers?.length || 0}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <FolderOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{actualCategories?.length || 0}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{actualArticles?.length || 0}</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{actualAuditLog?.length || 0}</div>
              <div className="text-sm text-gray-600">Audit Entries</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={handleExport} disabled={isExporting} className="flex items-center space-x-2">
              {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              <span>{isExporting ? "Exporting..." : "Export Data"}</span>
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button
                disabled={isImporting}
                className="w-full flex items-center space-x-2 bg-transparent"
                variant="outline"
              >
                {isImporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>{isImporting ? "Importing..." : "Import Data"}</span>
              </Button>
            </div>

            <Button
              onClick={() => setShowConfirmClear(true)}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Data</span>
            </Button>
          </div>

          {importStatus && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{importStatus}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Storage Information</h3>
            <div className="text-sm text-gray-600">
              <p>
                Total Storage Used: <Badge variant="outline">{getStorageSize()}</Badge>
              </p>
              <p className="mt-1">Data is stored locally in your browser's localStorage</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showConfirmClear && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Confirm Data Deletion</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Choose what data you want to clear. This action cannot be undone.</p>
            <div className="flex space-x-2">
              <Button onClick={handleClearData} variant="destructive" size="sm">
                Clear Articles & Categories Only
              </Button>
              <Button onClick={handleResetAll} variant="destructive" size="sm">
                Reset All Data
              </Button>
              <Button onClick={() => setShowConfirmClear(false)} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Users Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {actualUsers?.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{user.username}</span>
                        <Badge variant="outline" className="ml-2">
                          {user.role}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  )) || <p className="text-gray-500">No users found</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Categories Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {actualCategories?.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{category.name}</span>
                        {category.subcategories && category.subcategories.length > 0 && (
                          <Badge variant="outline" className="ml-2">
                            {category.subcategories.length} subcategories
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  )) || <p className="text-gray-500">No categories found</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Articles Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {actualArticles?.map((article) => (
                    <div key={article.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{article.title}</span>
                        <Badge variant="outline" className="ml-2">
                          {article.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">by {article.createdBy}</div>
                    </div>
                  )) || <p className="text-gray-500">No articles found</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log Data</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {actualAuditLog?.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{entry.action}</span>
                        <div className="text-sm text-gray-500">{entry.details}</div>
                      </div>
                      <div className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</div>
                    </div>
                  )) || <p className="text-gray-500">No audit entries found</p>}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
