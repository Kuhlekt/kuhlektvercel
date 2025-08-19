"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2, RefreshCw, AlertCircle, CheckCircle, Database } from "lucide-react"
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
  const [isClearing, setIsClearing] = useState(false)
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
      const data = {
        users: currentUsers,
        categories: currentCategories,
        articles: currentArticles,
        auditLog: currentAuditLog,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Data exported successfully!" })
      console.log("📤 Data exported successfully")
    } catch (error) {
      console.error("Export error:", error)
      setMessage({ type: "error", text: "Failed to export data" })
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
      const data = JSON.parse(text)

      console.log("📥 Importing data:", data)

      // Flexible validation - check if it's a valid object with at least one expected property
      if (!data || typeof data !== "object") {
        throw new Error("Invalid file format - not a valid JSON object")
      }

      // Check if it has at least one of the expected properties
      const hasValidData = data.users || data.categories || data.articles || data.auditLog
      if (!hasValidData) {
        throw new Error("Invalid backup file - no recognizable data found")
      }

      // Import data with fallbacks
      let importedCount = 0

      if (data.users && Array.isArray(data.users)) {
        storage.saveUsers(data.users)
        importedCount += data.users.length
        console.log(`📥 Imported ${data.users.length} users`)
      }

      if (data.categories && Array.isArray(data.categories)) {
        storage.saveCategories(data.categories)
        importedCount += data.categories.length
        console.log(`📥 Imported ${data.categories.length} categories`)
      }

      if (data.articles && Array.isArray(data.articles)) {
        storage.saveArticles(data.articles)
        importedCount += data.articles.length
        console.log(`📥 Imported ${data.articles.length} articles`)
      }

      if (data.auditLog && Array.isArray(data.auditLog)) {
        const auditEntries = data.auditLog.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }))
        localStorage.setItem("kb_audit_log", JSON.stringify(auditEntries))
        console.log(`📥 Imported ${auditEntries.length} audit log entries`)
      }

      setMessage({
        type: "success",
        text: `Data imported successfully! Imported ${importedCount} items.`,
      })

      // Refresh data
      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      console.error("Import error:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to import data",
      })
    } finally {
      setIsImporting(false)
      // Reset file input
      event.target.value = ""
    }
  }

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return
    }

    setIsClearing(true)
    setMessage(null)

    try {
      storage.clearAll()
      storage.init() // Reinitialize with defaults

      setMessage({ type: "success", text: "All data cleared successfully!" })
      console.log("🗑️ All data cleared")

      // Refresh data
      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      console.error("Clear data error:", error)
      setMessage({ type: "error", text: "Failed to clear data" })
    } finally {
      setIsClearing(false)
    }
  }

  const handleResetToDefaults = async () => {
    if (!confirm("Reset to default settings? This will clear all data and restore defaults.")) {
      return
    }

    setIsClearing(true)
    setMessage(null)

    try {
      storage.resetToDefaults()
      setMessage({ type: "success", text: "Reset to defaults successfully!" })
      console.log("🔄 Reset to defaults complete")

      // Refresh data
      if (onDataChange) {
        onDataChange()
      }
    } catch (error) {
      console.error("Reset error:", error)
      setMessage({ type: "error", text: "Failed to reset to defaults" })
    } finally {
      setIsClearing(false)
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
        <CardContent className="space-y-6">
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Data Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentUsers?.length || 0}</div>
              <div className="text-sm text-blue-800">Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{currentCategories?.length || 0}</div>
              <div className="text-sm text-green-800">Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{currentArticles?.length || 0}</div>
              <div className="text-sm text-purple-800">Articles</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{currentAuditLog?.length || 0}</div>
              <div className="text-sm text-orange-800">Audit Entries</div>
            </div>
          </div>

          {/* Export/Import Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Export Data</h3>
              <p className="text-sm text-gray-600">Download all data as a JSON backup file</p>
              <Button onClick={handleExport} disabled={isExporting} className="w-full">
                {isExporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Import Data</h3>
              <p className="text-sm text-gray-600">Restore data from a JSON backup file</p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button disabled={isImporting} className="w-full bg-transparent" variant="outline">
                  {isImporting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Clear All Data</h4>
                <p className="text-sm text-gray-600">
                  Permanently delete all users, categories, articles, and audit logs
                </p>
                <Button onClick={handleClearData} disabled={isClearing} variant="destructive" className="w-full">
                  {isClearing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All Data
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Reset to Defaults</h4>
                <p className="text-sm text-gray-600">Clear all data and restore default admin user</p>
                <Button onClick={handleResetToDefaults} disabled={isClearing} variant="destructive" className="w-full">
                  {isClearing ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset to Defaults
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
