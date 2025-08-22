"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Download, Upload, Trash2, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { isMockMode } from "@/lib/supabase"
import { exportAllData, importAllData, clearAllData } from "@/utils/database"

interface ImportStats {
  categories: number
  subcategories: number
  articles: number
  users: number
  auditLogs: number
}

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [exportProgress, setExportProgress] = useState(0)
  const [clearProgress, setClearProgress] = useState(0)
  const [importStats, setImportStats] = useState<ImportStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [clearConfirmText, setClearConfirmText] = useState("")

  const handleExportData = async () => {
    if (isMockMode) {
      setError("Export not available in preview mode. Supabase configuration required.")
      return
    }

    setIsExporting(true)
    setError(null)
    setSuccess(null)
    setExportProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setExportProgress((prev) => Math.min(prev + 10, 90))
      }, 200)

      const data = await exportAllData()

      clearInterval(progressInterval)
      setExportProgress(100)

      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setSuccess("Data exported successfully!")
    } catch (err) {
      setError(`Export failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsExporting(false)
      setTimeout(() => setExportProgress(0), 2000)
    }
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (isMockMode) {
      setError("Import not available in preview mode. Supabase configuration required.")
      return
    }

    setIsImporting(true)
    setError(null)
    setSuccess(null)
    setImportStats(null)
    setImportProgress(0)

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate backup format
      if (!data.categories || !data.articles || !data.users) {
        throw new Error("Invalid backup file format")
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => Math.min(prev + 5, 90))
      }, 300)

      const stats = await importAllData(data)

      clearInterval(progressInterval)
      setImportProgress(100)
      setImportStats(stats)
      setSuccess("Data imported successfully!")
    } catch (err) {
      setError(`Import failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsImporting(false)
      setTimeout(() => setImportProgress(0), 3000)
      // Reset file input
      event.target.value = ""
    }
  }

  const handleClearData = async () => {
    if (clearConfirmText !== "DELETE ALL DATA") {
      setError('Please type "DELETE ALL DATA" to confirm')
      return
    }

    if (isMockMode) {
      setError("Clear data not available in preview mode. Supabase configuration required.")
      return
    }

    setIsClearing(true)
    setError(null)
    setSuccess(null)
    setClearProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setClearProgress((prev) => Math.min(prev + 8, 90))
      }, 200)

      await clearAllData()

      clearInterval(progressInterval)
      setClearProgress(100)
      setSuccess("All data cleared successfully!")
      setShowClearConfirm(false)
      setClearConfirmText("")
    } catch (err) {
      setError(`Clear failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsClearing(false)
      setTimeout(() => setClearProgress(0), 2000)
    }
  }

  return (
    <div className="space-y-6">
      {isMockMode && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Data management features require Supabase configuration. Currently running in preview mode with local
            storage.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download a complete backup of your knowledge base including all categories, articles, users, and audit logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isExporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Exporting data...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} />
            </div>
          )}
          <Button onClick={handleExportData} disabled={isExporting || isMockMode} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export All Data"}
          </Button>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>
            Restore your knowledge base from a backup file. This will replace all existing data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isImporting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Importing data...</span>
                <span>{importProgress}%</span>
              </div>
              <Progress value={importProgress} />
            </div>
          )}

          {importStats && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2">Import Summary</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                <div>Categories: {importStats.categories}</div>
                <div>Subcategories: {importStats.subcategories}</div>
                <div>Articles: {importStats.articles}</div>
                <div>Users: {importStats.users}</div>
                <div>Audit Logs: {importStats.auditLogs}</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="backup-file">Select Backup File</Label>
            <Input
              id="backup-file"
              type="file"
              accept=".json"
              onChange={handleImportData}
              disabled={isImporting || isMockMode}
            />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Clear All Data */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete all data from the knowledge base. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showClearConfirm ? (
            <Button variant="destructive" onClick={() => setShowClearConfirm(true)} disabled={isMockMode}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          ) : (
            <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="text-red-800">
                <p className="font-medium">⚠️ This will permanently delete:</p>
                <ul className="list-disc list-inside mt-2 text-sm">
                  <li>All categories and subcategories</li>
                  <li>All articles and their content</li>
                  <li>All users (except system admin)</li>
                  <li>All audit log entries</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-text">
                  Type <code className="bg-red-100 px-1 rounded">DELETE ALL DATA</code> to confirm:
                </Label>
                <Input
                  id="confirm-text"
                  value={clearConfirmText}
                  onChange={(e) => setClearConfirmText(e.target.value)}
                  placeholder="DELETE ALL DATA"
                  disabled={isClearing}
                />
              </div>

              {isClearing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Clearing data...</span>
                    <span>{clearProgress}%</span>
                  </div>
                  <Progress value={clearProgress} />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleClearData}
                  disabled={isClearing || clearConfirmText !== "DELETE ALL DATA" || isMockMode}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isClearing ? "Clearing..." : "Confirm Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowClearConfirm(false)
                    setClearConfirmText("")
                    setError(null)
                  }}
                  disabled={isClearing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
