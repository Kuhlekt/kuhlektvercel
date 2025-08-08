"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Upload, Trash2, Database, FileText, Users, Activity, HardDrive } from 'lucide-react'
import { storage, dataManager } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: (data: { categories: Category[], users: User[], auditLog: AuditLogEntry[], pageVisits?: number }) => void
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importError, setImportError] = useState("")
  const [importSuccess, setImportSuccess] = useState("")
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  // Calculate statistics
  const totalArticles = categories.reduce((total, category) => {
    const categoryArticles = category.articles.length
    const subcategoryArticles = category.subcategories.reduce(
      (subTotal, sub) => subTotal + sub.articles.length,
      0
    )
    return total + categoryArticles + subcategoryArticles
  }, 0)

  const totalCategories = categories.length
  const totalSubcategories = categories.reduce((total, cat) => total + cat.subcategories.length, 0)
  const totalUsers = users.length
  const totalAuditEntries = auditLog.length
  const pageVisits = storage.getPageVisits()

  // Calculate approximate data size
  const dataSize = new Blob([JSON.stringify({ categories, users, auditLog })]).size
  const dataSizeKB = Math.round(dataSize / 1024)

  const handleExport = async () => {
    setIsExporting(true)
    try {
      dataManager.exportData()
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportError("")
    setImportSuccess("")

    try {
      const importedData = await dataManager.importData(file)
      onDataImported(importedData)
      setImportSuccess("Data imported successfully!")
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Import failed")
    } finally {
      setIsImporting(false)
      // Reset file input
      event.target.value = ""
    }
  }

  const handleClearAll = async () => {
    setIsClearing(true)
    try {
      storage.clearAll()
      // Reload the page to reset all state
      window.location.reload()
    } catch (error) {
      console.error("Clear failed:", error)
    } finally {
      setIsClearing(false)
      setShowClearDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Statistics Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Articles</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground">
              {totalCategories} categories, {totalSubcategories} subcategories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.role === 'admin').length} admins, {users.filter(u => u.role === 'editor').length} editors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAuditEntries}</div>
            <p className="text-xs text-muted-foreground">
              {pageVisits} page visits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataSizeKB} KB</div>
            <p className="text-xs text-muted-foreground">
              Local storage usage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Export/Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {importError && (
            <Alert variant="destructive">
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}

          {importSuccess && (
            <Alert>
              <AlertDescription>{importSuccess}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Export */}
            <div className="space-y-2">
              <Label>Export Data</Label>
              <p className="text-sm text-muted-foreground">
                Download a complete backup of all your data including articles, users, and audit logs.
              </p>
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? "Exporting..." : "Export Backup"}
              </Button>
            </div>

            {/* Import */}
            <div className="space-y-2">
              <Label htmlFor="import-file">Import Data</Label>
              <p className="text-sm text-muted-foreground">
                Restore data from a previously exported backup file. This will replace all current data.
              </p>
              <div className="flex items-center space-x-2">
                <Input
                  id="import-file"
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="flex-1"
                />
                {isImporting && (
                  <Badge variant="secondary">Importing...</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center space-x-2">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Permanently delete all data including articles, users, audit logs, and settings. This action cannot be undone.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => setShowClearDialog(true)}
              disabled={isClearing}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Clear All Data</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete all data? This will permanently remove:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{totalArticles} articles</li>
                <li>{totalUsers} users</li>
                <li>{totalAuditEntries} audit log entries</li>
                <li>All categories and settings</li>
              </ul>
              <strong className="block mt-2">This action cannot be undone.</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleClearAll}
              disabled={isClearing}
            >
              {isClearing ? "Clearing..." : "Yes, Clear All Data"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
