"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Database,
  FileText,
  Users,
  FolderOpen,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
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
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = storage.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setImportStatus({
        type: "success",
        message: "Backup exported successfully!",
      })
    } catch (error) {
      console.error("Export error:", error)
      setImportStatus({
        type: "error",
        message: "Failed to export backup. Please try again.",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportStatus({ type: null, message: "" })

    try {
      const text = await file.text()
      let data: any

      try {
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error("Invalid JSON format")
      }

      // Flexible validation - check if it's an object and has at least one expected property
      if (!data || typeof data !== "object") {
        throw new Error("Invalid backup file format - not a valid object")
      }

      const hasValidData =
        data.users ||
        data.categories ||
        data.articles ||
        data.auditLog ||
        data.exportDate ||
        Array.isArray(data.users) ||
        Array.isArray(data.categories) ||
        Array.isArray(data.articles) ||
        Array.isArray(data.auditLog)

      if (!hasValidData) {
        throw new Error("Invalid backup file format - no recognizable data found")
      }

      console.log("📥 Importing data:", {
        users: data.users?.length || 0,
        categories: data.categories?.length || 0,
        articles: data.articles?.length || 0,
        auditLog: data.auditLog?.length || 0,
      })

      // Import the data with fallbacks for missing properties
      const importData = {
        users: Array.isArray(data.users) ? data.users : [],
        categories: Array.isArray(data.categories) ? data.categories : [],
        articles: Array.isArray(data.articles) ? data.articles : [],
        auditLog: Array.isArray(data.auditLog) ? data.auditLog : [],
        exportDate: data.exportDate || new Date().toISOString(),
      }

      storage.importData(importData)

      const importedCounts = {
        users: importData.users.length,
        categories: importData.categories.length,
        articles: importData.articles.length,
        auditLog: importData.auditLog.length,
      }

      setImportStatus({
        type: "success",
        message: `Backup imported successfully! Users: ${importedCounts.users}, Categories: ${importedCounts.categories}, Articles: ${importedCounts.articles}, Audit entries: ${importedCounts.auditLog}`,
      })

      // Refresh the data
      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to import backup file",
      })
    } finally {
      setIsImporting(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      storage.clearAll()
      setImportStatus({
        type: "info",
        message: "All data has been cleared.",
      })
      if (onDataChange) {
        onDataChange()
      }
    }
  }

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset to default settings? This will clear all data.")) {
      storage.resetToDefaults()
      setImportStatus({
        type: "info",
        message: "System has been reset to defaults.",
      })
      if (onDataChange) {
        onDataChange()
      }
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
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{users?.length || 0}</div>
                    <div className="text-sm text-gray-600">Users</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <FolderOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{categories?.length || 0}</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{articles?.length || 0}</div>
                    <div className="text-sm text-gray-600">Articles</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">{auditLog?.length || 0}</div>
                    <div className="text-sm text-gray-600">Audit Entries</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Storage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Storage Used:</span>
                      <Badge variant="outline">{getStorageSize()}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Export:</span>
                      <Badge variant="outline">Never</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Export Backup</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Download a complete backup of all your knowledge base data including users, categories, articles,
                      and audit logs.
                    </p>
                    <Button onClick={handleExport} disabled={isExporting} className="w-full">
                      {isExporting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export Backup
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Import Backup</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Restore your knowledge base from a previously exported backup file. This will replace all current
                      data.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="backup-file">Select Backup File</Label>
                      <Input
                        id="backup-file"
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        disabled={isImporting}
                      />
                    </div>
                    {isImporting && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Importing backup...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {importStatus.type && (
                <Alert
                  variant={importStatus.type === "error" ? "destructive" : "default"}
                  className={
                    importStatus.type === "success"
                      ? "border-green-200 bg-green-50"
                      : importStatus.type === "info"
                        ? "border-blue-200 bg-blue-50"
                        : ""
                  }
                >
                  {importStatus.type === "success" && <CheckCircle className="h-4 w-4" />}
                  {importStatus.type === "error" && <AlertTriangle className="h-4 w-4" />}
                  {importStatus.type === "info" && <Info className="h-4 w-4" />}
                  <AlertDescription>{importStatus.message}</AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Danger Zone</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <h4 className="font-medium text-red-800 mb-2">Clear All Data</h4>
                      <p className="text-sm text-red-600 mb-3">
                        This will permanently delete all users, categories, articles, and audit logs. This action cannot
                        be undone.
                      </p>
                      <Button variant="destructive" onClick={handleClearData} className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Data
                      </Button>
                    </div>

                    <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                      <h4 className="font-medium text-orange-800 mb-2">Reset to Defaults</h4>
                      <p className="text-sm text-orange-600 mb-3">
                        This will clear all data and restore the system to its initial state with default admin user.
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleResetToDefaults}
                        className="w-full border-orange-300 bg-transparent"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset to Defaults
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
