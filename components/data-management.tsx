"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Database, Trash2, AlertTriangle, CheckCircle, FileText, Users, Activity } from "lucide-react"
import { storage } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataImported: () => void
}

export function DataManagement({ categories, users, auditLog, onDataImported }: DataManagementProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const data = {
        categories,
        users,
        auditLog,
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

      showMessage("success", "Data exported successfully!")
    } catch (error) {
      showMessage("error", "Failed to export data")
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (data.categories) {
        storage.saveCategories(data.categories)
      }
      if (data.users) {
        storage.saveUsers(data.users)
      }
      if (data.auditLog) {
        storage.saveAuditLog(data.auditLog)
      }

      onDataImported()
      showMessage("success", "Data imported successfully!")
    } catch (error) {
      showMessage("error", "Failed to import data. Please check the file format.")
    } finally {
      setIsImporting(false)
      // Reset the input
      event.target.value = ""
    }
  }

  const handleClearAll = async () => {
    if (!window.confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return
    }

    setIsClearing(true)
    try {
      storage.clearAll()
      onDataImported()
      showMessage("success", "All data cleared successfully!")
    } catch (error) {
      showMessage("error", "Failed to clear data")
    } finally {
      setIsClearing(false)
    }
  }

  const loadDemoData = () => {
    const demoCategories: Category[] = [
      {
        id: "1",
        name: "Getting Started",
        description: "Basic information to get you started",
        articles: [
          {
            id: "1",
            title: "Welcome to the Knowledge Base",
            content:
              "This is your comprehensive knowledge base system. Here you can store, organize, and search through all your important information.\n\nKey features:\n- Organize content in categories and subcategories\n- Full-text search across all articles\n- User management with role-based access\n- Complete audit logging\n- Data import/export capabilities",
            author: "System",
            categoryId: "1",
            tags: ["welcome", "introduction", "features"],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        subcategories: [
          {
            id: "1-1",
            name: "Quick Start Guide",
            articles: [
              {
                id: "2",
                title: "How to Add Your First Article",
                content:
                  "Adding articles is easy:\n\n1. Click the 'Login' button and use admin/admin123\n2. Navigate to the 'Add Article' tab\n3. Fill in the title, content, and select a category\n4. Add relevant tags to make it searchable\n5. Click 'Save Article'\n\nYour article will be immediately available for browsing and searching.",
                author: "System",
                categoryId: "1",
                subcategoryId: "1-1",
                tags: ["tutorial", "articles", "getting-started"],
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "Administration",
        description: "Admin guides and system management",
        articles: [],
        subcategories: [
          {
            id: "2-1",
            name: "User Management",
            articles: [
              {
                id: "3",
                title: "Managing Users and Roles",
                content:
                  "The system supports three user roles:\n\n**Admin**: Full access to all features including user management, category management, and system administration.\n\n**Editor**: Can create, edit, and delete articles. Can access data management features.\n\n**Viewer**: Read-only access to articles and search functionality.\n\nTo manage users:\n1. Login as an admin\n2. Go to the Admin tab\n3. Use the User Management section to add, edit, or remove users",
                author: "System",
                categoryId: "2",
                subcategoryId: "2-1",
                tags: ["users", "roles", "administration"],
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          },
        ],
      },
    ]

    storage.saveCategories(demoCategories)
    onDataImported()
    showMessage("success", "Demo data loaded successfully!")
  }

  const getTotalArticles = () => {
    return categories.reduce((total, category) => {
      const categoryArticles = category.articles?.length || 0
      const subcategoryArticles =
        category.subcategories?.reduce((subTotal, sub) => subTotal + (sub.articles?.length || 0), 0) || 0
      return total + categoryArticles + subcategoryArticles
    }, 0)
  }

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {message.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      {/* Storage Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Storage Statistics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{getTotalArticles()}</div>
                <div className="text-sm text-gray-600">Articles</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{users.length}</div>
                <div className="text-sm text-gray-600">Users</div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{auditLog.length}</div>
                <div className="text-sm text-gray-600">Audit Entries</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Download a complete backup of all your knowledge base data including articles, users, and audit logs.
            </p>
            <Button onClick={handleExport} disabled={isExporting} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export All Data"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Import Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Import data from a previously exported backup file. This will merge with existing data.
            </p>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button disabled={isImporting} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? "Importing..." : "Import Data"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Data and Maintenance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Demo Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Load sample articles and categories to get started quickly with your knowledge base.
            </p>
            <Button onClick={loadDemoData} variant="outline" className="w-full bg-transparent">
              <Database className="h-4 w-4 mr-2" />
              Load Demo Data
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              <span>Clear All Data</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Permanently delete all data including articles, users, and audit logs. This action cannot be undone.
            </p>
            <Button onClick={handleClearAll} disabled={isClearing} variant="destructive" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              {isClearing ? "Clearing..." : "Clear All Data"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
