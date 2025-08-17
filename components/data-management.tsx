"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Download, Database, AlertCircle, CheckCircle } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, KnowledgeBaseUser, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: KnowledgeBaseUser[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

export function DataManagement({ categories = [], users = [], auditLog = [], onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [importProgress, setImportProgress] = useState(0)
  const [importStatus, setImportStatus] = useState<"idle" | "importing" | "success" | "error">("idle")
  const [importMessage, setImportMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleImport = async () => {
    if (!importData.trim()) {
      setImportMessage("Please provide JSON data to import")
      setImportStatus("error")
      return
    }

    setImportStatus("importing")
    setImportProgress(0)
    setImportMessage("Starting import...")

    try {
      const parsed = JSON.parse(importData)
      let processedData = parsed

      if (Array.isArray(parsed)) {
        processedData = { categories: parsed }
      }

      if (Array.isArray(processedData.categories) && processedData.categories.length > 0) {
        setImportMessage("Importing categories...")
        setImportProgress(50)

        const categoriesWithDates = processedData.categories.map((category: any) => ({
          ...category,
          articles: (category.articles || []).map((article: any) => ({
            ...article,
            createdAt: new Date(article.createdAt),
            updatedAt: new Date(article.updatedAt),
            editCount: article.editCount || 0,
          })),
          subcategories: (category.subcategories || []).map((subcategory: any) => ({
            ...subcategory,
            articles: (subcategory.articles || []).map((article: any) => ({
              ...article,
              createdAt: new Date(article.createdAt),
              updatedAt: new Date(article.updatedAt),
              editCount: article.editCount || 0,
            })),
          })),
        }))

        storage.saveCategories(categoriesWithDates)
      }

      setImportProgress(100)
      setImportMessage("Import completed successfully!")
      setImportStatus("success")
      setImportData("")
      onDataImported()
    } catch (error) {
      console.error("Import error:", error)
      setImportMessage(`Import failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      setImportStatus("error")
      setImportProgress(0)
    }
  }

  const handleExport = () => {
    try {
      const exportData = {
        categories,
        users,
        auditLog,
        exportedAt: new Date().toISOString(),
        version: "1.2",
      }

      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `kuhlekt-kb-backup-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  const getCurrentStats = () => {
    const categoriesArray = Array.isArray(categories) ? categories : []
    const totalArticles = categoriesArray.reduce((total, category) => {
      const categoryArticles = Array.isArray(category.articles) ? category.articles.length : 0
      const subcategoryArticles = Array.isArray(category.subcategories)
        ? category.subcategories.reduce(
            (subTotal, sub) => subTotal + (Array.isArray(sub.articles) ? sub.articles.length : 0),
            0,
          )
        : 0
      return total + categoryArticles + subcategoryArticles
    }, 0)

    return {
      categories: categoriesArray.length,
      articles: totalArticles,
      users: Array.isArray(users) ? users.length : 0,
    }
  }

  const currentStats = getCurrentStats()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Current System Data</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{currentStats.categories}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentStats.articles}</div>
              <div className="text-sm text-gray-600">Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{currentStats.users}</div>
              <div className="text-sm text-gray-600">Users</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Import Knowledge Base Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload JSON File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="text-center text-gray-500">or</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Paste JSON Data</label>
                <Textarea
                  placeholder="Paste your JSON backup data here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
              </div>

              <Button
                onClick={handleImport}
                disabled={!importData.trim() || importStatus === "importing"}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>{importStatus === "importing" ? "Importing..." : "Import Data"}</span>
              </Button>

              {importStatus === "importing" && (
                <div className="space-y-2">
                  <Progress value={importProgress} className="w-full" />
                  <div className="text-sm text-gray-600 text-center">{importMessage}</div>
                </div>
              )}

              {importMessage && importStatus !== "importing" && (
                <div
                  className={`flex items-center space-x-2 p-3 rounded ${
                    importStatus === "success"
                      ? "bg-green-50 text-green-700"
                      : importStatus === "error"
                        ? "bg-red-50 text-red-700"
                        : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {importStatus === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <span className="text-sm">{importMessage}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Export Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Export all your knowledge base data including categories and articles.
              </div>

              <Button onClick={handleExport} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export All Data</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
