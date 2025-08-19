"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Download, Upload, AlertCircle, CheckCircle, FileText, Users, Activity } from "lucide-react"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [importData, setImportData] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })

  const handleExport = () => {
    const exportData = {
      categories,
      users,
      auditLog,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `knowledge-base-export-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImport = async () => {
    if (!importData.trim()) {
      setImportStatus({ type: "error", message: "Please paste JSON data to import" })
      return
    }

    setIsImporting(true)
    setImportStatus({ type: null, message: "" })

    try {
      const parsedData = JSON.parse(importData)

      // Validate the structure
      if (!parsedData.categories || !Array.isArray(parsedData.categories)) {
        throw new Error("Invalid data format: categories array is required")
      }

      // Store the data
      if (parsedData.categories) {
        localStorage.setItem("kb_categories", JSON.stringify(parsedData.categories))
      }
      if (parsedData.users && Array.isArray(parsedData.users)) {
        localStorage.setItem("kb_users", JSON.stringify(parsedData.users))
      }
      if (parsedData.auditLog && Array.isArray(parsedData.auditLog)) {
        localStorage.setItem("kb_auditLog", JSON.stringify(parsedData.auditLog))
      }

      setImportStatus({
        type: "success",
        message: `Successfully imported ${parsedData.categories.length} categories, ${
          parsedData.users?.length || 0
        } users, and ${parsedData.auditLog?.length || 0} audit log entries`,
      })

      setImportData("")
      onDataImported()
    } catch (error) {
      console.error("Import error:", error)
      setImportStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to import data. Please check the JSON format.",
      })
    } finally {
      setIsImporting(false)
    }
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.removeItem("kb_categories")
      localStorage.removeItem("kb_users")
      localStorage.removeItem("kb_auditLog")
      localStorage.removeItem("kb_pageVisits")

      setImportStatus({
        type: "success",
        message: "All data has been cleared successfully",
      })

      onDataImported()
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
      <div>
        <h2 className="text-2xl font-bold mb-2">Data Management</h2>
        <p className="text-gray-600">Import, export, and manage your knowledge base data</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
          <TabsTrigger value="export">Export Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Articles</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalArticles()}</div>
                <p className="text-xs text-muted-foreground">Across {categories.length} categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">System users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activity Log</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{auditLog.length}</div>
                <p className="text-xs text-muted-foreground">Log entries</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Data Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Categories</h4>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div key={category.id} className="flex justify-between items-center text-sm">
                        <span>{category.name}</span>
                        <Badge variant="outline">
                          {(category.articles?.length || 0) +
                            (category.subcategories?.reduce((sum, sub) => sum + (sub.articles?.length || 0), 0) ||
                              0)}{" "}
                          articles
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Users by Role</h4>
                  <div className="space-y-1">
                    {["admin", "editor", "viewer"].map((role) => {
                      const count = users.filter((user) => user.role === role).length
                      return (
                        <div key={role} className="flex justify-between items-center text-sm">
                          <span className="capitalize">{role}</span>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5" />
                <span>Import Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {importStatus.type && (
                <Alert variant={importStatus.type === "error" ? "destructive" : "default"}>
                  {importStatus.type === "error" ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>{importStatus.message}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="import-data" className="text-sm font-medium">
                  Paste JSON Data
                </label>
                <Textarea
                  id="import-data"
                  placeholder="Paste your exported JSON data here..."
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  rows={12}
                  disabled={isImporting}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="destructive" onClick={clearAllData} disabled={isImporting}>
                  Clear All Data
                </Button>
                <Button onClick={handleImport} disabled={isImporting || !importData.trim()}>
                  {isImporting ? "Importing..." : "Import Data"}
                </Button>
              </div>
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
              <p className="text-sm text-gray-600">
                Export all your knowledge base data including articles, categories, users, and audit logs as a JSON
                file.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="font-medium">{getTotalArticles()}</div>
                  <div className="text-sm text-gray-500">Articles</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Users className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="font-medium">{users.length}</div>
                  <div className="text-sm text-gray-500">Users</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <div className="font-medium">{auditLog.length}</div>
                  <div className="text-sm text-gray-500">Log Entries</div>
                </div>
              </div>

              <Button onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
