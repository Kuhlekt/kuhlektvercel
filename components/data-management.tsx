"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2, AlertTriangle, CheckCircle } from "lucide-react"
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
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleExport = async () => {
    setIsExporting(true)
    setMessage(null)

    try {
      const exportData = storage.exportData()
      const blob = new Blob([exportData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setMessage({ type: "success", text: "Data exported successfully!" })
    } catch (error) {
      console.error("Export error:", error)
      setMessage({ type: "error", text: "Failed to export data. Please try again." })
    } finally {
      setIsExporting(false)
    }
  }

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = () => reject(new Error("File reading error"))
      reader.readAsText(file)
    })
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setMessage(null)

    try {
      const jsonString = await readFileAsText(file)
      const data = JSON.parse(jsonString)

      // Validate the data structure
      if (!data.categories || !Array.isArray(data.categories)) {
        throw new Error("Invalid data format: categories missing or not an array")
      }

      if (!data.users || !Array.isArray(data.users)) {
        throw new Error("Invalid data format: users missing or not an array")
      }

      if (!data.auditLog || !Array.isArray(data.auditLog)) {
        throw new Error("Invalid data format: auditLog missing or not an array")
      }

      // Convert date strings back to Date objects
      const processedCategories = data.categories.map((category: any) => ({
        ...category,
        articles: (category.articles || []).map((article: any) => ({
          ...article,
          createdAt: new Date(article.createdAt),
          updatedAt: new Date(article.updatedAt),
        })),
        subcategories: (category.subcategories || []).map((subcategory: any) => ({
          ...subcategory,
          articles: (subcategory.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
          })),
        })),
      }))

      const processedUsers = data.users.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
      }))

      const processedAuditLog = data.auditLog.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }))

      // Import the data to storage
      storage.importData(JSON.stringify(data))

      // Update the UI state using the correct prop names
      onCategoriesUpdate(processedCategories)
      onUsersUpdate(processedUsers)
      onAuditLogUpdate(processedAuditLog)

      setMessage({ type: "success", text: "Data imported successfully!" })
    } catch (error) {
      console.error("Import error:", error)
      setMessage({
        type: "error",
        text: `Failed to import data: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setIsImporting(false)
      // Reset the file input
      event.target.value = ""
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return
    }

    setIsClearing(true)
    setMessage(null)

    try {
      storage.clearAll()
      onCategoriesUpdate([])
      onUsersUpdate([])
      onAuditLogUpdate([])
      setMessage({ type: "success", text: "All data cleared successfully!" })
    } catch (error) {
      console.error("Clear error:", error)
      setMessage({ type: "error", text: "Failed to clear data. Please try again." })
    } finally {
      setIsClearing(false)
    }
  }

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
      const subcategoryArticles = Array.isArray(category.subcategories)
        ? category.subcategories.reduce(
            (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
            0,
          )
        : 0
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export, import, or clear your knowledge base data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-blue-800">Categories</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{getTotalArticles()}</div>
              <div className="text-sm text-green-800">Articles</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{users.length}</div>
              <div className="text-sm text-purple-800">Users</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button onClick={handleExport} disabled={isExporting} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>{isExporting ? "Exporting..." : "Export Data"}</span>
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button disabled={isImporting} className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>{isImporting ? "Importing..." : "Import Data"}</span>
              </Button>
            </div>

            <Button
              onClick={handleClearAll}
              disabled={isClearing}
              variant="destructive"
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isClearing ? "Clearing..." : "Clear All Data"}</span>
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p>
              <strong>Export:</strong> Download a JSON backup of all your data
            </p>
            <p>
              <strong>Import:</strong> Upload a JSON backup file to restore data
            </p>
            <p>
              <strong>Clear:</strong> Remove all data from the knowledge base (cannot be undone)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
