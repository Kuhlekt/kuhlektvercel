"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2, RefreshCw } from "lucide-react"
import { storage } from "../utils/storage"
import type { User, Category, Article, AuditLog } from "../types/knowledge-base"

interface DataManagementProps {
  users: User[]
  categories: Category[]
  articles: Article[]
  auditLog: AuditLog[]
  onUpdateUsers: (users: User[]) => void
  onUpdateCategories: (categories: Category[]) => void
  onUpdateArticles: (articles: Article[]) => void
}

export function DataManagement({
  users,
  categories,
  articles,
  auditLog,
  onUpdateUsers,
  onUpdateCategories,
  onUpdateArticles,
}: DataManagementProps) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleExportData = () => {
    try {
      const data = storage.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-export-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setMessage("Data exported successfully!")
    } catch (error) {
      setMessage("Error exporting data")
    }
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        storage.importData(data)

        // Update state
        onUpdateUsers(storage.getUsers())
        onUpdateCategories(storage.getCategories())
        onUpdateArticles(storage.getArticles())

        setMessage("Data imported successfully!")
      } catch (error) {
        setMessage("Error importing data: Invalid file format")
      } finally {
        setIsLoading(false)
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      storage.clearAll()
      storage.init()

      // Update state with fresh data
      onUpdateUsers(storage.getUsers())
      onUpdateCategories(storage.getCategories())
      onUpdateArticles(storage.getArticles())

      setMessage("All data cleared and reset to defaults")
    }
  }

  const handleResetToDefaults = () => {
    if (confirm("Are you sure you want to reset to default data? This will overwrite all current data.")) {
      storage.clearAll()
      storage.init()

      // Update state with fresh data
      onUpdateUsers(storage.getUsers())
      onUpdateCategories(storage.getCategories())
      onUpdateArticles(storage.getArticles())

      setMessage("Data reset to defaults successfully!")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>

        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Export Data</h4>
              <p className="text-sm text-gray-600 mb-3">Download all your data as a JSON file for backup purposes.</p>
              <Button onClick={handleExportData} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Import Data</h4>
              <p className="text-sm text-gray-600 mb-3">Import data from a previously exported JSON file.</p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isLoading}
                />
                <Button variant="outline" className="w-full bg-transparent" disabled={isLoading}>
                  <Upload className="h-4 w-4 mr-2" />
                  {isLoading ? "Importing..." : "Import Data"}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Reset to Defaults</h4>
              <p className="text-sm text-gray-600 mb-3">Reset all data to the original default state.</p>
              <Button onClick={handleResetToDefaults} variant="outline" className="w-full bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </Button>
            </div>

            <div className="p-4 border rounded-lg border-red-200">
              <h4 className="font-medium mb-2 text-red-700">Clear All Data</h4>
              <p className="text-sm text-gray-600 mb-3">Permanently delete all data. This action cannot be undone.</p>
              <Button onClick={handleClearAllData} variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-gray-500">Users</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{categories.length}</div>
          <div className="text-sm text-gray-500">Categories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{articles.length}</div>
          <div className="text-sm text-gray-500">Articles</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{auditLog.length}</div>
          <div className="text-sm text-gray-500">Audit Entries</div>
        </div>
      </div>
    </div>
  )
}
