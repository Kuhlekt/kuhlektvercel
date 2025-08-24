"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, Trash2, AlertTriangle, CheckCircle, Database } from "lucide-react"
import { apiDatabase } from "../utils/api-database"

interface DataManagementProps {
  onDataUpdate: () => void
}

export function DataManagement({ onDataUpdate }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [importPreview, setImportPreview] = useState<any>(null)

  const handleExport = async () => {
    try {
      setIsExporting(true)
      setMessage({ type: "info", text: "Preparing data export..." })

      const exportData = await apiDatabase.exportData()

      // Create and download file
      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Data exported successfully!" })
    } catch (error) {
      console.error("Export failed:", error)
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
    } finally {
      setIsExporting(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        // Validate and show preview
        setImportPreview({
          categories: data.categories?.length || 0,
          articles: data.articles?.length || 0,
          users: data.users?.length || 0,
          auditLog: data.auditLog?.length || 0,
          exportedAt: data.exportedAt || "Unknown",
          version: data.version || "Unknown",
        })

        setMessage({ type: "info", text: "File loaded. Review the preview and click Import to proceed." })
      } catch (error) {
        setMessage({ type: "error", text: "Invalid JSON file. Please select a valid backup file." })
        setImportPreview(null)
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!importPreview) return

    try {
      setIsImporting(true)
      setImportProgress(0)
      setMessage({ type: "info", text: "Starting import process..." })

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      // Get the file content again
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      const file = fileInput?.files?.[0]
      if (!file) throw new Error("No file selected")

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string
          await apiDatabase.importData(content)

          clearInterval(progressInterval)
          setImportProgress(100)
          setMessage({ type: "success", text: "Data imported successfully!" })

          // Refresh the parent component
          setTimeout(() => {
            onDataUpdate()
            setImportPreview(null)
            if (fileInput) fileInput.value = ""
          }, 1000)
        } catch (error) {
          clearInterval(progressInterval)
          console.error("Import failed:", error)
          setMessage({
            type: "error",
            text: `Import failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          })
        } finally {
          setIsImporting(false)
        }
      }
      reader.readAsText(file)
    } catch (error) {
      setIsImporting(false)
      console.error("Import failed:", error)
      setMessage({ type: "error", text: "Import failed. Please try again." })
    }
  }

  const handleClearData = async () => {
    if (
      !confirm(
        "⚠️ WARNING: This will permanently delete ALL data including categories, articles, users, and audit logs. This action cannot be undone. Are you absolutely sure?",
      )
    ) {
      return
    }

    if (
      !confirm(
        "🚨 FINAL CONFIRMATION: All knowledge base data will be lost forever. Type 'DELETE' in the next prompt to confirm.",
      )
    ) {
      return
    }

    const confirmation = prompt("Type 'DELETE' to confirm data deletion:")
    if (confirmation !== "DELETE") {
      setMessage({ type: "info", text: "Data deletion cancelled." })
      return
    }

    try {
      setIsClearing(true)
      setMessage({ type: "info", text: "Clearing all data..." })

      await apiDatabase.clearAllData()

      setMessage({ type: "success", text: "All data cleared successfully!" })

      // Refresh the parent component
      setTimeout(() => {
        onDataUpdate()
      }, 1000)
    } catch (error) {
      console.error("Clear failed:", error)
      setMessage({ type: "error", text: "Failed to clear data. Please try again." })
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Data Management</h2>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" && <CheckCircle className="h-4 w-4" />}
          {message.type === "error" && <AlertTriangle className="h-4 w-4" />}
          {message.type === "info" && <Database className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="clear">Clear Data</TabsTrigger>
        </TabsList>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Knowledge Base</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Download a complete backup of your knowledge base including all categories, articles, users, and audit
                logs.
              </p>
              <div className="flex items-center space-x-4">
                <Button onClick={handleExport} disabled={isExporting} className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>{isExporting ? "Exporting..." : "Export Data"}</span>
                </Button>
                <Badge variant="outline">JSON Format</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Import Knowledge Base</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">
                Upload a backup file to restore your knowledge base. This will replace all current data.
              </p>

              <div className="space-y-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {importPreview && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Import Preview:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        Categories: <Badge>{importPreview.categories}</Badge>
                      </div>
                      <div>
                        Articles: <Badge>{importPreview.articles}</Badge>
                      </div>
                      <div>
                        Users: <Badge>{importPreview.users}</Badge>
                      </div>
                      <div>
                        Audit Entries: <Badge>{importPreview.auditLog}</Badge>
                      </div>
                      <div>
                        Exported: <Badge variant="outline">{importPreview.exportedAt}</Badge>
                      </div>
                      <div>
                        Version: <Badge variant="outline">{importPreview.version}</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {isImporting && (
                  <div className="space-y-2">
                    <Progress value={importProgress} className="w-full" />
                    <p className="text-sm text-gray-600">Importing data... {importProgress}%</p>
                  </div>
                )}

                <Button
                  onClick={handleImport}
                  disabled={!importPreview || isImporting}
                  className="flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>{isImporting ? "Importing..." : "Import Data"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clear">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                <span>Clear All Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Danger Zone:</strong> This action will permanently delete ALL data including categories,
                  articles, users, and audit logs. This cannot be undone.
                </AlertDescription>
              </Alert>

              <p className="text-gray-600">
                Use this option only if you want to completely reset the knowledge base to an empty state.
              </p>

              <Button
                onClick={handleClearData}
                disabled={isClearing}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>{isClearing ? "Clearing..." : "Clear All Data"}</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
