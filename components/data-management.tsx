"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, Trash2, Database, FileText, Users, Activity, HardDrive } from 'lucide-react'
import { storage, dataManager } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onCategoriesUpdate: (categories: Category[]) => void
  onUsersUpdate: (users: User[]) => void
  onAuditLogUpdate: (auditLog: AuditLogEntry[]) => void
}

export function DataManagement({
  categories,
  users,
  auditLog,
  onCategoriesUpdate,
  onUsersUpdate,
  onAuditLogUpdate,
}: DataManagementProps) {
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Calculate statistics
  const totalArticles = categories.reduce((total, category) => {
    const categoryArticles = category.articles.length
    const subcategoryArticles = category.subcategories.reduce(
      (subTotal, sub) => subTotal + sub.articles.length,
      0
    )
    return total + categoryArticles + subcategoryArticles
  }, 0)

  const totalSubcategories = categories.reduce(
    (total, category) => total + category.subcategories.length,
    0
  )

  // Estimate data size
  const estimateDataSize = () => {
    const dataString = JSON.stringify({ categories, users, auditLog })
    const sizeInBytes = new Blob([dataString]).size
    const sizeInKB = (sizeInBytes / 1024).toFixed(2)
    return `${sizeInKB} KB`
  }

  const handleExport = async () => {
    setIsExporting(true)
    setMessage(null)
    
    try {
      dataManager.exportData()
      setMessage({ type: 'success', text: 'Data exported successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data. Please try again.' })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    setIsImporting(true)
    setMessage(null)

    try {
      const importedData = await dataManager.importData(importFile)
      
      // Update all data
      onCategoriesUpdate(importedData.categories)
      onUsersUpdate(importedData.users)
      onAuditLogUpdate(importedData.auditLog)
      
      // Save to localStorage
      storage.saveCategories(importedData.categories)
      storage.saveUsers(importedData.users)
      storage.saveAuditLog(importedData.auditLog)
      
      if (importedData.pageVisits) {
        localStorage.setItem('kb_page_visits', importedData.pageVisits.toString())
      }

      setMessage({ type: 'success', text: 'Data imported successfully!' })
      setImportFile(null)
      
      // Reset file input
      const fileInput = document.getElementById('import-file') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to import data. Please check the file format.' 
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleClearAll = () => {
    storage.clearAll()
    onCategoriesUpdate([])
    onUsersUpdate([])
    onAuditLogUpdate([])
    setShowClearDialog(false)
    setMessage({ type: 'success', text: 'All data cleared successfully!' })
  }

  const stats = [
    {
      title: "Articles",
      value: totalArticles,
      icon: FileText,
      color: "text-blue-600"
    },
    {
      title: "Categories",
      value: categories.length,
      icon: Database,
      color: "text-green-600"
    },
    {
      title: "Subcategories",
      value: totalSubcategories,
      icon: Database,
      color: "text-purple-600"
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      color: "text-orange-600"
    },
    {
      title: "Audit Entries",
      value: auditLog.length,
      icon: Activity,
      color: "text-red-600"
    },
    {
      title: "Data Size",
      value: estimateDataSize(),
      icon: HardDrive,
      color: "text-indigo-600"
    }
  ]

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Export/Import */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Download a complete backup of all your knowledge base data including articles, categories, users, and audit logs.
            </p>
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
          </CardContent>
        </Card>

        {/* Import */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Import Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Restore your knowledge base from a previously exported backup file. This will replace all current data.
            </p>
            <div>
              <Label htmlFor="import-file">Select Backup File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                disabled={isImporting}
              />
            </div>
            <Button 
              onClick={handleImport} 
              disabled={!importFile || isImporting} 
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h4 className="font-medium text-red-800">Clear All Data</h4>
              <p className="text-sm text-red-600">
                Permanently delete all articles, categories, users, and audit logs. This action cannot be undone.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear All Data</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete all data? This will permanently remove:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{totalArticles} articles</li>
                <li>{categories.length} categories</li>
                <li>{totalSubcategories} subcategories</li>
                <li>{users.length} users</li>
                <li>{auditLog.length} audit log entries</li>
              </ul>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAll}>
              Yes, Clear All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
