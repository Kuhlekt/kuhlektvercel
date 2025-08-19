"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Download,
  Upload,
  Database,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Trash2,
  HardDrive,
  FileText,
} from "lucide-react"

import { storage } from "../utils/storage"
import { initialCategories } from "../data/initial-data"
import { initialUsers } from "../data/initial-users"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleExport = () => {
    try {
      const exportData = storage.exportData()
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
      setMessage({ type: "error", text: "Failed to export data" })
    }
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setMessage({ type: "error", text: "Please paste the backup data" })
      return
    }

    setIsLoading(true)
    try {
      storage.importData(importData)
      setImportData("")
      setMessage({ type: "success", text: "Data imported successfully!" })
      onDataImported()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to import data. Please check the format." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadDemoData = async () => {
    setIsLoading(true)
    try {
      storage.saveCategories(initialCategories)
      storage.saveUsers(initialUsers)

      setMessage({ type: "success", text: "Demo data loaded successfully!" })
      onDataImported()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load demo data" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      return
    }

    setIsLoading(true)
    try {
      storage.clearAll()
      setMessage({ type: "success", text: "All data cleared successfully!" })
      onDataImported()
    } catch (error) {
      setMessage({ type: "error", text: "Failed to clear data" })
    } finally {
      setIsLoading(false)
    }
  }

  const storageInfo = storage.getStorageInfo()
  const storageHealth = storage.checkHealth()

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
          {message.type === "error" ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={message.type === "error" ? "text-red-800" : "text-green-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="backup" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
          <TabsTrigger value="storage">Storage Info</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Download className="h-5 w-5" />
                  <span>Export Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Download a complete backup of your knowledge base data.</p>
                <Button onClick={handleExport} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export Backup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Import Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="import-data">Paste backup data (JSON format)</Label>
                  <Textarea
                    id="import-data"
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="Paste your backup JSON data here..."
                    className="min-h-[100px] mt-2"
                  />
                </div>
                <Button onClick={handleImport} disabled={isLoading || !importData.trim()} className="w-full">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Import Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5" />
                <span>Storage Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{users.length}</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{auditLog.length}</div>
                  <div className="text-sm text-gray-600">Audit Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{formatBytes(storageInfo.totalSize)}</div>
                  <div className="text-sm text-gray-600">Total Size</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Categories Data:</span>
                  <Badge variant="outline">{formatBytes(storageInfo.categoriesSize)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Users Data:</span>
                  <Badge variant="outline">{formatBytes(storageInfo.usersSize)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Audit Log:</span>
                  <Badge variant="outline">{formatBytes(storageInfo.auditLogSize)}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Available Space:</span>
                  <Badge variant="outline">{formatBytes(storageInfo.availableSpace)}</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <div
                    className={`h-3 w-3 rounded-full ${storageHealth.isAvailable ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm">
                    Storage Status: {storageHealth.isAvailable ? "Available" : "Unavailable"}
                  </span>
                </div>
                {storageHealth.lastError && (
                  <div className="text-sm text-red-600 mt-1">Error: {storageHealth.lastError}</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Load Demo Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Load sample categories and articles for testing purposes.</p>
                <Button onClick={handleLoadDemoData} disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Load Demo Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <span>Clear All Data</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Permanently delete all data including categories, users, and audit logs.
                </p>
                <Button onClick={handleClearAll} disabled={isLoading} variant="destructive" className="w-full">
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Clear All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
