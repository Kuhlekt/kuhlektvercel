"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Upload,
  Database,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
  FolderOpen,
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
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Get current data from storage if props are empty
  const currentUsers = users.length > 0 ? users : storage.getUsers()
  const currentCategories = categories.length > 0 ? categories : storage.getCategories()
  const currentArticles = articles.length > 0 ? articles : storage.getArticles()
  const currentAuditLog = auditLog.length > 0 ? auditLog : storage.getAuditLog()

  const handleExport = async () => {
    setIsExporting(true)
    setMessage(null)

    try {
      const exportData = {
        users: currentUsers,
        categories: currentCategories,
        articles: currentArticles,
        auditLog: currentAuditLog,
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

      setMessage({
        type: "success",
        text: `Backup exported successfully! Contains ${currentUsers.length} users, ${currentCategories.length} categories, ${currentArticles.length} articles, and ${currentAuditLog.length} audit entries.`,
      })

      console.log("✅ Export successful:", {
        users: currentUsers.length,
        categories: currentCategories.length,
        articles: currentArticles.length,
        auditLog: currentAuditLog.length,
      })
    } catch (error) {
      console.error("❌ Export failed:", error)
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      setMessage({ type: "error", text: "Please select a file to import." })
      return
    }

    setIsImporting(true)
    setMessage(null)

    try {
      const fileContent = await importFile.text()
      console.log("📁 Reading import file...")

      let importData
      try {
        importData = JSON.parse(fileContent)
      } catch (parseError) {
        console.error("❌ JSON parse error:", parseError)
        throw new Error("Invalid JSON format in backup file")
      }

      console.log("📊 Import data structure:", {
        hasUsers: !!importData.users,
        hasCategories: !!importData.categories,
        hasArticles: !!importData.articles,
        hasAuditLog: !!importData.auditLog,
        userCount: Array.isArray(importData.users) ? importData.users.length : 0,
        categoryCount: Array.isArray(importData.categories) ? importData.categories.length : 0,
        articleCount: Array.isArray(importData.articles) ? importData.articles.length : 0,
        auditCount: Array.isArray(importData.auditLog) ? importData.auditLog.length : 0,
      })

      // Flexible validation - check if it's an object with at least one expected property
      if (!importData || typeof importData !== "object") {
        throw new Error("Invalid backup file format - not a valid object")
      }

      const hasValidData = importData.users || importData.categories || importData.articles || importData.auditLog
      if (!hasValidData) {
        throw new Error("Invalid backup file format - no recognized data found")
      }

      // Import the data with proper validation
      const importedCounts = { users: 0, categories: 0, articles: 0, auditLog: 0 }

      if (importData.users && Array.isArray(importData.users)) {
        storage.saveUsers(importData.users)
        importedCounts.users = importData.users.length
        console.log("👥 Users imported:", importedCounts.users)
      }

      if (importData.categories && Array.isArray(importData.categories)) {
        storage.saveCategories(importData.categories)
        importedCounts.categories = importData.categories.length
        console.log("📁 Categories imported:", importedCounts.categories)
      }

      if (importData.articles && Array.isArray(importData.articles)) {
        storage.saveArticles(importData.articles)
        importedCounts.articles = importData.articles.length
        console.log("📄 Articles imported:", importedCounts.articles)
      }

      if (importData.auditLog && Array.isArray(importData.auditLog)) {
        localStorage.setItem("kb_audit_log", JSON.stringify(importData.auditLog))
        importedCounts.auditLog = importData.auditLog.length
        console.log("📋 Audit log imported:", importedCounts.auditLog)
      }

      setMessage({
        type: "success",
        text: `Import successful! Imported ${importedCounts.users} users, ${importedCounts.categories} categories, ${importedCounts.articles} articles, and ${importedCounts.auditLog} audit entries.`,
      })

      // Refresh the data
      if (onDataChange) {
        onDataChange()
      }

      setImportFile(null)
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    } catch (error) {
      console.error("❌ Import failed:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to import data. Please check the file format.",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all articles and categories? This action cannot be undone.")) {
      storage.clearArticlesAndCategories()
      setMessage({ type: "success", text: "Articles and categories cleared successfully." })

      if (onDataChange) {
        onDataChange()
      }
    }
  }

  const handleResetAll = () => {
    if (
      confirm(
        "Are you sure you want to reset ALL data including users? This will restore default settings and cannot be undone.",
      )
    ) {
      storage.resetToDefaults()
      setMessage({ type: "success", text: "All data reset to defaults successfully." })

      if (onDataChange) {
        onDataChange()
      }

      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload()
      }, 1000)
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
              <TabsTrigger value="restore">Restore</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">{currentUsers.length || 0}</div>
                    <div className="text-sm text-gray-600">Users</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <FolderOpen className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">{currentCategories.length || 0}</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">{currentArticles.length || 0}</div>
                    <div className="text-sm text-gray-600">Articles</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold">{currentAuditLog.length || 0}</div>
                    <div className="text-sm text-gray-600">Audit Entries</div>
                  </CardContent>
                </Card>
              </div>

              <div className="text-sm text-gray-600">
                <p>Published Articles: {currentArticles.filter((a) => a.status === "published").length || 0}</p>
                <p>Draft Articles: {currentArticles.filter((a) => a.status === "draft").length || 0}</p>
                <p>Admin Users: {currentUsers.filter((u) => u.role === "admin").length || 0}</p>
                <p>Editor Users: {currentUsers.filter((u) => u.role === "editor").length || 0}</p>
              </div>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Export Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Export all data including users, categories, articles, and audit logs to a JSON file.
                  </p>
                  <Button onClick={handleExport} disabled={isExporting} className="w-full sm:w-auto">
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
                </div>
              </div>
            </TabsContent>

            <TabsContent value="restore" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Import Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Import data from a previously exported JSON backup file. This will replace existing data.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="import-file">Select Backup File</Label>
                      <Input
                        id="import-file"
                        type="file"
                        accept=".json"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                        className="mt-1"
                      />
                    </div>

                    <Button onClick={handleImport} disabled={!importFile || isImporting} className="w-full sm:w-auto">
                      {isImporting ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Import Backup
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Clear Content Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Remove all articles and categories while keeping users and settings.
                  </p>
                  <Button onClick={handleClearData} variant="outline" className="w-full sm:w-auto bg-transparent">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear Articles & Categories
                  </Button>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-red-600">Reset All Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Reset everything to default settings. This will remove all users, articles, categories, and audit
                    logs.
                  </p>
                  <Button onClick={handleResetAll} variant="destructive" className="w-full sm:w-auto">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset All Data
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"} className="mt-4">
              {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
