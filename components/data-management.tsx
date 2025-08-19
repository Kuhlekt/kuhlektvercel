"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2, Database } from "lucide-react"
import { storage } from "../utils/storage"
import type { User, Category, Article, AuditLog } from "../types/knowledge-base"

interface DataManagementProps {
  users: User[]
  categories: Category[]
  articles: Article[]
  auditLog: AuditLog[]
}

export function DataManagement({ users, categories, articles, auditLog }: DataManagementProps) {
  const [importStatus, setImportStatus] = useState<string>("")

  const handleExport = () => {
    const data = storage.exportData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        storage.importData(data)
        setImportStatus("Data imported successfully! Please refresh the page to see changes.")
      } catch (error) {
        setImportStatus("Error importing data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear ALL data? This action cannot be undone!")) {
      if (confirm("This will delete all users, categories, articles, and audit logs. Are you absolutely sure?")) {
        storage.clearAll()
        setImportStatus("All data cleared! Please refresh the page.")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Database className="h-5 w-5" />
        <h3 className="text-lg font-semibold">Data Management</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{users.length}</div>
          <div className="text-sm text-gray-600">Users</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{categories.length}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{articles.length}</div>
          <div className="text-sm text-gray-600">Articles</div>
        </div>
        <div className="p-4 border rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600">{auditLog.length}</div>
          <div className="text-sm text-gray-600">Audit Entries</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button onClick={handleExport} className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>

          <div className="flex items-center space-x-2">
            <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
            <Button asChild variant="outline">
              <label htmlFor="import-file" className="flex items-center space-x-2 cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Import Data</span>
              </label>
            </Button>
          </div>

          <Button onClick={handleClearAll} variant="destructive" className="flex items-center space-x-2">
            <Trash2 className="h-4 w-4" />
            <span>Clear All Data</span>
          </Button>
        </div>

        {importStatus && (
          <Alert>
            <AlertDescription>{importStatus}</AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-600 space-y-2">
          <p>
            <strong>Export:</strong> Download all system data as a JSON file for backup purposes.
          </p>
          <p>
            <strong>Import:</strong> Upload a previously exported JSON file to restore data.
          </p>
          <p>
            <strong>Clear All:</strong> Remove all data from the system (use with extreme caution).
          </p>
        </div>
      </div>
    </div>
  )
}
