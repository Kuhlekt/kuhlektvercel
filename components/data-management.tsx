"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import { storage, dataManager } from "../utils/storage"
import type { Category, User, AuditLogEntry } from "../types/knowledge-base"

interface DataManagementProps {
  categories: Category[]
  users: User[]
  auditLog: AuditLogEntry[]
  onDataUpdate: (data: { categories: Category[], users: User[], auditLog: AuditLogEntry[] }) => void
}

export function DataManagement({ categories, users, auditLog, onDataUpdate }: DataManagementProps) {
  const [importFile, setImportFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleExport = () => {
    try {
      dataManager.exportData()
      setMessage({ type: 'success', text: 'Data exported successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleImport = async () => {
    if (!importFile) return

    setIsImporting(true)
    try {
      const data = await dataManager.importData(importFile)
      
      // Save to localStorage
      storage.saveCategories(data.categories)
      storage.saveUsers(data.users)
      storage.saveAuditLog(data.auditLog)
      
      if (data.pageVisits) {
        localStorage.setItem('kb_page_visits', data.pageVisits.toString())
      }

      // Update parent component
      onDataUpdate({
        categories: data.categories,
        users: data.users,
        auditLog: data.auditLog
      })

      setMessage({ type: 'success', text: 'Data imported successfully!' })
      setImportFile(null)
    } catch (error) {
      setMessage({ type: 'error', text: `Import failed: ${error}` })
    } finally {
      setIsImporting(false)
      setTimeout(() => setMessage(null), 5000)
    }
  }

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      storage.clearAll()
      onDataUpdate({
        categories: [],
        users: [],
        auditLog: []
      })
      setMessage({ type: 'success', text: 'All data cleared successfully!' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const getDataStats = () => {
    const totalArticles = categories.reduce((total, category) => {
      const categoryArticles = category.articles.length
      const subcategoryArticles = category.subcategories.reduce(
        (subTotal, sub) => subTotal + sub.articles.length,
        0
      )
      return total + categoryArticles + subcategoryArticles
    }, 0)

    const totalSubcategories = categories.reduce(
      (total, category) => total + category.subcategories.length,
      0
    )

    return {
      categories: categories.length,
      subcategories: totalSubcategories,
      articles: totalArticles,
      users: users.length,
      auditEntries: auditLog.length,
      pageVisits: storage.getPageVisits()
    }
  }

  const stats = getDataStats()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Categories:</span>
                <span className="font-medium">{stats.categories}</span>
              </div>
              <div className="flex justify-between">
                <span>Subcategories:</span>
                <span className="font-medium">{stats.subcategories}</span>
              </div>
              <div className="flex justify-between">
                <span>Articles:</span>
                <span className="font-medium">{stats.articles}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Users:</span>
                <span className="font-medium">{stats.users}</span>
              </div>
              <div className="flex justify-between">
                <span>Audit Entries:</span>
                <span className="font-medium">{stats.auditEntries}</span>
              </div>
              <div className="flex justify-between">
                <span>Page Visits:</span>
                <span className="font-medium">{stats.pageVisits}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Data Size:</span>
                <span className="font-medium">
                  {Math.round(JSON.stringify({ categories, users, auditLog }).length / 1024)} KB
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Backup:</span>
                <span className="font-medium text-gray-500">Manual</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {message && (
        <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          {message.type === 'error' ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="h-5 w-5" />
              <span>Export Data</span>
            </CardTitle>
            <CardDescription>
              Download a backup of all your knowledge base data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Backup
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Import Data</span>
            </CardTitle>
            <CardDescription>
              Restore data from a backup file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="import-file">Select backup file</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
            </div>
            <Button 
              onClick={handleImport} 
              disabled={!importFile || isImporting}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import Backup'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription>
            Permanently delete all data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleClearAll}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
