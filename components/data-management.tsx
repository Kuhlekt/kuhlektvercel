"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Download, Upload, Trash2, Database, FileText, Users, Activity, HardDrive } from "lucide-react"
import { storage } from "../utils/storage"
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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Calculate statistics
  const totalArticles = categories.reduce((total, category) => {
    const categoryArticles = category.articles.length
    const subcategoryArticles = category.subcategories.reduce((subTotal, sub) => subTotal + sub.articles.length, 0)
    return total + categoryArticles + subcategoryArticles
  }, 0)

  const totalSubcategories = categories.reduce((total, category) => total + category.subcategories.length, 0)

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
      const data = {
        categories,
        users,
        auditLog,
        pageVisits: storage.getPageVisits(),
        exportedAt: new Date().toISOString(),
        version: "1.1",
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
    } catch (error) {
      console.error("Export error:", error)
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    setIsImporting(true)
    setMessage(null)

    try {
      const fileText = await readFileAsText(importFile)
      console.log("File read successfully, length:", fileText.length)

      let importedData
      try {
        importedData = JSON.parse(fileText)
        console.log("JSON parsed successfully")
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        throw new Error("Invalid JSON file. Please check the file format.")
      }

      // Validate required fields
      if (!importedData.categories || !Array.isArray(importedData.categories)) {
        throw new Error("Invalid backup file: missing or invalid categories")
      }
      if (!importedData.users || !Array.isArray(importedData.users)) {
        throw new Error("Invalid backup file: missing or invalid users")
      }
      if (!importedData.auditLog || !Array.isArray(importedData.auditLog)) {
        throw new Error("Invalid backup file: missing or invalid audit log")
      }

      console.log("Data validation passed")

      // Process categories with date conversion
      const processedCategories = importedData.categories.map((category: any) => ({
        ...category,
        articles: (category.articles || []).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
          editCount: article.editCount || 0,
          tags: Array.isArray(article.tags) ? article.tags : [],
        })),
        subcategories: (category.subcategories || []).map((subcategory: any) => ({
          ...subcategory,
          articles: (subcategory.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
            editCount: article.editCount || 0,
            tags: Array.isArray(article.tags) ? article.tags : [],
          })),
        })),
      }))

      // Process users with date conversion
      const processedUsers = importedData.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }))

      // Process audit log with date conversion
      const processedAuditLog = importedData.auditLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))

      console.log("Data processing completed")

      // Update state
      onCategoriesUpdate(processedCategories)
      onUsersUpdate(processedUsers)
      onAuditLogUpdate(processedAuditLog)

      // Save to storage
      storage.saveCategories(processedCategories)
      storage.saveUsers(processedUsers)
      storage.saveAuditLog(processedAuditLog)

      if (importedData.pageVisits) {
        localStorage.setItem("kuhlekt_kb_page_visits", importedData.pageVisits.toString())
      }

      console.log("Import completed successfully")
      setMessage({ type: "success", text: "Data imported successfully!" })
      setImportFile(null)

      // Reset file input
      const fileInput = document.getElementById("import-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Import error:", error)
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to import data. Please check the file format.",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === "string") {
          resolve(result)
        } else {
          reject(new Error("Failed to read file as text"))
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  const handleClearAll = () => {
    storage.clearAll()
    onCategoriesUpdate([])
    onUsersUpdate([])
    onAuditLogUpdate([])
    setShowClearDialog(false)
    setMessage({ type: "success", text: "All data cleared successfully!" })
  }

  const stats = [
    {
      title: "Articles",
      value: totalArticles,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Categories",
      value: categories.length,
      icon: Database,
      color: "text-green-600",
    },
    {
      title: "Subcategories",
      value: totalSubcategories,
      icon: Database,
      color: "text-purple-600",
    },
    {
      title: "Users",
      value: users.length,
      icon: Users,
      color: "text-orange-600",
    },
    {
      title: "Audit Entries",
      value: auditLog.length,
      icon: Activity,
      color: "text-red-600",
    },
    {
      title: "Data Size",
      value: estimateDataSize(),
      icon: HardDrive,
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="space-y-6">
      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
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
              Download a complete backup of all your knowledge base data including articles, categories, users, and
              audit logs.
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
            <Button onClick={handleImport} disabled={!importFile || isImporting} className="w-full">
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
            <Button variant="destructive" onClick={() => setShowClearDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Clear Confirmation Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent aria-describedby="clear-data-description">
          <DialogHeader>
            <DialogTitle>Clear All Data</DialogTitle>
            <DialogDescription id="clear-data-description">
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
