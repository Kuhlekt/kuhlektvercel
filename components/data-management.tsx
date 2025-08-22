"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Download, Upload, Trash2, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { database } from "../utils/database"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface BackupData {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  pageVisits: number
  exportedAt: string
  version: string
}

export function DataManagement() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null)
  const [importStats, setImportStats] = useState<{
    categories: number
    articles: number
    users: number
    auditEntries: number
  } | null>(null)

  const showMessage = (type: "success" | "error" | "info", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleExport = async () => {
    setIsExporting(true)
    setProgress(0)

    try {
      setProgress(25)
      showMessage("info", "Exporting data...")

      const data = await database.exportData()
      setProgress(75)

      // Create and download the file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setProgress(100)
      showMessage("success", "Data exported successfully!")
    } catch (error) {
      console.error("Export error:", error)
      showMessage("error", "Failed to export data. Please try again.")
    } finally {
      setIsExporting(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setProgress(0)
    setImportStats(null)

    try {
      setProgress(10)
      showMessage("info", "Reading backup file...")

      const text = await file.text()
      const backupData: BackupData = JSON.parse(text)

      setProgress(20)

      // Validate backup data structure
      if (!backupData.categories || !backupData.users || !Array.isArray(backupData.categories)) {
        throw new Error("Invalid backup file format")
      }

      showMessage("info", "Clearing existing data...")
      setProgress(30)

      // Clear existing data
      await database.clearAllData()

      setProgress(40)
      showMessage("info", "Importing categories and articles...")

      // Import categories and their structure
      let totalArticles = 0
      for (const category of backupData.categories) {
        // Create category
        const categoryId = await database.saveCategory(category.name, category.description)

        // Import category articles
        for (const article of category.articles || []) {
          await database.saveArticle({
            title: article.title,
            content: article.content,
            categoryId: categoryId,
            subcategoryId: undefined,
            tags: article.tags || [],
            createdBy: article.createdBy,
            lastEditedBy: article.lastEditedBy,
            editCount: article.editCount || 0,
          })
          totalArticles++
        }

        // Import subcategories and their articles
        for (const subcategory of category.subcategories || []) {
          const subcategoryId = await database.saveSubcategory(categoryId, subcategory.name, subcategory.description)

          for (const article of subcategory.articles || []) {
            await database.saveArticle({
              title: article.title,
              content: article.content,
              categoryId: categoryId,
              subcategoryId: subcategoryId,
              tags: article.tags || [],
              createdBy: article.createdBy,
              lastEditedBy: article.lastEditedBy,
              editCount: article.editCount || 0,
            })
            totalArticles++
          }
        }
      }

      setProgress(70)
      showMessage("info", "Importing users...")

      // Import users (skip if they already exist)
      let importedUsers = 0
      for (const user of backupData.users || []) {
        try {
          await database.saveUser({
            username: user.username,
            password: user.password,
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
          })
          importedUsers++
        } catch (error) {
          // User might already exist, skip
          console.warn("User already exists:", user.username)
        }
      }

      setProgress(90)
      showMessage("info", "Importing audit log...")

      // Import audit log entries
      let importedAuditEntries = 0
      for (const entry of backupData.auditLog || []) {
        try {
          await database.addAuditEntry({
            action: entry.action,
            articleId: entry.articleId,
            articleTitle: entry.articleTitle,
            categoryId: entry.categoryId,
            categoryName: entry.categoryName,
            subcategoryName: entry.subcategoryName,
            userId: entry.userId,
            username: entry.username,
            performedBy: entry.performedBy,
            details: entry.details,
          })
          importedAuditEntries++
        } catch (error) {
          console.warn("Failed to import audit entry:", error)
        }
      }

      setProgress(100)

      setImportStats({
        categories: backupData.categories.length,
        articles: totalArticles,
        users: importedUsers,
        auditEntries: importedAuditEntries,
      })

      showMessage("success", "Data imported successfully!")
    } catch (error) {
      console.error("Import error:", error)
      showMessage("error", `Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsImporting(false)
      setTimeout(() => {
        setProgress(0)
        setImportStats(null)
      }, 3000)

      // Reset file input
      event.target.value = ""
    }
  }

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear ALL data? This action cannot be undone!")) {
      return
    }

    if (
      !confirm(
        'This will permanently delete all categories, articles, users, and audit logs. Type "DELETE" to confirm.',
      )
    ) {
      return
    }

    setIsClearing(true)
    setProgress(0)

    try {
      setProgress(25)
      showMessage("info", "Clearing all data...")

      await database.clearAllData()

      setProgress(100)
      showMessage("success", "All data cleared successfully!")
    } catch (error) {
      console.error("Clear error:", error)
      showMessage("error", "Failed to clear data. Please try again.")
    } finally {
      setIsClearing(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Data Management</h2>
        <p className="text-muted-foreground">Export, import, and manage your knowledge base data.</p>
      </div>

      {message && (
        <Alert
          className={
            message.type === "error"
              ? "border-red-500"
              : message.type === "success"
                ? "border-green-500"
                : "border-blue-500"
          }
        >
          {message.type === "error" && <AlertTriangle className="h-4 w-4" />}
          {message.type === "success" && <CheckCircle className="h-4 w-4" />}
          {message.type === "info" && <Info className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {progress > 0 && (
        <div className="space-y-2">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground text-center">{progress}% complete</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>Download a complete backup of your knowledge base as a JSON file.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} disabled={isExporting || isImporting || isClearing} className="w-full">
              {isExporting ? "Exporting..." : "Export Data"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Includes all categories, articles, users, audit logs, and settings.
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
            <CardDescription>Restore your knowledge base from a backup file.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isExporting || isImporting || isClearing}
                className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              <p className="text-xs text-muted-foreground">
                ⚠️ This will replace all existing data. Export current data first if needed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {importStats && (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Import Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{importStats.categories}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{importStats.articles}</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{importStats.users}</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{importStats.auditEntries}</div>
                <div className="text-sm text-muted-foreground">Audit Entries</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Danger Zone */}
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that will permanently delete data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert className="border-red-500">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> The following action will permanently delete ALL data including categories,
                articles, users, and audit logs. This cannot be undone.
              </AlertDescription>
            </Alert>

            <Button
              variant="destructive"
              onClick={handleClearAll}
              disabled={isExporting || isImporting || isClearing}
              className="w-full"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? "Clearing All Data..." : "Clear All Data"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          <strong>Export format:</strong> JSON file containing all knowledge base data
        </p>
        <p>
          <strong>Import requirements:</strong> Valid JSON backup file from this system
        </p>
        <p>
          <strong>Backup recommendation:</strong> Export data regularly and store backups securely
        </p>
      </div>
    </div>
  )
}
