"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Download, Upload, Database, FileText, Users, FolderOpen, AlertTriangle, CheckCircle, Info } from "lucide-react"
import type { Article, User, Category } from "@/types/knowledge-base"

interface DataManagementProps {
  articles: Article[]
  users: User[]
  categories: Category[]
  onImportData: (data: any) => void
  onClearData: () => void
}

export function DataManagement({ articles, users, categories, onImportData, onClearData }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | "info" | null
    message: string
  }>({ type: null, message: "" })

  const exportData = () => {
    const data = {
      articles,
      users: users.map((user) => ({ ...user, password: "[REDACTED]" })), // Don't export passwords
      categories,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `knowledge-base-backup-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)

    setImportStatus({
      type: "success",
      message: "Data exported successfully!",
    })
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setImportStatus({
        type: "error",
        message: "Please paste your backup data first",
      })
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportStatus({ type: "info", message: "Starting import..." })

    try {
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setImportProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      const data = JSON.parse(importData)

      // Validate data structure
      if (!data.articles || !Array.isArray(data.articles)) {
        throw new Error("Invalid data format: articles array not found")
      }

      onImportData(data)
      setImportData("")
      setImportStatus({
        type: "success",
        message: `Successfully imported ${data.articles?.length || 0} articles, ${data.users?.length || 0} users, and ${data.categories?.length || 0} categories`,
      })
    } catch (error) {
      setImportStatus({
        type: "error",
        message: `Import failed: ${error instanceof Error ? error.message : "Invalid JSON format"}`,
      })
    } finally {
      setIsImporting(false)
      setImportProgress(0)
    }
  }

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      onClearData()
      setImportStatus({
        type: "info",
        message: "All data has been cleared",
      })
    }
  }

  const dataStats = [
    {
      title: "Articles",
      count: articles.length,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Users",
      count: users.length,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Categories",
      count: categories.length,
      icon: FolderOpen,
      color: "text-purple-600",
    },
    {
      title: "Total Views",
      count: articles.reduce((sum, article) => sum + (article.views || 0), 0),
      icon: Database,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Data Management</h2>
        <p className="text-muted-foreground">Import, export, and manage your knowledge base data</p>
      </div>

      {/* Data Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        {dataStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status Alert */}
      {importStatus.type && (
        <Alert variant={importStatus.type === "error" ? "destructive" : "default"}>
          {importStatus.type === "success" && <CheckCircle className="h-4 w-4" />}
          {importStatus.type === "error" && <AlertTriangle className="h-4 w-4" />}
          {importStatus.type === "info" && <Info className="h-4 w-4" />}
          <AlertDescription>{importStatus.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>Download a complete backup of your knowledge base</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>This will export:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>{articles.length} articles</li>
                <li>{users.length} users (passwords excluded)</li>
                <li>{categories.length} categories</li>
                <li>All metadata and relationships</li>
              </ul>
            </div>
            <Button onClick={exportData} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Export Backup
            </Button>
          </CardContent>
        </Card>

        {/* Import Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
            <CardDescription>Restore from a previous backup or import new data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="import-data" className="text-sm font-medium">
                Paste your backup JSON data:
              </label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your exported JSON data here..."
                rows={6}
                disabled={isImporting}
              />
            </div>

            {isImporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Importing...</span>
                  <span>{importProgress}%</span>
                </div>
                <Progress value={importProgress} />
              </div>
            )}

            <Button onClick={handleImport} disabled={isImporting || !importData.trim()} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              {isImporting ? "Importing..." : "Import Data"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that will permanently delete data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <h4 className="font-medium text-red-800 mb-2">Clear All Data</h4>
              <p className="text-sm text-red-600 mb-4">
                This will permanently delete all articles, users, and categories. This action cannot be undone.
              </p>
              <Button variant="destructive" onClick={handleClearData} className="w-full">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Clear All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
