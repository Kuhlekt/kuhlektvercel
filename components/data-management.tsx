"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2 } from "lucide-react"
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
      a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showMessage("Data exported successfully", "success")
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
        showMessage("Data imported successfully. Please refresh the page.", "success")
      } catch (error) {
        showMessage("Failed to import data. Invalid file format.", "error")
      }
    }
    reader.readAsText(file)
  }

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      storage.clearAll()
      showMessage("All data cleared. Please refresh the page.", "success")
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Data Management</h3>

      {message && (
        <Alert variant={messageType === "error" ? "destructive" : "default"}>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Export Data</h4>
          <p className="text-sm text-gray-600 mb-4">Download a backup of all your knowledge base data.</p>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-medium mb-2">Import Data</h4>
          <p className="text-sm text-gray-600 mb-4">Upload a previously exported backup file to restore your data.</p>
          <div className="flex items-center space-x-2">
            <input type="file" accept=".json" onChange={handleImport} className="hidden" id="import-file" />
            <Button asChild>
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </label>
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-4 border-red-200">
          <h4 className="font-medium mb-2 text-red-700">Clear All Data</h4>
          <p className="text-sm text-gray-600 mb-4">
            Permanently delete all data from the knowledge base. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </div>
      </div>
    </div>
  )
}
