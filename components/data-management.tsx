"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Download, FileText, AlertTriangle, CheckCircle, Database, Eye, Import, RefreshCw } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, Article, KnowledgeBaseUser, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: KnowledgeBaseUser[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

interface ImportData {
  categories?: Category[]
  articles?: Article[]
  users?: KnowledgeBaseUser[]
  auditLog?: AuditLogEntry[]
}

interface ImportPreview {
  categories: number
  articles: number
  users: number
  auditLog: number
  totalSize: string
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState("")
  const [importError, setImportError] = useState("")
  const [importSuccess, setImportSuccess] = useState("")
  const [preview, setPreview] = useState<ImportPreview | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/json") {
      setImportError("Please select a JSON file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
      generatePreview(content)
    }
    reader.onerror = () => {
      setImportError("Failed to read file")
    }
    reader.readAsText(file)
  }

  const generatePreview = (jsonData: string) => {
    try {
      const data = JSON.parse(jsonData)
      let parsedData: ImportData

      // Handle different JSON structures
      if (data.categories || data.articles || data.users || data.auditLog) {
        parsedData = data
      } else if (Array.isArray(data)) {
        // Assume it's articles if it's an array
        parsedData = { articles: data }
      } else {
        throw new Error("Invalid data structure")
      }

      const previewData: ImportPreview = {
        categories: parsedData.categories?.length || 0,
        articles: parsedData.articles?.length || 0,
        users: parsedData.users?.length || 0,
        auditLog: parsedData.auditLog?.length || 0,
        totalSize: `${(jsonData.length / 1024).toFixed(1)} KB`,
      }

      setPreview(previewData)
      setImportError("")
    } catch (error) {
      setImportError("Invalid JSON format")
      setPreview(null)
    }
  }

  const handlePasteData = (value: string) => {
    setImportData(value)
    if (value.trim()) {
      generatePreview(value)
    } else {
      setPreview(null)
    }
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setImportError("Please provide data to import")
      return
    }

    setIsImporting(true)
    setImportProgress(0)
    setImportError("")
    setImportSuccess("")
    setImportStatus("Parsing data...")

    try {
      const data = JSON.parse(importData)
      let parsedData: ImportData

      // Handle different JSON structures
      if (data.categories || data.articles || data.users || data.auditLog) {
        parsedData = data
      } else if (Array.isArray(data)) {
        parsedData = { articles: data }
      } else {
        throw new Error("Invalid data structure")
      }

      setImportProgress(20)
      setImportStatus("Validating data...")

      // Convert string dates to Date objects
      const convertDates = (obj: any): any => {
        if (obj === null || obj === undefined) return obj
        if (typeof obj === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
          return new Date(obj)
        }
        if (Array.isArray(obj)) {
          return obj.map(convertDates)
        }
        if (typeof obj === "object") {
          const converted: any = {}
          for (const [key, value] of Object.entries(obj)) {
            converted[key] = convertDates(value)
          }
          return converted
        }
        return obj
      }

      setImportProgress(40)
      setImportStatus("Processing categories...")

      if (parsedData.categories) {
        const convertedCategories = convertDates(parsedData.categories)
        storage.saveCategories(convertedCategories)
      }

      setImportProgress(60)
      setImportStatus("Processing articles...")

      if (parsedData.articles) {
        const convertedArticles = convertDates(parsedData.articles)
        // Get existing articles and merge
        const existingArticles = storage.getArticles()
        const mergedArticles = [...existingArticles]

        convertedArticles.forEach((newArticle: Article) => {
          const existingIndex = mergedArticles.findIndex((a) => a.id === newArticle.id)
          if (existingIndex >= 0) {
            mergedArticles[existingIndex] = newArticle
          } else {
            mergedArticles.push(newArticle)
          }
        })

        storage.saveArticles(mergedArticles)
      }

      setImportProgress(80)
      setImportStatus("Processing users...")

      if (parsedData.users) {
        const convertedUsers = convertDates(parsedData.users)
        storage.saveUsers(convertedUsers)
      }

      setImportProgress(90)
      setImportStatus("Processing audit log...")

      if (parsedData.auditLog) {
        const convertedAuditLog = convertDates(parsedData.auditLog)
        storage.saveAuditLog(convertedAuditLog)
      }

      setImportProgress(95)
      setImportStatus("Updating page visits...")

      // Update page visits counter
      const currentVisits = storage.getPageVisits()
      localStorage.setItem("kuhlekt_kb_page_visits", (currentVisits + 1).toString())

      setImportProgress(100)
      setImportStatus("Import completed successfully!")

      setImportSuccess(
        `Successfully imported: ${preview?.categories || 0} categories, ${preview?.articles || 0} articles, ${
          preview?.users || 0
        } users, ${preview?.auditLog || 0} audit entries`,
      )

      // Clear form
      setImportData("")
      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Notify parent component
      onDataImported()
    } catch (error) {
      console.error("Import error:", error)
      setImportError(error instanceof Error ? error.message : "Import failed")
    } finally {
      setIsImporting(false)
      setTimeout(() => {
        setImportProgress(0)
        setImportStatus("")
      }, 3000)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const articles = storage.getArticles()
      const exportData = {
        categories,
        articles,
        users,
        auditLog,
        exportDate: new Date().toISOString(),
        version: "1.0",
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const clearImportData = () => {
    setImportData("")
    setPreview(null)
    setImportError("")
    setImportSuccess("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Data Management</h3>
          <p className="text-sm text-gray-600">Import and export knowledge base data</p>
        </div>
        <Button onClick={handleExport} disabled={isExporting} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export Data"}
        </Button>
      </div>

      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="stats">Current Data</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Import className="h-5 w-5" />
                <span>Import Data</span>
              </CardTitle>
              <CardDescription>
                Import categories, articles, users, and audit log data from a JSON file or paste JSON directly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="file" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="file">File Upload</TabsTrigger>
                  <TabsTrigger value="paste">Paste Data</TabsTrigger>
                </TabsList>

                <TabsContent value="file" className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="file-upload" className="text-sm font-medium">
                      Select JSON File
                    </label>
                    <input
                      id="file-upload"
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="paste" className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="paste-data" className="text-sm font-medium">
                      Paste JSON Data
                    </label>
                    <Textarea
                      id="paste-data"
                      value={importData}
                      onChange={(e) => handlePasteData(e.target.value)}
                      placeholder="Paste your JSON data here..."
                      className="min-h-[200px] font-mono text-sm"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {preview && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-2 text-blue-800">
                      <Eye className="h-4 w-4" />
                      <span>Import Preview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">{preview.categories}</div>
                        <div className="text-sm text-blue-600">Categories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">{preview.articles}</div>
                        <div className="text-sm text-blue-600">Articles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">{preview.users}</div>
                        <div className="text-sm text-blue-600">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">{preview.auditLog}</div>
                        <div className="text-sm text-blue-600">Audit Entries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">{preview.totalSize}</div>
                        <div className="text-sm text-blue-600">File Size</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {isImporting && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Import Progress</span>
                    <span className="text-sm text-gray-600">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} className="w-full" />
                  {importStatus && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      <span>{importStatus}</span>
                    </div>
                  )}
                </div>
              )}

              {importError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">{importError}</AlertDescription>
                </Alert>
              )}

              {importSuccess && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{importSuccess}</AlertDescription>
                </Alert>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleImport} disabled={isImporting || !importData.trim()} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  {isImporting ? "Importing..." : "Import Data"}
                </Button>
                <Button onClick={clearImportData} variant="outline" disabled={isImporting}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{categories.length}</div>
                    <div className="text-sm text-gray-600">Categories</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{storage.getArticles().length}</div>
                    <div className="text-sm text-gray-600">Articles</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-2xl font-bold">{users.length}</div>
                    <div className="text-sm text-gray-600">Users</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold">{auditLog.length}</div>
                    <div className="text-sm text-gray-600">Audit Entries</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Storage Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Page Visits:</span>
                  <Badge variant="outline">{storage.getPageVisits()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Storage Available:</span>
                  <Badge variant="outline" className="text-green-600">
                    Yes
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Export:</span>
                  <Badge variant="outline">Never</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
