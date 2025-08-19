"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Trash2, RefreshCw, Database, FileText, Users, Activity } from "lucide-react"
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleExport = () => {
    try {
      setIsLoading(true)

      // Get fresh data from storage
      const exportData = {
        users: storage.getUsers(),
        categories: storage.getCategories(),
        articles: storage.getArticles(),
        auditLog: storage.getAuditLog(),
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

      showMessage("success", "Data exported successfully!")
      console.log("✅ Export completed:", exportData)
    } catch (error) {
      console.error("❌ Export error:", error)
      showMessage("error", "Failed to export data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        console.log("📁 Import file content:", content.substring(0, 200) + "...")

        const importedData = JSON.parse(content)
        console.log("📊 Parsed import data:", importedData)

        // Flexible validation - check if it's an object and has at least one expected property
        if (!importedData || typeof importedData !== "object") {
          throw new Error("Invalid file format - not a valid JSON object")
        }

        // Check if it has at least one of the expected properties
        const hasValidData =
          importedData.users || importedData.categories || importedData.articles || importedData.auditLog
        if (!hasValidData) {
          throw new Error("Invalid backup file - no recognizable data found")
        }

        // Import data with defaults for missing properties
        const usersToImport = Array.isArray(importedData.users) ? importedData.users : []
        const categoriesToImport = Array.isArray(importedData.categories) ? importedData.categories : []
        const articlesToImport = Array.isArray(importedData.articles) ? importedData.articles : []
        const auditLogToImport = Array.isArray(importedData.auditLog) ? importedData.auditLog : []

        console.log("📥 Importing:", {
          users: usersToImport.length,
          categories: categoriesToImport.length,
          articles: articlesToImport.length,
          auditLog: auditLogToImport.length,
        })

        // Save imported data
        if (usersToImport.length > 0) {
          storage.saveUsers(usersToImport)
        }
        if (categoriesToImport.length > 0) {
          storage.saveCategories(categoriesToImport)
        }
        if (articlesToImport.length > 0) {
          storage.saveArticles(articlesToImport)
        }
        if (auditLogToImport.length > 0) {
          storage.saveAuditLog(auditLogToImport)
        }

        // Refresh the UI
        if (onDataChange) {
          onDataChange()
        }

        const importSummary = [
          usersToImport.length > 0 ? `${usersToImport.length} users` : null,
          categoriesToImport.length > 0 ? `${categoriesToImport.length} categories` : null,
          articlesToImport.length > 0 ? `${articlesToImport.length} articles` : null,
          auditLogToImport.length > 0 ? `${auditLogToImport.length} audit entries` : null,
        ]
          .filter(Boolean)
          .join(", ")

        showMessage("success", `Data imported successfully! Imported: ${importSummary}`)
        console.log("✅ Import completed successfully")
      } catch (error) {
        console.error("❌ Import error:", error)
        showMessage("error", `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      } finally {
        setIsLoading(false)
        // Reset the file input
        event.target.value = ""
      }
    }

    reader.onerror = () => {
      console.error("❌ File read error")
      showMessage("error", "Failed to read file")
      setIsLoading(false)
    }

    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (!confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return
    }

    try {
      setIsLoading(true)
      storage.clearAll()

      if (onDataChange) {
        onDataChange()
      }

      showMessage("success", "All data cleared successfully!")
      console.log("🗑️ All data cleared")
    } catch (error) {
      console.error("❌ Clear error:", error)
      showMessage("error", "Failed to clear data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    try {
      setIsLoading(true)
      if (onDataChange) {
        onDataChange()
      }
      showMessage("success", "Data refreshed successfully!")
      console.log("🔄 Data refreshed")
    } catch (error) {
      console.error("❌ Refresh error:", error)
      showMessage("error", "Failed to refresh data")
    } finally {
      setIsLoading(false)
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
                    <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
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
            </TabsContent>

            <TabsContent value="backup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Export Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">Download a complete backup of all your knowledge base data.</p>
                    <Button onClick={handleExport} disabled={isLoading} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      {isLoading ? "Exporting..." : "Export Data"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Import Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">Restore data from a previously exported backup file.</p>
                    <div>
                      <Label htmlFor="import-file">Select Backup File</Label>
                      <Input
                        id="import-file"
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        disabled={isLoading}
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Refresh Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Reload all data from storage to ensure everything is up to date.
                    </p>
                    <Button
                      onClick={handleRefresh}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      {isLoading ? "Refreshing..." : "Refresh Data"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-red-600">Clear All Data</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">Permanently delete all data. This action cannot be undone.</p>
                    <Button onClick={handleClearAll} disabled={isLoading} variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isLoading ? "Clearing..." : "Clear All Data"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {message && (
            <Alert
              className={`mt-4 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
            >
              <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
