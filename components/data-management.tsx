"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, Upload, Trash2, AlertTriangle, CheckCircle, Info, FileText } from "lucide-react"
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [exportProgress, setExportProgress] = useState(0)
  const [clearProgress, setClearProgress] = useState(0)
  const [importStats, setImportStats] = useState<ImportStats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [clearConfirmText, setClearConfirmText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleExportData = async () => {
    if (isMockMode) {
      setError("Export not available in preview mode. Supabase configuration required.")
      return
    }

    setIsExporting(true)
    clearMessages()
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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        setError("Please select a valid JSON file")
        return
      }
      setSelectedFile(file)
      clearMessages()
    }
  }

  const handleImportData = async () => {
    if (!selectedFile) {
      setError("Please select a backup file first")
      return
    }

    if (isMockMode) {
      setError("Import not available in preview mode. Supabase configuration required.")
      return
    }

    setIsImporting(true)
    clearMessages()
    setImportStats(null)
    setImportProgress(0)

    try {
      setImportProgress(10)
      const text = await selectedFile.text()

      setImportProgress(20)
      const data = JSON.parse(text)

      // Validate backup format
      if (!data.categories && !data.articles && !data.users) {
        throw new Error("Invalid backup file format. Missing required data sections.")
      }

      setImportProgress(30)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setImportProgress((prev) => Math.min(prev + 5, 90))
      }, 300)

      const stats = await importAllData(data)

      clearInterval(progressInterval)
      setImportProgress(100)
      setImportStats(stats)
      setSuccess("Data imported successfully!")
      setSelectedFile(null)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err) {
      setError(`Import failed: ${err instanceof Error ? err.message : "Unknown error"}`)
    } finally {
      setIsImporting(false)
      setTimeout(() => setImportProgress(0), 3000)
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
    clearMessages()
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
      setShowClearDialog(false)
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
      <div>
        <h2 className="text-2xl font-bold mb-2">Data Management</h2>
        <p className="text-muted-foreground">Export, import, and manage your knowledge base data.</p>
      </div>

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
          <p className="text-xs text-muted-foreground">
            Creates a JSON file with timestamp in filename for easy organization.
          </p>
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
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> Importing will completely replace all existing data. Export current data first
              if needed.
            </AlertDescription>
          </Alert>

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
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Import Summary
              </h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                <div>Categories: {importStats.categories}</div>
                <div>Subcategories: {importStats.subcategories}</div>
                <div>Articles: {importStats.articles}</div>
                <div>Users: {importStats.users}</div>
                <div>Audit Logs: {importStats.auditLogs}</div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backup-file">Select Backup File</Label>
              <div className="flex items-center gap-2">
                <Input
                  ref={fileInputRef}
                  id="backup-file"
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileSelect}
                  disabled={isImporting || isMockMode}
                  className="file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {selectedFile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {selectedFile && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <FileText className="h-4 w-4" />
                  <div className="text-sm">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-blue-600">
                      Size: {(selectedFile.size / 1024).toFixed(1)} KB | Modified:{" "}
                      {new Date(selectedFile.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button onClick={handleImportData} disabled={!selectedFile || isImporting || isMockMode} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
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
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warning:</strong> This will permanently delete all categories, articles, users, and audit logs.
            </AlertDescription>
          </Alert>

          <Button variant="destructive" onClick={() => setShowClearDialog(true)} disabled={isMockMode}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      {/* Clear Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Data Deletion
            </DialogTitle>
            <DialogDescription>This will permanently delete all data from your knowledge base:</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                <li>All categories and subcategories</li>
                <li>All articles and their content</li>
                <li>All users (except system admin)</li>
                <li>All audit log entries</li>
                <li>All application settings</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-text">
                Type <code className="bg-red-100 px-1 rounded text-red-800">DELETE ALL DATA</code> to confirm:
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
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowClearDialog(false)
                setClearConfirmText("")
                clearMessages()
              }}
              disabled={isClearing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearData}
              disabled={isClearing || clearConfirmText !== "DELETE ALL DATA" || isMockMode}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? "Clearing..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
