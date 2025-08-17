"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react"

interface DataManagementProps {
  onDataImported?: (data: any) => void
}

export function DataManagement({ onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = () => {
    try {
      const data = {
        articles: JSON.parse(localStorage.getItem("kb-articles") || "[]"),
        categories: JSON.parse(localStorage.getItem("kb-categories") || "[]"),
        users: JSON.parse(localStorage.getItem("kb-users") || "[]"),
        auditLog: JSON.parse(localStorage.getItem("kb-audit-log") || "[]"),
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
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
      setMessage({ type: "error", text: "Please provide data to import" })
      return
    }

    setIsImporting(true)
    try {
      const data = JSON.parse(importData)

      // Validate data structure
      if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error("Invalid data format: articles array is required")
      }

      // Import data to localStorage
      if (data.articles) {
        localStorage.setItem("kb-articles", JSON.stringify(data.articles))
      }
      if (data.categories) {
        localStorage.setItem("kb-categories", JSON.stringify(data.categories))
      }
      if (data.users) {
        localStorage.setItem("kb-users", JSON.stringify(data.users))
      }
      if (data.auditLog) {
        localStorage.setItem("kb-audit-log", JSON.stringify(data.auditLog))
      }

      // Call the callback if provided
      if (onDataImported) {
        onDataImported(data)
      }

      setMessage({ type: "success", text: `Successfully imported ${data.articles.length} articles and related data!` })
      setImportData("")

      // Refresh the page after a short delay to reflect changes
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      setMessage({
        type: "error",
        text: `Import failed: ${error instanceof Error ? error.message : "Invalid JSON format"}`,
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
    }
    reader.readAsText(file)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setImportData(text)
      setMessage({ type: "success", text: "Data pasted from clipboard!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to paste from clipboard" })
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
          <CardDescription>
            Download a backup of all knowledge base data including articles, categories, users, and audit logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
          <CardDescription>Import knowledge base data from a backup file or paste JSON data directly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div>
            <Label htmlFor="file-upload">Upload Backup File</Label>
            <Input id="file-upload" type="file" accept=".json" onChange={handleFileUpload} className="mt-1" />
          </div>

          {/* Paste Data */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="import-data">Or Paste JSON Data</Label>
              <Button type="button" variant="outline" size="sm" onClick={handlePaste}>
                <FileText className="h-4 w-4 mr-1" />
                Paste
              </Button>
            </div>
            <Textarea
              id="import-data"
              placeholder="Paste your JSON backup data here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="mt-1 min-h-[200px] font-mono text-sm"
            />
          </div>

          <Button onClick={handleImport} disabled={!importData.trim() || isImporting} className="w-full">
            {isImporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Importing...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Status Messages */}
      {message && (
        <Alert className={message.type === "error" ? "border-red-500" : "border-green-500"}>
          {message.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
