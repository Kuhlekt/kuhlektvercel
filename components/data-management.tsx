"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2, AlertTriangle } from "lucide-react"
import { storage } from "../utils/storage"

export function DataManagement() {
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 3000)
  }

  const handleExport = () => {
    try {
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
      showMessage("Data exported successfully!", "success")
    } catch (error) {
      showMessage("Failed to export data", "error")
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        storage.importData(data)
        showMessage("Data imported successfully! Please refresh the page.", "success")
      } catch (error) {
        showMessage("Failed to import data. Please check the file format.", "error")
      }
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This will delete all users, categories, articles, and audit logs. This action cannot be undone!",
      )
    ) {
      storage.clearAll()
      showMessage("All data cleared! Please refresh the page.", "success")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Data Management</h3>
        <p className="text-sm text-gray-600 mb-4">
          Export your data for backup purposes or import data from a previous backup.
        </p>
      </div>

      {message && (
        <Alert variant={messageType === "error" ? "destructive" : "default"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Download className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold">Export Data</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">Download all your data as a JSON file for backup purposes.</p>
          <Button onClick={handleExport} className="w-full">
            Export All Data
          </Button>
        </div>

        <div className="border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Upload className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold">Import Data</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">Import data from a previously exported JSON file.</p>
          <div>
            <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
            <Button asChild className="w-full">
              <label htmlFor="import-file" className="cursor-pointer">
                Import Data
              </label>
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-4 border-red-200">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h4 className="font-semibold text-red-700">Clear All Data</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">Permanently delete all data. This action cannot be undone!</p>
          <Button onClick={handleClearAll} variant="destructive" className="w-full">
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All Data
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold mb-2">Data Storage Information</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• All data is stored locally in your browser's localStorage</p>
          <p>• Data persists across browser sessions but is device-specific</p>
          <p>• Regular exports are recommended for backup purposes</p>
          <p>• Clearing browser data will remove all knowledge base content</p>
        </div>
      </div>
    </div>
  )
}
