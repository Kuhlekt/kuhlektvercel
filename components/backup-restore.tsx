"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Download,
  Upload,
  FileText,
  Calendar,
  Database,
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw,
} from "lucide-react"
import { storage } from "../utils/storage"
import type { User, Category, Article, AuditLog } from "../types/knowledge-base"

interface BackupRestoreProps {
  users: User[]
  categories: Category[]
  articles: Article[]
  auditLog: AuditLog[]
  currentUser: User
  onDataRestored: () => void
}

interface BackupData {
  version: string
  timestamp: string
  metadata: {
    totalUsers: number
    totalCategories: number
    totalArticles: number
    totalAuditEntries: number
    createdBy: string
    description?: string
  }
  data: {
    users: User[]
    categories: Category[]
    articles: Article[]
    auditLog: AuditLog[]
  }
}

export function BackupRestore({
  users,
  categories,
  articles,
  auditLog,
  currentUser,
  onDataRestored,
}: BackupRestoreProps) {
  const [backupDescription, setBackupDescription] = useState("")
  const [restoreStatus, setRestoreStatus] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })
  const [isProcessing, setIsProcessing] = useState(false)
  const [backupPreview, setBackupPreview] = useState<BackupData | null>(null)

  const createBackup = () => {
    setIsProcessing(true)

    try {
      const backupData: BackupData = {
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        metadata: {
          totalUsers: users.length,
          totalCategories: categories.length,
          totalArticles: articles.length,
          totalAuditEntries: auditLog.length,
          createdBy: currentUser.username,
          description: backupDescription.trim() || undefined,
        },
        data: {
          users: users.map((user) => ({
            ...user,
            // Don't include passwords in backup for security
            password: "***REDACTED***",
          })),
          categories,
          articles,
          auditLog,
        },
      }

      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: "application/json",
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      const timestamp = new Date().toISOString().split("T")[0]
      const description = backupDescription.trim() ? `-${backupDescription.trim().replace(/[^a-zA-Z0-9]/g, "_")}` : ""

      a.download = `kuhlekt-kb-backup-${timestamp}${description}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Log the backup creation
      storage.addAuditEntry({
        performedBy: currentUser.id,
        action: "CREATE_BACKUP",
        details: `Created backup: ${backupDescription || "Manual backup"}`,
      })

      setRestoreStatus({
        type: "success",
        message: "Backup created successfully and downloaded!",
      })

      setBackupDescription("")
    } catch (error) {
      console.error("Backup creation error:", error)
      setRestoreStatus({
        type: "error",
        message: "Failed to create backup. Please try again.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setBackupPreview(null)

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string) as BackupData

        // Validate backup structure
        if (!backupData.version || !backupData.data || !backupData.metadata) {
          throw new Error("Invalid backup file structure")
        }

        setBackupPreview(backupData)
        setRestoreStatus({
          type: "info",
          message: "Backup file loaded. Review the details below and click 'Restore Data' to proceed.",
        })
      } catch (error) {
        console.error("Backup file parsing error:", error)
        setRestoreStatus({
          type: "error",
          message: "Invalid backup file. Please select a valid Kuhlekt KB backup file.",
        })
      } finally {
        setIsProcessing(false)
      }
    }

    reader.onerror = () => {
      setRestoreStatus({
        type: "error",
        message: "Failed to read backup file.",
      })
      setIsProcessing(false)
    }

    reader.readAsText(file)
  }

  const restoreFromBackup = () => {
    if (!backupPreview) return

    const confirmMessage = `This will replace ALL current data with the backup data. This action cannot be undone.

Current data:
- Users: ${users.length}
- Categories: ${categories.length}  
- Articles: ${articles.length}
- Audit entries: ${auditLog.length}

Backup data:
- Users: ${backupPreview.metadata.totalUsers}
- Categories: ${backupPreview.metadata.totalCategories}
- Articles: ${backupPreview.metadata.totalArticles}
- Audit entries: ${backupPreview.metadata.totalAuditEntries}

Are you sure you want to continue?`

    if (!confirm(confirmMessage)) return

    setIsProcessing(true)

    try {
      // Restore users (but keep current admin password if exists)
      const restoredUsers = backupPreview.data.users.map((user) => {
        if (user.username === "admin") {
          const currentAdmin = users.find((u) => u.username === "admin")
          return {
            ...user,
            password: currentAdmin?.password || "admin123", // Keep current admin password
            createdAt: new Date(user.createdAt),
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
          }
        }
        return {
          ...user,
          password: "default123", // Set default password for other users
          createdAt: new Date(user.createdAt),
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        }
      })

      // Ensure admin user exists
      if (!restoredUsers.some((u) => u.username === "admin")) {
        restoredUsers.push({
          id: "admin-001",
          username: "admin",
          password: "admin123",
          email: "admin@kuhlekt.com",
          role: "admin" as const,
          createdAt: new Date(),
        })
      }

      // Restore categories with proper date parsing
      const restoredCategories = backupPreview.data.categories.map((category) => ({
        ...category,
        createdAt: new Date(category.createdAt),
      }))

      // Restore articles with proper date parsing
      const restoredArticles = backupPreview.data.articles.map((article) => ({
        ...article,
        createdAt: new Date(article.createdAt),
        updatedAt: new Date(article.updatedAt),
      }))

      // Use the storage import method for proper handling
      storage.importData({
        users: restoredUsers,
        categories: restoredCategories,
        articles: restoredArticles,
        auditLog: backupPreview.data.auditLog,
      })

      // Add restore entry to audit log
      const currentAuditLog = storage.getAuditLog()
      const restoredAuditLog = [
        ...currentAuditLog,
        {
          id: Date.now().toString(),
          performedBy: currentUser.id,
          action: "RESTORE_BACKUP",
          details: `Restored backup from ${new Date(backupPreview.timestamp).toLocaleString()}${
            backupPreview.metadata.description ? ` - ${backupPreview.metadata.description}` : ""
          }`,
          timestamp: new Date(),
        },
      ]

      localStorage.setItem("kb_audit_log", JSON.stringify(restoredAuditLog))

      setRestoreStatus({
        type: "success",
        message: "Backup restored successfully! The page will reload to apply changes.",
      })

      console.log("✅ Backup restored successfully")

      // Reload page after short delay
      setTimeout(() => {
        onDataRestored()
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error("❌ Restore error:", error)
      setRestoreStatus({
        type: "error",
        message: "Failed to restore backup. Please try again.",
      })
      setIsProcessing(false)
    }
  }

  const clearPreview = () => {
    setBackupPreview(null)
    setRestoreStatus({ type: null, message: "" })
    // Reset file input
    const fileInput = document.getElementById("backup-file") as HTMLInputElement
    if (fileInput) fileInput.value = ""
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Backup & Restore</h3>
      </div>

      {/* Status Messages */}
      {restoreStatus.type && (
        <Alert variant={restoreStatus.type === "error" ? "destructive" : "default"}>
          {restoreStatus.type === "success" && <CheckCircle className="h-4 w-4" />}
          {restoreStatus.type === "error" && <AlertTriangle className="h-4 w-4" />}
          {restoreStatus.type === "info" && <Info className="h-4 w-4" />}
          <AlertDescription>{restoreStatus.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Create Backup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{users.length}</div>
                <div className="text-blue-800">Users</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{categories.length}</div>
                <div className="text-green-800">Categories</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">{articles.length}</div>
                <div className="text-purple-800">Articles</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-xl font-bold text-orange-600">{auditLog.length}</div>
                <div className="text-orange-800">Audit Entries</div>
              </div>
            </div>

            <div>
              <Label htmlFor="backup-description">Description (Optional)</Label>
              <Input
                id="backup-description"
                value={backupDescription}
                onChange={(e) => setBackupDescription(e.target.value)}
                placeholder="e.g., Before major update, Weekly backup..."
                maxLength={50}
              />
            </div>

            <Button onClick={createBackup} disabled={isProcessing} className="w-full">
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Create & Download Backup
                </>
              )}
            </Button>

            <div className="text-xs text-gray-600 space-y-1">
              <p>• Backup includes all users, categories, articles, and audit logs</p>
              <p>• User passwords are redacted for security</p>
              <p>• File will be downloaded as JSON format</p>
            </div>
          </CardContent>
        </Card>

        {/* Restore Backup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Restore Backup</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="backup-file">Select Backup File</Label>
              <Input id="backup-file" type="file" accept=".json" onChange={handleFileSelect} disabled={isProcessing} />
            </div>

            {backupPreview && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Backup Preview</span>
                  </h4>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <Badge variant="outline">{backupPreview.version}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span>{new Date(backupPreview.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created by:</span>
                      <span>{backupPreview.metadata.createdBy}</span>
                    </div>
                    {backupPreview.metadata.description && (
                      <div className="flex justify-between">
                        <span>Description:</span>
                        <span className="font-medium">{backupPreview.metadata.description}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="text-center p-2 bg-blue-100 rounded">
                      <div className="font-bold text-blue-600">{backupPreview.metadata.totalUsers}</div>
                      <div className="text-xs text-blue-800">Users</div>
                    </div>
                    <div className="text-center p-2 bg-green-100 rounded">
                      <div className="font-bold text-green-600">{backupPreview.metadata.totalCategories}</div>
                      <div className="text-xs text-green-800">Categories</div>
                    </div>
                    <div className="text-center p-2 bg-purple-100 rounded">
                      <div className="font-bold text-purple-600">{backupPreview.metadata.totalArticles}</div>
                      <div className="text-xs text-purple-800">Articles</div>
                    </div>
                    <div className="text-center p-2 bg-orange-100 rounded">
                      <div className="font-bold text-orange-600">{backupPreview.metadata.totalAuditEntries}</div>
                      <div className="text-xs text-orange-800">Audit Entries</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={restoreFromBackup} disabled={isProcessing} variant="destructive" className="flex-1">
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Restoring...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Restore Data
                      </>
                    )}
                  </Button>
                  <Button onClick={clearPreview} variant="outline" disabled={isProcessing}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-600 space-y-1">
              <p>• ⚠️ This will replace ALL current data</p>
              <p>• Admin password will be preserved</p>
              <p>• Other user passwords will be reset to "default123"</p>
              <p>• Page will reload after successful restore</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setBackupDescription(`Weekly-${new Date().toISOString().split("T")[0]}`)
                createBackup()
              }}
              disabled={isProcessing}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Weekly Backup
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setBackupDescription(`Manual-${new Date().toISOString().split("T")[0]}`)
                createBackup()
              }}
              disabled={isProcessing}
            >
              <Download className="h-4 w-4 mr-2" />
              Quick Backup
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const input = document.getElementById("backup-file") as HTMLInputElement
                input?.click()
              }}
              disabled={isProcessing}
            >
              <Upload className="h-4 w-4 mr-2" />
              Quick Restore
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
